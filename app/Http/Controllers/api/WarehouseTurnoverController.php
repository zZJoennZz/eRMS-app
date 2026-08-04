<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Turnover;
use App\Models\TurnoverData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WarehouseTurnoverController extends Controller
{
    public function get_past_turnovers()
    {
        $user = Auth::user();

        if ($user->type !== 'ADMIN' && $user->type !== 'WAREHOUSE_CUST' && $user->type !== 'BRANCH_HEAD') {
            return send401Response();
        }

        $turnover = Turnover::has('add_data')
            ->where('status', '<>', 'PENDING')
            ->where('branches_id', $user->branches_id)
            ->with(['user.profile.positions', 'items.rds_record.documents.rds', 'added_by_user.profile.positions'])
            ->get();

        return send200Response($turnover);
    }

    public function create_turnover(Request $request)
    {
        try {
            DB::beginTransaction();
            $user = Auth::user();

            if ($user->type !== 'ADMIN' && $user->type !== 'WAREHOUSE_CUST') {
                log_bank_action("Unauthorized Turnover creation attempt by User: {$user->username}");

                return send401Response();
            }

            // Validate and create turnover
            $turnover = new Turnover;
            $turnover->fill($request->all());
            $turnover->added_by = $user->id;
            $turnover->branches_id = $user->branches_id;
            $turnover->save();

            $turnover_add_data = new TurnoverData;
            $turnover_add_data->turnovers_id = $turnover->id;
            $turnover_add_data->data = json_encode($request->add_data);
            $turnover_add_data->save();

            // SUCCESS LOG: Essential for tracking the submission of turnover metadata
            log_bank_action(
                "SUBMITTED Turnover Request ID: {$turnover->id} for Branch ID: {$user->branches_id} with additional metadata.",
                $turnover,
                ['metadata_snapshot' => $request->add_data]
            );

            DB::commit();

            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            log_bank_action("System error while creating turnover for User: {$user->username}", null, ['error' => $e->getMessage()]);

            return send400Response($e->getMessage());
        }
    }
}
