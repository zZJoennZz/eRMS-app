<?php

use App\Http\Controllers\api\MiscController;
use App\Http\Controllers\api\PassportAuthController;
use App\Http\Controllers\api\RDSController;
use App\Http\Controllers\api\RDSRecordController;
use App\Http\Controllers\api\TransactionController;
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

        //misc
        Route::get('signatories', [MiscController::class, 'get_signatories']);
        Route::get('records_for_transfer', [MiscController::class, 'get_records_for_transfer']);
    });

    Route::middleware('guest')->group(function () {
        Route::post('login', [PassportAuthController::class, 'login']);
    });
});
