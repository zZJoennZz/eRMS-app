<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\RDSRecordDocument;
use App\Models\RDSRecordDocumentHistory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BorrowTransferController extends Controller
{
    //
    public function borrow(Request $request)
    {
        if (Auth::user()->type !== 'EMPLOYEE') {
            log_bank_action('Unauthorized borrow attempt by User: '.Auth::user()->username);

            return send401Response();
        }

        $req_data = $request->cart;
        $data_ids = array_column($req_data, 'id');

        try {
            // VALIDATION
            $rds_records = RDSRecordDocument::whereIn('id', $data_ids)->get();

            if ($rds_records->where('current_status', 'AVAILABLE')->count() !== $rds_records->count()) {
                log_bank_action('Borrow Failed: One or more selected documents are currently UNAVAILABLE.');

                return send422Response('Selected document/s are not available.');
            }

            if (
                $rds_records->contains(function ($record) {
                    return $record->source_of_documents !== Auth::user()->profile->position->name;
                })
            ) {
                log_bank_action('Security Alert: User attempted to borrow documents outside their department/source scope.');

                return send422Response('You are not allowed to borrow the selected document/s.');
            }

            foreach ($rds_records as $rec) {
                if ($rec->record->branches_id !== Auth::user()->branches_id) {
                    log_bank_action('Cross-Branch Violation: Attempted to borrow document from a different branch.');

                    return send422Response('This document is not in your branch.');
                }
            }

            // BEGIN BORROW
            DB::beginTransaction();

            foreach ($rds_records as $rec) {
                $new_rds_documents_history = new RDSRecordDocumentHistory;
                $new_rds_documents_history->action = 'INIT_BORROW';
                $new_rds_documents_history->status = 'PENDING';
                $new_rds_documents_history->remarks = $request->borrowReason;
                $new_rds_documents_history->record_documents_id = $rec->id;
                $new_rds_documents_history->users_id = Auth::user()->id;
                $new_rds_documents_history->save();
            }

            // SUCCESS LOG: Essential for tracking document request volume and intent
            log_bank_action(
                'BORROW REQUEST SUBMITTED: '.count($rds_records).' documents requested. Status set to PENDING.',
                null, // No single transaction object yet, metadata captures the context
                [
                    'reason' => $request->borrowReason,
                    'document_ids' => $data_ids,
                ]
            );

            DB::commit();

            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            log_bank_action('System error during borrow submission', null, ['error' => $e->getMessage()]);

            return send400Response();
        }
    }

    public function get_pending_requests()
    {
        $user = Auth::user();
        if (! in_array($user->type, ['DEV', 'ADMIN', 'RECORDS_CUST', 'BRANCH_HEAD', 'EMPLOYEE'])) {
            return send401Response();
        }

        try {
            $borrow_requests = [];
            if ($user->type === 'RECORDS_CUST' || $user->type === 'BRANCH_HEAD' || $user->type === 'DEV' || $user->type === 'ADMIN') {
                // $borrow_requests = RDSRecordDocument::with(['rds', 'record', 'latest_history.action_by.profile'])
                //     ->whereHas('record', function ($query) {
                //         $query->where('branches_id', $user->branches_id);
                //     })
                //     ->whereHas('latest_history', function ($query) {
                //         $query->where('action', 'INIT_BORROW');
                //     })
                //     ->where("current_status", "AVAILABLE")
                //     ->get();

                // $pending_borrows = RDSRecordDocumentHistory::with('document.rds', 'document.record', 'action_by.profile')
                //     ->where('action', 'INIT_BORROW')
                //     ->where('status', 'PENDING')
                //     ->whereHas('document.record', function ($query) use ($user) {
                //         $query->where('branches_id', $user->branches_id);
                //     })
                //     ->get();
                // $returning_borrows = RDSRecordDocumentHistory::with('document.rds', 'document.record', 'action_by.profile')
                //     ->where('action', 'INIT_BORROW')
                //     ->where('status', 'RETURNING')
                //     ->whereHas('document.record', function ($query) use ($user) {
                //         $query->where('branches_id', $user->branches_id);
                //     })
                //     ->get();
                // $borrow_requests = new \Illuminate\Database\Eloquent\Collection();
                // $borrow_requests = $borrow_requests->merge($pending_borrows);
                // $borrow_requests = $borrow_requests->merge($returning_borrows);

                $borrow_requests = RDSRecordDocumentHistory::with(['document.rds', 'document.record', 'action_by.profile', 'children' => function ($query) {
                    $query->orderBy('created_at', 'DESC');
                }])
                    ->where('action', 'INIT_BORROW')
                    ->whereHas('document.record', function ($query) use ($user) {
                        $query->where('branches_id', $user->branches_id);
                    })
                    ->orderBy('created_at', 'desc')
                    ->get();

                // elseif ($user->type === "BRANCH_HEAD" || $user->type === "DEV" || $user->type === "ADMIN") {
                //     // $borrow_requests = RDSRecordDocument::with(['rds', 'record', 'latest_history.action_by.profile'])
                //     //     ->whereHas('latest_history', function ($query) {
                //     //         $query->where('action', 'PROCESSING');
                //     //     })
                //     //     ->whereHas('record', function ($query) {
                //     //         $query->where('branches_id', $user->branches_id);
                //     //     })
                //     //     ->where("current_status", "PROCESSING")
                //     //     ->get();
                //     $borrow_requests = RDSRecordDocumentHistory::with('document.rds', 'document.record', 'action_by.profile')
                //         ->where('action', 'INIT_BORROW')
                //         ->whereHas('document.record', function ($query) use ($user) {
                //             $query->where('branches_id', $user->branches_id);
                //         })
                //         ->get();
                // }
            } elseif ($user->type === 'EMPLOYEE') {
                $borrow_requests = RDSRecordDocumentHistory::with('document.rds', 'document.record', 'action_by.profile', 'children')
                    ->where('action', 'INIT_BORROW')
                    ->where('users_id', $user->id)
                    ->whereHas('document.record', function ($query) use ($user) {
                        $query->where('branches_id', $user->branches_id);
                    })
                    ->orderBy('created_at', 'desc')
                    ->get();
            } else {
                return send401Response();
            }

            return send200Response($borrow_requests);
        } catch (\Exception $e) {
            return send400Response();
        }
    }

    public function process_pending_request(Request $request)
    {
        $user = Auth::user();
        if (! in_array($user->type, ['DEV', 'ADMIN', 'RECORDS_CUST', 'EMPLOYEE', 'BRANCH_HEAD'])) {
            log_bank_action("Unauthorized process attempt by User: {$user->username}");

            return send401Response();
        }

        $all_data = $request->all();
        $document_ids = collect($all_data)->pluck('document.id');
        $has_duplicates = $document_ids->duplicates()->isNotEmpty();
        if ($has_duplicates) {
            return send422Response('Please select only one of the borrow requests with the same document/s.');
        }

        $rds_record_document = RDSRecordDocument::whereIn('id', $document_ids)
            ->where('current_status', 'PROCESSING')
            ->count();
        if ($rds_record_document > 0 && $user->type === 'RECORDS_CUST') {
            log_bank_action('Process Failed: Attempted to process already processing documents.');

            return send422Response('Your selected documents is currently processing and cannot be processed.');
        }

        try {
            DB::beginTransaction();

            foreach ($request->all() as $rds) {
                $rds_history = RDSRecordDocumentHistory::find($rds['id']);
                $rds_record_document = RDSRecordDocument::find($rds_history->record_documents_id);
                if ($rds_record_document->record->branches_id !== $user->branches_id) {
                    log_bank_action("Security Alert: User {$user->username} tried to process document {$rds_record_document->id} from a different branch.");

                    return send422Response('This document is not in your branch.');
                }

                if ($user->type === 'RECORDS_CUST') {
                    $rds_record_document->current_status = 'PROCESSING';
                } elseif ($user->type === 'BRANCH_HEAD') {
                    $rds_record_document->current_status = 'FOR_RECEIVING';
                } elseif ($user->type === 'EMPLOYEE') {
                    $rds_record_document->current_status = 'BORROWED';
                } else {
                    return send401Response();
                }
                $rds_record_document->save();
                $rds_record_document_history = RDSRecordDocumentHistory::find($rds['id']);

                $new_rds_record_document_history = new RDSRecordDocumentHistory;
                $new_rds_record_document_history->record_documents_id = $rds_history->record_documents_id;

                if ($user->type === 'RECORDS_CUST') {
                    $new_rds_record_document_history->action = 'PROCESSING';
                    $new_rds_record_document_history->remarks = 'Document borrow request has been processed.';
                    $rds_record_document_history->status = 'PROCESSING';
                } elseif ($user->type === 'BRANCH_HEAD') {
                    $new_rds_record_document_history->action = 'BORROW_APPROVED';
                    $new_rds_record_document_history->remarks = 'Document borrow request has been approved.';
                    $rds_record_document_history->status = 'RECEIVING';
                } elseif ($user->type === 'EMPLOYEE') {
                    $new_rds_record_document_history->action = 'BORROWED';
                    $new_rds_record_document_history->remarks = 'Borrowed document has been received.';
                    $rds_record_document_history->status = 'BORROWED';
                }
                $new_rds_record_document_history->related_history_id = $rds['id'];
                $new_rds_record_document_history->users_id = $user->id;
                $new_rds_record_document_history->save();
                $rds_record_document_history->save();
            }

            // SUCCESS LOG: Documents the progression of the borrow request
            log_bank_action(
                'LIFECYCLE UPDATE: '.count($request->all())." document(s) transitioned to status: {$rds_record_document->current_status}",
                null,
                ['processed_by' => $user->username, 'role' => $user->type]
            );

            DB::commit();

            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            log_bank_action('System error during request processing', null, ['error' => $e->getMessage()]);

            return send400Response();
        }
    }

    public function initiate_return(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->type !== 'EMPLOYEE') {
            return send401Response();
        }
        try {
            $rds_record_document_history = RDSRecordDocumentHistory::where('id', $id)
                ->with('children')
                ->where('users_id', $user->id)
                ->where('status', 'BORROWED')
                ->whereHas('children', function ($query) {
                    $query->where('action', 'BORROWED');
                })
                ->get();
            if ($rds_record_document_history->count() === 0) {
                return send422Response('Invalid borrow.');
            }

            $last_child = $rds_record_document_history[0]->children[$rds_record_document_history[0]->children->count() - 1];
            $dateToCheck = Carbon::parse($last_child->created_at);

            if ($dateToCheck->lt(Carbon::now()->subDays(14)) && blank($request->remarks)) {
                log_bank_action("Return Blocked: Missing justification for overdue document return (ID: {$id}).");

                return send422Response('Please enter your justification.');
            }

            DB::beginTransaction();
            $rds_history = RDSRecordDocumentHistory::find($id);
            $rds_record_document = RDSRecordDocument::find($rds_history->record_documents_id);
            if ($rds_record_document->record->branches_id !== $user->branches_id) {
                log_bank_action('Security Alert: User attempted to initiate return for document not in their branch.');

                return send422Response('This document is not in your branch.');
            }

            $rds_history->status = 'RETURNING';
            $rds_history->save();

            $new_rds_record_document_history = new RDSRecordDocumentHistory;
            $new_rds_record_document_history->record_documents_id = $rds_history->record_documents_id;
            $new_rds_record_document_history->action = 'INIT_RETURN';
            $new_rds_record_document_history->remarks = 'Returning the borrowed document.';
            $new_rds_record_document_history->related_history_id = $id;
            $new_rds_record_document_history->users_id = $user->id;
            $new_rds_record_document_history->save();

            // LOG: Documentation of intent to return a borrowed asset
            log_bank_action(
                "RETURN INITIATED for Document ID: {$rds_record_document->id}. Previous Status: BORROWED.",
                $rds_record_document,
                ['justification' => $request->remarks ?? 'N/A', 'days_held' => $dateToCheck->diffInDays(Carbon::now())]
            );

            DB::commit();

            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            log_bank_action("System error during return initiation for ID: {$id}", null, ['error' => $e->getMessage()]);

            return send400Response();
        }
    }

    public function receive_rc(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->type !== 'RECORDS_CUST') {
            log_bank_action("Unauthorized receive attempt by User: {$user->username}. Only Records Custodians can receive documents.");

            return send401Response();
        }
        try {
            $rds_record_document_history = RDSRecordDocumentHistory::where('id', $id)
                ->with('children')
                ->where('status', 'RETURNING')
                ->whereHas('children', function ($query) {
                    $query->where('action', 'INIT_RETURN');
                })
                ->get();

            if ($rds_record_document_history->count() === 0) {
                log_bank_action("Receive Failed: Attempted to receive an invalid or non-returning borrow (ID: {$id}).");

                return send422Response('Invalid borrow.');
            }

            $dateToCheck = Carbon::parse($rds_record_document_history[0]->children[$rds_record_document_history[0]->children->count() - 1]->created_at);

            DB::beginTransaction();
            $rds_history = RDSRecordDocumentHistory::find($id);
            $rds_record_document = RDSRecordDocument::find($rds_history->record_documents_id);

            if ($rds_record_document->record->branches_id !== $user->branches_id) {
                log_bank_action("Security Alert: User {$user->username} tried to receive document ID {$rds_record_document->id} belonging to another branch.");

                return send422Response('This document is not in your branch.');
            }

            $rds_history->status = 'RETURNED';
            $rds_history->save();

            $new_rds_record_document_history = new RDSRecordDocumentHistory;
            $new_rds_record_document_history->record_documents_id = $rds_history->record_documents_id;
            $new_rds_record_document_history->action = 'RETURNED';
            $new_rds_record_document_history->remarks = 'Borrowed document has been returned.';
            $new_rds_record_document_history->related_history_id = $id;
            $new_rds_record_document_history->users_id = $user->id;
            $new_rds_record_document_history->save();

            $rds_record_doc = RDSRecordDocument::find($rds_history->record_documents_id);
            $rds_record_doc->current_status = 'AVAILABLE';
            $rds_record_doc->save();

            // SUCCESS LOG: Confirms the asset is back in secured storage
            log_bank_action(
                "CUSTODY RESTORED: Document ID {$rds_record_doc->id} received by RC. Status updated to AVAILABLE.",
                $rds_record_doc,
                [
                    'received_by' => $user->username,
                    'borrow_history_id' => $id,
                    'turnaround_time' => $dateToCheck->diffForHumans(),
                ]
            );

            DB::commit();

            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            log_bank_action("System error during RC receive for ID: {$id}", null, ['error' => $e->getMessage()]);

            return send400Response();
        }
    }

    public function get_borrowed_items_by_user()
    {
        try {
            $rds_record_document_history = RDSRecordDocumentHistory::where('related_history_id', 0)->with('children')->get();

            return $rds_record_document_history;
        } catch (\Exception $e) {
            return send400Response();
        }
    }

    public function decline_borrow(Request $request)
    {
        $user = Auth::user();
        if (! in_array($user->type, ['RECORDS_CUST', 'BRANCH_HEAD'])) {
            log_bank_action("Unauthorized decline attempt for borrow request by User: {$user->username}");

            return send401Response();
        }

        $all_data = $request->all();
        $document_ids = collect($all_data)->pluck('document.id');
        $has_duplicates = $document_ids->duplicates()->isNotEmpty();
        if ($has_duplicates) {
            return send422Response('Please select only one of the borrow requests with the same document/s.');
        }

        $rds_record_document = RDSRecordDocument::whereIn('id', $document_ids)
            ->where('current_status', 'PROCESSING')
            ->count();
        if ($rds_record_document > 0 && $user->type === 'RECORDS_CUST') {
            log_bank_action('Decline Failed: Attempted to decline documents that are currently in PROCESSING state.');

            return send422Response('Your selected documents is currently processing and cannot be processed.');
        }
        try {
            DB::beginTransaction();

            foreach ($request->all() as $rds) {
                $rds_history = RDSRecordDocumentHistory::find($rds['id']);
                $rds_record_document = RDSRecordDocument::find($rds_history->record_documents_id);

                if ($rds_record_document->record->branches_id !== $user->branches_id) {
                    log_bank_action("Security Alert: User {$user->username} attempted to decline a borrow request for a document in another branch.");

                    return send422Response('This document is not in your branch.');
                }

                $rds_record_document->current_status = 'AVAILABLE';
                $rds_record_document->save();

                $rds_record_document_history = RDSRecordDocumentHistory::find($rds['id']);

                $new_rds_record_document_history = new RDSRecordDocumentHistory;
                $new_rds_record_document_history->record_documents_id = $rds_history->record_documents_id;

                $new_rds_record_document_history->action = 'DECLINE';
                $new_rds_record_document_history->remarks = 'Document borrow request has been declined.';
                $rds_record_document_history->status = 'DECLINED';

                $new_rds_record_document_history->related_history_id = $rds['id'];
                $new_rds_record_document_history->users_id = $user->id;
                $new_rds_record_document_history->save();
                $rds_record_document_history->save();
            }

            // SUCCESS LOG: Documents the rejection of the access request
            log_bank_action(
                'BORROW REQUEST DECLINED: Access denied for '.count($request->all()).' document(s). Documents restored to AVAILABLE.',
                null,
                [
                    'declined_by' => $user->username,
                    'role' => $user->type,
                    'document_ids' => $document_ids,
                ]
            );

            DB::commit();

            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            log_bank_action('System error during borrow decline', null, ['error' => $e->getMessage()]);

            return send400Response();
        }
    }
}
