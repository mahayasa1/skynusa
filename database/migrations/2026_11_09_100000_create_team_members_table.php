<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->string('sub_role')->nullable();
            $table->string('photo')->nullable();
            $table->string('level', 20)->default('staff'); // ceo | management | staff
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Isi awal = susunan tim yang sebelumnya tertulis di kode.
        $now = now();
        $rows = [
            ['Royce Francis M.M', 'CEO & Founder', 'Business Strategy', 'asset/royce.png', 'ceo'],
            ['Mahayasa Wibawa', 'Chief Technology Officer', 'Technical Leadership', 'asset/id.png', 'management'],
            ['Arnold Tamelan', 'Head of Operations', 'Project Management', 'asset/arnold.jpeg', 'management'],
            ['Bagus Wisnu', 'Head of Design', 'UI/UX & Creative', 'asset/bgw.jpg', 'management'],
            ['Hassan', 'Head of Engineer', 'Electronic Engineering', 'asset/hassan.jpeg', 'management'],
            ['Frans', 'Head of Internet of Things', 'Electrical Installation', 'asset/frans.jpg', 'management'],
            ['Rudi', 'Front-end Developer', null, 'asset/profile.png', 'staff'],
            ['Anjani', 'Administrator', null, 'asset/profile.png', 'staff'],
            ['Agus Surya', 'UI/UX Designer', null, 'asset/agus.jpg', 'staff'],
            ['Rihaf', 'Lighting Installation', null, 'asset/profile.png', 'staff'],
        ];

        foreach ($rows as $i => [$name, $role, $sub, $photo, $level]) {
            DB::table('team_members')->insert([
                'name' => $name, 'role' => $role, 'sub_role' => $sub, 'photo' => $photo,
                'level' => $level, 'order' => $i + 1, 'is_active' => true,
                'created_at' => $now, 'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
