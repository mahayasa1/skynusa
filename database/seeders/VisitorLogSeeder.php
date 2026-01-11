<?php

namespace Database\Seeders;

use App\Models\VisitorLog;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class VisitorLogSeeder extends Seeder
{
    public function run(): void
    {
        $cities = [
            ['Jakarta', 106.8456, -6.2088],
            ['Surabaya', 112.7521, -7.2575],
            ['Bandung', 107.6191, -6.9175],
            ['Medan', 98.6722, 3.5952],
            ['Denpasar', 115.2126, -8.6705],
            ['Makassar', 119.4327, -5.1477],
            ['Semarang', 110.4203, -6.9932],
            ['Yogyakarta', 110.3695, -7.7956],
        ];

        $devices = ['desktop', 'mobile', 'tablet'];
        $browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
        $platforms = ['Windows', 'Mac OS X', 'Linux', 'Android', 'iOS'];

        // Generate data untuk 7 hari terakhir
        for ($day = 0; $day < 7; $day++) {
            $date = Carbon::now()->subDays($day);
            $logsPerDay = rand(50, 200);

            for ($i = 0; $i < $logsPerDay; $i++) {
                [$city, $lon, $lat] = $cities[array_rand($cities)];
                
                VisitorLog::create([
                    'ip_address' => $this->randomIp(),
                    'user_agent' => 'Mozilla/5.0',
                    'url' => '/',
                    'method' => 'GET',
                    'country' => 'Indonesia',
                    'city' => $city,
                    'region' => $city,
                    'latitude' => $lat + (rand(-100, 100) / 10000),
                    'longitude' => $lon + (rand(-100, 100) / 10000),
                    'device' => $devices[array_rand($devices)],
                    'browser' => $browsers[array_rand($browsers)],
                    'platform' => $platforms[array_rand($platforms)],
                    'referrer' => null,
                    'created_at' => $date->copy()->addMinutes(rand(0, 1439)),
                    'updated_at' => $date->copy()->addMinutes(rand(0, 1439)),
                ]);
            }
        }

        $this->command->info('Visitor logs seeded successfully!');
    }

    private function randomIp(): string
    {
        return rand(1, 255) . '.' . rand(0, 255) . '.' . rand(0, 255) . '.' . rand(1, 255);
    }
}