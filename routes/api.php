<?php

use App\Http\Controllers\api\BorrowTransferController;
use App\Http\Controllers\api\BranchController;
use App\Http\Controllers\api\ClusterController;
use App\Http\Controllers\api\DisposalController;
use App\Http\Controllers\api\MiscController;
use App\Http\Controllers\api\PassportAuthController;
use App\Http\Controllers\api\PositionController;
use App\Http\Controllers\api\RDSController;
use App\Http\Controllers\api\RDSRecordController;
use App\Http\Controllers\api\TransactionController;
use App\Http\Controllers\api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('v1')->group(function () {
    Route::middleware('auth:api')->group(function () {
        Route::post('register', [PassportAuthController::class, 'register']);
        Route::post('logout', [PassportAuthController::class, 'logout']);
        Route::post('check_token', [PassportAuthController::class, 'is_valid']);

        Route::resource('rds', RDSController::class);
        Route::get('rds-records/approved-rds-records', [RDSRecordController::class, 'approved_rds_records']);
        Route::post('approve-rds', [RDSRecordController::class, 'approve_rds_record']);
        Route::post('decline-rds', [RDSRecordController::class, 'decline_record']);
        Route::resource('rds-records', RDSRecordController::class);
        Route::post('approve-transaction', [TransactionController::class, 'approve_transaction']);
        Route::post('process-transaction', [TransactionController::class, 'process_transaction']);
        Route::post('decline-transaction', [TransactionController::class, 'decline_transaction']);
        Route::resource('transactions', TransactionController::class);
        Route::resource('users', UserController::class);
        Route::post('reset-user-pw/{id?}', [UserController::class, 'reset_pw']);
        Route::post('change-my-password', [UserController::class, 'change_own_password']);
        Route::resource('positions', PositionController::class);
        Route::resource('branches', BranchController::class);
        Route::resource('clusters', ClusterController::class);
        Route::get('branch-detail', [BranchController::class, 'get_branch_profile']);
        Route::put('save-branch-details', [BranchController::class, 'save_branch_details']);

        //borrow-return
        Route::post('borrow', [BorrowTransferController::class, 'borrow']);
        Route::get('pending-borrows', [BorrowTransferController::class, 'get_pending_requests']);
        Route::post('pending-borrows', [BorrowTransferController::class, 'process_pending_request']);
        Route::get('borrowed', [BorrowTransferController::class, 'get_borrowed_items_by_user']);
        Route::put('return/{id}', [BorrowTransferController::class, 'initiate_return']);
        Route::put('receive-rc/{id}', [BorrowTransferController::class, 'receive_rc']);
        Route::post('decline-borrows', [BorrowTransferController::class, 'decline_borrow']);

        //disposal
        Route::get('disposals', [DisposalController::class, 'get_box_for_disposal']);
        Route::post('disposals', [DisposalController::class, 'submit_disposal']);
        Route::put('disposals/approve/{id?}', [DisposalController::class, 'approve_disposal']);
        Route::put('disposals/confirm/{id?}', [DisposalController::class, 'confirm_disposal']);
        Route::get('disposals/print/{id?}', [DisposalController::class, 'get_report']);
        Route::put('disposals/decline/{id?}', [DisposalController::class, 'decline_disposal']);

        //misc
        Route::get('signatories', [MiscController::class, 'get_signatories']);
        Route::get('records_for_transfer', [MiscController::class, 'get_records_for_transfer']);
        Route::get('rc-dashboard', [MiscController::class, 'rc_dashboard']);
        Route::get('bh-dashboard', [MiscController::class, 'bh_dashboard']);
        Route::get('emp-dashboard', [MiscController::class, 'emp_dashboard']);
        Route::get('wh-dashboard', [MiscController::class, 'wh_dashboard']);

        Route::get('employee-pending-transactions', [MiscController::class, 'get_employee_pending_transactions']);
        Route::get('pending-rds', [MiscController::class, 'get_pending_rds']);
        Route::get('for-disposal', [MiscController::class, 'get_document_for_disposal']);

        //warehouse only
        Route::get('warehouse-supply', [RDSRecordController::class, 'warehouse_supply']);
        Route::post('record-report', [MiscController::class, 'print_filtered_warehouse_records']);

        Route::get('print/{id?}', [MiscController::class, 'get_document_record']);
    });

    Route::middleware('guest')->group(function () {
        Route::post('login', [PassportAuthController::class, 'login']);
        Route::post('forgot-password', [PassportAuthController::class, 'forgot_password']);
    });
});
