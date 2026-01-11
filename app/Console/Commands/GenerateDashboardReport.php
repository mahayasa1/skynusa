<?php

namespace App\Console\Commands;

use App\Models\Pesanan;
use App\Models\VisitorLog;
use App\Models\Berita;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Symfony\Component\Console\Command\Command as ConsoleCommand;

class GenerateDashboardReport extends Command
{
    protected $signature = 'dashboard:report {--period=today}';
    protected $description = 'Generate dashboard statistics report';

    public function handle()
    {
        $period = $this->option('period');
        
        $this->info("Generating dashboard report for: {$period}");
        $this->newLine();

        switch ($period) {
            case 'today':
                $this->todayReport();
                break;
            case 'week':
                $this->weekReport();
                break;
            case 'month':
                $this->monthReport();
                break;
            default:
                $this->error('Invalid period. Use: today, week, or month');
                return ConsoleCommand::FAILURE;
        }

        return ConsoleCommand::SUCCESS;
    }

    private function todayReport()
    {
        $visitors = VisitorLog::today()->count();
        $uniqueVisitors = VisitorLog::today()->distinct('ip_address')->count();
        $pesanan = Pesanan::whereDate('created_at', Carbon::today())->count();

        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Visitors', $visitors],
                ['Unique Visitors', $uniqueVisitors],
                ['New Orders', $pesanan],
            ]
        );

        // Top cities
        $cities = VisitorLog::today()
            ->whereNotNull('city')
            ->selectRaw('city, COUNT(*) as count')
            ->groupBy('city')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get();

        if ($cities->isNotEmpty()) {
            $this->newLine();
            $this->info('Top 5 Cities Today:');
            $this->table(
                ['City', 'Visitors'],
                $cities->map(fn($c) => [$c->city, $c->count])
            );
        }
    }

    private function weekReport()
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $visitors = VisitorLog::where('created_at', '>=', $startOfWeek)->count();
        $pesanan = Pesanan::where('created_at', '>=', $startOfWeek)->count();

        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Visitors (This Week)', $visitors],
                ['New Orders (This Week)', $pesanan],
            ]
        );
    }

    private function monthReport()
    {
        $visitors = VisitorLog::thisMonth()->count();
        $pesanan = Pesanan::thisMonth()->count();
        $berita = Berita::thisMonth()->where('is_published', true)->count();

        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Visitors (This Month)', $visitors],
                ['New Orders (This Month)', $pesanan],
                ['Published News (This Month)', $berita],
            ]
        );
    }
}