<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Position;
use App\Models\UserPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $user = Auth::user();
        $positions = [];
        if ($user->type === "RECORDS_CUST") {
            $positions = Position::where('type', 'EMPLOYEE')->get();
        } elseif ($user->type === "BRANCH_HEAD" || $user->type === "DEV" || $user->type === "ADMIN") {
            $positions = Position::where('type', '<>', 'DEV')->get();
        } else {
            return send401Response();
        }
        return send200Response($positions);
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

    public function get_own_positions($id)
    {
        $user = Auth::user();

        if ($user->type !== "EMPLOYEE") {
            return send401Response();
        }

        $positions = UserPosition::where('user_profiles_id', $user->profile->id)
            ->with(['position'])
            ->get();

        return send200Response($positions);
    }
}
