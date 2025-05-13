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

        if ($user->type !== "ADMIN" && $user->type !== "WAREHOUSE_CUST") {
            return send401Response();
        }

        $turnover = Turnover::has('add_data')
            ->where('status', '<>', 'PENDING')
            ->with(['user.profile.positions', 'items.rds_record.documents.rds', 'added_by_user.profile.positions'])
            ->get();

        return send200Response($turnover);
    }

    public function create_turnover(Request $request)
    {
        try {
            DB::beginTransaction();
            $user = Auth::user();

            if ($user->type !== "ADMIN" && $user->type !== "WAREHOUSE_CUST") {
                return send401Response();
            }
            // Validate and create turnover
            $turnover = new Turnover();
            $turnover->fill($request->all());
            $turnover->added_by = $user->id;
            $turnover->branches_id = $user->branches_id;
            $turnover->save();

            $turnover_add_data = new TurnoverData();
            $turnover_add_data->turnovers_id = $turnover->id;
            $turnover_add_data->data = json_encode($request->add_data);
            $turnover_add_data->save();

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response($e->getMessage());
        }
    }
}
