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
                    ->with(['rds_records.record.branch', 'receiver_user', 'issuer_user', 'submitted_by_user'])
                    ->get();
            } elseif ($user->type === "BRANCH_HEAD" || $user->type === "RECORDS_CUST") {
                $transaction = RDSTransaction::whereHas('rds_records.record', function ($query) use ($user) {
                    $query->where('branches_id', $user->branches_id);
                })
                    ->with(['rds_records.record.branch', 'receiver_user', 'issuer_user', 'submitted_by_user'])
                    ->orderBy('created_at', 'DESC')
                    ->get();
            } else {
                $transaction = RDSTransaction::with(['rds_records.record.branch', 'receiver_user', 'issuer_user', 'submitted_by_user'])
                    ->where('status', '<>', 'PENDING')
                    ->orderBy('created_at', 'DESC')
                    ->get();
            }
            return send200Response($transaction);
        } catch (\Exception $e) {
            return send400Response();
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

        try {
            DB::beginTransaction();

            if ($request->transaction['type'] === 'TRANSFER') {
                if (Auth::user()->type !== "RECORDS_CUST") {
                    return send401Response();
                }

                $new_transaction = new RDSTransaction();
                $new_transaction->status = "PENDING";
                $new_transaction->type = "TRANSFER";
                $new_transaction->transaction_date = \Carbon\Carbon::now();
                $new_transaction->issuer = Auth::user()->id;
                $new_transaction->submitted_by = Auth::user()->id;
                $new_transaction->remarks = $request->transaction['remarks'];
                $new_transaction->receiver = User::whereHas('branch', function ($query) {
                    $query->where('clusters_id', Auth::user()->branch->clusters_id);
                })
                    ->where('type', 'WAREHOUSE_CUST')
                    ->first()->id;
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

                    $invalid_actions = ['BORROW', 'TRANSFER'];
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
                $new_transaction_history->action = "SUBMIT";
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

                    $invalid_actions = ['WITHDRAW', 'RETURN'];
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
                $new_transaction_history->action = "SUBMIT";
                $new_transaction_history->action_date = \Carbon\Carbon::now();
                $new_transaction_history->save();
            } elseif ($request->transaction['type'] === "BORROW") {
                if (Auth::user()->type !== "EMPLOYEE") {
                    return send401Response();
                }

                $new_transaction = new RDSTransaction();
                $new_transaction->status = "PENDING";
                $new_transaction->type = "BORROW";
                $new_transaction->transaction_date = \Carbon\Carbon::now();
                $new_transaction->issuer = Auth::user()->id;
                $new_transaction->submitted_by = Auth::user()->id;
                $new_transaction->remarks = $request->transaction['remarks'];
                $new_transaction->receiver = User::where('branches_id', Auth::user()->branches_id)
                    ->where('type', 'RECORDS_CUST')
                    ->first()->id;
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

                    $invalid_actions = ['TRANSFER', 'BORROW'];
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
                $new_transaction_history->action = "SUBMIT";
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

    public function process_transaction(Request $request)
    {
        $user = Auth::user();
        try {
            DB::beginTransaction();
            $transaction = RDSTransaction::find($request->id);
            $new_transaction_history = new RDSTransactionHistory();
            $new_transaction_history->r_d_s_transactions_id = $transaction->id;
            if ($user->type === "WAREHOUSE_CUST" || ($user->type === "BRANCH_HEAD" && $transaction->type === "BORROW")) {
                $transaction->status = "FOR RECEIVING";
                $new_transaction_history->action = "FOR RECEIVING";
            } else {
                $transaction->status = "PROCESSING";
                $new_transaction_history->action = "PROCESSING";
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
            $new_transaction_history->action = "APPROVE";
            $new_transaction_history->action_date = \Carbon\Carbon::Now();
            $new_transaction_history->save();

            foreach ($transaction->rds_records as $rds) {
                $new_rds_record_history = new RDSRecordHistory();
                $new_rds_record_history->r_d_s_records_id = $rds->record->id;
                $new_rds_record_history->users_id = $user->id;
                $new_rds_record_history->location = $user->branch->name;
                if ($user->type === 'WAREHOUSE_CUST') {
                    $new_rds_record_history->action = "TRANSFER";
                } elseif ($user->type === "RECORDS_CUST") {
                    $new_rds_record_history->action = "WITHDRAW";
                } elseif ($user->type === "EMPLOYEE" && $transaction->type === "BORROW") {
                    $new_rds_record_history->action = "BORROW";
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
}
