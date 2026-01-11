<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Cache;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // Clean old visitor logs every day at 2 AM
        $schedule->command('visitors:clean --days=30')
                 ->dailyAt('02:00')
                 ->withoutOverlapping();

        // Clear dashboard cache every 5 minutes
        $schedule->call(function () {
            Cache::forget('dashboard_chart_data');
            Cache::forget('visitor_locations');
        })->everyFiveMinutes();

        // Generate daily report at 11 PM
        $schedule->command('dashboard:report --period=today')
                 ->dailyAt('23:00');
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
