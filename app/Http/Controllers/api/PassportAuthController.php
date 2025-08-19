<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Cache\RateLimiter;

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
                    ->uncompromised()
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
            
            return response()->json([
                'message' => 'Too many login attempts. Please try again in ' . $seconds . ' seconds.'
            ], 429);
        }

        try {
            $data = [
                'username' => $request->username,
                'password' => $request->password,
            ];

            if (Auth::attempt($data)) {
                /** @var \App\Models\User $user **/
                $user = Auth::user();

                if ($user->is_inactive) {
                    return send400Response("The account you are trying to use is inactive. Please contact branch head or the web developer/administrator.");
                }
                $this->limiter()->clear($this->throttleKey($request));

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
                return send401Response();
            }
        } catch (\Exception $e) {
            $this->limiter()->hit($this->throttleKey($request), $this->decayMinutes() * 60);
            return send400Response();
        }
    }

    public function logout()
    {
        try {
            if (Auth::guard('api')->check()) {
                /** @var \App\Models\User $user **/
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
                    "id" => Auth::user()->id,
                    "expires_in" => Auth::user()->token()->expires_at,
                    "type" => Auth::user()->type,
                    "profile" => Auth::user()->profile,
                    'branch' => Auth::user()->branch,
                    "current_position" => Auth::user()->profile->position,
                ], 'Token is valid.');
            } else {
                return send401Response();
            }
        } catch (\Exception $e) {
            if (Auth::guard('api')->check()) {
                /** @var \App\Models\User $user **/
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

    protected function hasTooManyLoginAttempts(Request $request) {
        return $this->limiter()->tooManyAttempts(
            $this->throttleKey($request),
            $this->maxAttempts()
        );
    }

    protected function throttleKey(Request $request) {
        return Str::lower($request->input('username')).'|'.$request->ip();
    }

    protected function maxAttempts() {
        return 3;
    }

    protected function decayMinutes() {
        return 15;
    }

    protected function limiter() {
        return app(RateLimiter::class);
    }

    public function forgot_password(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

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
                    'password' => bcrypt($password)
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET ? send200Response() : send400Response('Invalid token or email address!');
    }

    public function force_reset_password(Request $request)
    {
        $this->validate($request, [
            'currentPassword' => 'required',
            'newPassword' => 'required|min:8|different:currentPassword',
        ]);

        try {
            $user = $request->user();
            
            if (!Hash::check($request->currentPassword, $user->password)) {
                return send400Response('Current password is incorrect.');
            }

            DB::beginTransaction();
            
            $user->password = Hash::make($request->newPassword);
            $user->password_changed_at = now();
            $user->save();

            // Revoke all existing tokens (forces re-authentication)
            $user->token()->revoke();
            
            DB::commit();

            return send200Response([
                'password_reset' => true
            ], 'Password successfully changed. You can now continue with your new password.');

        } catch (\Exception $e) {
            DB::rollBack();
            // Don't expose system errors to client
            logger()->error('Password reset error: ' . $e->getMessage());
            return send400Response('An error occurred while resetting your password.');
        }
    }
}
