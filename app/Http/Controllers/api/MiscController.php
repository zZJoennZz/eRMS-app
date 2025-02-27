<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\RDSRecord;
use App\Models\RDSRecordDocumentHistory;
use App\Models\RDSTransaction;
use App\Models\User;
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
        // $rds_record = RDSRecord::with('latest_history')->whereDoesntHave('latest_history', function ($query) {
        //     $query->where('location', 'Warehouse');
        // })
        //     ->where('branches_id', Auth::user()->branches_id)
        //     ->where('status', 'APPROVED')
        //     ->count();
        // $rds_record = RDSRecord::whereHas('history', function ($query) {
        //     $query->where('location', '<>', 'Warehouse')
        //         ->whereRaw('id = (SELECT id FROM r_d_s_record_histories WHERE r_d_s_records_id = r_d_s_record_histories.r_d_s_records_id ORDER BY updated_at DESC LIMIT 1)');
        // })
        //     ->where('branches_id', $user->branches_id)
        //     ->where('status', 'APPROVED')
        //     ->count();
        // $rds_record_warehouse = RDSRecord::with('latest_history')->whereHas('latest_history', function ($query) {
        //     $query->where('location', 'Warehouse');
        // })
        //     ->where('branches_id', Auth::user()->branches_id)
        //     ->where('status', 'APPROVED')
        //     ->get();
        // $rds_record_warehouse = RDSRecord::whereHas('history', function ($query) {
        //     $query->where('location', 'Warehouse')
        //         ->whereRaw('id = (SELECT id FROM r_d_s_record_histories WHERE r_d_s_records_id = r_d_s_record_histories.r_d_s_records_id ORDER BY updated_at DESC LIMIT 1)');
        // })
        //     ->where('branches_id', $user->branches_id)
        //     ->where('status', 'APPROVED')
        //     ->count();
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
}
