import PublicLayout from '@/layouts/public-layout';
import SEOHead from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

/**
 * Type definition untuk Service (relasi)
 */
interface Service {
    id: number;
    title: string;
    slug: string;
}

/**
 * Type definition untuk Portfolio dari backend
 */
interface Portfolio {
    id: number;
    service_id: number;

    title: string;
    slug: string;
    description: string;
    short_description: string | null;

    image: string;
    gallery: string[] | null;

    client_name: string | null;
    location: string | null;

    project_date: string | null;
    duration: string | null;

    technologies: string[] | null;
    features: string[] | null;

    project_url: string | null;

    is_active: boolean;
    is_featured: boolean;

    order: number | null;

    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;

    created_at?: string;
    updated_at?: string;

    service?: Service;
}

/**
 * Props halaman Portfolio
 */
interface PortfolioProps {
    portfolios: Portfolio[];
    statistics?: {
        total_projects: number;
        success_rate: string;
        total_clients: number;
    };
}

export default function PortfolioPage({ portfolios, statistics,}: PortfolioProps) {

    
    return (
        <PublicLayout>
            <SEOHead
                title="Portfolio Project - Instalasi, IT & Web Development"
                description="Portfolio project instalasi CCTV, AC central, IT infrastructure, dan web development. Lebih dari 180+ project berhasil dengan klien profesional."
                keywords="portfolio cctv, portfolio instalasi ac, portfolio it support, web development project"
                canonical="https://skynusa-tech.com/portfolio"
                ogImage="/asset/logo.png"
            />

            {/* ================= HERO SECTION ================= */}
            <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-16">
                <div className="absolute inset-0 bg-[url('/asset/bg-main.png')] bg-cover bg-center opacity-20" />
                <div className="relative mx-auto max-w-7xl px-4 text-center">
                    <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur border border-white/20">
                        <span className="text-xl font-extrabold text-white">
                            PORTFOLIO
                        </span>
                    </div>

                    <h1 className="mb-6 text-4xl lg:text-5xl font-bold text-white">
                        Project yang Telah Kami Kerjakan
                    </h1>

                    <p className="mx-auto max-w-3xl text-lg text-blue-100">
                        Lihat berbagai proyek instalasi, maintenance, IT support, dan web development yang telah kami selesaikan dengan hasil memuaskan 
                    </p>
                </div>
            </section>

            {/* ================= PORTFOLIO GRID ================= */}
            <section className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-2">
                        {portfolios?.map((item) => (
                            <Card
                                key={item.id}
                                className="group overflow-hidden transition-all hover:shadow-2xl bg-white"
                            >
                                {/* Image */}
                                <div className="relative aspect-16/10 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                                    {item?.service && (
                                        <div className="absolute bottom-4 left-4">
                                            <span className="rounded-full bg-blue-600 px-3 py-1 text-sm">
                                                {item?.service?.title}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Header */}
                                <CardHeader className='text-black'>
                                    <CardTitle className="text-xl">
                                        {item.title}
                                    </CardTitle>

                                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                                        {item?.client_name && (
                                            <span>{item.client_name}</span>
                                        )}

                                        {item.client_name &&
                                            item.project_date && <span>•</span>}

                                        {item.project_date && (
                                            <span>
                                                {new Date(
                                                    item.project_date
                                                ).getFullYear()}
                                            </span>
                                        )}
                                    </div>

                                    <CardDescription>
                                        {item.short_description ??
                                            item.description}
                                    </CardDescription>
                                </CardHeader>

                                {/* Features */}
                                {item.features &&
                                    item.features.length > 0 && (
                                        <CardContent className='text-black'>
                                            <h4 className="mb-2 font-semibold">
                                                Features
                                            </h4>

                                            <ul className="grid grid-cols-2 gap-2">
                                                {item.features.map(
                                                    (feature, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-2 text-sm"
                                                        >
                                                            <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
                                                            <span>
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </CardContent>
                                    )}
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= STATISTICS ================= */}
            <section className="bg-gray-50 py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="grid gap-8 text-center md:grid-cols-4">
                        <div>
                            <div className="mb-2 text-5xl font-bold text-blue-600">
                                {statistics?.total_projects ?? '180+'}
                            </div>
                            <div className="font-medium text-gray-600">
                                Total Projects
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 text-5xl font-bold text-blue-600">
                                {statistics?.success_rate ?? '95%'}
                            </div>
                            <div className="font-medium text-gray-600">
                                Success Rate
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 text-5xl font-bold text-blue-600">
                                {statistics?.total_clients ?? '150+'}
                            </div>
                            <div className="font-medium text-gray-600">
                                Happy Clients
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 text-5xl font-bold text-blue-600">
                                24/7
                            </div>
                            <div className="font-medium text-gray-600">
                                Support
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 py-16">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h2 className="mb-6 text-3xl lg:text-4xl font-bold text-white">
                        Siap Mengerjakan Project Anda?
                    </h2>

                    <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                        Konsultasikan kebutuhan project Anda dan dapatkan solusi
                        terbaik dari tim kami
                    </p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Button
                            size="lg"
                            className="bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300"
                        >
                            Konsultasi Gratis
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-white font-semibold text-white hover:bg-white hover:text-blue-600"
                        >
                            Hubungi Kami
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
