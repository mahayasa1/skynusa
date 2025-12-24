<?php

use App\Http\Controllers\ServicesController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home Page - dengan data services dari database
Route::get('/', function () {
    
    $servicesController = app(ServicesController::class);
    $portfolioController = app(PortfolioController::class);
    
    $services = $servicesController->getServicesForHome();
    $portfolios = $portfolioController->getPortfoliosForHome();
    
    return Inertia::render('index', [
        'services' => $services,
        'portfolios' => $portfolios,
    ]);
})->name('home');

// Tentang Kami
Route::get('/tentang-kami', function () {
    return Inertia::render('about');
})->name('about');

// Layanan (Public Routes)
Route::get('/layanan', [ServicesController::class, 'index'])->name('services');
Route::get('/layanan/{slug}', [ServicesController::class, 'show'])->name('services.show');

// Portfolio
Route::controller(PortfolioController::class)->group(function () {
    Route::get('/portfolio', 'index')->name('portfolio.index');
    Route::get('/portfolio/{slug}', 'show')->name('portfolio.show');
});

// Kontak
Route::get('/kontak', function () {
    return Inertia::render('contact');
})->name('contact');

// Tim
Route::get('/tim', function () {
    return Inertia::render('tim');
})->name('tim');

/**
 * ============================================
 * ADMIN ROUTES - Services Management
 * Middleware: auth, role:admin
 * ============================================
 */
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    
    Route::controller(ServicesController::class)->prefix('layanan')->group(function () {
        
        // List services
        Route::get('/', 'adminIndex')->name('services.index');
        
        // Create
        Route::get('/create', 'create')->name('services.create');
        Route::post('/', 'store')->name('services.store');
        
        // Bulk operations (sebelum {id} routes)
        Route::post('/bulk-destroy', 'bulkDestroy')->name('services.bulk-destroy');
        Route::post('/bulk-update-status', 'bulkUpdateStatus')->name('services.bulk-update-status');
        Route::post('/update-order', 'updateOrder')->name('services.update-order');
        
        // Single service operations
        Route::get('/{id}', 'adminShow')->name('services.show');
        Route::get('/{id}/edit', 'edit')->name('services.edit');
        Route::put('/{id}', 'update')->name('services.update');
        Route::patch('/{id}', 'update');
        Route::delete('/{id}', 'destroy')->name('services.destroy');
        
        // Toggle operations
        Route::patch('/{id}/toggle-status', 'toggleStatus')->name('services.toggle-status');
        Route::patch('/{id}/toggle-featured', 'toggleFeatured')->name('services.toggle-featured');
        
        // Duplicate
        Route::post('/{id}/duplicate', 'duplicate')->name('services.duplicate');
    });

    Route::controller(PortfolioController::class)->prefix('portfolio')->group(function () {
        
        // List portfolios
        Route::get('/', 'adminIndex')->name('portfolio.index');
        
        // Create
        Route::get('/create', 'create')->name('portfolio.create');
        Route::post('/', 'store')->name('portfolio.store');
        
        // Bulk operations (sebelum {id} routes)
        Route::post('/bulk-destroy', 'bulkDestroy')->name('portfolio.bulk-destroy');
        Route::post('/bulk-update-status', 'bulkUpdateStatus')->name('portfolio.bulk-update-status');
        Route::post('/update-order', 'updateOrder')->name('portfolio.update-order');
        
        // Single portfolio operations
        Route::get('/{id}', 'adminShow')->name('portfolio.show');
        Route::get('/{id}/edit', 'edit')->name('portfolio.edit');
        Route::put('/{id}', 'update')->name('portfolio.update');
        Route::patch('/{id}', 'update');
        Route::delete('/{id}', 'destroy')->name('portfolio.destroy');
        
        // Toggle operations
        Route::patch('/{id}/toggle-status', 'toggleStatus')->name('portfolio.toggle-status');
        Route::patch('/{id}/toggle-featured', 'toggleFeatured')->name('portfolio.toggle-featured');
        
        // Duplicate
        Route::post('/{id}/duplicate', 'duplicate')->name('portfolio.duplicate');
    });
});

// Settings routes (sudah ada)
require __DIR__.'/settings.php';

require __DIR__.'/sitemap.php';