<?php

use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', function () {
    $pages = [
        ['loc' => url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
        ['loc' => url('/tentang-kami'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => url('/layanan'), 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['loc' => url('/portfolio'), 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['loc' => url('/kontak'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => url('/tim'), 'priority' => '0.7', 'changefreq' => 'monthly'],
    ];

    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    foreach ($pages as $page) {
        $xml .= '<url>';
        $xml .= '<loc>' . htmlspecialchars($page['loc']) . '</loc>';
        $xml .= '<lastmod>' . date('Y-m-d') . '</lastmod>';
        $xml .= '<changefreq>' . $page['changefreq'] . '</changefreq>';
        $xml .= '<priority>' . $page['priority'] . '</priority>';
        $xml .= '</url>';
    }
    
    $xml .= '</urlset>';

    return response($xml, 200)->header('Content-Type', 'text/xml');
});