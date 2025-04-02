<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\RDSRecord;
use App\Models\RDSRecordDocument;
use App\Models\RDSRecordHistory;
use App\Models\RecordDisposal;
use App\Models\RecordDisposalHistory;
use App\Models\RecordDisposalItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DisposalController extends Controller
{
    //
    public function get_box_for_disposal()
    {
        $user = Auth::user();
        if ($user->type === "RECORDS_CUST" || $user->type === "BRANCH_HEAD" || $user->type === "DEV" || $user->type === "ADMIN") {
            $overdueRecords = RDSRecord::whereHas('documents', function ($query) {
                $query->where('projected_date_of_disposal', '<', now()->toDateString());
            })
                ->where('branches_id', $user->branches_id)
                ->with(['documents.rds', 'latest_history'])
                ->where('status', 'APPROVED')
                ->get();
            $upcomingRecords = RDSRecord::whereHas('documents', function ($query) {
                $query->whereBetween('projected_date_of_disposal', [now()->toDateString(), now()->addDays(5)->toDateString()]);
            })
                ->where('branches_id', $user->branches_id)
                ->with(['documents.rds', 'latest_history'])
                ->where('status', 'APPROVED')
                ->get();
            $pendingDisposal = RecordDisposal::with(['items.record.documents.rds', 'history', 'user.profile'])
                ->where('branches_id', $user->branches_id)
                ->where('status', '<>', 'DISPOSED')
                ->orderBy('created_at', 'DESC')
                ->get();
            $disposal_archive = RecordDisposal::with(['items.record.documents.rds', 'history', 'user.profile'])
                ->where('branches_id', $user->branches_id)
                ->where('status', 'DISPOSED')
                ->get();

            $data = [
                'overdue' => $overdueRecords,
                'upcoming' => $upcomingRecords,
                'pending' => $pendingDisposal,
                'disposal_archive' => $disposal_archive,
            ];

            return send200Response($data);
        } else {
            return send401Response();
        }
    }

    public function submit_disposal(Request $request)
    {
        $user = Auth::user();
        try {
            $cart = $request->cart;

            //VALIDATIONS
            $cartIds = collect($cart)->pluck('id');
            $ctr_rds_record_with_pending_transactions = RDSRecord::whereIn('id', $cartIds)
                ->where('status', 'APPROVED')
                ->where('branches_id', $user->branches_id)
                ->whereHas('documents', function ($query) {
                    $query->where('current_status', '<>', 'AVAILABLE');
                })
                ->count();
            if ($ctr_rds_record_with_pending_transactions > 0) {
                return send422Response("Some records have pending transactions or borrows.");
            }
            $ctr_rds_record_belongs_to_branch = RDSRecord::whereIn('id', $cartIds)
                ->where('status', 'APPROVED')
                ->where('branches_id', '<>', $user->branches_id)
                ->count();
            if ($ctr_rds_record_belongs_to_branch > 0) {
                return send422Response('One or more document does not belong to your branch.');
            }
            DB::beginTransaction();

            $branch_head = User::where('branches_id', Auth::user()->branches_id)
                ->with(['profile'])
                ->where('type', 'BRANCH_HEAD')
                ->first();

            $new_rds_disposal = new RecordDisposal();
            $new_rds_disposal->status = "PENDING";
            $new_rds_disposal->users_id  = $user->id;
            $new_rds_disposal->branches_id  = $user->branches_id;
            $new_rds_disposal->branch_head_id  = $branch_head->id;
            $new_rds_disposal->other  = json_encode(["location" => $request->location]);
            $new_rds_disposal->save();

            foreach ($cart as $c) {
                $new_disposal_item = new RecordDisposalItem();
                $new_disposal_item->record_disposals_id = $new_rds_disposal->id;
                $new_disposal_item->r_d_s_records_id  = $c['id'];
                $new_disposal_item->save();

                $rds_record = RDSRecord::find($c['id']);
                $rds_record->status = "PENDING_DISPOSAL";
                $rds_record->save();

                $new_record_history = new RDSRecordHistory();
                $new_record_history->r_d_s_records_id = $rds_record->id;
                $new_record_history->action = "SUBMIT_DISPOSAL";
                $new_record_history->location = $rds_record->latest_history->location;
                $new_record_history->users_id = $user->id;
                $new_record_history->save();
            }

            $new_rds_disposal_history = new RecordDisposalHistory();
            $new_rds_disposal_history->record_disposals_id = $new_rds_disposal->id;
            $new_rds_disposal_history->action = 'SUBMIT';
            $new_rds_disposal_history->users_id = $user->id;
            $new_rds_disposal_history->save();

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return $e;
            return send400Response();
        }
    }

    public function get_report($id)
    {
        try {
            $disposal_form = RecordDisposal::with(['items.record.documents.rds', 'user.profile.position', 'user.branch', 'branch_head.profile'])->where('id', $id)->first();

            $res = [
                'disposal_form' => $disposal_form,
            ];

            return send200Response($res);
        } catch (\Exception $e) {
            return send400Response();
        }
    }

    public function approve_disposal($id)
    {
        $user = Auth::user();
        try {
            if ($user->type !== "BRANCH_HEAD" && $user->type !== "ADMIN" && $user->type !== "DEV") {
                return send401Response();
            }

            DB::beginTransaction();
            $record_disposal = RecordDisposal::find($id);
            $record_disposal->status = "APPROVED";
            $record_disposal->save();

            $new_record_disposal_history = new RecordDisposalHistory();
            $new_record_disposal_history->record_disposals_id  = $record_disposal->id;
            $new_record_disposal_history->action  = "APPROVED";
            $new_record_disposal_history->remarks  = "APPROVED for submission.";
            $new_record_disposal_history->users_id  = $user->id;
            $new_record_disposal_history->save();

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }

    public function confirm_disposal($id)
    {
        $user = Auth::user();
        try {
            if ($user->type !== "BRANCH_HEAD" && $user->type !== "ADMIN" && $user->type !== "DEV") {
                return send401Response();
            }
            DB::beginTransaction();
            $record_disposal = RecordDisposal::find($id);
            $record_disposal->status = "DISPOSED";
            $record_disposal->save();

            $new_record_disposal_history = new RecordDisposalHistory();
            $new_record_disposal_history->record_disposals_id  = $record_disposal->id;
            $new_record_disposal_history->action  = "DISPOSED";
            $new_record_disposal_history->remarks  = "Disposal confirmed.";
            $new_record_disposal_history->users_id  = $user->id;
            $new_record_disposal_history->save();

            foreach ($record_disposal->items as $rec) {
                $record = RDSRecord::find($rec->r_d_s_records_id);
                $record->status = "DISPOSED";
                RDSRecordDocument::where('r_d_s_records_id', $rec->r_d_s_records_id)->update(["current_status" => "DISPOSED"]);
                $record->save();
                $new_record_history = new RDSRecordHistory();
                $new_record_history->r_d_s_records_id = $record->id;
                $new_record_history->action = "DISPOSE";
                $new_record_history->location = $record->latest_history->location;
                $new_record_history->users_id = $user->id;
                $new_record_history->save();
            }

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }

    public function decline_disposal($id)
    {
        $user = Auth::user();
        try {
            if ($user->type !== "BRANCH_HEAD") {
                return send401Response();
            }
            DB::beginTransaction();
            $record_disposal = RecordDisposal::find($id);
            $record_disposal->status = "DECLINED";
            $record_disposal->save();

            foreach ($record_disposal->items as $item) {
                $rds_record = RDSRecord::find($item->r_d_s_records_id);
                $rds_record->status = "APPROVED";
                $rds_record->save();

                $new_record_history = new RDSRecordHistory();
                $new_record_history->r_d_s_records_id = $rds_record->id;
                $new_record_history->action = "DECLINE_DISPOSAL";
                $new_record_history->location = $rds_record->latest_history->location;
                $new_record_history->users_id = $user->id;
                $new_record_history->save();
            }

            $new_record_disposal_history = new RecordDisposalHistory();
            $new_record_disposal_history->record_disposals_id  = $record_disposal->id;
            $new_record_disposal_history->action  = "DECLINE";
            $new_record_disposal_history->remarks  = "Disposal request declined.";
            $new_record_disposal_history->users_id  = $user->id;
            $new_record_disposal_history->save();

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }
}
