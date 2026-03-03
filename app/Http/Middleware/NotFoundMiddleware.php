<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class NotFoundMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        
        if ($response->getStatusCode() === 404) {
            return Inertia::render('errors/NotFound', [
                'status' => 404,
                'message' => 'Halaman yang Anda cari tidak ditemukan.'
            ])->toResponse($request)->setStatusCode(404);
        }
        
        return $response;
    }
}
