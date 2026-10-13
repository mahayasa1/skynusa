import { Head, Link } from '@inertiajs/react';
import SEOHead from '@/components/seo-head';
import OrgChart from '@/components/OrgChart';
import { 
    ChevronDown,
    Code, 
    ArrowRight,
    Users,
    TrendingUp,
    Award,
    Zap,
    Shield,
    HeadphonesIcon,
    CheckCircle,
    Menu, 
    X,
    LogIn,
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
}

const getIconComponent = (iconName: string) => {
    const Icons = LucideIcons as any;
    return Icons[iconName] || LucideIcons.Code;
};

const features = [
    { icon: Award, title: 'Standar Profesional', description: 'Mengikuti standar industri terbaik dan prosedur keamanan yang ketat untuk setiap proyek.' },
    { icon: Users, title: 'Tim Berpengalaman', description: 'Teknisi bersertifikasi dengan pengalaman bertahun-tahun di bidang elektronik, AC, IT, dan web.' },
    { icon: Zap, title: 'Respon Cepat', description: 'Respon cepat untuk layanan darurat dan penyelesaian sesuai timeline yang disepakati.' },
    { icon: HeadphonesIcon, title: 'Dukungan Penuh', description: 'Customer support responsif dan maintenance berkala untuk menjaga sistem Anda optimal.' },
    { icon: Shield, title: 'Garansi Terjamin', description: 'Setiap pekerjaan dilengkapi garansi resmi dan jaminan kepuasan klien.' },
    { icon: TrendingUp, title: 'Track Record Terbukti', description: 'Lebih dari 300 proyek berhasil dengan tingkat kepuasan klien 95%.' }
];

export default function IndexPage({ services, portfolios, companies }: IndexPageProps) {
    const safePortfolios = Array.isArray(portfolios) ? portfolios : [];
    const safeCompanies = Array.isArray(companies) ? companies : [];
    const [openAbout, setOpenAbout] = useState(false);
    const [openPesanan, setOpenPesanan] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const [mobilePesananOpen, setMobilePesananOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>();
    const [servicesRef, servicesVisible] = useIntersectionObserver<HTMLElement>();
    const [portfolioRef, portfolioVisible] = useIntersectionObserver<HTMLElement>();
    const [featuresRef, featuresVisible] = useIntersectionObserver<HTMLElement>();
    const [testimonialsRef, testimonialsVisible] = useIntersectionObserver<HTMLElement>();
    const [teamRef, teamVisible] = useIntersectionObserver<HTMLElement>();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenAbout(false); setOpenPesanan(false);
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") { setOpenAbout(false); setOpenPesanan(false); }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    // Draw org chart horizontal connector lines

    const closeMobileMenu = () => {
        setMobileMenuOpen(false); setMobileAboutOpen(false); setMobilePesananOpen(false);
    };

    return (
        <>
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

            {/* ── Navigation ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 sm:h-16 items-center justify-between">

                        <Link href="/" className="flex items-center gap-2 shrink-0">
                            <img src="/asset/logo.png" alt="SKYNUSA TECH Logo"
                                className="h-7 sm:h-9 w-auto max-w-[140px] sm:max-w-[200px]" />
                        </Link>

                        {/* Desktop Nav */}
                        <div ref={menuRef} className="hidden lg:flex items-center gap-6">
                            <a href="#home" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                            <a href="#services" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Layanan</a>
                            <a href="#portfolio" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Portfolio</a>

                            <div className="relative">
                                <button onClick={() => { setOpenAbout(!openAbout); setOpenPesanan(false); }}
                                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${openAbout ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}>
                                    About
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openAbout ? "rotate-180" : ""}`} />
                                </button>
                                {openAbout && (
                                    <div className="absolute left-0 mt-2 w-44 rounded-xl border border-gray-100 bg-white shadow-lg z-50">
                                        <div className="py-1">
                                            <a href="/tim" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Tim Kami</a>
                                            <a href="/kontak" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Kontak</a>
                                            <a href="/tentang-kami" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Tentang Kami</a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button onClick={() => { setOpenPesanan(!openPesanan); setOpenAbout(false); }}
                                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${openPesanan ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}>
                                    Pesanan
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openPesanan ? "rotate-180" : ""}`} />
                                </button>
                                {openPesanan && (
                                    <div className="absolute left-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white shadow-lg z-50">
                                        <div className="py-1">
                                            <a href="/pesanan/order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Order Pesanan</a>
                                            <a href="/pesanan/tracking" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Tracking Pesanan</a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <a href="/berita" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Berita</a>
                        </div>

                        <div className="flex items-center gap-2">
                            <a href="/login"
                                className="hidden lg:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow hover:shadow-md transition-all duration-200">
                                <LogIn className="w-3.5 h-3.5" />
                                Login
                            </a>
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
                        <div className="px-3 py-3 space-y-0.5">
                            <a href="#home" onClick={closeMobileMenu} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Home</a>
                            <a href="#services" onClick={closeMobileMenu} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Layanan</a>
                            <a href="#portfolio" onClick={closeMobileMenu} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Portfolio</a>
                            <div>
                                <button onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                                    className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                    About
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAboutOpen ? "rotate-180" : ""}`} />
                                </button>
                                {mobileAboutOpen && (
                                    <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-blue-100 pl-3">
                                        <a href="/tim" onClick={closeMobileMenu} className="block py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">Tim Kami</a>
                                        <a href="/kontak" onClick={closeMobileMenu} className="block py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">Kontak</a>
                                        <a href="/tentang-kami" onClick={closeMobileMenu} className="block py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">Tentang Kami</a>
                                    </div>
                                )}
                            </div>
                            <div>
                                <button onClick={() => setMobilePesananOpen(!mobilePesananOpen)}
                                    className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                    Pesanan
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobilePesananOpen ? "rotate-180" : ""}`} />
                                </button>
                                {mobilePesananOpen && (
                                    <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-blue-100 pl-3">
                                        <a href="/pesanan/order" onClick={closeMobileMenu} className="block py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">Order Pesanan</a>
                                        <a href="/pesanan/tracking" onClick={closeMobileMenu} className="block py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">Tracking Pesanan</a>
                                    </div>
                                )}
                            </div>
                            <a href="/berita" onClick={closeMobileMenu} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Berita</a>
                            <div className="pt-2 mt-1 border-t border-gray-100">
                                <a href="/login" onClick={closeMobileMenu}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow transition-all duration-200">
                                    <LogIn className="w-4 h-4" /> Login
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* ── Hero ── */}
            <section id="home" ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-14 sm:pt-16">
                <div className="absolute inset-0 bg-[url('/asset/bg-main.png')] bg-cover bg-center opacity-15"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
                    <div className="text-start max-w-3xl">
                        <div className={`mb-3 sm:mb-5 inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 ${heroVisible ? 'anim-down hidden-init' : 'hidden-init'}`}>
                            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">SOLUSI TEKNIS TERPERCAYA</span>
                        </div>
                        <h1 className={`mb-3 sm:mb-4 text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight ${heroVisible ? 'anim-left hidden-init d100' : 'hidden-init'}`}>
                            Layanan Instalasi, Maintenance & IT Support Profesional
                        </h1>
                        <p className={`mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg text-blue-100 leading-relaxed ${heroVisible ? 'anim-left hidden-init d200' : 'hidden-init'}`}>
                            Tim teknisi berpengalaman kami siap membantu kebutuhan instalasi elektronik, perawatan AC, maintenance, dukungan IT, dan pembuatan website untuk rumah, kantor, dan industri Anda.
                        </p>
                        <div className={`flex flex-col sm:flex-row gap-3 ${heroVisible ? 'anim-up hidden-init d300' : 'hidden-init'}`}>
                            <Link href="/kontak">
                                <Button size="sm" className="gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold px-5 py-2.5 text-sm w-full sm:w-auto sm:text-base sm:px-6 sm:py-3">
                                    Konsultasi Gratis <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/portfolio">
                                <Button size="sm" variant="outline" className="bg-amber-400 border-amber-400 text-white hover:bg-amber-500 font-semibold px-5 py-2.5 text-sm w-full sm:w-auto sm:text-base sm:px-6 sm:py-3">
                                    Lihat Portfolio
                                </Button>
                            </Link>
                        </div>
                        <div className={`mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-8 border-t border-white/20 pt-6 sm:pt-8 ${heroVisible ? 'anim-up hidden-init d400' : 'hidden-init'}`}>
                            <div>
                                <div className="text-2xl sm:text-4xl font-bold text-white">200+</div>
                                <div className="mt-0.5 text-xs sm:text-sm text-blue-200">Projects Completed</div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-4xl font-bold text-white">98%</div>
                                <div className="mt-0.5 text-xs sm:text-sm text-blue-200">Client Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-6 sm:h-10 bg-gradient-to-b from-transparent to-white"></div>
            </section>

            {/* ── Services ── */}
            <section id="services" ref={servicesRef} className="bg-white py-10 sm:py-14 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className={`mb-8 sm:mb-12 text-center ${servicesVisible ? 'anim-up hidden-init' : 'hidden-init'}`}>
                        <div className="mb-2 sm:mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs sm:text-sm font-semibold text-blue-600">OUR SERVICES</div>
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
                                <Button size="sm" variant="outline" className="px-6 py-2.5 border-gray-300 bg-gray-900 text-white hover:-translate-y-1 font-semibold text-sm sm:text-base sm:px-8 sm:py-3">
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
                        <div className="mb-2 sm:mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs sm:text-sm font-semibold text-blue-600">PORTFOLIO</div>
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
                            <Button size="sm" variant="outline" className="px-6 py-2.5 border-gray-300 bg-gray-900 text-white hover:-translate-y-1 font-semibold text-sm sm:text-base sm:px-8">
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
                        <div className="mb-2 sm:mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs sm:text-sm font-semibold text-blue-600">WHY CHOOSE US</div>
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
                                { value: '95%', label: 'Kepuasan Klien' },
                                { value: '188+', label: 'Proyek Selesai' },
                                { value: '20+', label: 'Teknisi Ahli' },
                                { value: '10+', label: 'Tahun Berpengalaman' },
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
                    <div className={`text-center mb-2 ${testimonialsVisible ? 'anim-down hidden-init' : 'hidden-init'}`}>
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium">Dipercaya Oleh</span>
                    </div>
                    <h2 className={`text-center text-xl sm:text-3xl font-bold text-gray-900 mb-2 mt-3 ${testimonialsVisible ? 'anim-up hidden-init d100' : 'hidden-init'}`}>
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
                    <div className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-3xl mx-auto border border-gray-100 ${testimonialsVisible ? 'anim-up hidden-init d400' : 'hidden-init'}`}>
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">BS</div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Budi Santoso</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">Direktur Operasional, PT Maju Bersama</p>
                            </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-3">
                            "Bekerja dengan Skynusa Tech sangat memuaskan. Tim mereka menyelesaikan instalasi sistem kelistrikan gedung kami dengan profesional dan tepat waktu. Hasil kerja sangat rapi dan sesuai standar."
                        </p>
                        <div className="flex text-yellow-400 text-lg">
                            {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                        </div>
                    </div>
                    <div className={`mt-8 text-center ${testimonialsVisible ? 'anim-up hidden-init d500' : 'hidden-init'}`}>
                        <Link href="/kontak">
                            <Button size="sm" variant="outline" className="px-8 py-2.5 border-gray-300 bg-gray-900 text-white hover:-translate-y-1 font-semibold text-sm sm:text-base">
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
                        <span className="inline-block mb-2 rounded-full bg-blue-100 px-3 py-1 text-xs sm:text-sm font-semibold text-blue-600">OUR TEAM</span>
                        <h2 className="mb-2 text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">SKYNUSA TEAM</h2>
                        <p className="mx-auto max-w-xl text-sm sm:text-base text-gray-600">Tim profesional yang solid dan berpengalaman untuk kesuksesan project Anda</p>
                    </div>
                    <OrgChart teamVisible={teamVisible} />
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-gray-200 bg-gray-900 py-8 sm:py-12 text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-4">
                        <div className="col-span-2 sm:col-span-1">
                            <img src="asset/footer-logo.png" alt="SKYNUSA TECH Logo" className="mb-4 h-7 sm:h-8 w-auto max-w-[160px]" />
                            <p className="text-xs text-gray-400 leading-relaxed">Solusi profesional untuk instalasi, maintenance, IT support, dan web development.</p>
                        </div>
                        <div>
                            <h3 className="mb-3 text-sm font-semibold">Menu Cepat</h3>
                            <ul className="space-y-1.5 text-xs text-gray-400">
                                <li><Link href="/tentang-kami" className="hover:text-blue-400 transition-colors">Tentang Kami</Link></li>
                                <li><Link href="/portfolio" className="hover:text-blue-400 transition-colors">Portfolio</Link></li>
                                <li><Link href="/layanan" className="hover:text-blue-400 transition-colors">Layanan</Link></li>
                                <li><Link href="/tim" className="hover:text-blue-400 transition-colors">Tim Kami</Link></li>
                                <li><Link href="/kontak" className="hover:text-blue-400 transition-colors">Kontak</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-3 text-sm font-semibold">Layanan Kami</h3>
                            <ul className="space-y-1.5 text-xs text-gray-400">
                                <li>Instalasi Elektronik</li>
                                <li>Service AC</li>
                                <li>Maintenance</li>
                                <li>IT Support</li>
                                <li>Web Development</li>
                            </ul>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <h3 className="mb-3 text-sm font-semibold">Hubungi Kami</h3>
                            <ul className="space-y-1.5 text-xs text-gray-400">
                                <li><a href="mailto:Roycegroupbali@gmail.com" className="hover:text-blue-400 transition-colors break-all">Roycegroupbali@gmail.com</a></li>
                                <li><a href="tel:+62881080888361" className="hover:text-blue-400 transition-colors">+62 881-080-888-361</a></li>
                                <li className="leading-relaxed">Royce Group, Purimas Regency 2 Kav 8, Jimbaran, Bali</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
                        <p>Developed by © {new Date().getFullYear()} SKYNUSA TECH.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}