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
        Route::resource('rds-records', RDSRecordController::class);
        Route::post('approve-transaction', [TransactionController::class, 'approve_transaction']);
        Route::post('process-transaction', [TransactionController::class, 'process_transaction']);
        Route::resource('transactions', TransactionController::class);
        Route::resource('users', UserController::class);
        Route::resource('positions', PositionController::class);
        Route::resource('branches', BranchController::class);
        Route::resource('clusters', ClusterController::class);

        //borrow-return
        Route::post('borrow', [BorrowTransferController::class, 'borrow']);
        Route::get('pending-borrows', [BorrowTransferController::class, 'get_pending_requests']);
        Route::post('pending-borrows', [BorrowTransferController::class, 'process_pending_request']);
        Route::get('borrowed', [BorrowTransferController::class, 'get_borrowed_items_by_user']);
        Route::put('return/{id}', [BorrowTransferController::class, 'initiate_return']);
        Route::put('receive-rc/{id}', [BorrowTransferController::class, 'receive_rc']);

        //disposal
        Route::get('disposals', [DisposalController::class, 'get_box_for_disposal']);
        Route::post('disposals', [DisposalController::class, 'submit_disposal']);
        Route::put('disposals/approve/{id?}', [DisposalController::class, 'approve_disposal']);
        Route::put('disposals/confirm/{id?}', [DisposalController::class, 'confirm_disposal']);
        Route::get('disposals/print/{id?}', [DisposalController::class, 'get_report']);

        //misc
        Route::get('signatories', [MiscController::class, 'get_signatories']);
        Route::get('records_for_transfer', [MiscController::class, 'get_records_for_transfer']);
        Route::get('rc-dashboard', [MiscController::class, 'rc_dashboard']);

        Route::get('employee-pending-transactions', [MiscController::class, 'get_employee_pending_transactions']);
        Route::get('pending-rds', [MiscController::class, 'get_pending_rds']);
        Route::get('for-disposal', [MiscController::class, 'get_document_for_disposal']);


        Route::get('print/{id?}', [MiscController::class, 'get_document_record']);
    });

    Route::middleware('guest')->group(function () {
        Route::post('login', [PassportAuthController::class, 'login']);
        Route::post('forgot-password', [PassportAuthController::class, 'forgot_password']);
    });
});
