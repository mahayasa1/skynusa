<?php

namespace Database\Seeders;

use App\Models\Services;
use Illuminate\Database\Seeder;

class ServicesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'Instalasi dan Maintenance Listrik',
                'slug' => 'instalasi-maintenance-listrik',
                'description' => 'Instalasi sistem kelistrikan yang aman dan sesuai standar untuk rumah, kantor, dan industri',
                'icon' => 'Zap',
                'features' => [
                    'Instalasi panel listrik lengkap',
                    'Sistem grounding dan penangkal petir',
                    'Instalasi penerangan indoor & outdoor',
                    'Maintenance rutin sistem kelistrikan',
                    'Troubleshooting dan perbaikan',
                    'Upgrade kapasitas daya listrik',
                ],
                'image' => '/asset/cctv.jpeg',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Instalasi dan Service AC',
                'slug' => 'instalasi-service-ac',
                'description' => 'Pemasangan dan perawatan AC untuk kenyamanan optimal dengan efisiensi energi terbaik',
                'icon' => 'AirVent',
                'features' => [
                    'Instalasi AC Split & Multi Split',
                    'Instalasi AC Central & VRV',
                    'Service berkala dan cleaning AC',
                    'Perbaikan dan troubleshooting',
                    'Isi freon dan cek kebocoran',
                    'Konsultasi pemilihan AC yang tepat',
                ],
                'image' => '/asset/AC.jpeg',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'IT Support & Maintenance',
                'slug' => 'it-support-maintenance',
                'description' => 'Dukungan teknis IT profesional untuk komputer, jaringan, dan sistem teknologi informasi',
                'icon' => 'Monitor',
                'features' => [
                    'Setup dan maintenance PC/Laptop',
                    'Instalasi jaringan LAN/WAN',
                    'Setup server dan cloud storage',
                    'Troubleshooting hardware & software',
                    'IT helpdesk dan remote support',
                    'Data backup dan recovery',
                ],
                'image' => '/asset/IT Support.jpeg',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Web Development',
                'slug' => 'web-development',
                'description' => 'Pembuatan dan pemeliharaan website profesional untuk meningkatkan kehadiran online bisnis',
                'icon' => 'Code',
                'features' => [
                    'Website company profile',
                    'Toko online / E-commerce',
                    'Web application custom',
                    'Website maintenance & update',
                    'SEO optimization',
                    'Responsive & mobile-friendly design',
                ],
                'image' => '/asset/web.jpeg',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($services as $service) {
            Services::create($service);
        }
    }
}