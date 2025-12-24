<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Categories;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Instalasi CCTV',
                'description' => 'Pemasangan dan konfigurasi sistem CCTV profesional.',
            ],
            [
                'name' => 'IT Infrastructure',
                'description' => 'Jaringan, server, dan sistem IT perusahaan.',
            ],
            [
                'name' => 'Web Development',
                'description' => 'Pembuatan website dan sistem berbasis web.',
            ],
            [
                'name' => 'Maintenance & Support',
                'description' => 'Perawatan sistem dan dukungan teknis.',
            ],
        ];

        foreach ($categories as $category) {
            Categories::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'is_active' => true,
            ]);
        }
    }
}
