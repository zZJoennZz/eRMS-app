<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Cluster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ClusterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        if (Auth::user()->type === "ADMIN" || Auth::user()->type === "DEV") {
            $clusters = Cluster::all();
            return send200Response($clusters);
        } else {
            return send401Response();
        }
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
        if (Auth::user()->type === "ADMIN" || Auth::user()->type === "DEV") {
            try {
                DB::beginTransaction();

                $new_cluster = new Cluster();
                $new_cluster->name = $request->cluster;
                $new_cluster->save();

                DB::commit();
                return send200Response();
            } catch (\Exception $e) {
                DB::rollBack();
                return send400Response($e->getMessage());
            }
        } else {
            return send401Response();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        if (Auth::user()->type === "ADMIN" || Auth::user()->type === "DEV") {
            $clusters = Cluster::find($id);
            return send200Response($clusters);
        } else {
            return send401Response();
        }
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
        if (Auth::user()->type === "ADMIN" || Auth::user()->type === "DEV") {
            try {
                DB::beginTransaction();

                $cluster = Cluster::find($id);
                $cluster->name = $request->cluster;
                $cluster->save();

                DB::commit();
                return send200Response();
            } catch (\Exception $e) {
                DB::rollBack();
                return send400Response($e->getMessage());
            }
        } else {
            return send401Response();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
