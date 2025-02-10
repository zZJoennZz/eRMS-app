<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use App\Models\User;

class PassportAuthController extends Controller
{
    public function first_account()
    {
        try {
            DB::beginTransaction();
            User::create([
                'branches_id' => 1,
                'type' => 'DEV',
                'username' => "webdev",
                'email' => "zzjoennzz@gmail.com",
                'password' => bcrypt("pokemon14"),
            ]);
            DB::commit();

            return send200Response([], 'User successfully registered.');
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }
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

        try {
            $data = [
                'username' => $request->username,
                'password' => $request->password,
            ];

            if (Auth::attempt($data)) {
                /** @var \App\Models\User $user **/
                $user = Auth::user();
                $token = $user->createToken(env('AUTH_SECRET') ?? 'AWEDASDS@232')->accessToken;

                return send200Response(['token' => $token, 'id' => $user->id]);
            } else {
                return send401Response();
            }
        } catch (\Exception $e) {
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
            if (Auth::guard('api')->check()) {
                return send200Response([
                    "id" => Auth::user()->id,
                    "type" => Auth::user()->type,
                    "branch" => "test",
                    "br_account_number" => "test",
                    "dept_code" => "test",
                    "address" => "test",
                    "contact_number" => "test",
                    "email_address" => "test",
                    "branch_head" => "test",
                    "supply_officer" => "test",
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
}
