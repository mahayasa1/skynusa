<?php

use App\Http\Controllers\Api\DashboardApiController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('dashboard')->group(function () {
    Route::get('/chart-data', [DashboardApiController::class, 'getChartData']);
    Route::get('/visitor-locations', [DashboardApiController::class, 'getVisitorLocations']);
    Route::get('/visitor-stats', [DashboardApiController::class, 'getVisitorStats']);
    Route::post('/clear-cache', [DashboardApiController::class, 'clearCache']);
});