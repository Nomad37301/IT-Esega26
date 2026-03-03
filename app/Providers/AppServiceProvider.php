<?php

namespace App\Providers;

use App\Http\Resources\UserSharedResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Inertia::share([
        //     'user' => fn() => Auth::check() ? new UserSharedResource(Auth::user()) : null,
        // ]);
        
        // Explicitly register API routes
        $this->mapApiRoutes();
    }
    
    /**
     * Define the "api" routes for the application.
     */
    protected function mapApiRoutes(): void
    {
        Route::prefix('api')
            ->middleware('api')
            ->group(base_path('routes/api.php'));
    }
}
