<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
