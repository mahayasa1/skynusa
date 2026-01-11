<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Services;
use App\Models\Berita;
use App\Models\Portfolio;
use App\Models\Pesanan;
use App\Models\Pesan;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Service\DashboardService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{

protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }
    /**
     * Display admin dashboard with role-based data and realtime updates
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        $data = [
            'user' => $user,
            'role' => $role,
            'permissions' => $user->permissions,
        ];

        // Get common data
        $data['chart_data'] = $this->dashboardService->getChartData();
        $data['visitor_locations'] = $this->dashboardService->getVisitorLocations();

        // Statistics based on role
        if ($role === 'admin') {
            $data['stats'] = [
                'total_users' => User::count(),
                'total_services' => Services::count(),
                'total_portfolio' => Portfolio::count(),
                'total_companies' => Company::count(),
                'total_pesanan' => Pesanan::count(),
                'total_pesan' => Pesan::count(),
                'total_berita' => Berita::where('is_published', true)->count(),
                'pending_pesanan' => Pesanan::where('status', 'pending')->count(),
                'processing_pesanan' => Pesanan::whereIn('status', ['verifikasi', 'proses', 'approval', 'running'])->count(),
                'completed_pesanan' => Pesanan::where('status', 'selesai')->count(),
                'total_feedback' => Pesan::count(),
            ];

            $data['recent_pesanan'] = Pesanan::with('service:id,title')
                ->latest()
                ->take(5)
                ->get();

            $data['recent_pesan'] = Pesan::latest()
                ->take(5)
                ->get();

        } elseif ($role === 'manager') {
            $data['stats'] = [
                'total_pesanan' => Pesanan::count(),
                'total_portfolio' => Portfolio::count(),
                'pending_pesanan' => Pesanan::where('status', 'pending')->count(),
                'processing_pesanan' => Pesanan::whereIn('status', ['verifikasi', 'proses', 'approval', 'running'])->count(),
                'completed_pesanan' => Pesanan::where('status', 'selesai')->count(),
                'total_feedback' => Pesan::count(),
            ];

            $data['recent_pesanan'] = Pesanan::with('service:id,title')
                ->latest()
                ->take(5)
                ->get();

        } elseif ($role === 'head') {
            $data['stats'] = [
                'total_services' => Services::count(),
                'total_portfolio' => Portfolio::count(),
                'total_companies' => Company::count(),
                'active_services' => Services::where('is_active', true)->count(),
                'pending_pesanan' => Pesanan::where('status', 'pending')->count(),
                'completed_pesanan' => Pesanan::where('status', 'selesai')->count(),
            ];

            $data['recent_services'] = Services::latest()->take(5)->get();
            $data['recent_portfolio'] = Portfolio::latest()->take(5)->get();

        } elseif ($role === 'staff') {
            $data['stats'] = [
                'total_pesanan' => Pesanan::count(),
                'total_pesan' => Pesan::count(),
                'total_berita' => Berita::where('is_published', true)->count(),
                'pending_pesanan' => Pesanan::where('status', 'pending')->count(),
                'processing_pesanan' => Pesanan::whereIn('status', ['verifikasi', 'proses', 'approval', 'running'])->count(),
                'completed_pesanan' => Pesanan::where('status', 'selesai')->count(),
                'total_feedback' => Pesan::count(),
            ];

            $data['recent_pesanan'] = Pesanan::with('service:id,title')
                ->latest()
                ->take(5)
                ->get();

            $data['recent_pesan'] = Pesan::latest()
                ->take(5)
                ->get();
        }

        return Inertia::render('admin/dashboard', $data);
    }

    /**
     * Get chart data for the last 12 months
     */
    private function getChartData(): array
    {
        // Cache untuk 5 menit agar tidak terlalu sering query
        return Cache::remember('dashboard_chart_data', 300, function () {
            $chartData = [];
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            for ($i = 11; $i >= 0; $i--) {
                $date = Carbon::now()->subMonths($i);
                $monthIndex = (int)$date->format('n') - 1;
                
                // Count pesanan untuk bulan ini
                $pesananCount = Pesanan::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count();
                
                // Simulasi kunjungan website (di production, gunakan Google Analytics API atau tracking sendiri)
                // Untuk sekarang, kita buat formula berdasarkan pesanan
                $kunjunganCount = $this->getMonthlyVisitors($date);
                
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
     * Get simulated monthly visitors
     * Dalam production, ganti dengan data dari Google Analytics atau sistem tracking Anda
     */
    private function getMonthlyVisitors(Carbon $date): int
    {
        // Simulasi: ambil dari cache atau database tracking
        // Untuk demo, kita gunakan formula sederhana
        $cacheKey = 'visitors_' . $date->format('Y_m');
        
        return Cache::remember($cacheKey, 3600, function () use ($date) {
            // Cek apakah ada tracking di database (jika Anda punya tabel tracking)
            // Jika tidak, return random data yang realistis
            $baseVisitors = 400;
            $variance = rand(-100, 200);
            return max($baseVisitors + $variance, 200);
        });
    }

    /**
     * Get visitor locations with counts
     * Dalam production, gunakan IP geolocation atau analytics API
     */
    private function getVisitorLocations(): array
    {
        return Cache::remember('visitor_locations', 300, function () {
            // Data kota-kota besar Indonesia dengan jumlah pengunjung
            // Dalam production, ini harus dari database tracking dengan IP geolocation
            
            $locations = [
                ['city' => 'Jakarta', 'coordinates' => [106.8456, -6.2088], 'visitors' => 0],
                ['city' => 'Surabaya', 'coordinates' => [112.7521, -7.2575], 'visitors' => 0],
                ['city' => 'Bandung', 'coordinates' => [107.6191, -6.9175], 'visitors' => 0],
                ['city' => 'Medan', 'coordinates' => [98.6722, 3.5952], 'visitors' => 0],
                ['city' => 'Denpasar', 'coordinates' => [115.2126, -8.6705], 'visitors' => 0],
                ['city' => 'Makassar', 'coordinates' => [119.4327, -5.1477], 'visitors' => 0],
                ['city' => 'Semarang', 'coordinates' => [110.4203, -6.9932], 'visitors' => 0],
                ['city' => 'Yogyakarta', 'coordinates' => [110.3695, -7.7956], 'visitors' => 0],
            ];

            // Simulasi data pengunjung
            // Dalam production, query dari tabel visitor_tracking atau gunakan Analytics API
            foreach ($locations as &$location) {
                $location['visitors'] = $this->getCityVisitors($location['city']);
            }

            return $locations;
        });
    }

    /**
     * Get visitors count for a specific city
     * Ganti dengan query ke tabel tracking Anda
     */
    private function getCityVisitors(string $city): int
    {
        // Simulasi: dalam production, query dari database
        // SELECT COUNT(*) FROM visitor_logs WHERE city = ? AND DATE(created_at) = CURDATE()
        
        $baseVisitors = [
            'Jakarta' => 1000,
            'Surabaya' => 700,
            'Bandung' => 500,
            'Medan' => 400,
            'Denpasar' => 800,
            'Makassar' => 300,
            'Semarang' => 250,
            'Yogyakarta' => 450,
        ];

        $base = $baseVisitors[$city] ?? 200;
        $variance = rand(-100, 150);
        
        return max($base + $variance, 50);
    }
}