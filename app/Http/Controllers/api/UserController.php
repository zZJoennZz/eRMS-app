<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserPosition;
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
            $users = User::with(['profile', 'branch.cluster', 'profile.position', 'profile.positions.position'])
                ->where('is_inactive', 0)
                ->get();
        } elseif ($user->type === "BRANCH_HEAD") {
            $users = User::with(['profile.positions.position', 'branch.cluster', 'profile.position', 'profile.positions.position'])
                ->where('branches_id', $user->branches_id)
                ->where('is_inactive', 0)
                ->where('type', '<>', 'DEV')
                ->where('type', '<>', 'ADMIN')
                ->get();
        } elseif ($user->type === "RECORDS_CUST") {
            $users = User::with(['profile.positions.position', 'branch.cluster', 'profile.position', 'profile.positions.position'])
                ->where('branches_id', $user->branches_id)
                ->where('is_inactive', 0)
                ->where('type', '<>', 'BRANCH_HEAD')
                ->where('type', '<>', 'DEV')
                ->where('type', '<>', 'ADMIN')
                ->get();
        } elseif ($user->type = "WAREHOUSE_HEAD") {
            $users = User::with(['profile.positions.position', 'branch.cluster', 'profile.position', 'profile.positions.position'])
                ->where('branches_id', $user->branches_id)
                ->where('is_inactive', 0)
                ->where('type', '<>', 'BRANCH_HEAD')
                ->where('type', '<>', 'DEV')
                ->where('type', '<>', 'ADMIN')
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

        $typeToUsernameNumber = [
            'EMPLOYEE' => 1,
            'RECORDS_CUST' => 2,
            'WAREHOUSE_CUST' => 3,
            'BRANCH_HEAD' => 4,
            'WAREHOUSE_HEAD' => 5,
        ];

        try {
            DB::beginTransaction();
            if (!array_key_exists($request->type, $typeToUsernameNumber)) {
                return send422Response("Invalid submissions. Please refresh the page.");
            }
            if ($user->type === "ADMIN" || $user->type === "DEV") {

                $request->validate([
                    'username' => 'required|unique:users',
                    'email_address' => 'required|email|unique:users,email',
                    'password' => 'required:min:6',
                ]);

                $new_user = new User();
                $new_user->username = $typeToUsernameNumber[$request->type] . $request->username;
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

                $new_user_position = new UserPosition();
                $new_user_position->user_profiles_id = $new_user_profile->id;
                $new_user_position->positions_id = $request->positions_id;
                $new_user_position->type = "MAIN";
                $new_user_position->save();
            } elseif ($user->type === "BRANCH_HEAD" || $user->type === "RECORDS_CUST") {
                if ($user->type === "RECORDS_CUST" && $request->type !== "BRANCH_HEAD" && $request->type !== "RECORDS_CUST" && $request->type !== "DEV" && $request->type !== "WAREHOUSE") {

                    $request->validate([
                        'username' => 'required|unique:users',
                        'email_address' => 'required|email|unique:users,email',
                        'password' => 'required:min:6',
                    ]);

                    $new_user = new User();
                    $new_user->username = $typeToUsernameNumber[$request->type] . $request->username;
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

                    $new_user_position = new UserPosition();
                    $new_user_position->user_profiles_id = $new_user_profile->id;
                    $new_user_position->positions_id = $request->positions_id;
                    $new_user_position->type = "MAIN";
                    $new_user_position->save();
                } elseif ($user->type === "BRANCH_HEAD" && $request->type !== "DEV" && $request->type !== "WAREHOUSE") {
                    $request->validate([
                        'username' => 'required|unique:users',
                        'email_address' => 'required|email|unique:users,email',
                        'password' => 'required:min:6',
                    ]);

                    $new_user = new User();
                    $new_user->username = $typeToUsernameNumber[$request->type] . $request->username;
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

                    $new_user_position = new UserPosition();
                    $new_user_position->user_profiles_id = $new_user_profile->id;
                    $new_user_position->positions_id = $request->positions_id;
                    $new_user_position->type = "MAIN";
                    $new_user_position->save();
                } else {
                    DB::rollBack();
                    return send401Response();
                }
            } elseif ($user->type === "WAREHOUSE_HEAD") {
                $request->validate([
                    'username' => 'required|unique:users',
                    'email_address' => 'required|email|unique:users,email',
                    'password' => 'required:min:6',
                ]);

                $new_user = new User();
                $new_user->username = $typeToUsernameNumber[$request->type] . $request->username;
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

                $new_user_position = new UserPosition();
                $new_user_position->user_profiles_id = $new_user_profile->id;
                $new_user_position->positions_id = $request->positions_id;
                $new_user_position->type = "MAIN";
                $new_user_position->save();
            } else {
                return send401Response();
            }
            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $user = User::where('id', $id)
            ->with(['profile.positions.position'])
            ->first();
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
        $typeToUsernameNumber = [
            'EMPLOYEE' => 1,
            'RECORDS_CUST' => 2,
            'WAREHOUSE_CUST' => 3,
            'BRANCH_HEAD' => 4,
            'WAREHOUSE_HEAD' => 5,
        ];
        try {
            DB::beginTransaction();
            $user = Auth::user();
            $get_user = User::find($id);
            if (!array_key_exists($request->type, $typeToUsernameNumber)) {
                return send422Response("Invalid submissions. Please refresh the page.");
            }
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

            if ($get_user->type === "RECORDS_CUST" && count($request->intervening_positions) > 0) {
                return send422Response("RC can't have intervening positions.");
            }

            if ($get_user->type === "BRANCH_HEAD" && count($request->intervening_positions) > 0) {
                return send422Response("BH can't have intervening positions.");
            }

            if ($user->type === "RECORDS_CUST") {
                $typeRules = 'required|in:EMPLOYEE';
            } elseif ($user->type === "BRANCH_HEAD") {
                $typeRules = 'required|in:EMPLOYEE,RECORDS_CUST';
            } elseif ($user->type === "ADMIN" || $user->type === "DEV") {
                $typeRules = 'required|in:EMPLOYEE,RECORDS_CUST,BRANCH_HEAD,WAREHOUSE_CUST,WAREHOUSE_HEAD';
            } elseif ($user->type === "WAREHOUSE_HEAD") {
                $typeRules = "required";
            } else {
                DB::rollBack();
                return send401Response();
            }

            $new_username = $typeToUsernameNumber[$request->type] . substr($request->username, 1);
            if ($get_user->username !== $new_username) {
                $sameUsernameCtr = User::where('username', $new_username)->count();

                if ($sameUsernameCtr > 0) {
                    return send422Response("Please enter unique username.");
                }
            }
            $rules = [
                'username' => 'required',
                'email_address' => $emailRules,
                'first_name' => $nameRules,
                'middle_name' => 'max:200',
                'last_name' => $nameRules,
                'type' => $typeRules,
                'positions_id' => 'required|exists:positions,id',
                'intervening_positions' => 'array',
                'intervening_positions.id' => 'exists:positions,id'
            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                $errors = implode("\n", $validator->errors()->all()); // Concatenate errors into a single text
                DB::rollBack();
                return send422Response($errors);
            }

            if ($user->type === "ADMIN" || $user->type === "RECORDS_CUST" || $user->type === "BRANCH_HEAD" || $user->type === "DEV") {
                if ($user->id === $get_user->id) {
                    return send401Response();
                }

                if ($get_user->borrows->filter(fn($borrow) => $borrow->status !== 'RETURNED')->isNotEmpty()) {
                    DB::rollBack();
                    return send422Response("Please ensure that the user has no pending transactions.");
                }

                $get_user->username = $new_username;
                $get_user->email = $request->email_address;
                $get_user->type = $request->type;
                $get_user->save();

                $user_profile = UserProfile::find($get_user->profile->id);
                $user_profile->first_name = $request->first_name;
                $user_profile->middle_name = $request->middle_name ?? "";
                $user_profile->last_name = $request->last_name;
                $user_profile->positions_id = $request->positions_id;
                $user_profile->save();

                UserPosition::where('user_profiles_id', $id)->delete();

                $main_user_position = new UserPosition();
                $main_user_position->user_profiles_id = $get_user->profile->id;
                $main_user_position->type = "MAIN";
                $main_user_position->positions_id = $request->positions_id;
                $main_user_position->save();

                foreach ($request->intervening_positions as $ip) {
                    $inter_user_position = new UserPosition();
                    $inter_user_position->user_profiles_id = $get_user->profile->id;
                    $inter_user_position->type = "INTERVENING";
                    $inter_user_position->positions_id = $ip['id'];
                    $inter_user_position->save();
                }

                DB::commit();
                return send200Response();
            } elseif ($user->type === "WAREHOUSE_HEAD") {
                if ($get_user->branch->clusters_id !== $user->branch->clusters_id && $get_user->type !== "WAREHOUSE_CUST") {
                    return send401Response();
                }

                $get_user->username = $new_username;
                $get_user->email = $request->email_address;
                $get_user->save();

                $user_profile = UserProfile::find($get_user->profile->id);
                $user_profile->first_name = $request->first_name;
                $user_profile->middle_name = $request->middle_name ?? "";
                $user_profile->last_name = $request->last_name;
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

    public function disabled_users()
    {
        $user = Auth::user();

        if ($user->type !== "ADMIN" && $user->type !== "DEV") {
            return send401Response();
        }

        $users = User::with(['profile', 'branch', 'profile.position', 'profile.positions.position'])
            ->where('is_inactive', 1)
            ->get();

        return send200Response($users);
    }

    public function reset_pw($id)
    {
        try {
            DB::beginTransaction();
            $user = Auth::user();
            $get_user = User::find($id);

            if ($user->branches_id !== $get_user->branches_id && $user->type !== "ADMIN" && $user->type !== "DEV") {
                return send401Response();
            }

            $branch_code = $get_user->branch->name === "Warehouse" ? "WH" : $get_user->branch->code;
            $get_user->password = bcrypt($branch_code . $get_user->profile->last_name);
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

    public function switch_position($id)
    {
        try {
            $user = Auth::user();
            DB::beginTransaction();
            if ($user->type !== "EMPLOYEE") {
                return send401Response();
            }
            $position = UserPosition::find($id);
            if ($user->profile->positions_id === $position->positions_id) {
                return send422Response("Your selected position is already active.");
            }

            $is_position_available = UserPosition::where('user_profiles_id', $user->profile->id)
                ->where('id', $id)
                ->get()
                ->count() > 0 ? true : false;

            if ($is_position_available) {
                $user_profile = UserProfile::find($user->profile->id);
                $user_profile->positions_id = $position->positions_id;
                $user_profile->save();
            } else {
                return send400Response("Position not available for this account.");
            }
            DB::commit();
            return send200Response();
        } catch (Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }

    public function set_inactive($id)
    {
        try {
            DB::beginTransaction();
            $user = Auth::user();
            if ($user->type !== "ADMIN" && $user->type !== "DEV") {
                return send401Response();
            }

            $sel_user = User::find($id);

            $sel_user->is_inactive = true;
            $sel_user->save();

            DB::commit();

            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }

    public function set_enable($id)
    {
        try {
            DB::beginTransaction();
            $user = Auth::user();
            if ($user->type !== "ADMIN" && $user->type !== "DEV") {
                return send401Response();
            }

            $sel_user = User::find($id);

            $sel_user->is_inactive = false;
            $sel_user->save();

            DB::commit();

            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }
}
