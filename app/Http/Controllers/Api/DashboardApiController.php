<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardApiController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Get chart data
     */
    public function getChartData(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->dashboardService->getChartData(),
        ]);
    }

    /**
     * Get visitor locations
     */
    public function getVisitorLocations(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->dashboardService->getVisitorLocations(),
        ]);
    }

    /**
     * Get visitor statistics
     */
    public function getVisitorStats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->dashboardService->getVisitorStats(),
        ]);
    }

    /**
     * Clear dashboard cache
     */
    public function clearCache(): JsonResponse
    {
        $this->dashboardService->clearCache();

        return response()->json([
            'success' => true,
            'message' => 'Dashboard cache cleared successfully',
        ]);
    }
}