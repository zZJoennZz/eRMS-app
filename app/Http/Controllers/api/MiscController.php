<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\RDSRecord;
use App\Models\RDSRecordDocumentHistory;
use App\Models\RDSTransaction;
use App\Models\RecordDisposal;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MiscController extends Controller
{
    //
    public function get_signatories()
    {
        $users = User::with("profile")
            ->with("branch")
            ->select("id", "branches_id")
            ->get();
        return send200Response($users);
    }

    public function get_records_for_transfer()
    {
        $user = Auth::user();
        return RDSRecord::where('branches_id', '=', $user->branches_id)
            ->get();
    }

    public function get_document_record($id)
    {
        $rds_record = RDSRecord::where('id', $id)->with(['branch'])->first();
        return view('print.document-record')
            ->with('rds_record', $rds_record);
    }

    public function get_employee_pending_transactions()
    {
        $user = Auth::user();
        $data = [];

        if ($user->type === "EMPLOYEE") {
            $data = RDSTransaction::where('status', 'FOR RECEIVING')
                ->where('submitted_by', $user->id)
                ->with(['rds_records.record.documents.rds'])
                ->limit(5)
                ->orderBy('created_at', 'DESC')
                ->get();
        }

        if ($user->type === "BRANCH_HEAD") {
            $transfer = RDSTransaction::where('status', 'PENDING')
                ->where('type', 'TRANSFER')
                ->whereHas('submitted_by_user', function ($query) use ($user) {
                    $query->where('branches_id', $user->branches_id);
                })
                ->with(['rds_records.record.documents.rds'])
                ->limit(5)
                ->orderBy('created_at', 'DESC')
                ->get();
            $data = $transfer;
        }

        if ($user->type === "WAREHOUSE_CUST") {
            $transfer = RDSTransaction::where('status', 'PROCESSING')
                ->where('type', 'TRANSFER')
                ->whereHas('submitted_by_user.branch', function ($query) use ($user) {
                    $query->where('clusters_id', $user->branch->clusters_id);
                })
                ->with(['rds_records.record.documents.rds'])
                ->limit(5)
                ->orderBy('created_at', 'DESC')
                ->get();
            $data = $transfer;
        }
        return send200Response($data);
    }

    public function get_pending_rds()
    {
        $user = Auth::user();
        $rds_records = [];
        if ($user->type === "RECORDS_CUST") {
            $rds_records = RDSRecord::where('branches_id', $user->branches_id)
                ->with(['documents'])
                ->where('status', 'PENDING')
                ->get();
        } else {
            return send401Response();
        }

        return send200Response($rds_records);
    }

    public function get_document_for_disposal()
    {
        $user = Auth::user();

        if ($user->type === "RECORDS_CUST" || $user->type === "BRANCH_HEAD" || $user->type === "DEV") {
            $overdueRecords = RDSRecord::whereHas('documents', function ($query) {
                $query->where('projected_date_of_disposal', '<', now()->toDateString());
            })
                ->with(['documents'])
                ->where('status', 'APPROVED')
                ->get();
            $upcomingRecords = RDSRecord::whereHas('documents', function ($query) {
                $query->whereBetween('projected_date_of_disposal', [now()->toDateString(), now()->addDays(5)->toDateString()]);
            })
                ->with(['documents'])
                ->where('status', 'APPROVED')
                ->get();

            $data = [
                'overdue' => $overdueRecords,
                'upcoming' => $upcomingRecords,
            ];
            return send200Response($data);
        } else {
            return send401Response();
        }
    }

    public function rc_dashboard()
    {
        $user = Auth::user();

        if ($user->type !== "RECORDS_CUST") {
            return send401Response();
        }

        $pending_boxes = RDSRecord::where('status', 'PENDING')
            ->where('branches_id', $user->branches_id)
            ->count();
        $receiving = RDSTransaction::where('status', 'FOR RECEIVING')
            ->where('type', 'WITHDRAW')
            ->whereHas('submitted_by_user.branch', function ($query) use ($user) {
                $query->where('id', $user->branches_id);
            })
            ->count();
        $pending_borrows = RDSRecordDocumentHistory::where('action', 'INIT_BORROW')
            ->whereHas('action_by', function ($query) use ($user) {
                $query->where('branches_id', $user->branches_id);
            })
            ->where('status', 'PENDING')
            ->count();
        $pending_returns = RDSRecordDocumentHistory::where('action', 'INIT_BORROW')
            ->whereHas('action_by', function ($query) use ($user) {
                $query->where('branches_id', $user->branches_id);
            })
            ->where('status', 'RETURNING')
            ->count();
        $rds_record = DB::table('r_d_s_records')
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('r_d_s_record_histories as h')
                    ->whereRaw('r_d_s_records.id = h.r_d_s_records_id')
                    ->where('location', '<>', 'Warehouse')
                    ->whereRaw('h.id = (
                    SELECT h2.id 
                    FROM r_d_s_record_histories AS h2 
                    WHERE h2.r_d_s_records_id = h.r_d_s_records_id 
                    ORDER BY h2.updated_at DESC 
                    LIMIT 1
                )');
            })
            ->where('branches_id', $user->branches_id)
            ->where('status', 'APPROVED')
            ->count();
        $rds_record_warehouse = DB::table('r_d_s_records')
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
            ->where('branches_id', $user->branches_id)
            ->where('status', 'APPROVED')
            ->count();
        $upcoming_disposals = RDSRecord::with('latest_history')->whereHas('documents', function ($query) {
            $query->whereBetween('projected_date_of_disposal', [now()->toDateString(), now()->addDays(5)->toDateString()]);
        })
            ->where('status', 'APPROVED')
            ->count();
        $overdue_disposals = RDSRecord::whereHas('documents', function ($query) {
            $query->where('projected_date_of_disposal', '<', now()->toDateString());
        })
            ->where('branches_id', $user->branches_id)
            ->where('status', 'APPROVED')
            ->count();
        $res = [
            "pending_boxes" => $pending_boxes,
            "receiving" => $receiving,
            "pending_borrows" => $pending_borrows,
            "pending_returns" => $pending_returns,
            "rds_record" => $rds_record,
            "rds_record_warehouse" => $rds_record_warehouse,
            "upcoming_disposals" => $upcoming_disposals,
            "overdue_disposals" => $overdue_disposals,
        ];

        return send200Response($res);
    }

    public function bh_dashboard()
    {
        $user = Auth::user();

        if ($user->type !== "BRANCH_HEAD") {
            return send401Response();
        }

        $pending_transfer = RDSTransaction::where('status', 'PENDING')
            ->where('type', 'TRANSFER')
            ->whereHas('submitted_by_user.branch', function ($query) use ($user) {
                $query->where('id', $user->branches_id);
            })
            ->count();

        $pending_withdraw = RDSTransaction::where('status', 'PENDING')
            ->where('type', 'WITHDRAW')
            ->whereHas('submitted_by_user.branch', function ($query) use ($user) {
                $query->where('id', $user->branches_id);
            })
            ->count();
        $processing_borrows = RDSRecordDocumentHistory::where('action', 'INIT_BORROW')
            ->whereHas('action_by', function ($query) use ($user) {
                $query->where('branches_id', $user->branches_id);
            })
            ->where('status', 'PROCESSING')
            ->count();

        $rds_record = DB::table('r_d_s_records')
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('r_d_s_record_histories as h')
                    ->whereRaw('r_d_s_records.id = h.r_d_s_records_id')
                    ->where('location', '<>', 'Warehouse')
                    ->whereRaw('h.id = (
                    SELECT h2.id 
                    FROM r_d_s_record_histories AS h2 
                    WHERE h2.r_d_s_records_id = h.r_d_s_records_id 
                    ORDER BY h2.updated_at DESC 
                    LIMIT 1
                )');
            })
            ->where('branches_id', $user->branches_id)
            ->where('status', 'APPROVED')
            ->count();
        $rds_record_warehouse = DB::table('r_d_s_records')
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
            ->where('branches_id', $user->branches_id)
            ->where('status', 'APPROVED')
            ->count();
        $upcoming_disposals = RDSRecord::with('latest_history')->whereHas('documents', function ($query) {
            $query->whereBetween('projected_date_of_disposal', [now()->toDateString(), now()->addDays(5)->toDateString()]);
        })
            ->where('status', 'APPROVED')
            ->count();
        $overdue_disposals = RDSRecord::whereHas('documents', function ($query) {
            $query->where('projected_date_of_disposal', '<', now()->toDateString());
        })
            ->where('branches_id', $user->branches_id)
            ->where('status', 'APPROVED')
            ->count();
        $res = [
            "pending_transfer" => $pending_transfer,
            "pending_withdraw" => $pending_withdraw,
            "processing_borrows" => $processing_borrows,
            "rds_record" => $rds_record,
            "rds_record_warehouse" => $rds_record_warehouse,
            "upcoming_disposals" => $upcoming_disposals,
            "overdue_disposals" => $overdue_disposals,
        ];

        return send200Response($res);
    }

    public function emp_dashboard()
    {
        $user = Auth::user();

        if ($user->type !== "EMPLOYEE") {
            return send401Response();
        }

        $for_receiving = RDSRecordDocumentHistory::where('action', 'INIT_BORROW')
            ->where('users_id', $user->id)
            ->whereHas('document.record', function ($query) use ($user) {
                $query->where('branches_id', $user->branches_id);
            })
            ->where('status', 'RECEIVING')
            ->count();

        $on_hand = RDSRecordDocumentHistory::where('action', 'INIT_BORROW')
            ->where('users_id', $user->id)
            ->whereHas('document.record', function ($query) use ($user) {
                $query->where('branches_id', $user->branches_id);
            })
            ->where('status', 'BORROWED')
            ->count();
        $pending_borrows = RDSRecordDocumentHistory::where('action', 'INIT_BORROW')
            ->where('users_id', $user->id)
            ->whereHas('document.record', function ($query) use ($user) {
                $query->where('branches_id', $user->branches_id);
            })
            ->where('status', 'PENDING')
            ->count();


        $res = [
            "for_receiving" => $for_receiving,
            "on_hand" => $on_hand,
            "pending_borrows" => $pending_borrows,
        ];

        return send200Response($res);
    }

    public function wh_dashboard()
    {
        $user = Auth::user();

        if ($user->type !== "WAREHOUSE_CUST") {
            return send401Response();
        }

        $for_receiving = RDSTransaction::where('status', 'PROCESSING')
            ->where('type', 'TRANSFER')
            ->whereHas('submitted_by_user.branch', function ($query) use ($user) {
                $query->where('clusters_id', $user->branch->clusters_id);
            })
            ->count();

        $pending_withdraw = RDSTransaction::where('status', 'PENDING')
            ->where('type', 'WITHDRAW')
            ->whereHas('submitted_by_user.branch', function ($query) use ($user) {
                $query->where('clusters_id', $user->branch->clusters_id);
            })
            ->count();
        $boxes_in_warehouse = DB::table('r_d_s_records')
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
            ->count();

        $res = [
            "for_receiving" => $for_receiving,
            "pending_withdraw" => $pending_withdraw,
            "boxes_in_warehouse" => $boxes_in_warehouse,
        ];

        return send200Response($res);
    }

    public function print_filtered_warehouse_records(Request $request)
    {
        try {
            $user = Auth::user();
            $resData = [];
            if ($user->type === "WAREHOUSE_CUST") {
                $startDate = Carbon::parse($request->startDate)->startOfDay();
                $endDate = Carbon::parse($request->endDate)->endOfDay();
                if ($request->reportType === "warehouseRecords") {
                    if ($request->searchField === "name") {
                        $resData = RDSRecord::whereHas('branch', function ($query) use ($request) {
                            $query->where('name', 'like', '%' . $request->searchTxt . '%')->where('clusters_id', Auth::user()->branch->clusters_id);
                        })->whereHas('latest_history', function ($query) use ($startDate) {
                            $query->where('location', 'Warehouse')->where('action', 'transfer');
                        })
                            ->with(['documents.rds', 'latest_history'])
                            ->where('status', 'APPROVED')
                            ->get();
                    } elseif ($request->searchField === "history_created_at" && $request->dateFilterType === "as_of") {
                        $resData = RDSRecord::whereHas('branch', function ($query) {
                            $query->where('clusters_id', Auth::user()->branch->clusters_id);
                        })
                            ->whereHas('latest_history', function ($query) use ($startDate) {
                                $query->where('location', 'Warehouse')->where('action', 'transfer')->where('created_at', '<=', $startDate->endOfDay());
                            })
                            ->with(['documents.rds', 'latest_history'])
                            ->where('status', 'APPROVED')
                            ->get();
                    } elseif ($request->searchField === "history_created_at" && $request->dateFilterType === "date_range") {


                        $resData = RDSRecord::whereHas('branch', function ($query) {
                            $query->where('clusters_id', Auth::user()->branch->clusters_id);
                        })
                            ->whereHas('latest_history', function ($query) use ($startDate, $endDate) {
                                $query
                                    ->where('created_at', '>=', $startDate)
                                    ->where('created_at', '<=', $endDate);
                            })
                            ->with(['documents.rds', 'latest_history'])
                            ->where('status', 'APPROVED')
                            ->get();
                    } else {
                        return send400Response("Invalid parameters.");
                    }
                }
            }

            if ($user->type === "RECORDS_CUST" || $user->type === "BRANCH_HEAD") {
                if (isset($request->from_date)) {
                    $startDate = Carbon::parse($request->from_date)->startOfDay();
                    $endDate = Carbon::parse($request->to_date)->endOfDay();
                }

                if ($request->reportType === "branchSummary" || $request->reportType === "branchBoxes") {
                    $resData = RDSRecord::where('branches_id', $user->branches_id)
                        ->with(['documents.rds', 'latest_history', 'submitted_by_user.profile'])
                        ->where('status', 'APPROVED')
                        ->whereBetween('created_at', [$startDate, $endDate]);

                    if ($request->scope === "branch_only") {
                        $resData = $resData->whereHas('latest_history', function ($query) {
                            $query->where('action', '!=', 'TRANSFER')
                                ->where('location', '!=', 'Warehouse');
                        });
                    } elseif ($request->scope === "warehouse_only") {
                        $resData = $resData->whereHas('latest_history', function ($query) {
                            $query->where('action', 'TRANSFER')
                                ->where('location', 'Warehouse');
                        });
                    }
                    $resData = $resData->get();
                } elseif ($request->reportType === "disposedBoxSum" || $request->reportType === "disposedRecordsSum") {
                    // $resData = RDSRecord::where('branches_id', $user->branches_id)
                    //     ->with(['documents.rds', 'latest_history', 'submitted_by_user.profile'])
                    //     ->where('status', 'DISPOSED')
                    //     ->whereBetween('created_at', [$startDate, $endDate])
                    //     ->get();
                    $resData = RecordDisposal::where('branches_id', $user->branches_id)
                        ->where('status', 'DISPOSED')
                        ->with(['items.record.documents.rds'])
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->get();
                } elseif ($request->reportType === "recordsByUser") {
                    $resData = RDSRecord::where('branches_id', $user->branches_id)
                        ->with(['documents.rds', 'latest_history', 'submitted_by_user.profile'])
                        // ->whereHas('latest_history', function ($query) {
                        //     $query->where('action', '!=', 'TRANSFER')
                        //         ->where('location', '!=', 'Warehouse');
                        // })
                        ->where('status', 'APPROVED')
                        ->where('submitted_by', $request->users_id)
                        ->get();
                } elseif ($request->reportType === "borrowsAndReturns") {
                    $resData = RDSRecordDocumentHistory::whereHas('document.record', function ($query) use ($user) {
                        $query->where('branches_id', $user->branches_id);
                    })
                        ->where('action', 'INIT_BORROW')
                        ->with(['document.record', 'action_by.profile', 'document.rds'])
                        ->get();
                } elseif ($request->reportType === "currentBorrowed") {
                    $resData = RDSRecordDocumentHistory::whereHas('document.record', function ($query) use ($user) {
                        $query->where('branches_id', $user->branches_id);
                    })
                        ->where('action', 'INIT_BORROW')
                        ->where('status', 'BORROWED')
                        ->with(['document.record', 'action_by.profile', 'document.rds'])
                        ->get();
                } else {
                    return send400Response("Invalid parameters.");
                }
            }

            if ($user->type === "EMPLOYEE") {
                $startDate = "";
                $endDate = "";
                if (isset($request->from_date)) {
                    $startDate = Carbon::parse($request->from_date)->startOfDay();
                    $endDate = Carbon::parse($request->to_date)->endOfDay();
                }
                if ($request->reportType === "currentBorrows") {
                    $resData = RDSRecordDocumentHistory::where('users_id', $user->id)
                        ->where('action', 'INIT_BORROW')
                        ->where('status', 'BORROWED')
                        ->with(['document.record', 'action_by.profile', 'document.rds'])
                        ->get();
                } elseif ($request->reportType === "submittedDoc") {
                    $resData = RDSRecord::where('submitted_by', $user->id)
                        ->with(['documents.rds', 'latest_history', 'submitted_by_user.profile'])
                        // ->whereHas('latest_history', function ($query) {
                        //     $query->where('action', '!=', 'TRANSFER')
                        //         ->where('location', '!=', 'Warehouse');
                        // })
                        ->where('status', 'APPROVED')
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->get();
                }
            }
            return send200Response($resData);
        } catch (\Exception $e) {
            return send400Response();
        }
    }
}
