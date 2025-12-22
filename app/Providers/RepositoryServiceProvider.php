<?php

namespace App\Providers;

use App\Repository\ServicesRepository;
use App\Services\ServicesService;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class RepositoryServiceProvider extends BaseServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register Repository
        $this->app->singleton(ServicesRepository::class, function ($app) {
            return new ServicesRepository();
        });

        // Register Services
        $this->app->singleton(ServicesService::class, function ($app) {
            return new ServicesService(
                $app->make(ServicesRepository::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}