<?php

use App\Http\Controllers\BeritaController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\PesananController;
use App\Http\Controllers\PesanController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home Page - dengan data services dari database
Route::get('/', function () {
    
    $servicesController = app(ServicesController::class);
    $portfolioController = app(PortfolioController::class);
    $companiesController = app(CompanyController::class);
    
    $services = $servicesController->getServicesForHome();
    $portfolios = $portfolioController->getPortfoliosForHome();
    $companies = $companiesController->getCompaniesForHome();
    
    return Inertia::render('index', [
        'services' => $services,
        'portfolios' => $portfolios,
        'companies' => $companies,
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

Route::controller(PesananController::class)->group(function () {
    Route::post('/kontak', 'store')->name('contact.store');
});

// Tim
Route::get('/tim', function () {
    return Inertia::render('tim');
})->name('tim');

//pesanan
Route::controller(PesananController::class)->group(function () {
    // Order form
    Route::get('/pesanan/order', 'create')->name('order.create');
    Route::post('/pesanan/order', 'store')->name('order.store');
    
    // Tracking
    Route::get('/pesanan/tracking', 'trackingForm')->name('order.tracking.form');
    Route::post('/pesanan/tracking', 'track')->name('order.tracking');
});


Route::controller(BeritaController::class)->group(function () {
    Route::get('/berita', 'index')->name('berita.index');
    Route::get('/berita/category/{category}', 'category')->name('berita.category');
    Route::get('/berita/{slug}', 'show')->name('berita.show');
});


/**
 * ============================================
 * ADMIN DASHBOARD - All authenticated users
 * ============================================
 */
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

/**
 * ============================================
 * ADMIN ROUTES - User Management (Admin Only)
 * ============================================
 */
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::controller(UserController::class)->prefix('users')->group(function () {
        Route::get('/', 'index')->name('users.index');
        Route::get('/create', 'create')->name('users.create');
        Route::post('/', 'store')->name('users.store');
        Route::post('/bulk-destroy', 'bulkDestroy')->name('users.bulk-destroy');
        Route::get('/{user}', 'show')->name('users.show');
        Route::get('/{user}/edit', 'edit')->name('users.edit');
        Route::put('/{user}', 'update')->name('users.update');
        Route::delete('/{user}', 'destroy')->name('users.destroy');
    });
});

/**
* ============================================
 * ADMIN ROUTES - Services Management
 * Admin & Head can access
 * ============================================
 */
Route::middleware(['auth', 'role:admin,head'])->prefix('admin')->name('admin.')->group(function () {

    Route::controller(CompanyController::class)->prefix('companies')->group(function () {
        Route::get('/', 'adminIndex')->name('companies.index');
        Route::get('/create', 'create')->name('companies.create');
        Route::post('/', 'store')->name('companies.store');
        
        // Bulk operations
        Route::post('/bulk-destroy', 'bulkDestroy')->name('companies.bulk-destroy');
        Route::post('/bulk-update-status', 'bulkUpdateStatus')->name('companies.bulk-update-status');
        
        Route::get('/{id}', 'adminShow')->name('companies.show');
        Route::get('/{id}/edit', 'edit')->name('companies.edit');
        Route::put('/{id}', 'update')->name('companies.update');
        Route::patch('/{id}', 'update');
        Route::delete('/{id}', 'destroy')->name('companies.destroy');
        Route::patch('/{id}/toggle-status', 'toggleStatus')->name('companies.toggle-status');
    });

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
});

/**
 * ============================================
 * PORTFOLIO ROUTES - Admin, Manager, Head
 * ============================================
 */
Route::middleware(['auth', 'role:admin,manager,head'])->prefix('admin')->name('admin.')->group(function () {
    
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


/**
 * ============================================
 * PESANAN ROUTES - Admin, Manager, Staff (read)
 * ============================================
 */
Route::middleware(['auth', 'role:admin,manager,staff'])->prefix('admin')->name('admin.')->group(function () {
    Route::controller(PesananController::class)->prefix('pesanan')->group(function () {
        // List orders
        Route::get('/', 'adminIndex')->name('pesanan.index');
        
        // Single order operations
        Route::get('/{id}', 'show')->name('pesanan.show');
    });
});

// Pesanan CRUD - Admin & Manager only
Route::middleware(['auth', 'role:admin,manager'])->prefix('admin')->name('admin.')->group(function () {
    Route::controller(PesananController::class)->prefix('pesanan')->group(function () {
        // Bulk operations
        Route::post('/bulk-destroy', 'bulkDestroy')->name('pesanan.bulk-destroy');
        Route::post('/bulk-update-status', 'bulkUpdateStatus')->name('pesanan.bulk-update-status');
        
        // Edit operations
        Route::get('/{id}/edit', 'edit')->name('pesanan.edit');
        Route::put('/{id}', 'update')->name('pesanan.update');
        Route::patch('/{id}', 'update');
        Route::delete('/{id}', 'destroy')->name('pesanan.destroy');
        
        // Update status
        Route::patch('/{id}/update-status', 'updateStatus')->name('pesanan.update-status');
    });
});

/**
 * ============================================
 * PESAN ROUTES - Admin & Staff
 * ============================================
 */
Route::middleware(['auth', 'role:admin,staff'])->prefix('admin')->name('admin.')->group(function () {
    Route::controller(PesanController::class)->prefix('pesan')->group(function () {
        Route::get('/', 'adminIndex')->name('pesan.index');
        Route::get('/trashed', 'trashed')->name('pesan.trashed');
        Route::get('/{id}', 'show')->name('pesan.show');
    });

    Route::controller(BeritaController::class)->prefix('berita')->group(function () {
        Route::get('/', 'adminIndex')->name('berita.index');
        Route::get('/create', 'create')->name('berita.create');
        Route::post('/', 'store')->name('berita.store');
        
        // Bulk operations
        Route::post('/bulk-destroy', 'bulkDestroy')->name('berita.bulk-destroy');
        Route::post('/bulk-update-status', 'bulkUpdateStatus')->name('berita.bulk-update-status');
        
        Route::get('/{id}', 'adminShow')->name('berita.show');
        Route::get('/{id}/edit', 'edit')->name('berita.edit');
        Route::put('/{id}', 'update')->name('berita.update');
        Route::patch('/{id}', 'update');
        Route::delete('/{id}', 'destroy')->name('berita.destroy');
        
        Route::patch('/{id}/toggle-publish', 'togglePublish')->name('berita.toggle-publish');
        Route::patch('/{id}/toggle-featured', 'toggleFeatured')->name('berita.toggle-featured');
    });
});

// Pesan CRUD - Admin only
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::controller(PesanController::class)->prefix('pesan')->group(function () {
        Route::post('/bulk-destroy', 'bulkDestroy')->name('pesan.bulk-destroy');
        Route::post('/bulk-force-destroy', 'bulkForceDestroy')->name('pesan.bulk-force-destroy');
        Route::get('/export', 'export')->name('pesan.export');
        Route::get('/{id}/edit', 'edit')->name('pesan.edit');
        Route::put('/{id}', 'update')->name('pesan.update');
        Route::patch('/{id}', 'update');
        Route::delete('/{id}', 'destroy')->name('pesan.destroy');
        Route::delete('/{id}/force', 'forceDestroy')->name('pesan.force-destroy');
        Route::post('/{id}/restore', 'restore')->name('pesan.restore');
    });
});

// Settings routes (sudah ada)
require __DIR__.'/auth.php';

require __DIR__.'/settings.php';