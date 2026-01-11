<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            [
                'name' => 'Komisi Perlindungan Anak Indonesia',
                'logo' => null,
                'website' => null,
                'email' => null,
                'phone' => null,
                'address' => null,
                'is_active' => true,
            ],
            [
                'name' => 'PT Integrasi Muda Teknologi',
                'logo' => null,
                'website' => null,
                'email' => null,
                'phone' => null,
                'address' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Komunitas Pramuka Anti Perundungan',
                'logo' => null,
                'website' => null,
                'email' => null,
                'phone' => null,
                'address' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Rare Coffee',
                'logo' => '/asset/rare-coffee.jpeg',
                'website' => null,
                'email' => null,
                'phone' => null,
                'address' => null,
                'is_active' => true,
            ],
        ];

        foreach ($companies as $company) {
            Company::create([
                'name' => $company['name'],
                'slug' => Str::slug($company['name']),
                'logo' => $company['logo'],
                'website' => $company['website'],
                'email' => $company['email'],
                'phone' => $company['phone'],
                'address' => $company['address'],
                'is_active' => $company['is_active'],
            ]);
        }
    }
}
