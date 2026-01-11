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
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display admin dashboard with role-based data
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

        // Statistics based on role
        if ($role === 'admin') {
            $data['stats'] = [
                'total_users' => User::count(),
                'total_services' => Services::count(),
                'total_portfolio' => Portfolio::count(),
                'total_companies' => Company::count(),
                'total_pesanan' => Pesanan::count(),
                'total_pesan' => Pesan::count(),
                'total_berita' => Berita::count(),
                'pending_pesanan' => Pesanan::where('status', 'pending')->count(),
            ];

            // Recent activities
            $data['recent_pesanan'] = Pesanan::with('service:id,title')
                ->latest()
                ->take(5)
                ->get();

            $data['recent_pesan'] = Pesan::latest()
                ->take(5)
                ->get();

            // Charts data - Pesanan by month
            $data['pesanan_by_month'] = Pesanan::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

            // Pesanan by status
            $data['pesanan_by_status'] = Pesanan::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get();

        } elseif ($role === 'manager') {
            $data['stats'] = [
                'total_pesanan' => Pesanan::count(),
                'total_portfolio' => Portfolio::count(),
                'pending_pesanan' => Pesanan::where('status', 'pending')->count(),
                'completed_pesanan' => Pesanan::where('status', 'completed')->count(),
            ];

            $data['recent_pesanan'] = Pesanan::with('service:id,title')
                ->latest()
                ->take(5)
                ->get();

            $data['pesanan_by_status'] = Pesanan::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get();

        } elseif ($role === 'head') {
            $data['stats'] = [
                'total_services' => Services::count(),
                'total_portfolio' => Portfolio::count(),
                'total_companies' => Company::count(),
                'active_services' => Services::where('status', 'active')->count(),
            ];

            $data['recent_services'] = Services::latest()->take(5)->get();
            $data['recent_portfolio'] = Portfolio::latest()->take(5)->get();

        } elseif ($role === 'staff') {
            $data['stats'] = [
                'total_pesanan' => Pesanan::count(),
                'total_pesan' => Pesan::count(),
                'total_berita' => Berita::where('is_published', true)->count(),
                'pending_pesanan' => Pesanan::where('status', 'pending')->count(),
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
}