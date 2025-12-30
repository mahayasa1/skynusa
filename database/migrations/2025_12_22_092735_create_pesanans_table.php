<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pesanans', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->string('telp');
            $table->text('description');
            $table->date('due_date');
            $table->enum('status', ['pending', 'verifikasi', 'proses', 'approval', 'running', 'selesai'])->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanans');
    }
};
