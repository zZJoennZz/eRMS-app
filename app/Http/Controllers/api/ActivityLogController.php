<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Models\Activity;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // STRICT GATE: Only ADMIN and DEV
        if (! in_array($user->type, ['ADMIN', 'DEV'])) {
            return send401Response();
        }

        try {
            // Spatie uses 'causer' as the relationship for the user who did the action
            $query = Activity::with(['causer.profile'])
                ->orderBy('created_at', 'desc');

            // Search Logic
            if ($request->filled('search')) {
                $searchTerm = '%'.$request->search.'%';
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('description', 'LIKE', $searchTerm)
                        ->orWhere('log_name', 'LIKE', $searchTerm)
                        ->orWhere('properties', 'LIKE', $searchTerm)
                        ->orWhereHasMorph('causer', [\App\Models\User::class], function ($u) use ($searchTerm) {
                            $u->where('username', 'LIKE', $searchTerm)
                                ->orWhereHas('profile', function ($p) use ($searchTerm) {
                                    $p->where('first_name', 'LIKE', $searchTerm)
                                        ->orWhere('last_name', 'LIKE', $searchTerm);
                                });
                        });
                });
            }

            // Date Filters
            if ($request->filled(['start_date', 'end_date'])) {
                $query->whereBetween('created_at', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay(),
                ]);
            }

            $logs = $query->paginate($request->per_page ?? 25);

            // Transform for the Frontend
            $logs->getCollection()->transform(function ($log) {
                // Spatie calls the user the "causer"
                $causer = $log->causer;

                $log->performer_name = $causer
                    ? ($causer->profile ? $causer->profile->first_name.' '.$causer->profile->last_name : $causer->username)
                    : 'System / Unauthenticated';

                // Format a readable message
                // e.g., "created", "updated", or custom log messages
                $log->display_message = ucfirst($log->description);
                $log->subject_name = $log->subject_type ? class_basename($log->subject_type) : 'System';

                return $log;
            });

            return response()->json([
                'status' => 200,
                'data' => $logs,
            ], 200);

        } catch (\Exception $e) {
            return send400Response('Activity log retrieval failed: '.$e->getMessage());
        }
    }

    public function export_csv(Request $request)
    {
        $user = Auth::user();

        // 1. Security Gate
        if (! in_array($user->type, ['ADMIN', 'DEV'])) {
            log_bank_action("Unauthorized Audit Export attempt by User: {$user->username}");

            return send401Response();
        }

        $filters = $request->only(['search', 'start_date', 'end_date']);

        // 2. Use your helper function to log the export event
        log_bank_action(
            "SYSTEM AUDIT EXPORT: User {$user->username} generated a CSV export of the activity logs.",
            null, // No specific model as the subject
            [
                'filters_applied' => $filters,
                'ip_address' => $request->ip(),
                'export_type' => 'CSV_STREAM',
            ]
        );

        // 3. Stream the Response
        return new StreamedResponse(function () use ($filters) {
            $handle = fopen('php://output', 'w');

            // CSV Headers
            fputcsv($handle, ['Timestamp', 'Performer', 'Action', 'Entity', 'Details']);

            Activity::with('causer.profile')
                ->orderBy('created_at', 'desc')
                ->when($filters['search'], function ($q, $search) {
                    $q->where('description', 'LIKE', "%$search%")
                        ->orWhere('properties', 'LIKE', "%$search%");
                })
                ->when($filters['start_date'], function ($q, $start) use ($filters) {
                    $q->whereBetween('created_at', [
                        Carbon::parse($start)->startOfDay(),
                        Carbon::parse($filters['end_date'])->endOfDay(),
                    ]);
                })
                ->chunk(200, function ($logs) use ($handle) {
                    foreach ($logs as $log) {
                        $performer = $log->causer
                            ? ($log->causer->profile
                                ? $log->causer->profile->first_name.' '.$log->causer->profile->last_name
                                : $log->causer->username)
                            : 'System / Unauthenticated';

                        fputcsv($handle, [
                            $log->created_at->format('Y-m-d H:i:s'),
                            $performer,
                            strtoupper($log->description),
                            $log->subject_type ? class_basename($log->subject_type) : 'System',
                            json_encode($log->properties),
                        ]);
                    }
                });

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="audit_trail_'.now()->format('Ymd_His').'.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ]);
    }
}
