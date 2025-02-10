<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\RDSRecord;
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
}
