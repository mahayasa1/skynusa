<?php

namespace Database\Seeders;

use App\Models\Berita;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        $beritas = [
            [
                'title' => 'Tips Merawat AC Agar Awet dan Hemat Listrik',
                'excerpt' => 'Panduan lengkap merawat AC dengan benar untuk menghemat biaya listrik',
                'category' => 'tips',
                'tags' => ['AC', 'Tips', 'Hemat Energi'],
            ],
            [
                'title' => 'Teknologi CCTV Terbaru dengan AI Recognition',
                'excerpt' => 'Mengenal teknologi CCTV modern dengan fitur pengenalan wajah berbasis AI',
                'category' => 'teknologi',
                'tags' => ['CCTV', 'AI', 'Keamanan'],
            ],
            // ... tambahkan lebih banyak
        ];

        foreach ($beritas as $data) {
            Berita::create([
                'user_id' => $admin->id,
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'excerpt' => $data['excerpt'],
                'content' => '<p>' . $data['excerpt'] . '</p><p>Lorem ipsum dolor sit amet...</p>',
                'category' => $data['category'],
                'tags' => $data['tags'],
                'is_published' => true,
                'published_at' => now(),
                'views' => rand(10, 500),
            ]);
        }
    }
}