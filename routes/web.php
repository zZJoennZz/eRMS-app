<?php

use App\Http\Controllers\api\MiscController;
use App\Http\Controllers\api\PassportAuthController;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('print/{id?}', [MiscController::class, 'get_document_record']);
// Route::get('/rec-cust', function () {
//     User::create([
//         'branches_id' => 1,
//         'type' => 'RECORDS_CUST',
//         'username' => "rec_cust",
//         'email' => "test4@gmail.com",
//         'password' => bcrypt("test4"),
//     ]);

//     UserProfile::create([
//         'users_id' => 5,
//         'first_name' => 'Record',
//         'middle_name' => '',
//         'last_name' => 'Custodian',
//         'others' => '',
//         'positions_id' => 2,
//     ]);
// });

Route::get('{path}', function () {
    return view('app');
})->where('path', '(.*)');
