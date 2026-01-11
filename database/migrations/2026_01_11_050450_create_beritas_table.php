<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('beritas', function (Blueprint $table) {
            $table->id();
            
            // Basic Info
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable(); // Short description
            $table->longText('content');
            
            // Media
            $table->string('featured_image')->nullable();
            $table->json('gallery')->nullable(); // Additional images
            
            // Author & Category
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('category')->nullable(); // Teknologi, Tutorial, News, dll
            $table->json('tags')->nullable(); // Array of tags
            
            // Publishing
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            
            // Stats
            $table->integer('views')->default(0);
            $table->integer('order')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['is_published', 'published_at']);
            $table->index('slug');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('beritas');
    }
};