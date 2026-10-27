<?php

use App\Service\DashboardService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Scheduled Tasks
|--------------------------------------------------------------------------
| Laravel 12 tidak lagi membaca App\Console\Kernel, jadi semua jadwal
| didefinisikan di sini. Pastikan cron berikut aktif di server:
|   * * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
*/

// Bersihkan log pengunjung lama setiap hari jam 02:00
Schedule::command('visitors:clean --days=30')
    ->dailyAt('02:00')
    ->withoutOverlapping();

// Bersihkan cache dashboard setiap 5 menit
Schedule::call(fn () => app(DashboardService::class)->clearCache())
    ->name('dashboard-cache-clear')
    ->everyFiveMinutes();

// Buat laporan harian jam 23:00
Schedule::command('dashboard:report --period=today')
    ->dailyAt('23:00')
    ->withoutOverlapping();
