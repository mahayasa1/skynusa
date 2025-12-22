// resources/js/components/seo-head.tsx
import { Head } from '@inertiajs/react';
import { seoConfig, googleVerification } from '@/config/seo';

interface SEOHeadProps {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    ogType?: 'website' | 'article' | 'profile' | 'product' | 'service';
    canonical?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    locale?: string;
    alternateLocales?: string[];
    schema?: 'organization' | 'service' | 'article' | 'product' | 'faq' | 'breadcrumb';
    price?: string;
    availability?: string;
}

export default function SEOHead({
    title,
    description,
    keywords = seoConfig.defaultKeywords,
    ogImage = seoConfig.defaultImage,
    ogType = 'website',
    canonical,  
    author = seoConfig.company.name,
    publishedTime,
    modifiedTime,
    locale = 'id_ID',
    alternateLocales = ['en_US'],
    schema = 'organization',
    price,
    availability = 'InStock',
}: SEOHeadProps) {
    const baseUrl = seoConfig.siteUrl;
    const fullTitle = title.includes(seoConfig.siteName) ? title : `${title} | ${seoConfig.siteName}`;
    const fullCanonical = canonical || (typeof window !== 'undefined' ? window.location.href : baseUrl);
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;
    
    // Organization Schema
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${baseUrl}#organization`,
        "name": seoConfig.company.name,
        "legalName": seoConfig.company.legalName,
        "url": baseUrl,
        "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/asset/logo.png`,
            "width": 250,
            "height": 60
        },
        "image": `${baseUrl}/asset/logo.png`,
        "description": seoConfig.defaultDescription,
        "foundingDate": seoConfig.company.foundingDate,
        "slogan": "Solusi Teknis Terpercaya untuk Segala Kebutuhan Anda",
        "priceRange": seoConfig.company.priceRange,
        "telephone": seoConfig.company.phone,
        "email": seoConfig.company.email,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": seoConfig.company.address.street,
            "addressLocality": seoConfig.company.address.city,
            "addressRegion": seoConfig.company.address.region,
            "postalCode": seoConfig.company.address.postalCode,
            "addressCountry": seoConfig.company.address.countryCode
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": seoConfig.company.geo.latitude,
            "longitude": seoConfig.company.geo.longitude
        },
        "openingHoursSpecification": seoConfig.company.openingHours.map(hours => ({
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": hours.split(' ')[0],
            "opens": hours.split(' ')[1].split('-')[0],
            "closes": hours.split(' ')[1].split('-')[1]
        })),
        "areaServed": seoConfig.areasServed.map(area => ({
            "@type": "City",
            "name": area
        })),
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": seoConfig.company.phone,
            "contactType": "customer service",
            "email": seoConfig.company.email,
            "availableLanguage": ["Indonesian", "English"],
            "areaServed": "ID",
            "hoursAvailable": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "08:00",
                "closes": "17:00"
            }
        },
        "sameAs": Object.values(seoConfig.socialLinks),
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "150",
            "bestRating": "5",
            "worstRating": "1"
        }
    };

    // Service Schema
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": title,
        "provider": {
            "@id": `${baseUrl}#organization`
        },
        "areaServed": seoConfig.areasServed.map(area => ({
            "@type": "City",
            "name": area
        })),
        "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": fullCanonical,
            "servicePhone": seoConfig.company.phone
        },
        "offers": {
            "@type": "Offer",
            "availability": availability,
            "price": price || "Varies",
            "priceCurrency": "IDR"
        }
    };

    // Website Schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        "url": baseUrl,
        "name": seoConfig.siteName,
        "description": seoConfig.defaultDescription,
        "publisher": {
            "@id": `${baseUrl}#organization`
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        },
        "inLanguage": "id-ID"
    };

    // Breadcrumb Schema
    const breadcrumbSchema = typeof window !== 'undefined' ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": window.location.pathname.split('/').filter(Boolean).map((segment, index, arr) => ({
            "@type": "ListItem",
            "position": index + 2,
            "name": segment.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            "item": `${baseUrl}/${arr.slice(0, index + 1).join('/')}`
        }))
    } : null;

    // Add home as first breadcrumb
    if (breadcrumbSchema && breadcrumbSchema.itemListElement.length > 0) {
        breadcrumbSchema.itemListElement.unshift({
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
        });
    }

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="Indonesian" />
            <meta name="revisit-after" content="7 days" />
            <meta name="rating" content="general" />
            <meta name="distribution" content="global" />
            
            {/* Verification Tags */}
            <meta name="google-site-verification" content={googleVerification} />
            
            {/* Canonical URL */}
            <link rel="canonical" href={fullCanonical} />
            
            {/* Alternate Languages */}
            {alternateLocales.map(altLocale => (
                <link key={altLocale} rel="alternate" hrefLang={altLocale} href={fullCanonical} />
            ))}
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullOgImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={title} />
            <meta property="og:site_name" content={seoConfig.siteName} />
            <meta property="og:locale" content={locale} />
            {seoConfig.company.phone && <meta property="business:contact_data:phone_number" content={seoConfig.company.phone} />}
            {seoConfig.company.address.street && <meta property="business:contact_data:street_address" content={seoConfig.company.address.street} />}
            {seoConfig.company.address.city && <meta property="business:contact_data:locality" content={seoConfig.company.address.city} />}
            {seoConfig.company.address.region && <meta property="business:contact_data:region" content={seoConfig.company.address.region} />}
            {seoConfig.company.address.postalCode && <meta property="business:contact_data:postal_code" content={seoConfig.company.address.postalCode} />}
            {seoConfig.company.address.country && <meta property="business:contact_data:country_name" content={seoConfig.company.address.country} />}
            
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
            <meta name="twitter:image:alt" content={title} />
            <meta name="twitter:creator" content={seoConfig.twitterHandle} />
            <meta name="twitter:site" content={seoConfig.twitterHandle} />
            
            {/* Additional Meta Tags */}
            <meta name="theme-color" content="#2563eb" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content={seoConfig.siteName} />
            <meta name="format-detection" content="telephone=yes" />
            <meta name="mobile-web-app-capable" content="yes" />
            
            {/* Geo Tags */}
            <meta name="geo.region" content="ID-BA" />
            <meta name="geo.placename" content={`${seoConfig.company.address.city}, ${seoConfig.company.address.region}`} />
            <meta name="geo.position" content={`${seoConfig.company.geo.latitude};${seoConfig.company.geo.longitude}`} />
            <meta name="ICBM" content={`${seoConfig.company.geo.latitude}, ${seoConfig.company.geo.longitude}`} />

            {/* Structured Data - Organization */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>

            {/* Structured Data - Website */}
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>

            {/* Structured Data - Service (if applicable) */}
            {schema === 'service' && (
                <script type="application/ld+json">
                    {JSON.stringify(serviceSchema)}
                </script>
            )}

            {/* Structured Data - Breadcrumb */}
            {breadcrumbSchema && breadcrumbSchema.itemListElement.length > 1 && (
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            )}
        </Head>
    );
}