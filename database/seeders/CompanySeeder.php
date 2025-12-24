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
                'name' => 'PT Skynusa Teknologi',
                'logo' => 'companies/skynusa.png',
                'website' => 'https://skynusa-tech.com',
                'email' => 'info@skynusa-tech.com',
                'phone' => '081234567890',
                'address' => 'Denpasar, Bali',
                'is_active' => true,
            ],
            [
                'name' => 'CV Bali Smart Solution',
                'logo' => 'companies/bali-smart.png',
                'website' => null,
                'email' => 'contact@balismart.co.id',
                'phone' => '082233445566',
                'address' => 'Badung, Bali',
                'is_active' => true,
            ],
            [
                'name' => 'PT Nusantara Digital Indo',
                'logo' => null,
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
