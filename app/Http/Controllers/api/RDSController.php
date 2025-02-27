<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\RDSRecord;
use App\Models\RecordsDispositionSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RDSController extends Controller
{
    public $msg404;

    public function __construct()
    {
        $this->msg404 = "RDS not found.";
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        try {
            $rds = RecordsDispositionSchedule::all();

            return send200Response($rds);
        } catch (\Exception $e) {
            return send400Response();
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        if (Auth::user()->type !== "DEV") {
            return send401Response();
        }
        try {
            DB::beginTransaction();

            $request->validate([
                'item_number' => 'required|string|max:255|unique:records_disposition_schedules,item_number',
                'record_series_title_and_description' => 'required|string|max:255',
                'active' => 'required|numeric',
                'storage' => 'required|numeric',
                'remarks' => 'max:255',
                'has_condition' => 'boolean',
            ]);

            $new_rds = new RecordsDispositionSchedule();
            $new_rds->item_number = $request->item_number;
            $new_rds->record_series_title_and_description = $request->record_series_title_and_description;
            $new_rds->record_series_title_and_description_1 = $request->record_series_title_and_description_1;
            $new_rds->active = $request->active;
            $new_rds->storage = $request->storage;
            $new_rds->remarks = $request->remarks;
            $new_rds->has_condition = $request->has_condition;
            $new_rds->save();

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
        if (Auth::user()->type !== "DEV") {
            return send401Response();
        }
        try {
            $rds = RecordsDispositionSchedule::find($id);

            return send200Response($rds);
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
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
        if (Auth::user()->type !== "DEV") {
            return send401Response();
        }


        try {
            $rds = RecordsDispositionSchedule::find($id);

            if (!$rds) {
                return send404Response();
            }

            DB::beginTransaction();

            $request->validate([
                'record_series_title_and_description' => 'required|string|max:255',
                'active' => 'required|numeric',
                'storage' => 'required|numeric',
                'has_condition' => 'boolean',
            ]);

            $rds->record_series_title_and_description = $request->record_series_title_and_description;
            $rds->record_series_title_and_description_1 = $request->record_series_title_and_description_1;
            $rds->active = $request->active;
            $rds->storage = $request->storage;
            $rds->remarks = $request->remarks;
            $rds->has_condition = $request->has_condition;
            $rds->save();

            DB::commit();

            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response($e);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function print_list()
    {
        $rds = RDSRecord::where('status', 'APPROVED')->with(['documents.rds'])->get();
        return view('print/rds-list')->with('rds', $rds);
    }
}
