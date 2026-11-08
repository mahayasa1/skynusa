import { Head, Link } from '@inertiajs/react';
import SEOHead from '@/components/seo-head';
import OrgChart from '@/components/OrgChart';
import PublicLayout from '@/layouts/public-layout';
import {
    Code,
    ArrowRight,
    Users,
    TrendingUp,
    Award,
    Zap,
    Shield,
    HeadphonesIcon,
    CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import { useState, useEffect, useRef, RefObject } from "react";

// Animation Hook
const useIntersectionObserver = <T extends HTMLElement>(
  options: IntersectionObserverInit = {}
): readonly [RefObject<T | null>, boolean] => {
  const elementRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1, ...options }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [elementRef, isVisible] as const;
};

interface Service {
    id: number; title: string; slug: string; description: string;
    icon: string; features: string[]; image: string; order: number;
    is_active: boolean; created_at: string; updated_at: string;
}
interface Portfolio {
    id: number; service_id: number; title: string; slug: string;
    description: string; short_description: string | null; image: string;
    gallery: string[] | null; client_name: string | null; location: string | null;
    project_date: string | null; duration: string | null; technologies: string[] | null;
    features: string[] | null; project_url: string | null; is_active: boolean;
    is_featured: boolean; order: number | null; meta_title: string | null;
    meta_description: string | null; meta_keywords: string | null;
    created_at?: string; updated_at?: string;
    service?: { id: number; title: string; slug: string; };
}
interface Company {
    id: number; name: string; slug: string; logo: string | null; website: string | null;
}
interface IndexPageProps {
    services: Service[]; portfolios: Portfolio[]; companies: Company[];
    hero?: { mode?: 'video' | 'foto' | 'keduanya'; video_url: string | null; poster_url: string | null };
}

const getIconComponent = (iconName: string) => {
    const Icons = LucideIcons as any;
    return Icons[iconName] || LucideIcons.Code;
};

// ISI DENGAN ANGKA ASLI. Dipakai di hero, kartu statistik, dan teks keunggulan
// supaya angkanya tidak beda-beda antar bagian.
const STATS = {
    projects: '188+',
    satisfaction: '95%',
    technicians: '20+',
    years: '10+',
};

const features = [
    { icon: Award, title: 'Standar Profesional', description: 'Mengikuti standar industri terbaik dan prosedur keamanan yang ketat untuk setiap proyek.' },
    { icon: Users, title: 'Tim Berpengalaman', description: 'Teknisi bersertifikasi dengan pengalaman bertahun-tahun di bidang elektronik, AC, IT, dan web.' },
    { icon: Zap, title: 'Respon Cepat', description: 'Respon cepat untuk layanan darurat dan penyelesaian sesuai timeline yang disepakati.' },
    { icon: HeadphonesIcon, title: 'Dukungan Penuh', description: 'Customer support responsif dan maintenance berkala untuk menjaga sistem Anda optimal.' },
    { icon: Shield, title: 'Garansi Terjamin', description: 'Setiap pekerjaan dilengkapi garansi resmi dan jaminan kepuasan klien.' },
    { icon: TrendingUp, title: 'Track Record Terbukti', description: `Lebih dari ${STATS.projects} proyek selesai dengan tingkat kepuasan klien ${STATS.satisfaction}.` }
];

export default function IndexPage({ services, portfolios, companies, hero }: IndexPageProps) {
    const heroPoster = hero?.poster_url ?? '/asset/bg-main.png';
    const heroVideo = hero?.video_url ?? null;
    const heroMode = hero?.mode ?? 'video';
    const showVideo = heroMode !== 'foto';
    const showPhoto = heroMode !== 'video';
    const safePortfolios = Array.isArray(portfolios) ? portfolios : [];
    const safeCompanies = Array.isArray(companies) ? companies : [];
    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>();
    const [servicesRef, servicesVisible] = useIntersectionObserver<HTMLElement>();
    const [portfolioRef, portfolioVisible] = useIntersectionObserver<HTMLElement>();
    const [featuresRef, featuresVisible] = useIntersectionObserver<HTMLElement>();
    const [testimonialsRef, testimonialsVisible] = useIntersectionObserver<HTMLElement>();
    const [teamRef, teamVisible] = useIntersectionObserver<HTMLElement>();

    return (
        <PublicLayout>
            <SEOHead
                title="SKYNUSA TECH - Solusi Instalasi Listrik, AC, IT Support & Web Development Profesional"
                description="SKYNUSA TECH menyediakan layanan instalasi listrik, service AC, IT support, dan web development profesional di Bali."
                keywords="instalasi listrik bali, service ac bali, it support bali, web development bali"
                canonical="https://skynusa-tech.com"
                ogImage="/asset/logo.png"
            />

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInLeft {
                    from { opacity: 0; transform: translateX(-24px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.93); }
                    to { opacity: 1; transform: scale(1); }
                }
                .anim-up   { animation: fadeInUp   0.65s ease-out forwards; }
                .anim-down { animation: fadeInDown 0.65s ease-out forwards; }
                .anim-left { animation: fadeInLeft 0.65s ease-out forwards; }
                .anim-scale{ animation: scaleIn    0.65s ease-out forwards; }
                .d100 { animation-delay: 0.1s; }
                .d200 { animation-delay: 0.2s; }
                .d300 { animation-delay: 0.3s; }
                .d400 { animation-delay: 0.4s; }
                .d500 { animation-delay: 0.5s; }
                .d600 { animation-delay: 0.6s; }
                .hidden-init { opacity: 0; }

                /* ── Org chart structural lines ── */
                .org-v-line {
                    width: 2px;
                    background: rgb(209 213 219);
                    margin: 0 auto;
                }
                /* vertical drop above each mgmt/staff card */
                .org-card-drop {
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 2px;
                    height: 20px;
                    background: rgb(209 213 219);
                }
                /* hide structural lines on mobile */
                @media (max-width: 639px) {
                    .org-card-drop,
                    .org-ceo-drop,
                    .org-mid-drop {
                        display: none;
                    }
                }
            `}</style>

            {/* ── Hero ── */}
            <section id="home" ref={heroRef} className="relative isolate overflow-hidden bg-gray-900 pt-14 sm:pt-16">
                {/* Video latar diatur dari Admin > Hero Beranda. Kalau kosong, pakai public/asset/hero.mp4.
                    Poster tampil saat video belum siap atau user mengaktifkan "reduce motion". */}
                {/* Mode diatur dari Admin > Hero Beranda: video | foto | keduanya.
                    Pada mode "video", foto hanya muncul untuk pengunjung "reduce motion". */}
                <img src={heroPoster} alt="" aria-hidden="true"
                    className={`absolute inset-0 -z-10 h-full w-full object-cover opacity-50 ${showPhoto ? '' : 'hidden motion-reduce:block'}`} />
                {showVideo && (
                    <video key={heroVideo ?? 'static'} autoPlay muted loop playsInline preload="metadata" poster={heroPoster} aria-hidden="true"
                        className={`absolute inset-0 -z-10 h-full w-full object-cover motion-reduce:hidden ${heroMode === 'keduanya' ? 'opacity-40' : 'opacity-50'}`}>
                        {heroVideo ? (
                            <source src={heroVideo} />
                        ) : (
                            <>
                                <source src="/asset/hero.webm" type="video/webm" />
                                <source src="/asset/hero.mp4" type="video/mp4" />
                            </>
                        )}
                    </video>
                )}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-900 via-gray-900/85 to-gray-900/30" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                    <div className="max-w-2xl">
                        <p className={`mb-4 text-sm font-medium text-brand ${heroVisible ? 'anim-down hidden-init' : 'hidden-init'}`}>
                            Teknisi lokal di Jimbaran, Bali
                        </p>
                        <h1 className={`mb-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] ${heroVisible ? 'anim-up hidden-init d100' : 'hidden-init'}`}>
                            Instalasi, AC, IT support, dan website. Satu tim sampai tuntas.
                        </h1>
                        <p className={`mb-8 max-w-xl text-base sm:text-lg text-gray-300 leading-relaxed ${heroVisible ? 'anim-up hidden-init d200' : 'hidden-init'}`}>
                            Dari instalasi listrik dan perawatan AC sampai jaringan kantor dan pembuatan website, untuk rumah, villa, kantor, dan industri.
                        </p>
                        <div className={`flex flex-col sm:flex-row gap-3 ${heroVisible ? 'anim-up hidden-init d300' : 'hidden-init'}`}>
                            <Link href="/kontak"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-semibold text-gray-900 hover:bg-brand-strong transition-colors">
                                Konsultasi gratis <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/portfolio"
                                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors">
                                Lihat portfolio
                            </Link>
                        </div>
                        <dl className={`mt-12 flex gap-10 border-t border-white/15 pt-6 ${heroVisible ? 'anim-up hidden-init d400' : 'hidden-init'}`}>
                            <div>
                                <dd className="font-display text-3xl font-bold text-white">{STATS.projects}</dd>
                                <dt className="mt-1 text-sm text-gray-300">Proyek selesai</dt>
                            </div>
                            <div>
                                <dd className="font-display text-3xl font-bold text-white">{STATS.satisfaction}</dd>
                                <dt className="mt-1 text-sm text-gray-300">Klien puas</dt>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            {/* ── Services ── */}
            <section id="services" ref={servicesRef} className="bg-white py-10 sm:py-14 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className={`mb-8 sm:mb-12 text-center ${servicesVisible ? 'anim-up hidden-init' : 'hidden-init'}`}>
                        <h2 className="mb-2 sm:mb-3 text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">Solusi Teknis Lengkap untuk Kebutuhan Anda</h2>
                        <p className="mx-auto max-w-2xl text-sm sm:text-base text-gray-600">Layanan instalasi, maintenance, IT support, dan web development dengan standar profesional tinggi</p>
                    </div>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        {services && services.length > 0 ? (
                            services.map((service, index) => {
                                const IconComponent = getIconComponent(service.icon);
                                const delays = ['', 'd100', 'd200', 'd300', 'd400', 'd500', 'd600'];
                                return (
                                    <Card key={service.id}
                                        className={`group relative overflow-hidden border-gray-200 bg-white transition-all hover:shadow-xl hover:-translate-y-1 ${servicesVisible ? `anim-scale hidden-init ${delays[Math.min(index, 6)]}` : 'hidden-init'}`}>
                                        <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50"></div>
                                        <CardHeader className="p-4 sm:p-5">
                                            <div className="mb-3 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                                                <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </div>
                                            <CardTitle className="text-base sm:text-lg text-gray-900">{service.title}</CardTitle>
                                            <CardDescription className="text-xs sm:text-sm text-gray-600 leading-relaxed">{service.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 sm:p-5 pt-0">
                                            {service.features && service.features.length > 0 && (
                                                <ul className="space-y-1.5 sm:space-y-2">
                                                    {service.features.slice(0, 3).map((feature, idx) => (
                                                        <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                                                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 shrink-0">
                                                                <CheckCircle className="h-2.5 w-2.5 text-blue-600" />
                                                            </div>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-gray-500 text-sm">Belum ada layanan tersedia.</p>
                            </div>
                        )}
                    </div>
                    {services && services.length > 0 && (
                        <div className={`mt-8 text-center ${servicesVisible ? 'anim-up hidden-init d400' : 'hidden-init'}`}>
                            <Link href="/layanan">
                                <Button size="sm" variant="outline" className="px-6 py-2.5 rounded-full border-gray-900 bg-gray-900 text-white hover:bg-blue-700 hover:border-blue-700 font-semibold text-sm sm:text-base sm:px-8 sm:py-3">
                                    Lihat Semua Layanan
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Portfolio ── */}
            <section id="portfolio" ref={portfolioRef} className="bg-gray-50 py-10 sm:py-14 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className={`mb-8 sm:mb-12 text-center ${portfolioVisible ? 'anim-up hidden-init' : 'hidden-init'}`}>
                        <h2 className="mb-2 sm:mb-3 text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">Project yang Telah Kami Kerjakan</h2>
                        <p className="mx-auto max-w-2xl text-sm sm:text-base text-gray-600">Proyek instalasi, maintenance, IT support, dan web development yang telah kami selesaikan</p>
                    </div>
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                        {safePortfolios.length > 0 ? (
                            safePortfolios.map((item, index) => {
                                const delays = ['', 'd100', 'd200', 'd300', 'd400', 'd500', 'd600'];
                                return (
                                    <Card key={item.id}
                                        className={`group overflow-hidden transition-all hover:shadow-2xl bg-white ${portfolioVisible ? `anim-scale hidden-init ${delays[Math.min(index, 6)]}` : 'hidden-init'}`}>
                                        <div className="relative aspect-video overflow-hidden">
                                            <img src={item?.image ?? '/asset/default.jpg'} alt={item?.title ?? 'Portfolio'}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            {item?.service?.title && (
                                                <div className="absolute bottom-3 left-3">
                                                    <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs text-white font-medium">{item.service.title}</span>
                                                </div>
                                            )}
                                        </div>
                                        <CardHeader className="p-4 pb-2">
                                            <CardTitle className="text-base sm:text-lg text-black">{item?.title ?? 'Untitled Project'}</CardTitle>
                                            <div className="flex flex-wrap gap-1.5 text-xs text-gray-500">
                                                {item?.client_name && <span>{item.client_name}</span>}
                                                {item?.client_name && item?.project_date && <span>•</span>}
                                                {item?.project_date && <span>{new Date(item.project_date).getFullYear()}</span>}
                                            </div>
                                            <CardDescription className="text-xs sm:text-sm">
                                                {item?.short_description ?? item?.description ?? 'No description available.'}
                                            </CardDescription>
                                        </CardHeader>
                                        {Array.isArray(item?.features) && item.features.length > 0 && (
                                            <CardContent className="p-4 pt-0 text-black">
                                                <h4 className="mb-1.5 text-sm font-semibold">Features</h4>
                                                <ul className="grid grid-cols-2 gap-1.5">
                                                    {item.features.map((feature, idx) => (
                                                        <li key={idx} className="flex items-start gap-1.5 text-xs">
                                                            <CheckCircle className="mt-0.5 h-3.5 w-3.5 text-blue-600 shrink-0" />
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        )}
                                    </Card>
                                );
                            })
                        ) : (
                            <p className="text-center text-sm text-gray-500 col-span-full py-10">Belum ada portfolio.</p>
                        )}
                    </div>
                    <div className={`mt-8 text-center ${portfolioVisible ? 'anim-up hidden-init d400' : 'hidden-init'}`}>
                        <Link href="/portfolio">
                            <Button size="sm" variant="outline" className="px-6 py-2.5 rounded-full border-gray-900 bg-gray-900 text-white hover:bg-blue-700 hover:border-blue-700 font-semibold text-sm sm:text-base sm:px-8">
                                Lihat Semua Proyek <ArrowRight className="h-4 w-4 ml-1.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" ref={featuresRef} className="bg-white py-10 sm:py-14 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className={`mb-8 sm:mb-12 text-center ${featuresVisible ? 'anim-up hidden-init' : 'hidden-init'}`}>
                        <h2 className="mb-2 sm:mb-3 text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">Keunggulan Layanan Kami</h2>
                        <p className="mx-auto max-w-2xl text-sm sm:text-base text-gray-600">Keahlian teknis, pengalaman industri, dan pendekatan customer-centric untuk hasil terbaik</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {features.map((feature, index) => {
                            const delays = ['', 'd100', 'd200', 'd300', 'd400', 'd500'];
                            return (
                                <div key={index} className={`flex flex-col items-start gap-3 ${featuresVisible ? `anim-up hidden-init ${delays[Math.min(index, 5)]}` : 'hidden-init'}`}>
                                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-50 shrink-0">
                                        <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{feature.title}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={`mt-10 sm:mt-14 ${featuresVisible ? 'anim-scale hidden-init d400' : 'hidden-init'}`}>
                        <div className="bg-white rounded-2xl shadow-lg py-6 px-4 sm:py-8 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center border border-gray-100">
                            {[
                                { value: STATS.satisfaction, label: 'Kepuasan Klien' },
                                { value: STATS.projects, label: 'Proyek Selesai' },
                                { value: STATS.technicians, label: 'Teknisi Ahli' },
                                { value: STATS.years, label: 'Tahun Berpengalaman' },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{stat.value}</div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-0.5">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section ref={testimonialsRef} className="bg-white py-10 sm:py-14 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className={`text-center text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 ${testimonialsVisible ? 'anim-up hidden-init d100' : 'hidden-init'}`}>
                        Klien yang Telah Bekerja Sama
                    </h2>
                    <p className={`text-center text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 ${testimonialsVisible ? 'anim-up hidden-init d200' : 'hidden-init'}`}>
                        Bergabunglah dengan ratusan klien yang mempercayakan kebutuhan teknis mereka kepada kami.
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 mb-10 sm:mb-16">
                        {safeCompanies.length > 0 ? (
                            safeCompanies.map((company, index) => {
                                const delays = ['', 'd100', 'd200', 'd300', 'd400', 'd500', 'd600'];
                                return (
                                    <div key={company.id} className={`text-center group ${testimonialsVisible ? `anim-scale hidden-init ${delays[Math.min(index, 6)]}` : 'hidden-init'}`}>
                                        <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shadow hover:shadow-md transition-shadow">
                                            {company.logo
                                                ? <img src={company.logo} alt={company.name} className="h-full w-full object-contain p-1.5" />
                                                : <span className="text-gray-400 text-lg font-bold">{company.name.charAt(0)}</span>
                                            }
                                        </div>
                                        <p className="mt-2 text-gray-700 text-xs font-medium group-hover:text-blue-600 transition-colors line-clamp-2">{company.name}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="col-span-full text-center text-sm text-gray-500">Belum ada data klien.</p>
                        )}
                    </div>
                    <div className={`mt-8 text-center ${testimonialsVisible ? 'anim-up hidden-init d500' : 'hidden-init'}`}>
                        <Link href="/kontak">
                            <Button size="sm" variant="outline" className="px-8 py-2.5 rounded-full border-gray-900 bg-gray-900 text-white hover:bg-blue-700 hover:border-blue-700 font-semibold text-sm sm:text-base">
                                Hubungi Kami Sekarang
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Team Section – CSS-only org chart ── */}
            <section id="tim" ref={teamRef} className="bg-gray-50 py-10 sm:py-14 lg:py-20">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className={`mb-8 sm:mb-12 text-center ${teamVisible ? 'anim-up hidden-init' : 'hidden-init'}`}>
                        <h2 className="mb-2 text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">SKYNUSA TEAM</h2>
                        <p className="mx-auto max-w-xl text-sm sm:text-base text-gray-600">Tim profesional yang solid dan berpengalaman untuk kesuksesan project Anda</p>
                    </div>
                    <OrgChart teamVisible={teamVisible} />
                </div>
            </section>

        </PublicLayout>
    );
}