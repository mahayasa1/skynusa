<?php
// routes/sitemap.php

use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', function () {
    $pages = [
        [
            'loc' => url('/'), 
            'priority' => '1.0', 
            'changefreq' => 'daily',
            'images' => [
                ['url' => url('/asset/logo.png'), 'caption' => 'SKYNUSA TECH Logo'],
                ['url' => url('/asset/bg-main.png'), 'caption' => 'SKYNUSA TECH Services'],
            ]
        ],
        [
            'loc' => url('/tentang-kami'), 
            'priority' => '0.8', 
            'changefreq' => 'monthly',
            'images' => [
                ['url' => url('/asset/about.jpeg'), 'caption' => 'Tim SKYNUSA TECH'],
            ]
        ],
        [
            'loc' => url('/layanan'), 
            'priority' => '0.9', 
            'changefreq' => 'weekly',
            'images' => [
                ['url' => url('/asset/cctv.jpeg'), 'caption' => 'Instalasi CCTV'],
                ['url' => url('/asset/AC.jpeg'), 'caption' => 'Service AC'],
                ['url' => url('/asset/IT Support.jpeg'), 'caption' => 'IT Support'],
                ['url' => url('/asset/web.jpeg'), 'caption' => 'Web Development'],
            ]
        ],
        [
            'loc' => url('/portfolio'), 
            'priority' => '0.9', 
            'changefreq' => 'weekly',
            'images' => [
                ['url' => url('/asset/cctv.jpeg'), 'caption' => 'Portfolio CCTV'],
                ['url' => url('/asset/AC.jpeg'), 'caption' => 'Portfolio AC'],
                ['url' => url('/asset/web.jpeg'), 'caption' => 'Portfolio Web'],
                ['url' => url('/asset/IT Support.jpeg'), 'caption' => 'Portfolio IT'],
            ]
        ],
        [
            'loc' => url('/kontak'), 
            'priority' => '0.8', 
            'changefreq' => 'monthly'
        ],
        [
            'loc' => url('/tim'), 
            'priority' => '0.7', 
            'changefreq' => 'monthly',
            'images' => [
                ['url' => url('/asset/Royce.jpg'), 'caption' => 'CEO SKYNUSA TECH'],
                ['url' => url('/asset/id.png'), 'caption' => 'CTO SKYNUSA TECH'],
            ]
        ],
    ];

    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
    $xml .= 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
    
    foreach ($pages as $page) {
        $xml .= '<url>';
        $xml .= '<loc>' . htmlspecialchars($page['loc']) . '</loc>';
        $xml .= '<lastmod>' . date('Y-m-d') . '</lastmod>';
        $xml .= '<changefreq>' . $page['changefreq'] . '</changefreq>';
        $xml .= '<priority>' . $page['priority'] . '</priority>';
        
        // Add images if present
        if (isset($page['images'])) {
            foreach ($page['images'] as $image) {
                $xml .= '<image:image>';
                $xml .= '<image:loc>' . htmlspecialchars($image['url']) . '</image:loc>';
                if (isset($image['caption'])) {
                    $xml .= '<image:caption>' . htmlspecialchars($image['caption']) . '</image:caption>';
                }
                $xml .= '</image:image>';
            }
        }
        
        $xml .= '</url>';
    }
    
    $xml .= '</urlset>';

    return response($xml, 200)->header('Content-Type', 'text/xml');
});

// Image Sitemap
Route::get('/sitemap-images.xml', function () {
    $images = [
        ['url' => url('/asset/logo.png'), 'caption' => 'SKYNUSA TECH Logo', 'title' => 'Logo'],
        ['url' => url('/asset/footer-logo.png'), 'caption' => 'SKYNUSA TECH Footer Logo', 'title' => 'Footer Logo'],
        ['url' => url('/asset/bg-main.png'), 'caption' => 'Background Services', 'title' => 'Services Background'],
        ['url' => url('/asset/cctv.jpeg'), 'caption' => 'Instalasi CCTV Profesional', 'title' => 'CCTV Installation'],
        ['url' => url('/asset/AC.jpeg'), 'caption' => 'Service AC dan Instalasi', 'title' => 'AC Service'],
        ['url' => url('/asset/IT Support.jpeg'), 'caption' => 'IT Support dan Maintenance', 'title' => 'IT Support'],
        ['url' => url('/asset/web.jpeg'), 'caption' => 'Web Development Services', 'title' => 'Web Development'],
        ['url' => url('/asset/about.jpeg'), 'caption' => 'Tim SKYNUSA TECH', 'title' => 'Our Team'],
        ['url' => url('/asset/Royce.jpg'), 'caption' => 'Royce Francis - CEO', 'title' => 'CEO'],
        ['url' => url('/asset/id.png'), 'caption' => 'Mahayasa Wibawa - CTO', 'title' => 'CTO'],
    ];

    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
    $xml .= 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
    
    foreach ($images as $image) {
        $xml .= '<url>';
        $xml .= '<loc>' . htmlspecialchars(url('/')) . '</loc>';
        $xml .= '<image:image>';
        $xml .= '<image:loc>' . htmlspecialchars($image['url']) . '</image:loc>';
        if (isset($image['caption'])) {
            $xml .= '<image:caption>' . htmlspecialchars($image['caption']) . '</image:caption>';
        }
        if (isset($image['title'])) {
            $xml .= '<image:title>' . htmlspecialchars($image['title']) . '</image:title>';
        }
        $xml .= '</image:image>';
        $xml .= '</url>';
    }
    
    $xml .= '</urlset>';

    return response($xml, 200)->header('Content-Type', 'text/xml');
});