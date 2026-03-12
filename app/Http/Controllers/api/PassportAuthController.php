<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PassportAuthController extends Controller
{
    // public function first_account()
    // {
    //     try {
    //         DB::beginTransaction();
    //         User::create([
    //             'branches_id' => 1,
    //             'type' => 'DEV',
    //             'username' => "webdev",
    //             'email' => "zzjoennzz@gmail.com",
    //             'password' => bcrypt("pokemon14"),
    //         ]);
    //         DB::commit();

    //         return send200Response([], 'User successfully registered.');
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return send400Response();
    //     }
    // }
    //
    public function register(Request $request)
    {
        if (Auth::user()->id !== 1) {
            return send401Response();
        }
        $this->validate($request, [
            'branches_id' => 'required|exists:branches,id',
            'type' => 'required|in:EMPLOYEE,WAREHOUSE_CUST,RECORDS_CUST,BRANCH_HEAD,DEV',
            'username' => 'required|unique:users,username|min:4',
            'email' => 'required|email|unique:users,email|min:4',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(),
            ],
        ]);

        try {
            DB::beginTransaction();
            User::create([
                'branches_id' => $request->branches_id,
                'type' => $request->type,
                'username' => $request->username,
                'email' => $request->email,
                'password' => bcrypt($request->password),
            ]);
            DB::commit();

            return send200Response([], 'User successfully registered.');
        } catch (\Exception $e) {
            DB::rollBack();

            return send400Response();
        }
    }

    public function login(Request $request)
    {
        $this->validate($request, [
            'username' => 'required|min:4',
            'password' => 'required',
        ]);

        if ($this->hasTooManyLoginAttempts($request)) {
            $seconds = $this->limiter()->availableIn(
                $this->throttleKey($request)
            );

            // LOG: Rate limit lockout
            log_bank_action('Login blocked: Too many attempts', null, [
                'username' => $request->username,
                'lockout_duration' => $seconds,
            ]);

            return response()->json([
                'message' => 'Too many login attempts. Please try again in '.$seconds.' seconds.',
            ], 429);
        }

        try {
            $data = [
                'username' => $request->username,
                'password' => $request->password,
            ];

            if (Auth::attempt($data)) {
                /** @var \App\Models\User $user * */
                $user = Auth::user();

                if ($user->is_inactive) {
                    // LOG: Successful credentials but account is disabled
                    log_bank_action('Login denied: Account inactive', $user);

                    return send400Response('The account you are trying to use is inactive. Please contact branch head or the web developer/administrator.');
                }

                $this->limiter()->clear($this->throttleKey($request));

                // LOG: Successful login
                log_bank_action('User logged in successfully', $user);

                $tokenResult = $user->createToken(env('AUTH_SECRET') ?? 'AWEDASDS@232');
                $token = $tokenResult->token;
                $token->expires_at = now()->addMinutes(15);
                $token->save();

                return send200Response([
                    'token' => $tokenResult->accessToken,
                    'expires_in' => $token->expires_at,
                    'id' => $user->id,
                    'type' => $user->type,
                    'profile' => $user->profile,
                    'current_position' => $user->profile->position,
                    'branch' => $user->branch,
                    'is_password_expired' => $user->isPasswordExpired(),
                ]);
            } else {
                $this->limiter()->hit($this->throttleKey($request), $this->decayMinutes() * 60);

                // LOG: Failed login attempt (Invalid credentials)
                // Note: Never log the password itself!
                log_bank_action('Failed login attempt', null, ['attempted_username' => $request->username]);

                return send401Response();
            }
        } catch (\Exception $e) {
            $this->limiter()->hit($this->throttleKey($request), $this->decayMinutes() * 60);

            // LOG: System error during login
            log_bank_action('Login error', null, ['exception' => $e->getMessage()]);

            return send400Response();
        }
    }

    public function logout()
    {
        try {
            if (Auth::guard('api')->check()) {
                /** @var \App\Models\User $user * */
                $user = Auth::guard('api')->user();
                if ($user->token()->revoke()) {
                    return send200Response([], 'User successfully logged out!');
                }

                return send400Response();
            } else {
                return send401Response();
            }
        } catch (\Exception $e) {
            return send400Response();
        }
    }

    public function is_valid()
    {
        try {
            if (Auth::guard('api')->check() && Auth::user()->is_inactive === 0) {
                return send200Response([
                    'id' => Auth::user()->id,
                    'expires_in' => Auth::user()->token()->expires_at,
                    'type' => Auth::user()->type,
                    'profile' => Auth::user()->profile,
                    'branch' => Auth::user()->branch,
                    'current_position' => Auth::user()->profile->position,
                ], 'Token is valid.');
            } else {
                return send401Response();
            }
        } catch (\Exception $e) {
            if (Auth::guard('api')->check()) {
                /** @var \App\Models\User $user * */
                $user = Auth::guard('api')->user();
                if ($user->token()->revoke()) {
                    return send200Response([], 'Token access revoked.');
                }

                return send400Response();
            } else {
                return send401Response();
            }
        }
    }

    protected function hasTooManyLoginAttempts(Request $request)
    {
        return $this->limiter()->tooManyAttempts(
            $this->throttleKey($request),
            $this->maxAttempts()
        );
    }

    protected function throttleKey(Request $request)
    {
        return Str::lower($request->input('username')).'|'.$request->ip();
    }

    protected function maxAttempts()
    {
        return 3;
    }

    protected function decayMinutes()
    {
        return 15;
    }

    protected function limiter()
    {
        return app(RateLimiter::class);
    }

    public function forgot_password(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        // LOG: Request for password reset
        log_bank_action('Requested password reset link', null, ['email' => $request->email]);

        return $status === Password::RESET_LINK_SENT ? send200Response() : send400Response();
    }

    public function reset_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return send400Response();
        }

        $status = Password::reset(
            $request->only('email', 'password', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => bcrypt($password),
                ])->save();

                // LOG: Successful reset via token
                log_bank_action('Password reset successfully via token', $user);
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            log_bank_action('Failed password reset attempt', null, ['email' => $request->email, 'reason' => 'Invalid token']);

            return send400Response('Invalid token or email address!');
        }

        return send200Response();
    }

    public function force_reset_password(Request $request)
    {
        $this->validate($request, [
            'currentPassword' => 'required',
            'newPassword' => 'required|min:8|different:currentPassword',
        ]);

        try {
            $user = $request->user();

            if (! Hash::check($request->currentPassword, $user->password)) {
                // LOG: Failed attempt to change password (wrong current password)
                log_bank_action('Failed password change: Incorrect current password', $user);

                return send400Response('Current password is incorrect.');
            }

            DB::beginTransaction();

            $user->password = Hash::make($request->newPassword);
            $user->password_changed_at = now();
            $user->save();

            // LOG: Successful manual password change
            log_bank_action('Password successfully changed by user', $user);

            // Revoke all existing tokens (forces re-authentication)
            $user->token()->revoke();

            DB::commit();

            return send200Response([
                'password_reset' => true,
            ], 'Password successfully changed. You can now continue with your new password.');

        } catch (\Exception $e) {
            DB::rollBack();

            // LOG: System error during reset
            log_bank_action('Error during forced password reset', $user ?? null, ['error' => $e->getMessage()]);

            logger()->error('Password reset error: '.$e->getMessage());

            return send400Response('An error occurred while resetting your password.');
        }
    }
}
