<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Position;
use App\Models\RDSRecord;
use App\Models\Turnover;
use App\Models\TurnoverItem;
use App\Models\User;
use App\Models\UserPosition;
use App\Models\UserProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TurnoverController extends Controller
{
    public function get_past_turnovers()
    {

        $user = Auth::user();
        $turnover = Turnover::where('branches_id', $user->branches_id)
            ->where('status', '<>', 'PENDING')
            ->with(['user.profile.positions', 'items.rds_record.documents.rds', 'added_by_user.profile.positions'])
            ->get();

        return send200Response($turnover);
    }

    public function check_for_existing_turnover_request()
    {
        $user = Auth::user();
        $turnover = Turnover::where('branches_id', $user->branches_id)
            ->where('status', '=', 'PENDING')
            ->get();

        return send200Response(["hasTurnoverRequest" => $turnover->count() > 0]);
    }

    public function get_turnover()
    {
        $user = Auth::user();
        $turnover = Turnover::where('branches_id', $user->branches_id)
            ->where('status', '=', 'PENDING')
            ->get();

        return send200Response($turnover);
    }

    public function get_turnover_for_report()
    {
        $user = Auth::user();
        $turnover = Turnover::where('branches_id', $user->branches_id)
            ->where('status', '=', 'PENDING')
            ->with(['user.profile.positions', 'items.rds_record.documents.rds', 'added_by_user.profile.positions', 'items.rds_record.latest_history'])
            ->first();

        $branch = Branch::find($user->branches_id);

        $branch_head = User::where('branches_id', $user->branches_id)
            ->where('type', 'BRANCH_HEAD')
            ->with(['profile'])
            ->first();

        return send200Response(["turnover" => $turnover, 'branch' => $branch, 'branch_head' => $branch_head]);
    }


    public function create_turnover(Request $request)
    {
        try {
            DB::beginTransaction();
            $user = Auth::user();

            // Check if the user is of type RECORDS_CUST
            if ($user->type !== 'RECORDS_CUST') {
                return send422Response('Only records custodian can create turnover records.');
            }

            // Check if the selected employee is in the same branch
            $in_branch = User::where('id', $request->selectedEmployee)
                ->where('branches_id', $user->branches_id)
                ->where('type', '<>', 'RECORDS_CUST')
                ->get()
                ->count() > 0;
            if (!$in_branch) {
                return send422Response('Selected employee must be in the same branch and not a records custodian already.');
            }

            $check_for_pending_boxes = RDSRecord::where('status', 'PENDING')
                ->where('branches_id', $user->branches_id)
                // ->whereHas('latest_history', function ($query) {
                //     $query->where('location', '<>', 'WAREHOUSE');
                // })
                ->get();
            if ($check_for_pending_boxes->count() > 0) {
                return send422Response('Please process the pending boxes first!');
            }

            // Create a new turnover record

            $turnover = new Turnover();
            $turnover->selected_employee = $request->selectedEmployee;
            $turnover->designation_status = $request->designationStatus;
            $turnover->assumption_date = $request->assumptionDate;
            $turnover->from_date = $request->fromDate;
            $turnover->to_date = $request->toDate;
            $turnover->current_job_holder_id = $request->currentJobHolderId;
            $turnover->incoming_job_holder_id = $request->incomingJobHolderId;
            $turnover->status = 'PENDING';
            $turnover->added_by = $user->id;
            $turnover->branches_id = $user->branches_id;
            $turnover->save();

            $rds_record = RDSRecord::where('branches_id', $user->branches_id)
                ->where('status', '<>', 'DISPOSED')
                // ->whereHas('latest_history', function ($query) {
                //     $query->where('location', '<>', 'WAREHOUSE');
                // })
                ->where('status', '<>', 'PENDING')
                ->get();

            foreach ($rds_record as $record) {
                $new_turnover_item = new TurnoverItem();
                $new_turnover_item->turnovers_id = $turnover->id;
                $new_turnover_item->r_d_s_records_id = $record->id;
                $new_turnover_item->others = "{}";
                $new_turnover_item->save();
            }

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response($e->getMessage());
        }
    }

    public function get_turnover_request()
    {
        $user = Auth::user();
        if ($user->type !== "BRANCH_HEAD" && $user->type !== "RECORDS_CUST") {
            return send422Response('Only branch head can view turnover requests.');
        }
        $turnover = Turnover::where('branches_id', $user->branches_id)
            ->where('status', '=', 'PENDING')
            ->with(['user', 'items' => function ($query) {
                $query->whereHas('rds_record', function ($query) {
                    $query->where('status', '<>', 'DISPOSED')
                        ->where('status', '<>', 'PENDING')
                        ->whereHas('latest_history', function ($query) {
                            $query->where('location', '<>', 'WAREHOUSE');
                        });
                });
            }, 'items.rds_record' => function ($query) {
                $query->where('status', '<>', 'DISPOSED')
                    ->where('status', '<>', 'PENDING')
                    ->whereHas('latest_history', function ($query) {
                        $query->where('location', '<>', 'WAREHOUSE');
                    });
            }, 'items.rds_record.documents', 'items.rds_record.latest_history'])
            ->first();

        return send200Response($turnover);
    }

    public function approve_turnover($id)
    {
        try {
            $user = Auth::user();
            if ($user->type !== "BRANCH_HEAD") {
                return send422Response('Only branch head can approve turnover requests.');
            }

            DB::beginTransaction();
            $turnover = Turnover::where('id', $id)
                ->where('branches_id', $user->branches_id)
                ->where('status', '=', 'PENDING')
                ->with(['user'])
                ->first();

            $get_new_rc = User::find($turnover->selected_employee);


            $new_user = new User();
            $new_user->username = $get_new_rc->username . 'rc' . Carbon::now()->format('ymd');
            $new_user->email = $new_user->username . '@rds.com';
            $new_user->password = bcrypt($user->branch->code . $get_new_rc->profile->last_name);
            $new_user->type = "RECORDS_CUST";
            $new_user->branches_id = $user->branches_id;
            $new_user->save();

            $rc_position = Position::where('type', 'RECORDS_CUST')->first();

            $new_user_profile = new UserProfile();
            $new_user_profile->users_id = $new_user->id;
            $new_user_profile->first_name = $get_new_rc->profile->first_name;
            $new_user_profile->middle_name = $get_new_rc->profile->middle_name ?? "";
            $new_user_profile->last_name = $get_new_rc->profile->last_name;
            $new_user_profile->positions_id = $rc_position->id;
            $new_user_profile->save();

            $new_user_position = new UserPosition();
            $new_user_position->user_profiles_id = $new_user_profile->id;
            $new_user_position->positions_id = $rc_position->id;
            $new_user_position->type = "MAIN";
            $new_user_position->save();

            $inactive_position = Position::where('name', 'Inactive')->first()->id;
            $current_rc = User::find($turnover->added_by);
            $current_rc->is_inactive = 1;

            $current_rc_profile = UserProfile::where('users_id', $current_rc->id)->first();
            $current_rc_profile->positions_id = $inactive_position;

            $current_rc_profile->save();

            UserPosition::where('user_profiles_id', $current_rc->profile->id)->delete();

            $new_position = new UserPosition();
            $new_position->user_profiles_id = $current_rc->profile->id;
            $new_position->positions_id = $inactive_position;
            $new_position->type = "MAIN";
            $new_position->save();

            $current_rc->save();

            $turnover->status = 'APPROVED';
            $turnover->save();
            DB::commit();

            return send200Response(
                ['username' => $new_user->username,]
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response($e->getMessage());
        }
    }

    public function decline_turnover($id)
    {
        try {
            $user = Auth::user();
            if ($user->type !== "BRANCH_HEAD") {
                return send422Response('Only branch head can approve turnover requests.');
            }
            DB::beginTransaction();


            $turnover = Turnover::where('id', $id)
                ->where('status', '=', 'PENDING')
                ->first();
            $turnover->status = 'DECLINED';
            $turnover->save();

            DB::commit();
            return send200Response();
        } catch (\Exception $e) {
            DB::rollBack();
            return send400Response($e->getMessage());
        }
    }
    // public function get_turnover() {
    //     $user = Auth::user();
    //     if ($user->type !== "BRANCH_HEAD") {
    //         return send422Response('Only branch head can view turnover requests.');
    //     }
    //     $turnover = Turnover::where('branches_id', $user->branches_id)
    //         ->where('status', '=', 'PENDING')
    //         ->with(['user'])
    //         ->get();

    //     return send200Response($turnover);
    // }
}
