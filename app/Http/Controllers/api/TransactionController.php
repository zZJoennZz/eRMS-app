<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Position;
use App\Models\RDSRecord;
use App\Models\RDSRecordHistory;
use App\Models\RDSTransaction;
use App\Models\RDSTransactionHistory;
use App\Models\RDSTransactionItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        try {
            $user = Auth::user();
            $transaction = [];
            if ($user->type === "EMPLOYEE") {
                $transaction = RDSTransaction::where('submitted_by', $user->id)
                    ->whereHas('rds_records.record', function ($query) use ($user) {
                        $query->where('branches_id', $user->branches_id);
                    })
                    ->orderBy('created_at', 'DESC')
                    ->with(['rds_records.record.branch', 'rds_records.record.latest_history', 'receiver_user', 'issuer_user', 'submitted_by_user', 'history'])
                    ->get();
            } elseif ($user->type === "BRANCH_HEAD" || $user->type === "RECORDS_CUST") {
                $transaction = RDSTransaction::whereHas('rds_records.record', function ($query) use ($user) {
                    $query->where('branches_id', $user->branches_id);
                })
                    ->with(['rds_records.record.branch', 'rds_records.record.latest_history', 'receiver_user', 'issuer_user', 'submitted_by_user', 'history'])
                    ->orderBy('created_at', 'DESC')
                    ->get();
            } elseif ($user->type === "WAREHOUSE_CUST" || $user->type === "WAREHOUSE_HEAD") {
                $transaction = RDSTransaction::whereHas('rds_records.record.branch', function ($query) use ($user) {
                    $query->where('clusters_id', $user->branch->clusters_id);
                })
                    ->where('type', '<>', 'RETURN')
                    ->where('type', '<>', 'BORROW')
                    ->with(['rds_records.record.branch', 'rds_records.record.latest_history', 'receiver_user', 'issuer_user', 'submitted_by_user', 'history'])
                    ->orderBy('created_at', 'DESC')
                    ->get();
            } else {
                return send401Response();
            }
            return send200Response($transaction);
        } catch (\Exception $e) {
            return send400Response($e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //

        try {
            DB::beginTransaction();
            $warehouse_custodian = User::whereHas('branch', function ($query) {
                $query->where('clusters_id', Auth::user()->branch->clusters_id);
            })
                ->where('is_inactive', '0')
                ->where('type', 'WAREHOUSE_CUST')
                ->first();
            if ($warehouse_custodian === null || $warehouse_custodian === "" || $warehouse_custodian === 0) {
                DB::rollBack();
                return send422Response("There's currently no active Record Center Custodian. Please reach out to your group's Record Center Head.");
            }
            if ($request->transaction['type'] === 'TRANSFER') {
                if (Auth::user()->type !== "RECORDS_CUST") {
                    return send401Response();
                }

                $hasWarehouseCust = User::whereHas('branch', function ($query) {
                    $query->where('clusters_id', Auth::user()->branch->clusters_id);
                })
                    ->where('type', 'WAREHOUSE_CUST')
                    ->get();

                if ($hasWarehouseCust->count() === 0) {
                    return send422Response("Please make sure the branch have records custodian.");
                }

                $new_transaction = new RDSTransaction();
                $new_transaction->status = "PENDING";
                $new_transaction->type = "TRANSFER";
                $new_transaction->transaction_date = \Carbon\Carbon::now();
                $new_transaction->issuer = Auth::user()->id;
                $new_transaction->submitted_by = Auth::user()->id;
                $new_transaction->remarks = $request->transaction['remarks'];
                $new_transaction->receiver = $warehouse_custodian->id;
                $new_transaction->save();

                //validate the cart
                foreach ($request->cart as $c) {
                    $get_rds_record = RDSRecord::find($c['id']);
                    if ($get_rds_record->status !== 'APPROVED') {
                        DB::rollBack();
                        return send400Response('Invalid submission! Try again.');
                    }

                    $get_transactions_by_rds_record = RDSTransaction::whereHas('rds_records', function ($query) use ($get_rds_record) {
                        $query->where('r_d_s_records_id', '=', $get_rds_record->id);
                    })
                        ->whereIn('status', ['FOR RECEIVING', 'PROCESSING', 'PENDING'])
                        ->count();

                    if ($get_transactions_by_rds_record > 0) {
                        DB::rollBack();
                        return send400Response('Box number: ' . $get_rds_record->box_number . ' currently has a pending transaction!');
                    }

                    $invalid_actions = ['BORROW', 'TRANSFER', 'RELEASE'];
                    if (in_array($get_rds_record->history[$get_rds_record->history->count() - 1]->action, $invalid_actions)) {
                        DB::rollBack();
                        return send400Response();
                    }

                    $new_transaction_item = new RDSTransactionItem();
                    $new_transaction_item->r_d_s_transactions_id = $new_transaction->id;
                    $new_transaction_item->r_d_s_records_id = $c['id'];
                    $new_transaction_item->save();
                }

                $new_transaction_history = new RDSTransactionHistory();
                $new_transaction_history->r_d_s_transactions_id = $new_transaction->id;
                $new_transaction_history->action = "INITIATE_TRANSFER";
                $new_transaction_history->action_date = \Carbon\Carbon::now();
                $new_transaction_history->save();
            } elseif ($request->transaction['type'] === 'WITHDRAW') {
                if (Auth::user()->type !== "RECORDS_CUST") {
                    return send401Response();
                }

                $new_transaction = new RDSTransaction();
                $new_transaction->status = "PENDING";
                $new_transaction->type = "WITHDRAW";
                $new_transaction->transaction_date = \Carbon\Carbon::now();
                $new_transaction->issuer = User::whereHas('branch', function ($query) {
                    $query->where('clusters_id', Auth::user()->branch->clusters_id);
                })
                    ->where('is_inactive', false)
                    ->where('type', 'WAREHOUSE_CUST')
                    ->first()->id;
                $new_transaction->submitted_by = Auth::user()->id;
                $new_transaction->remarks = $request->transaction['remarks'];
                $new_transaction->receiver = Auth::user()->id;
                $new_transaction->save();

                //validate the cart
                foreach ($request->cart as $c) {
                    $get_rds_record = RDSRecord::find($c['id']);
                    if ($get_rds_record->status !== 'APPROVED') {
                        DB::rollBack();
                        return send400Response('Invalid submission! Try again.');
                    }

                    $get_transactions_by_rds_record = RDSTransaction::whereIn('status', ['FOR RECEIVING', 'PROCESSING', 'PENDING'])
                        ->whereHas('rds_records', function ($query) use ($get_rds_record) {
                            $query->where('r_d_s_records_id', '=', $get_rds_record->id);
                        })
                        ->count();

                    if ($get_transactions_by_rds_record > 0) {
                        DB::rollBack();
                        return send400Response('Box number: ' . $get_rds_record->box_number . ' currently has a pending transaction!');
                    }

                    $invalid_actions = ['WITHDRAW', 'RETURN', 'RELEASE'];
                    if (in_array($get_rds_record->history[$get_rds_record->history->count() - 1]->action, $invalid_actions)) {
                        DB::rollBack();
                        return send400Response('Item is not available.');
                    }

                    $new_transaction_item = new RDSTransactionItem();
                    $new_transaction_item->r_d_s_transactions_id = $new_transaction->id;
                    $new_transaction_item->r_d_s_records_id = $c['id'];
                    $new_transaction_item->save();
                }

                $new_transaction_history = new RDSTransactionHistory();
                $new_transaction_history->r_d_s_transactions_id = $new_transaction->id;
                $new_transaction_history->action = "INITIATE_WITHDRAW";
                $new_transaction_history->action_date = \Carbon\Carbon::now();
                $new_transaction_history->save();
            } elseif ($request->transaction["type"] === "RELEASE") {
                if (Auth::user()->type !== "RECORDS_CUST") {
                    return send401Response();
                }

                $new_transaction = new RDSTransaction();
                $new_transaction->status = "PENDING";
                $new_transaction->type = "RELEASE";
                $new_transaction->transaction_date = \Carbon\Carbon::now();
                $new_transaction->receiver = Auth::user()->id;
                $new_transaction->submitted_by = Auth::user()->id;
                $new_transaction->remarks = $request->transaction['remarks'];
                $new_transaction->issuer = Auth::user()->id;
                $new_transaction->save();

                //validate the cart
                foreach ($request->cart as $c) {
                    $get_rds_record = RDSRecord::find($c['id']);
                    if ($get_rds_record->status !== 'APPROVED') {
                        DB::rollBack();
                        return send400Response('Invalid submission! Try again.');
                    }

                    $get_transactions_by_rds_record = RDSTransaction::whereIn('status', ['FOR RECEIVING', 'PROCESSING', 'PENDING'])
                        ->whereHas('rds_records', function ($query) use ($get_rds_record) {
                            $query->where('r_d_s_records_id', '=', $get_rds_record->id);
                        })
                        ->count();

                    if ($get_transactions_by_rds_record > 0) {
                        DB::rollBack();
                        return send400Response('Box number: ' . $get_rds_record->box_number . ' currently has a pending transaction!');
                    }

                    $invalid_actions = ['WITHDRAW', 'RETURN', 'RELEASE'];
                    if (in_array($get_rds_record->history[$get_rds_record->history->count() - 1]->action, $invalid_actions)) {
                        DB::rollBack();
                        return send400Response('Item is not available.');
                    }

                    $new_transaction_item = new RDSTransactionItem();
                    $new_transaction_item->r_d_s_transactions_id = $new_transaction->id;
                    $new_transaction_item->r_d_s_records_id = $c['id'];
                    $new_transaction_item->save();
                }

                $new_transaction_history = new RDSTransactionHistory();
                $new_transaction_history->r_d_s_transactions_id = $new_transaction->id;
                $new_transaction_history->action = "INIT_RELEASE";
                $new_transaction_history->action_date = \Carbon\Carbon::now();
                $new_transaction_history->save();
            } else {
                return send400Response("Invalid transaction type.");
            }
            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }

    public function initiate_borrow(Request $request)
    {
        return $request->all();
    }

    public function process_transaction(Request $request)
    {
        $user = Auth::user();
        try {
            DB::beginTransaction();
            $transaction = RDSTransaction::find($request->id);
            // if ($user->type === "EMPLOYEE" && $transaction->type === "BORROW") {
            //     if ($transaction->submitted_by === $user->id) {
            //         $new_transaction = new RDSTransaction();
            //         $new_transaction->status = "PENDING";
            //         $new_transaction->type = "RETURN";
            //         $new_transaction->transaction_date = \Carbon\Carbon::now();
            //         $new_transaction->receiver = Auth::user()->id;
            //         $new_transaction->submitted_by = Auth::user()->id;
            //         $new_transaction->remarks = "Justification: " . $request->remarks;
            //         $new_transaction->issuer = User::where('branches_id', Auth::user()->branches_id)
            //             ->where('is_inactive', false)
            //             ->where('type', 'RECORDS_CUST')
            //             ->first()->id;
            //         $new_transaction->save();

            //         if ($transaction->submitted_by !== $user->id) {
            //             return send401Response();
            //         }

            //         //validate the cart
            //         foreach ($transaction->rds_records as $c) {
            //             $get_rds_record = RDSRecord::find($c->r_d_s_records_id);
            //             if ($get_rds_record->status !== 'APPROVED') {
            //                 DB::rollBack();
            //                 return send400Response('Invalid submission! Try again.');
            //             }

            //             $get_transactions_by_rds_record = RDSTransaction::whereIn('status', ['FOR RECEIVING', 'PROCESSING', 'PENDING'])
            //                 ->whereHas('rds_records', function ($query) use ($get_rds_record) {
            //                     $query->where('r_d_s_records_id', '=', $get_rds_record->id);
            //                 })
            //                 ->count();

            //             if ($get_transactions_by_rds_record > 0) {
            //                 DB::rollBack();
            //                 return send400Response('Box number: ' . $get_rds_record->box_number . ' currently has a pending transaction!');
            //             }

            //             $invalid_actions = ['TRANSFER'];
            //             if (in_array($get_rds_record->history[$get_rds_record->history->count() - 1]->action, $invalid_actions)) {
            //                 DB::rollBack();
            //                 return send400Response('Item is not available.');
            //             }

            //             $new_transaction_item = new RDSTransactionItem();
            //             $new_transaction_item->r_d_s_transactions_id = $new_transaction->id;
            //             $new_transaction_item->r_d_s_records_id = $c->r_d_s_records_id;
            //             $new_transaction_item->save();
            //         }

            //         $new_transaction_history = new RDSTransactionHistory();
            //         $new_transaction_history->r_d_s_transactions_id = $new_transaction->id;
            //         $new_transaction_history->action = "SUBMIT";
            //         $new_transaction_history->action_date = \Carbon\Carbon::now();
            //         $new_transaction_history->save();
            //     } else {
            //         return send401Response();
            //     }

            //     DB::commit();
            //     return send200Response();
            // }

            // if ($user->type === "BRANCH_HEAD" && $transaction->type === "BORROW" && $transaction->status === "PROCESSING") {
            //     $transaction->status = "FOR RECEIVING";
            //     $new_transaction_history = new RDSTransactionHistory();
            //     $new_transaction_history->r_d_s_transactions_id = $transaction->id;
            //     $new_transaction_history->action = "APPROVE";
            //     $new_transaction_history->action_date = \Carbon\Carbon::now();
            //     $new_transaction_history->save();
            //     $transaction->save();

            //     DB::commit();
            //     return send200Response();
            // }

            if ($user->type === "WAREHOUSE_CUST" && $transaction->type === "WITHDRAW" && $transaction->status === "PROCESSING") {
                $transaction->status = "FOR WH APPROVAL";

                $new_transaction_history = new RDSTransactionHistory();
                $new_transaction_history->r_d_s_transactions_id = $transaction->id;
                $new_transaction_history->action = "WAREHOUSE_CUST_APPROVE_WITHDRAW";
                $new_transaction_history->action_date = \Carbon\Carbon::now();

                $new_transaction_history->save();
                $transaction->save();

                DB::commit();
                return send200Response();
            }

            if ($user->type === "WAREHOUSE_HEAD" && $transaction->type === "WITHDRAW" && $transaction->status === "FOR WH APPROVAL") {
                $transaction->status = "FOR RECEIVING";

                $new_transaction_history = new RDSTransactionHistory();
                $new_transaction_history->r_d_s_transactions_id = $transaction->id;
                $new_transaction_history->action = "WAREHOUSE_APPROVE_WITHDRAW";
                $new_transaction_history->action_date = \Carbon\Carbon::now();

                $new_transaction_history->save();
                $transaction->save();

                DB::commit();
                return send200Response();
            }

            $new_transaction_history = new RDSTransactionHistory();
            $new_transaction_history->r_d_s_transactions_id = $transaction->id;
            $transaction->status = "PROCESSING";
            if ($user->type === "BRANCH_HEAD" && $transaction->type === "TRANSFER") {
                $new_transaction_history->action = "BRANCH_HEAD_APPROVE_TRANSFER";
            } elseif ($user->type === "BRANCH_HEAD" && $transaction->type === "WITHDRAW") {
                $new_transaction_history->action = "BRANCH_HEAD_APPROVE_WITHDRAW";
            }
            $new_transaction_history->action_date = \Carbon\Carbon::Now();
            $transaction->save();
            $new_transaction_history->save();
            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }

    public function approve_transaction(Request $request)
    {
        $user = Auth::user();

        try {
            DB::beginTransaction();
            $transaction = RDSTransaction::find($request->id);
            $transaction->status = "APPROVED";
            $transaction->save();

            $new_transaction_history = new RDSTransactionHistory();
            $new_transaction_history->r_d_s_transactions_id = $transaction->id;
            if ($transaction->type === "RETURN" && $user->type === "RECORDS_CUST") {
                $new_transaction_history->action = "RETURN";
            } else {
                if ($transaction->type === "TRANSFER") {
                    $new_transaction_history->action = "WAREHOUSE_RECEIVE";
                } elseif ($transaction->type === "WITHDRAW") {
                    $new_transaction_history->action = "RECORD_CUST_RECEIVE";
                } elseif ($transaction->type === "RELEASE") {
                    $new_transaction_history->action = "BRANCH_HEAD_APPROVE_RELEASE";
                }
            }
            $new_transaction_history->action_date = \Carbon\Carbon::Now();
            $new_transaction_history->save();

            foreach ($transaction->rds_records as $rds) {
                $new_rds_record_history = new RDSRecordHistory();
                $new_rds_record_history->r_d_s_records_id = $rds->record->id;
                $new_rds_record_history->users_id = $user->id;
                if ($user->type === 'WAREHOUSE_CUST') {
                    $new_rds_record_history->location = "Warehouse";
                } else {
                    $new_rds_record_history->location = $user->branch->name;
                }
                if ($user->type === 'WAREHOUSE_CUST') {
                    $new_rds_record_history->action = "TRANSFER";
                } elseif ($user->type === "BRANCH_HEAD" && $transaction->type === "RELEASE") {
                    $new_rds_record_history->action = "RELEASE";
                } elseif ($user->type === "RECORDS_CUST" && $transaction->type === "RETURN") {
                    $new_rds_record_history->action = "RETURN";
                } elseif ($user->type === "RECORDS_CUST") {
                    $new_rds_record_history->action = "WITHDRAW";
                } elseif ($user->type === "EMPLOYEE" && $transaction->type === "BORROW") {
                    $new_rds_record_history->action = "BORROW";
                } elseif ($user->type === "EMPLOYEE" && $transaction->type === "RETURN") {
                    $new_rds_record_history->action = "RETURNED";
                } else {
                    DB::rollBack();
                    return send401Response();
                }
                $new_rds_record_history->save();
            }

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }

    public function decline_transaction(Request $request)
    {
        try {
            DB::beginTransaction();
            $transaction = RDSTransaction::find($request->id);
            $transaction->status = "DECLINED";
            $transaction->save();

            $new_transaction_history = new RDSTransactionHistory();
            $new_transaction_history->r_d_s_transactions_id = $transaction->id;
            $new_transaction_history->action = "DECLINE";
            $new_transaction_history->action_date = \Carbon\Carbon::Now();
            $new_transaction_history->save();

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response();
        }
    }

    public function return_release($id)
    {
        try {
            $user = Auth::user();

            DB::beginTransaction();
            $transaction = RDSTransaction::find($id);

            if ($transaction->type !== "RELEASE") {
                DB::rollBack();
                return send400Response("Invalid record!");
            }

            if ($transaction->rds_records[0]->record->latest_history->action !== "RELEASE") {
                DB::rollBack();
                return send400Response("Invalid record!");
            }

            if ($transaction->submitted_by_user->branches_id !== $user->branches_id) {
                DB::rollBack();
                return send401Response();
            }

            $transaction->type = "RELEASE_RETURNED";
            $transaction->save();

            foreach ($transaction->rds_records as $rec) {
                $new_record_history = new RDSRecordHistory();
                $new_record_history->r_d_s_records_id = $rec->record->id;
                $new_record_history->users_id = $user->id;
                $new_record_history->action = "RETURN_RELEASE";
                $new_record_history->location = $user->branch->name;
                $new_record_history->save();
            }

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response($e->getMessage());
        }
    }
}
