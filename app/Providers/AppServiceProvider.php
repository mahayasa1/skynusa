<?php

namespace App\Providers;

use App\Service\DashboardService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
     public function register(): void
    {
        // Register DashboardService
        $this->app->singleton(DashboardService::class, function ($app) {
            return new DashboardService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
