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
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            
            // Foreign key to services
            $table->foreignId('service_id')
                ->constrained('services')
                ->onDelete('cascade');  
            
            $table->foreignId('companies_id')
                ->constrained('companies')
                ->onDelete('cascade');
            
            $table->foreignId('categories_id')
                ->constrained('categories')
                ->onDelete('cascade');

            // Basic info
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('short_description')->nullable();
            
            // Media
            $table->string('image')->nullable();
            $table->json('gallery')->nullable(); // Multiple images
            
            // Project details
            $table->string('location')->nullable();
            $table->date('project_date')->nullable();
            $table->string('duration')->nullable();
            $table->json('technologies')->nullable(); // Array of tech used
            $table->json('features')->nullable(); // Array of features
            
            // Project URL (if applicable)
            $table->string('project_url')->nullable();
            
            // Status & visibility
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0);
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['service_id', 'is_active']);
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};
