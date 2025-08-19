<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForcePasswordReset
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user->isPasswordExpired()) {

            if ($request->is('api/v1/force-reset-password')) {
                return $next($request);
            }

            return response()->json([
                'password_expired' => true,
                'message' => 'You must reset your password to continue'
            ], 200);
        }

        return $next($request);
    }
}
