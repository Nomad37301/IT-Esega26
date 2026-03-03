<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        Log::info('Checking role middleware', [
            'user' => Auth::user(),
            'roles' => $roles,
            'path' => $request->path()
        ]);

        if (!Auth::check()) {
            Log::warning('User not authenticated');
            return redirect()->route('login');
        }

        $user = Auth::user();
        $userRole = $user->role;

        Log::info('User role check', [
            'user_role' => $userRole,
            'required_roles' => $roles
        ]);

        if (in_array($userRole, $roles)) {
            Log::info('Role check passed');
            return $next($request);
        }

        Log::warning('Role check failed', [
            'user_role' => $userRole,
            'required_roles' => $roles
        ]);

        return response()->json(['error' => 'Unauthorized'], 403);
    }
} 