<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home Page
Route::get('/', function () {
    return Inertia::render('index');
})->name('home');

// Tentang Kami
Route::get('/tentang-kami', function () {
    return Inertia::render('about');
})->name('about');

// Layanan
Route::get('/layanan', function () {
    return Inertia::render('services');
})->name('services');

// Portfolio
Route::get('/portfolio', function () {
    return Inertia::render('portfolio');
})->name('portfolio');

// Kontak
Route::get('/kontak', function () {
    return Inertia::render('contact');
})->name('contact');

// Settings routes (sudah ada)
require __DIR__.'/settings.php';