<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        {{-- SEO Meta Tags --}}
        <meta name="author" content="SKYNUSA TECH">
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
        <meta name="googlebot" content="index, follow">
        <meta name="bingbot" content="index, follow">
        
        {{-- Default Meta Description (akan di-override oleh halaman spesifik) --}}
        <meta name="description" content="SKYNUSA TECH - Layanan instalasi listrik, service AC, IT support & web development profesional di Bali dengan teknisi bersertifikat. 188+ proyek selesai, 98% kepuasan klien.">
        
        {{-- Geo Tags untuk Local SEO --}}
        <meta name="geo.region" content="ID-BA">
        <meta name="geo.placename" content="Denpasar, Bali">
        <meta name="geo.position" content="-8.670458;115.212876">
        <meta name="ICBM" content="-8.670458, 115.212876">
        
        {{-- Open Graph Default --}}
        <meta property="og:locale" content="id_ID">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="SKYNUSA TECH">
        <meta property="og:image" content="{{ asset('asset/logo.png') }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        
        {{-- Twitter Card Default --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@skynusatech">
        <meta name="twitter:creator" content="@skynusatech">
        
        {{-- Business Contact Info --}}
        <meta name="contact" content="info@skynusa.com">
        <meta name="telephone" content="+6281234567890">
        <meta name="address" content="Bali, Indonesia">
        
        {{-- Theme Color --}}
        <meta name="theme-color" content="#2563eb">
        <meta name="msapplication-TileColor" content="#2563eb">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        {{-- JSON-LD Schema Markup untuk Organization --}}
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "SKYNUSA TECH",
            "description": "Penyedia layanan instalasi listrik, service AC, IT support, dan web development profesional di Bali",
            "image": "{{ asset('asset/logo.png') }}",
            "logo": "{{ asset('asset/logo.png') }}",
            "@id": "https://skynusa-tech.com",
            "url": "https://skynusa-tech.com",
            "telephone": "+6281234567890",
            "email": "info@skynusa.com",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jl. Raya Denpasar No. 123",
                "addressLocality": "Denpasar",
                "addressRegion": "Bali",
                "postalCode": "80361",
                "addressCountry": "ID"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": -8.670458,
                "longitude": 115.212876
            },
            "openingHoursSpecification": [
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday"
                    ],
                    "opens": "08:00",
                    "closes": "17:00"
                },
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": "Saturday",
                    "opens": "08:00",
                    "closes": "13:00"
                }
            ],
            "priceRange": "$$",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "188",
                "bestRating": "5",
                "worstRating": "1"
            },
            "sameAs": [
                "https://www.facebook.com/skynusatech",
                "https://www.instagram.com/skynusatech",
                "https://www.linkedin.com/company/skynusatech",
                "https://twitter.com/skynusatech"
            ],
            "areaServed": {
                "@type": "City",
                "name": "Bali"
            },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Layanan SKYNUSA TECH",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Instalasi Listrik",
                            "description": "Instalasi sistem kelistrikan profesional untuk rumah, kantor, dan industri"
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Service AC",
                            "description": "Instalasi dan maintenance AC split, multi-split, dan central"
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "IT Support",
                            "description": "Dukungan teknis IT, setup jaringan, dan troubleshooting"
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Web Development",
                            "description": "Pembuatan website profesional dan e-commerce"
                        }
                    }
                ]
            }
        }
        </script>

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>