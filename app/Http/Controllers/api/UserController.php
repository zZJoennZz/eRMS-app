<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $user = Auth::user();
        $users = [];
        if ($user->type === "DEV" || $user->type === "ADMIN") {
            $users = User::with(['profile', 'branch', 'profile.position'])->get();
        } elseif ($user->type === "BRANCH_HEAD") {
            $users = User::with(['profile', 'branch', 'profile.position'])
                ->where('branches_id', $user->branches_id)
                ->get();
        } elseif ($user->type === "RECORDS_CUST") {
            $users = User::with(['profile', 'branch', 'profile.position'])
                ->where('branches_id', $user->branches_id)
                ->where('type', '<>', 'BRANCH_HEAD')
                ->get();
        } else {
            return send401Response();
        }

        return send200Response($users);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $user = Auth::user();
        try {
            DB::beginTransaction();
            if ($user->type === "ADMIN" || $user->type === "DEV") {

                $request->validate([
                    'username' => 'required|unique:users',
                    'email_address' => 'required|email|unique:users,email',
                    'password' => 'required:min:6',
                ]);

                $new_user = new User();
                $new_user->username = $request->username;
                $new_user->email = $request->email_address;
                $new_user->password = bcrypt($request->password);
                $new_user->type = $request->type;
                $new_user->branches_id = $request->branches_id;
                $new_user->save();

                $new_user_profile = new UserProfile();
                $new_user_profile->users_id = $new_user->id;
                $new_user_profile->first_name = $request->first_name;
                $new_user_profile->middle_name = $request->middle_name ?? "";
                $new_user_profile->last_name = $request->last_name;
                $new_user_profile->positions_id = $request->positions_id;
                $new_user_profile->save();
            } elseif ($user->type === "BRANCH_HEAD" || $user->type === "RECORDS_CUST") {
                if ($user->type === "RECORDS_CUST" && $request->type !== "BRANCH_HEAD" && $request->type !== "RECORDS_CUST" && $request->type !== "DEV" && $request->type !== "WAREHOUSE") {

                    $request->validate([
                        'username' => 'required|unique:users',
                        'email_address' => 'required|email|unique:users,email',
                        'password' => 'required:min:6',
                    ]);

                    $new_user = new User();
                    $new_user->username = $request->username;
                    $new_user->email = $request->email_address;
                    $new_user->password = bcrypt($request->password);
                    $new_user->type = "EMPLOYEE";
                    $new_user->branches_id = $user->branches_id;
                    $new_user->save();

                    $new_user_profile = new UserProfile();
                    $new_user_profile->users_id = $new_user->id;
                    $new_user_profile->first_name = $request->first_name;
                    $new_user_profile->middle_name = $request->middle_name ?? "";
                    $new_user_profile->last_name = $request->last_name;
                    $new_user_profile->positions_id = $request->positions_id;
                    $new_user_profile->save();
                } elseif ($user->type === "BRANCH_HEAD" && $request->type !== "DEV" && $request->type !== "WAREHOUSE") {
                    $request->validate([
                        'username' => 'required|unique:users',
                        'email_address' => 'required|email|unique:users,email',
                        'password' => 'required:min:6',
                    ]);

                    $new_user = new User();
                    $new_user->username = $request->username;
                    $new_user->email = $request->email_address;
                    $new_user->password = bcrypt($request->password);
                    $new_user->type = $request->type;
                    $new_user->branches_id = $user->branches_id;
                    $new_user->save();

                    $new_user_profile = new UserProfile();
                    $new_user_profile->users_id = $new_user->id;
                    $new_user_profile->first_name = $request->first_name;
                    $new_user_profile->middle_name = $request->middle_name ?? "";
                    $new_user_profile->last_name = $request->last_name;
                    $new_user_profile->positions_id = $request->positions_id;
                    $new_user_profile->save();
                } else {
                    DB::rollBack();
                    return send401Response();
                }
            } else {
                return send401Response();
            }
            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response($e);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $user = User::where('id', $id)->with(['profile'])->first();
        return send200Response($user);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        try {
            DB::beginTransaction();
            $user = Auth::user();
            $get_user = User::find($id);

            if (($user->type !== "DEV" && $user->type !== "ADMIN") && ($user->branches_id !== $get_user->branches_id)) {
                return send401Response();
            }

            $emailRules = "";
            $nameRules = "required|max:200";
            $typeRules = "";
            $usernameRules = "";

            if ($request->email_address === $get_user->email) {
                $emailRules = 'required|email';
            } else {
                $emailRules = 'required|email|unique:users,email';
            }

            if ($user->type === "RECORDS_CUST") {
                $typeRules = 'required|in:EMPLOYEE';
            } elseif ($user->type === "BRANCH_HEAD") {
                $typeRules = 'required|in:EMPLOYEE,RECORDS_CUST';
            } elseif ($user->type === "ADMIN" || $user->type === "DEV") {
                $typeRules = 'required|in:EMPLOYEE,RECORDS_CUST,BRANCH_HEAD,WAREHOUSE_CUST';
            } else {
                DB::rollBack();
                return send401Response();
            }

            if ($request->username === $get_user->username) {
                $usernameRules = 'required';
            } else {
                $usernameRules = 'required|unique:users,username';
            }
            $rules = [
                'username' => $usernameRules,
                'email_address' => $emailRules,
                'first_name' => $nameRules,
                'middle_name' => 'max:200',
                'last_name' => $nameRules,
                'type' => $typeRules,
                'positions_id' => 'required|exists:positions,id'
            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                $errors = implode("\n", $validator->errors()->all()); // Concatenate errors into a single text
                DB::rollBack();
                return send422Response($errors);
            }

            if ($user->type === "ADMIN" || $user->type === "RECORDS_CUST" || $user->type === "BRANCH_HEAD" || $user->type === "DEV") {
                $get_user->username = $request->username;
                $get_user->email = $request->email_address;
                $get_user->type = $request->type;
                $get_user->save();

                $user_profile = UserProfile::find($get_user->profile->id);
                $user_profile->first_name = $request->first_name;
                $user_profile->middle_name = $request->middle_name ?? "";
                $user_profile->last_name = $request->last_name;
                $user_profile->positions_id = $request->positions_id;
                $user_profile->save();

                DB::commit();
                return send200Response();
            } else {
                DB::rollBack();
                return send401Response();
            }
        } catch (Exception $e) {
            DB::rollBack();
            return send400Response($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function reset_pw($id)
    {
        try {
            DB::beginTransaction();
            $user = Auth::user();
            $get_user = User::find($id);

            if ($user->branches_id !== $get_user->branches_id) {
                return send401Response();
            }

            $get_user->password = bcrypt($user->branch->code . $get_user->profile->last_name);
            $get_user->save();

            DB::commit();
            return send200Response();
        } catch (Exception $e) {
            DB::rollBack();
            return send400Response($e->getMessage());
        }
    }

    public function change_own_password(Request $request)
    {
        try {
            DB::beginTransaction();
            $user = Auth::user();
            $get_user = User::find($user->id);

            $get_user->password = bcrypt($request->password);
            $get_user->save();

            DB::commit();
            return send200Response();
        } catch (Exception $e) {
            DB::rollBack();
            return send400Response($e->getMessage());
        }
    }
}
