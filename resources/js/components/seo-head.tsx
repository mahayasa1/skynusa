// resources/js/components/seo-head.tsx
import { Head } from '@inertiajs/react';

interface SEOHeadProps {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    ogType?: 'website' | 'article' | 'profile';
    canonical?: string;
    noindex?: boolean;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
}

export default function SEOHead({
    title,
    description,
    keywords = '',
    ogImage = '/asset/logo.png',
    ogType = 'website',
    canonical,
    noindex = false,
    author = 'SKYNUSA TECH',
    publishedTime,
    modifiedTime,
}: SEOHeadProps) {
    // Use environment variable or detect from window
    const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : 'https://skynusa-tech.com';
    
    const fullTitle = title.includes('SKYNUSA TECH') ? title : `${title} | SKYNUSA TECH`;
    const fullCanonical = canonical || (typeof window !== 'undefined' ? window.location.href : baseUrl);
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

    // Structured Data for Organization
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SKYNUSA TECH",
        "url": baseUrl,
        "logo": `${baseUrl}/asset/logo.png`,
        "description": "Solusi profesional untuk instalasi listrik, service AC, IT support, dan web development di Bali",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Denpasar",
            "addressRegion": "Bali",
            "addressCountry": "ID"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-8.670458",
            "longitude": "115.212876"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+62-812-3456-7890",
            "contactType": "customer service",
            "email": "info@skynusa.com",
            "availableLanguage": ["Indonesian", "English"]
        },
        "sameAs": [
            "https://www.facebook.com/skynusatech",
            "https://www.instagram.com/skynusatech",
            "https://twitter.com/skynusatech"
        ]
    };

    return (
        <Head>
            {/* Title Tag */}
            <title>{fullTitle}</title>

            {/* Basic Meta Tags */}
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />
            <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="Indonesian" />
            <meta name="revisit-after" content="7 days" />
            
            {/* Canonical URL */}
            <link rel="canonical" href={fullCanonical} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullOgImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="SKYNUSA TECH" />
            <meta property="og:locale" content="id_ID" />
            
            {/* Article specific */}
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            {author && <meta property="article:author" content={author} />}
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullCanonical} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullOgImage} />
            <meta name="twitter:creator" content="@skynusatech" />
            <meta name="twitter:site" content="@skynusatech" />
            
            {/* Additional Meta Tags */}
            <meta name="theme-color" content="#2563eb" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="SKYNUSA TECH" />
            <meta name="format-detection" content="telephone=yes" />
            
            {/* Geo Tags */}
            <meta name="geo.region" content="ID-BA" />
            <meta name="geo.placename" content="Denpasar, Bali" />
            <meta name="geo.position" content="-8.670458;115.212876" />
            <meta name="ICBM" content="-8.670458, 115.212876" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
        </Head>
    );
}