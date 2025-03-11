<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\RDSRecord;
use App\Models\RDSRecordDocument;
use App\Models\RDSRecordHistory;
use App\Models\RecordsDispositionSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RDSRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        if (Auth::user()->type === "WAREHOUSE_CUST") {
            return send401Response();
        }

        $rds_record = "";
        if (Auth::user()->type === "EMPLOYEE") {
            $main_records = RDSRecord::with(['documents.history', 'documents.rds', 'history' => function ($query) {
                return $query->orderBy('created_at', 'desc');
            }])
                ->whereHas('submitted_by_user.profile', function ($query) {
                    $query->where('positions_id', '=', Auth::user()->profile->positions_id);
                })
                ->where('status', '=', 'APPROVED')
                ->where('branches_id', '=', Auth::user()->branches_id)
                ->orderBy('box_number', 'asc')
                ->get();
            $pending_records = RDSRecord::with(['documents', 'documents.rds', 'history' => function ($query) {
                return $query->orderBy('created_at', 'desc');
            }])
                ->whereHas('documents', function ($query) {
                    $query
                        ->where('source_of_documents', '=', Auth::user()->profile->position->name);
                })
                ->whereHas('latest_history', function ($query) {
                    $query
                        ->where('users_id', Auth::user()->id);
                })
                ->where('status', '=', 'PENDING')
                ->where('branches_id', '=', Auth::user()->branches_id)
                ->orderBy('box_number', 'asc')
                ->get();

            $rds_record = new \Illuminate\Database\Eloquent\Collection();
            $rds_record = $rds_record->merge($main_records);
            $rds_record = $rds_record->merge($pending_records);
        } elseif (Auth::user()->type === "BRANCH_HEAD" || Auth::user()->type === "RECORDS_CUST") {
            $rds_record = RDSRecord::with(['documents', 'documents.rds', 'history' => function ($query) {
                return $query->orderBy('created_at', 'desc');
            }])
                ->where('branches_id', '=', Auth::user()->branches_id)
                ->orderBy('box_number', 'asc')
                ->get();
        } else {
            $rds_record = RDSRecord::with(['documents', 'documents.rds', 'history' => function ($query) {
                return $query->orderBy('created_at', 'desc');
            }])
                ->orderBy('box_number', 'asc')
                ->get();
        }
        return send200Response($rds_record);
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
        try {
            // $request->validate([
            //     'rdsRecords.records_disposition_schedules_id' => 'required',
            //     'rdsRecords.period_covered_from' => 'required|date',
            //     'rdsRecords.period_covered_to' => 'required|date',
            // ]);
            DB::beginTransaction();

            $totalRetention = "NONE";
            foreach ($request->rdsRecords as $rds) {
                $currentRds = RecordsDispositionSchedule::find($rds["records_disposition_schedules_id"]);
                if ($totalRetention === "NONE") {
                    $totalRetention = $currentRds->active + $currentRds->storage;
                }
                if ($currentRds) {
                    $total = $currentRds->active + $currentRds->storage;

                    if ($total !== $totalRetention) { // Assuming there's an expected total to compare
                        return send400Response("The retention period for the RDS' are not the same.");
                    }
                }
            }

            // // Fetch the last entry for this branch
            // $lastRecord = RDSRecord::where('branches_id', Auth::user()->branch->id)
            //     ->whereNotNull('box_number')
            //     ->orderByDesc('id')
            //     ->first();

            // // Extract the counter from the last box_number
            // if ($lastRecord && preg_match('/-(\d+)$/', $lastRecord->box_number, $matches)) {
            //     $counter = (int) $matches[1] + 1; // Increment
            // } else {
            //     $counter = 1; // Start at 1 if no records exist
            // }

            // // Ensure counter is at least 3 digits
            // $formattedCounter = str_pad($counter, 3, '0', STR_PAD_LEFT);

            $new_rds_record = new RDSRecord();
            $new_rds_record->status = "PENDING";
            $new_rds_record->box_number = "";
            $new_rds_record->branches_id = Auth::user()->branches_id;
            $new_rds_record->submitted_by = Auth::user()->id;
            $new_rds_record->save();

            $rds_data = $request->rdsRecords;

            $most_recent_record = collect($rds_data)
                ->sortByDesc(function ($item) {
                    return \Carbon\Carbon::parse($item['period_covered_to']);
                })
                ->first();

            foreach ($request->rdsRecords as $rds) {
                $sel_rds = RecordsDispositionSchedule::find($rds["records_disposition_schedules_id"]);
                $new_rds_document = new RDSRecordDocument();
                $new_rds_document->r_d_s_records_id = $new_rds_record->id;
                $new_rds_document->records_disposition_schedules_id = $rds["records_disposition_schedules_id"];
                $new_rds_document->source_of_documents = Auth::user()->profile->position->name;
                $new_rds_document->period_covered_from = $rds["period_covered_from"];
                $new_rds_document->period_covered_to = $rds["period_covered_to"];
                $new_rds_document->projected_date_of_disposal = date('Y-m-d', strtotime($most_recent_record['period_covered_to'] . ' +' . $sel_rds->active + $sel_rds->storage . 'years'));
                $new_rds_document->description_of_document = $sel_rds->record_series_title_and_description;
                $new_rds_document->remarks = $rds["remarks"];
                // DB::rollBack();
                // return send400Response(date('Y-m-d', strtotime($request->rdsRecords[0]["period_covered_to"] . ' +' . $sel_rds->active + $sel_rds->storage . 'years')));
                $new_rds_document->save();
            }

            $new_rds_record_history = new RDSRecordHistory();
            $new_rds_record_history->r_d_s_records_id = $new_rds_record->id;
            $new_rds_record_history->users_id = Auth::user()->id;
            $new_rds_record_history->action = "SUBMIT";
            $new_rds_record_history->location = Auth::user()->branch->name;
            $new_rds_record_history->save();

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            // return $e;
            return send400Response();
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

    public function warehouse_supply()
    {
        try {
            $user = Auth::user();
            $wh_sup = [];
            if ($user->type === "WAREHOUSE_CUST") {
                $wh_sup = DB::table('r_d_s_records')
                    ->join('branches', 'r_d_s_records.branches_id', '=', 'branches.id') // Join to get clusters_id
                    ->join('r_d_s_record_histories as latest_h', function ($join) {
                        $join->on('r_d_s_records.id', '=', 'latest_h.r_d_s_records_id')
                            ->whereRaw('latest_h.id = (
                            SELECT h2.id
                            FROM r_d_s_record_histories AS h2
                            WHERE h2.r_d_s_records_id = latest_h.r_d_s_records_id
                            ORDER BY h2.updated_at DESC
                            LIMIT 1
                        )');
                    })
                    ->where('latest_h.location', 'Warehouse')
                    ->where('branches.clusters_id', $user->branch->clusters_id) // Filter by clusters_id
                    ->where('r_d_s_records.status', 'APPROVED')
                    ->select('r_d_s_records.*', 'latest_h.created_at as history_created_at', 'branches.name', 'r_d_s_records.status') // Select created_at from latest history
                    ->get();
            } else {
                $wh_sup = DB::table('r_d_s_records')
                    ->join('branches', 'r_d_s_records.branches_id', '=', 'branches.id') // Join to get clusters_id
                    ->whereExists(function ($query) {
                        $query->select(DB::raw(1))
                            ->from('r_d_s_record_histories as h')
                            ->whereRaw('r_d_s_records.id = h.r_d_s_records_id')
                            ->where('location', 'Warehouse')
                            ->whereRaw('h.id = (
                        SELECT h2.id
                        FROM r_d_s_record_histories AS h2
                        WHERE h2.r_d_s_records_id = h.r_d_s_records_id
                        ORDER BY h2.updated_at DESC
                        LIMIT 1
                    )');
                    })
                    ->where('branches.clusters_id', $user->branch->clusters_id) // Replace 5 with your desired cluster ID
                    ->where('r_d_s_records.status', 'APPROVED')
                    ->get();
            }

            return send200Response($wh_sup);
        } catch (\Exception $e) {
            return send400Response();
        }
    }

    public function approve_rds_record(Request $request)
    {
        if (Auth::user()->type !== "RECORDS_CUST") {
            return send401Response();
        }

        try {
            DB::beginTransaction();
            $rds_record = RDSRecord::find($request->id);
            if ($rds_record->status === "APPROVED") {
                return send400Response("The record is already approved!");
            }
            // Fetch the last entry for this branch
            $lastRecord = RDSRecord::where('branches_id', Auth::user()->branch->id)
                ->whereNotNull('box_number')
                ->where('box_number', '<>', '')
                ->orderByDesc('box_number')
                ->first();

            // Extract the counter from the last box_number
            if ($lastRecord && preg_match('/-(\d+)$/', $lastRecord->box_number, $matches)) {
                $counter = (int) $matches[1] + 1; // Increment
            } else {
                $counter = 1; // Start at 1 if no records exist
            }

            // Ensure counter is at least 3 digits
            $formattedCounter = str_pad($counter, 3, '0', STR_PAD_LEFT);

            $rds_record->box_number = Auth::user()->branch->code . "-" . $formattedCounter;
            $rds_record->status = "APPROVED";
            $rds_record->save();

            $new_rds_record_history = new RDSRecordHistory();
            $new_rds_record_history->r_d_s_records_id = $rds_record->id;
            $new_rds_record_history->users_id = Auth::user()->id;
            $new_rds_record_history->action = "APPROVE";
            $new_rds_record_history->location = Auth::user()->branch->name;
            $new_rds_record_history->save();

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }

    public function decline_record(Request $request)
    {
        if (Auth::user()->type !== "RECORDS_CUST") {
            return send401Response();
        }

        try {
            DB::beginTransaction();
            $rds_record = RDSRecord::find($request->id);
            if ($rds_record->status === "APPROVED") {
                return send400Response("The record is already approved!");
            }
            if ($rds_record->status === "DECLINED") {
                return send400Response("The record is already declined!");
            }

            $rds_record->status = "DECLINED";
            $rds_record->save();

            $new_rds_record_history = new RDSRecordHistory();
            $new_rds_record_history->r_d_s_records_id = $rds_record->id;
            $new_rds_record_history->users_id = Auth::user()->id;
            $new_rds_record_history->action = "DECLINE";
            $new_rds_record_history->location = Auth::user()->branch->name;
            $new_rds_record_history->save();

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }
}
