<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Cluster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $user = Auth::user();
        $branches = [];
        if ($user->type !== "ADMIN" && $user->type !== "DEV") {
            $branches = Branch::with('cluster')->where('clusters_id', $user->branch->clusters_id)->get();
        } elseif ($user->type === "ADMIN" || $user->type === "DEV") {
            $branches = Branch::with('cluster')->get();
        } else {
            return send401Response();
        }

        return send200Response($branches);
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
        if (!in_array($user->type, ["DEV", "ADMIN"])) {
            return send401Response();
        }
        try {
            if ($request->clusters_id === 0 || $request->clusters_id === "0") {
                return send422Response('Please select a valid cluster!');
            }
            DB::beginTransaction();
            $new_branches = new Branch();

            if ($request->is_warehouse) {
                $get_warehouse = Branch::where('clusters_id', $request->clusters_id)->where('name', 'Warehouse')->get();
                if ($get_warehouse->count() > 0) {
                    return send422Response("This group already have enrolled warehouse.");
                } else {
                    $new_branches->code = "";
                    $new_branches->name = "Warehouse";
                    $new_branches->clusters_id = $request->clusters_id;
                }
            } else {
                $new_branches->code = $request->code;
                $new_branches->name = $request->name;
                $new_branches->clusters_id = $request->clusters_id;
            }

            $new_branches->save();
            DB::commit();

            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $user = Auth::user();
        if ($user->type !== "ADMIN" && $user->type !== "DEV") {
            return send401Response();
        }

        $branches = Branch::where('id', $id)->with('cluster')->first();
        return send200Response($branches);
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
            $user = Auth::user();
            if (!in_array($user->type, ["DEV", "ADMIN"])) {
                return send401Response();
            }
            DB::beginTransaction();
            $branch = Branch::find($id);

            if ($request->is_warehouse) {
                return send422Response("You cannot edit warehouse record.");
            } else {
                $branch->code = $request->code;
                $branch->name = $request->name;
            }

            $branch->save();
            DB::commit();

            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function get_branch_profile()
    {
        $user = Auth::user();

        if ($user->type !== "BRANCH_HEAD") {
            return send401Response();
        }

        $branch = Branch::find($user->branches_id);

        return send200Response($branch);
    }

    public function save_branch_details(Request $request)
    {
        $user = Auth::user();

        if ($user->type !== "BRANCH_HEAD") {
            return send401Response();
        }

        try {
            DB::beginTransaction();
            $branch = Branch::find($user->branches_id);
            $branch->agency_name = $request->agency_name;
            $branch->full_address = $request->full_address;
            $branch->telephone_number = $request->telephone_number;
            $branch->email_address = $request->email_address;
            $branch->location_of_records = $request->location_of_records;
            $branch->save();
            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response($e->getMessage());
        }
    }
}
