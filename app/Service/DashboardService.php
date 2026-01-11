<?php

namespace App\Service;

use App\Models\Pesanan;
use App\Models\VisitorLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Get chart data for the last 12 months
     */
    public function getChartData(): array
    {
        return Cache::remember('dashboard_chart_data', 300, function () {
            $chartData = [];
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            for ($i = 11; $i >= 0; $i--) {
                $date = Carbon::now()->subMonths($i);
                $monthIndex = (int)$date->format('n') - 1;
                
                // Count pesanan
                $pesananCount = Pesanan::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count();
                
                // Count kunjungan website
                $kunjunganCount = VisitorLog::getMonthlyVisitors($date);
                
                // Jika tidak ada data visitor, gunakan estimasi
                if ($kunjunganCount === 0) {
                    $kunjunganCount = $this->estimateVisitors($pesananCount);
                }
                
                $chartData[] = [
                    'month' => $months[$monthIndex],
                    'pesanan' => $pesananCount,
                    'kunjungan' => $kunjunganCount,
                ];
            }
            
            return $chartData;
        });
    }

    /**
     * Get visitor locations
     */
    public function getVisitorLocations(): array
    {
        return Cache::remember('visitor_locations', 300, function () {
            $visitors = VisitorLog::getVisitorsByCity(10);

            $locations = [];
            foreach ($visitors as $visitor) {
                $locations[] = [
                    'city' => $visitor->city,
                    'coordinates' => [(float)$visitor->lon, (float)$visitor->lat],
                    'visitors' => $visitor->count,
                ];
            }

            // Jika tidak ada data, return default cities
            if (empty($locations)) {
                $locations = $this->getDefaultLocations();
            }

            return $locations;
        });
    }

    /**
     * Get default visitor locations (fallback)
     */
    private function getDefaultLocations(): array
    {
        return [
            ['city' => 'Jakarta', 'coordinates' => [106.8456, -6.2088], 'visitors' => rand(100, 500)],
            ['city' => 'Surabaya', 'coordinates' => [112.7521, -7.2575], 'visitors' => rand(50, 300)],
            ['city' => 'Bandung', 'coordinates' => [107.6191, -6.9175], 'visitors' => rand(50, 250)],
            ['city' => 'Medan', 'coordinates' => [98.6722, 3.5952], 'visitors' => rand(30, 200)],
            ['city' => 'Denpasar', 'coordinates' => [115.2126, -8.6705], 'visitors' => rand(50, 400)],
            ['city' => 'Makassar', 'coordinates' => [119.4327, -5.1477], 'visitors' => rand(30, 150)],
            ['city' => 'Semarang', 'coordinates' => [110.4203, -6.9932], 'visitors' => rand(20, 120)],
            ['city' => 'Yogyakarta', 'coordinates' => [110.3695, -7.7956], 'visitors' => rand(40, 200)],
        ];
    }

    /**
     * Estimate visitors based on orders (rough calculation)
     */
    private function estimateVisitors(int $pesananCount): int
    {
        // Asumsi: 1 pesanan = 20-50 kunjungan rata-rata
        if ($pesananCount === 0) {
            return rand(200, 500);
        }
        
        $multiplier = rand(20, 50);
        return $pesananCount * $multiplier;
    }

    /**
     * Get visitor statistics
     */
    public function getVisitorStats(): array
    {
        return [
            'today' => VisitorLog::today()->count(),
            'this_month' => VisitorLog::thisMonth()->count(),
            'this_year' => VisitorLog::thisYear()->count(),
            'unique_today' => VisitorLog::today()->distinct('ip_address')->count(),
            'devices' => VisitorLog::getDeviceStats(),
        ];
    }

    /**
     * Clear dashboard cache
     */
    public function clearCache(): void
    {
        Cache::forget('dashboard_chart_data');
        Cache::forget('visitor_locations');
    }
}
