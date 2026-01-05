<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Administrator',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'telp' => '081234567890',
            'role' => 'admin',
            'foto' => null,
        ]);

        // Manager User
        User::create([
            'name' => 'Manager User',
            'username' => 'manager',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'telp' => '081234567891',
            'role' => 'manager',
            'foto' => null,
        ]);

        // Head User
        User::create([
            'name' => 'Head User',
            'username' => 'head',
            'email' => 'head@example.com',
            'password' => Hash::make('password'),
            'telp' => '081234567892',
            'role' => 'head',
            'foto' => null,
        ]);

        // Staff User
        User::create([
            'name' => 'Staff User',
            'username' => 'staff',
            'email' => 'staff@example.com',
            'password' => Hash::make('password'),
            'telp' => '081234567893',
            'role' => 'staff',
            'foto' => null,
        ]);

        // Additional sample users for each role (optional)
        User::create([
            'name' => 'John Admin',
            'username' => 'johnadmin',
            'email' => 'john.admin@example.com',
            'password' => Hash::make('password'),
            'telp' => '081234567894',
            'role' => 'admin',
            'foto' => null,
        ]);

        User::create([
            'name' => 'Sarah Manager',
            'username' => 'sarahmanager',
            'email' => 'sarah.manager@example.com',
            'password' => Hash::make('password'),
            'telp' => '081234567895',
            'role' => 'manager',
            'foto' => null,
        ]);

        User::create([
            'name' => 'David Head',
            'username' => 'davidhead',
            'email' => 'david.head@example.com',
            'password' => Hash::make('password'),
            'telp' => '081234567896',
            'role' => 'head',
            'foto' => null,
        ]);

        User::create([
            'name' => 'Emma Staff',
            'username' => 'emmastaff',
            'email' => 'emma.staff@example.com',
            'password' => Hash::make('password'),
            'telp' => '081234567897',
            'role' => 'staff',
            'foto' => null,
        ]);
    }
}