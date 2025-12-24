<?php

namespace Database\Seeders;

use App\Models\Categories;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Portfolio;
use App\Models\Company;
use App\Models\Services;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil ID relasi (pastikan sudah di-seed)
        $serviceIds  = Services::pluck('id')->toArray();
        $companyIds  = Company::pluck('id')->toArray();
        $categoryIds = Categories::pluck('id')->toArray();

        // Safety check
        if (empty($serviceIds) || empty($companyIds) || empty($categoryIds)) {
            $this->command->warn('Seeder Portfolio dilewati karena data relasi belum tersedia.');
            return;
        }

        $portfolios = [
            [
                'title' => 'Instalasi CCTV Hotel Bintang 5',
                'short_description' => 'Pemasangan sistem CCTV terintegrasi untuk keamanan hotel.',
                'description' => 'Proyek instalasi CCTV mencakup pemasangan kamera indoor & outdoor, konfigurasi NVR, serta monitoring terpusat.',
                'location' => 'Nusa Dua, Bali',
                'duration' => '2 Minggu',
                'technologies' => ['Hikvision', 'IP Camera', 'NVR', 'PoE Switch'],
                'features' => [
                    'Monitoring 24/7',
                    'Akses Mobile',
                    'Penyimpanan Cloud',
                ],
                'project_url' => null,
                'image' => 'asset/cctv.jpeg',
                'gallery' => [
                    'portfolios/cctv-hotel-1.jpg',
                    'portfolios/cctv-hotel-2.jpg',
                ],
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'Pengembangan Website Company Profile',
                'short_description' => 'Website profesional untuk perusahaan nasional.',
                'description' => 'Pengembangan website company profile dengan desain modern, SEO friendly, dan performa tinggi.',
                'location' => 'Denpasar, Bali',
                'duration' => '1 Bulan',
                'technologies' => ['Laravel', 'React', 'TailwindCSS'],
                'features' => [
                    'Responsive Design',
                    'SEO Optimization',
                    'Admin Dashboard',
                ],
                'project_url' => 'https://example-company.com',
                'image' => 'asset/about.jpeg',
                'gallery' => null,
                'is_featured' => false,
                'order' => 2,
            ],
        ];

        foreach ($portfolios as $index => $data) {
            Portfolio::create([
                'service_id'    => $serviceIds[array_rand($serviceIds)],
                'companies_id'  => $companyIds[array_rand($companyIds)],
                'categories_id' => $categoryIds[array_rand($categoryIds)],

                'title' => $data['title'],
                'slug'  => Str::slug($data['title']),

                'description' => $data['description'],
                'short_description' => $data['short_description'],

                'image' => $data['image'],
                'gallery' => $data['gallery'],

                'location' => $data['location'],
                'project_date' => now()->subMonths(rand(1, 12)),
                'duration' => $data['duration'],
                'technologies' => $data['technologies'],
                'features' => $data['features'],

                'project_url' => $data['project_url'],

                'is_active' => true,
                'is_featured' => $data['is_featured'],
                'order' => $data['order'],

                'meta_title' => $data['title'],
                'meta_description' => $data['short_description'],
                'meta_keywords' => implode(', ', $data['technologies']),
            ]);
        }
    }
}
