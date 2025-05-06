<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\RDSRecord;
use App\Models\RDSRecordDocument;
use App\Models\RDSRecordDocumentHistory;
use App\Models\RDSRecordHistory;
use App\Models\RecordsDispositionSchedule;
use Carbon\Carbon;
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
                ->whereHas('documents', function ($query) {
                    $query
                        ->where('source_of_documents', '=', Auth::user()->profile->position->name);
                })
                ->where('status', '=', 'APPROVED')
                ->where('box_number', '<>', 'OPEN')
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
                ->where('submitted_by', Auth::user()->id)
                ->where('status', '=', 'PENDING')
                ->where('box_number', '<>', 'OPEN')
                ->where('branches_id', '=', Auth::user()->branches_id)
                ->orderBy('box_number', 'asc')
                ->get();
            $declined_records = RDSRecord::with(['documents', 'documents.rds', 'history' => function ($query) {
                return $query->orderBy('created_at', 'desc');
            }])
                ->whereHas('documents', function ($query) {
                    $query
                        ->where('source_of_documents', '=', Auth::user()->profile->position->name);
                })
                ->where('submitted_by', Auth::user()->id)
                ->where('status', '=', 'DECLINED')
                ->where('box_number', '<>', 'OPEN')
                ->where('branches_id', '=', Auth::user()->branches_id)
                ->get();

            $open_records = RDSRecord::with(['documents', 'documents.rds', 'history' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])
                ->whereHas('documents', function ($query) {
                    $query->where('source_of_documents', '=', Auth::user()->profile->position->name);
                })
                ->where('submitted_by', Auth::user()->id)
                ->where('status', '=', 'PENDING')
                ->where('box_number', '=', 'OPEN')
                ->where('branches_id', '=', Auth::user()->branches_id)
                ->get();
            $rds_record = new \Illuminate\Database\Eloquent\Collection();
            $rds_record = $rds_record->merge($main_records);
            $rds_record = $rds_record->merge($pending_records);
            $rds_record = $rds_record->merge($declined_records);
            $rds_record = $rds_record->merge($open_records);
        } elseif (Auth::user()->type === "BRANCH_HEAD" || Auth::user()->type === "RECORDS_CUST") {
            $main_records = RDSRecord::with(['documents.history', 'documents.rds', 'history' => function ($query) {
                return $query->orderBy('created_at', 'desc');
            }])
                ->where('status', '=', 'APPROVED')
                ->where('branches_id', '=', Auth::user()->branches_id)
                ->orderBy('box_number', 'asc')
                ->get();
            $pending_records = RDSRecord::with(['documents', 'documents.rds', 'history' => function ($query) {
                return $query->orderBy('created_at', 'desc');
            }])
                ->where('status', '=', 'PENDING')
                ->where('branches_id', '=', Auth::user()->branches_id)
                ->orderBy('box_number', 'asc')
                ->get();
            $declined_records = RDSRecord::with(['documents', 'documents.rds', 'history' => function ($query) {
                return $query->orderBy('created_at', 'desc');
            }])
                ->where('status', '=', 'DECLINED')
                ->where('branches_id', '=', Auth::user()->branches_id)
                ->get();
            $rds_record = new \Illuminate\Database\Eloquent\Collection();
            $rds_record = $rds_record->merge($pending_records);
            $rds_record = $rds_record->merge($main_records);
            $rds_record = $rds_record->merge($declined_records);
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
                    return Carbon::parse($item['period_covered_to']);
                })
                ->first();

            foreach ($request->rdsRecords as $rds) {
                $dateFrom = Carbon::parse($rds["period_covered_from"]);
                $dateTo = Carbon::parse($rds["period_covered_to"]);

                if ($dateFrom->isFuture() || $dateTo->isFuture()) {
                    DB::rollBack();
                    return send422Response("Please do not put future dates for period covered.");
                }

                if ($dateFrom->gt($dateTo)) {
                    DB::rollBack();
                    return send422Response("Period covered from should be before the period covered to.");
                }


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
        $rds_record = RDSRecord::with(['documents.history', 'documents.rds', 'history' => function ($query) {
            return $query->orderBy('created_at', 'desc');
        }])
            ->where('id', $id)
            ->orderBy('box_number', 'asc')
            ->first();

        return send200Response($rds_record);
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

            DB::beginTransaction();
            $rds_record = RDSRecord::find($id);
            if ($user->branches_id !== $rds_record->branches_id) {
                return send401Response();
            }

            $rds_record_documents = RDSRecordDocument::where('r_d_s_records_id', $id)->get();

            $rds_record_documents_id_only = $rds_record_documents->pluck('id')->toArray();

            RDSRecordDocumentHistory::whereIn('record_documents_id', $rds_record_documents_id_only)
                ->delete();

            RDSRecordDocument::where('r_d_s_records_id', $id)
                ->delete();

            $rds_data = $request->documents;

            $most_recent_record = collect($rds_data)
                ->sortByDesc(function ($item) {
                    return Carbon::parse($item['period_covered_to']);
                })
                ->first();

            foreach ($request->documents as $rds) {
                $dateFrom = Carbon::parse($rds["period_covered_from"]);
                $dateTo = Carbon::parse($rds["period_covered_to"]);

                if ($dateFrom->isFuture() || $dateTo->isFuture()) {
                    return send422Response("Please do not put future dates for period covered.");
                }

                if ($dateFrom->gt($dateTo)) {
                    return send422Response("Period covered from should be before the period covered to.");
                }


                $sel_rds = RecordsDispositionSchedule::find($rds["records_disposition_schedules_id"]);
                $new_rds_document = new RDSRecordDocument();
                $new_rds_document->r_d_s_records_id = $id;
                $new_rds_document->records_disposition_schedules_id = $rds["records_disposition_schedules_id"];
                $new_rds_document->source_of_documents = Auth::user()->profile->position->name;
                $new_rds_document->period_covered_from = $rds["period_covered_from"];
                $new_rds_document->period_covered_to = $rds["period_covered_to"];
                $new_rds_document->projected_date_of_disposal = date('Y-m-d', strtotime($most_recent_record['period_covered_to'] . ' +' . $sel_rds->active + $sel_rds->storage . 'years'));
                $new_rds_document->description_of_document = $sel_rds->record_series_title_and_description;
                $new_rds_document->remarks = $rds["remarks"];

                $new_rds_document->save();
            }

            $rds_record->status = "PENDING";
            $rds_record->save();

            $new_rds_record_history = new RDSRecordHistory();
            $new_rds_record_history->r_d_s_records_id = $id;
            $new_rds_record_history->users_id = $user->id;
            $new_rds_record_history->action = "SUBMIT";
            $new_rds_record_history->location = $user->branch->name;
            $new_rds_record_history->save();

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            return send400Response();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $user = Auth::user();

        if ($user->type !== "RECORDS_CUST" || $user->type !== "BRANCH_HEAD") {
            return send401Response();
        }

        try {
            DB::beginTransaction();
            $rds_record = RDSRecord::find($id);

            if ($rds_record->status !== "DISPOSED") {
                return send422Response("You cannot delete boxes that aren't declined.");
            }

            $rds_record->delete();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
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

            if ($rds_record->box_number === "OPEN") {
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
            }

            // Fetch the last entry for this branch
            $lastRecord = RDSRecord::where('branches_id', Auth::user()->branch->id)
                ->whereNotNull('box_number')
                ->where('box_number', '<>', '')
                ->where('box_number', '<>', 'OPEN')
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

    public function rds_record_history($id)
    {
        $user = Auth::user();
        if ($user->type === "WAREHOUSE_CUST") {
            return send401Response();
        }
        $rds_record = RDSRecord::with(['documents.rds', 'submitted_by_user.profile', 'transactions.transaction.history.user.profile', 'history.user.profile', 'documents.history.action_by.profile'])
            ->where('branches_id', $user->branches_id)
            ->where('id', $id)
            ->first();

        return send200Response($rds_record);
    }

    public function get_branch_records()
    {
        $user = Auth::user();
        if ($user->type === "WAREHOUSE_CUST") {
            return send401Response();
        }
        $rds_record = RDSRecord::with(['documents.rds', 'submitted_by_user.profile', 'transactions.transaction.history.user.profile', 'history.user.profile', 'documents.history.action_by.profile'])
            ->where('branches_id', $user->branches_id)
            ->whereHas('latest_history', function ($query) {
                $query->where('location', '<>', 'Warehouse');
            })
            ->where('status', '<>', 'DISPOSED')
            ->get();

        return send200Response($rds_record);
    }

    public function add_to_open(Request $request)
    {
        $user = Auth::user();
        if ($user->type !== "EMPLOYEE") {
            return send401Response();
        }

        try {
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
            $new_rds_record->box_number = "OPEN";
            $new_rds_record->branches_id = Auth::user()->branches_id;
            $new_rds_record->submitted_by = Auth::user()->id;
            $new_rds_record->save();

            $rds_data = $request->rdsRecords;

            $most_recent_record = collect($rds_data)
                ->sortByDesc(function ($item) {
                    return Carbon::parse($item['period_covered_to']);
                })
                ->first();

            foreach ($request->rdsRecords as $rds) {
                $dateFrom = Carbon::parse($rds["period_covered_from"]);
                $dateTo = Carbon::parse($rds["period_covered_to"]);

                if ($dateFrom->isFuture() || $dateTo->isFuture()) {
                    return send422Response("Please do not put future dates for period covered.");
                }

                if ($dateFrom->gt($dateTo)) {
                    return send422Response("Period covered from should be before the period covered to.");
                }


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
            return send400Response();
        }
    }

    public function get_open_boxes()
    {
        //
        if (Auth::user()->type !== "RECORDS_CUST") {
            return send401Response();
        }

        $rds_record = RDSRecord::with(['documents.history', 'documents.rds', 'history' => function ($query) {
            return $query->orderBy('created_at', 'desc');
        }])
            ->where('status', '=', 'APPROVED')
            ->where('box_number', '=', 'OPEN')
            ->where('branches_id', '=', Auth::user()->branches_id)
            ->get();
        return send200Response($rds_record);
    }

    public function save_open_box_doc(Request $request)
    {
        if (Auth::user()->type !== "RECORDS_CUST") {
            return send401Response();
        }

        $open_box_ids = [];
        $projectedDates = [];
        $firstProjectedDate = $request->all()[0]["projected_date_of_disposal"];
        foreach ($request->all() as $rds) {
            if ($firstProjectedDate !== $rds["projected_date_of_disposal"]) {
                return send400Response("The projected date of disposal values are not consistent.");
            }

            array_push($open_box_ids, $rds["r_d_s_records_id"]);
        }

        $open_box_ids = array_unique($open_box_ids);

        try {
            DB::beginTransaction();
            $new_rds_record = new RDSRecord();
            $new_rds_record->status = "APPROVED";

            // Fetch the last entry for this branch
            $lastRecord = RDSRecord::where('branches_id', Auth::user()->branch->id)
                ->whereNotNull('box_number')
                ->where('box_number', '<>', '')
                ->where('box_number', '<>', 'OPEN')
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

            $new_rds_record->box_number = Auth::user()->branch->code . "-" . $formattedCounter;
            $new_rds_record->branches_id  = Auth::user()->branches_id;
            $new_rds_record->submitted_by = Auth::user()->id;
            $new_rds_record->save();

            $new_rds_record_history = new RDSRecordHistory();
            $new_rds_record_history->r_d_s_records_id = $new_rds_record->id;
            $new_rds_record_history->users_id = Auth::user()->id;
            $new_rds_record_history->action = "APPROVE";
            $new_rds_record_history->location = Auth::user()->branch->name;
            $new_rds_record_history->save();

            foreach ($request->all() as $rds) {
                $sel_rds = RDSRecordDocument::find($rds["id"]);
                $sel_rds->r_d_s_records_id = $new_rds_record->id;
                // DB::rollBack();
                // return send400Response(date('Y-m-d', strtotime($request->rdsRecords[0]["period_covered_to"] . ' +' . $sel_rds->active + $sel_rds->storage . 'years')));
                $sel_rds->save();
            }

            // Check if the open boxes still have documents and delete if empty
            foreach ($open_box_ids as $box_id) {
                $remainingDocuments = RDSRecordDocument::where('r_d_s_records_id', $box_id)->count();
                if ($remainingDocuments === 0) {
                    RDSRecordHistory::where('r_d_s_records_id', $box_id)->delete();
                    RDSRecord::where('id', $box_id)->delete();
                }
            }

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response($e);
        }
    }
}
