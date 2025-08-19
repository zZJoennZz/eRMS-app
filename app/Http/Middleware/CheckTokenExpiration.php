<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckTokenExpiration
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::guard('api')->check()) {
            $user = Auth::guard('api')->user();
            $token = $user->token();

            if ($token->expires_at && $token->expires_at->isPast()) {
                $token->revoke();
                return response()->json([
                    'message' => 'Token has expired. Please log in again.',
                ], 401);
            }
        }
        return $next($request);
    }
}
