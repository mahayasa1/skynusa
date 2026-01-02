import { Head, Link } from '@inertiajs/react';
import SEOHead from '@/components/seo-head';
import { 
    ChevronDown,
    Code, 
    Database, 
    Globe, 
    Laptop, 
    Server, 
    Shield,
    Smartphone,
    Zap,
    CheckCircle,
    ArrowRight,
    Star,
    Users,
    TrendingUp,
    Award,
    Clock,
    HeadphonesIcon,
    AirVent,
    Wrench,
    Monitor,
    Lightbulb,
    DessertIcon,
    Brush,
    Paperclip,
    Logs,
    Book,
    Menu, 
    X,
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [elementRef, isVisible] as const;
};

// =====================
// Type Definitions
// =====================
interface Service {
    id: number;
    title: string;
    slug: string;
    description: string;
    icon: string;
    features: string[];
    image: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

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
    service?: {
        id: number;
        title: string;
        slug: string;
    };
}

interface Company {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    website: string | null;
}

interface IndexPageProps {
    services: Service[];
    portfolios: Portfolio[];
    companies: Company[];
}

// =====================
// Helper Icon
// =====================
const getIconComponent = (iconName: string) => {
    const Icons = LucideIcons as any;
    return Icons[iconName] || LucideIcons.Code;
};

const features = [
    {
        icon: Award,
        title: 'Standar Profesional',
        description: 'Kami mengikuti standar industri terbaik dan prosedur keamanan yang ketat untuk setiap proyek instalasi dan maintenance.'
    },
    {
        icon: Users,
        title: 'Tim Berpengalaman',
        description: 'Teknisi dan engineer kami memiliki sertifikasi profesional dan pengalaman bertahun-tahun dalam bidang elektronik, AC, IT, dan web development.'
    },
    {
        icon: Zap,
        title: 'Respon Cepat',
        description: 'Kami memberikan respon cepat untuk permintaan layanan darurat dan menyelesaikan pekerjaan sesuai timeline yang disepakati.'
    },
    {
        icon: HeadphonesIcon,
        title: 'Dukungan Penuh',
        description: 'Layanan customer support yang responsif dan maintenance berkala untuk memastikan sistem Anda selalu dalam kondisi optimal'
    },
    {
        icon: Shield,
        title: 'Garansi Terjamin',
        description: 'Setiap pekerjaan kami dilengkapi dengan garansi resmi dan jaminan kepuasan untuk memberikan peace of mind kepada klien'
    },
    {
        icon: TrendingUp,
        title: 'Track Record Terbukti',
        description: 'Lebih dari 300 proyek berhasil dikerjakan dengan tingkat kepuasan klien 95% dan banyak klien yang menjadi pelanggan setia'
    }
];

// Props diterima langsung dari controller
export default function IndexPage({ services, portfolios, companies }: IndexPageProps) {
    const safePortfolios = Array.isArray(portfolios) ? portfolios : [];
    const safeCompanies = Array.isArray(companies) ? companies : [];
    const [openAbout, setOpenAbout] = useState(false);
    const [openPesanan, setOpenPesanan] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const [mobilePesananOpen, setMobilePesananOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement | null>(null);

    // Animation refs
    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>();
    const [servicesRef, servicesVisible] = useIntersectionObserver<HTMLElement>();
    const [portfolioRef, portfolioVisible] = useIntersectionObserver<HTMLElement>();
    const [featuresRef, featuresVisible] = useIntersectionObserver<HTMLElement>();
    const [testimonialsRef, testimonialsVisible] = useIntersectionObserver<HTMLElement>();
    const [teamRef, teamVisible] = useIntersectionObserver<HTMLElement>();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenAbout(false);
                setOpenPesanan(false);
            }
        };

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpenAbout(false);
                setOpenPesanan(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMobileAboutOpen(false);
        setMobilePesananOpen(false);
    };

    return (
        <>
            <SEOHead
                title="SKYNUSA TECH - Solusi Instalasi Listrik, AC, IT Support & Web Development Profesional"
                description="SKYNUSA TECH menyediakan layanan instalasi listrik, service AC, IT support, dan web development profesional di Bali. Teknisi bersertifikat dengan pengalaman 10+ tahun. Hubungi kami untuk konsultasi gratis!"
                keywords="instalasi listrik bali, service ac bali, it support bali, web development bali, maintenance elektronik, jasa teknisi profesional, instalasi cctv, panel listrik, ac central"
                canonical="https://skynusa-tech.com"
                ogImage="/asset/logo.png"
            />
            
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }

                .animate-fade-in-down {
                    animation: fadeInDown 0.8s ease-out forwards;
                }

                .animate-fade-in-left {
                    animation: fadeInLeft 0.8s ease-out forwards;
                }

                .animate-fade-in-right {
                    animation: fadeInRight 0.8s ease-out forwards;
                }

                .animate-scale-in {
                    animation: scaleIn 0.8s ease-out forwards;
                }

                .animate-delay-100 {
                    animation-delay: 0.1s;
                }

                .animate-delay-200 {
                    animation-delay: 0.2s;
                }

                .animate-delay-300 {
                    animation-delay: 0.3s;
                }

                .animate-delay-400 {
                    animation-delay: 0.4s;
                }

                .animate-delay-500 {
                    animation-delay: 0.5s;
                }

                .animate-delay-600 {
                    animation-delay: 0.6s;
                }

                .opacity-0 {
                    opacity: 0;
                }
            `}</style>
            
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white backdrop-blur-md animate-fade-in-down">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="flex items-center gap-2">
                                <img
                                    src="/asset/logo.png"
                                    alt="SKYNUSA TECH Logo"
                                    className="h-8 w-auto sm:h-10 max-w-[180px] sm:max-w-[220px]"
                                />
                            </Link>
                        </div>

                        <div ref={menuRef} className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-4 lg:gap-8">
                            <a href="#home" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                Home
                            </a>
                            <a href="#services" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                Layanan
                            </a>
                            <a href="#portfolio" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                Portfolio
                            </a>

                            <div className="relative">
                                <button 
                                    onClick={() => { 
                                        setOpenAbout(!openAbout); 
                                        setOpenPesanan(false); 
                                    }} 
                                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                                        openAbout ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                                    }`}
                                >
                                    About
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                                        openAbout ? "rotate-180" : ""
                                    }`} />
                                </button>
                                {openAbout && (
                                    <div className="absolute left-0 mt-2 w-44 rounded-xl border bg-white shadow-xl transition-all duration-200 ease-out opacity-0 translate-y-2 scale-95 animate-[fadeIn_.2s_ease-out_forwards]">
                                        <Link href="/tim" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mx-1 my-0.5">
                                            Tim Kami
                                        </Link>
                                        <Link href="/kontak" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mx-1 my-0.5">
                                            Kontak
                                        </Link>
                                        <Link href="/tentang-kami" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mx-1 my-0.5">
                                            Tentang Kami
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button 
                                    onClick={() => { 
                                        setOpenPesanan(!openPesanan); 
                                        setOpenAbout(false); 
                                    }} 
                                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                                        openPesanan ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                                    }`}
                                >
                                    Pesanan
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                                        openPesanan ? "rotate-180" : ""
                                    }`} />
                                </button>
                                {openPesanan && (
                                    <div className="absolute left-0 mt-2 w-56 rounded-xl border bg-white shadow-xl transition-all duration-200 ease-out opacity-0 translate-y-2 scale-95 animate-[fadeIn_.2s_ease-out_forwards]">
                                        <Link href="/pesanan/order" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mx-1 my-0.5">
                                            Order Pesanan
                                        </Link>
                                        <Link href="/pesanan/tracking" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mx-1 my-0.5">
                                            Tracking Pesanan
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link href="/berita" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                Berita
                            </Link>
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white">
                        <div className="px-4 py-4 space-y-1">
                            <a 
                                href="#home" 
                                onClick={closeMobileMenu}
                                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                            >
                                Home
                            </a>
                            <a 
                                href="#services" 
                                onClick={closeMobileMenu}
                                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                            >
                                Layanan
                            </a>
                            <a 
                                href="#portfolio" 
                                onClick={closeMobileMenu}
                                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                            >
                                Portfolio
                            </a>

                            <div>
                                <button
                                    onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                                    className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                >
                                    <span>About</span>
                                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                                        mobileAboutOpen ? "rotate-180" : ""
                                    }`} />
                                </button>
                                {mobileAboutOpen && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        <Link 
                                            href="/tim" 
                                            onClick={closeMobileMenu}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                        >
                                            Tim Kami
                                        </Link>
                                        <Link 
                                            href="/kontak" 
                                            onClick={closeMobileMenu}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                        >
                                            Kontak
                                        </Link>
                                        <Link 
                                            href="/tentang-kami" 
                                            onClick={closeMobileMenu}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                        >
                                            Tentang Kami
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div>
                                <button
                                    onClick={() => setMobilePesananOpen(!mobilePesananOpen)}
                                    className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                >
                                    <span>Pesanan</span>
                                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                                        mobilePesananOpen ? "rotate-180" : ""
                                    }`} />
                                </button>
                                {mobilePesananOpen && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        <Link 
                                            href="/pesanan/order" 
                                            onClick={closeMobileMenu}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                        >
                                            Order Pesanan
                                        </Link>
                                        <Link 
                                            href="/pesanan/tracking" 
                                            onClick={closeMobileMenu}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                        >
                                            Tracking Pesanan
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link 
                                href="/berita" 
                                onClick={closeMobileMenu}
                                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                            >
                                Berita
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="home" ref={heroRef} className="relative overflow-hidden bg-linear-to-br from-blue-600/50 via-blue-700/50 to-indigo-800/50 pt-18">
                <div className="absolute inset-0 bg-[url('asset/bg-main.png')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0"></div>
                <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-20 lg:py-24 sm:px-6 lg:px-8">
                    <div className="text-start">
                        <div className={`mb-4 sm:mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 ${heroVisible ? 'animate-fade-in-down opacity-0' : 'opacity-0'}`}>
                            <span className="text-xs sm:text-2xl font-extrabold text-white">SOLUSI TEKNIS TERPERCAYA</span>
                        </div>
                        <p className={`mb-6 sm:mb-6 max-w-3xl text-base sm:text-lg lg:text-xl text-blue-100 px-4 py-2 ${heroVisible ? 'animate-fade-in-left opacity-0 animate-delay-100' : 'opacity-0'}`}>
                            Layanan Instalasi, Maintenance & IT Support Profesional
                        </p>
                        <p className={`mb-6 sm:mb-12 max-w-4xl text-base sm:text-lg lg:text-xl text-blue-100 px-4 py-2 ${heroVisible ? 'animate-fade-in-left opacity-0 animate-delay-200' : 'opacity-0'}`}>
                            Kami adalah tim teknisi berpengalaman yang siap membantu kebutuhan instalasi elektronik, perawatan AC, maintenance perangkat, dukungan IT, dan pembuatan website untuk rumah, kantor, dan industri Anda.
                        </p>
                        <div className={`flex flex-col sm:flex-row flex-wrap justify-start gap-3 sm:gap-20 px-4 ${heroVisible ? 'animate-fade-in-up opacity-0 animate-delay-300' : 'opacity-0'}`}>
                            <Link href="/kontak">
                                <Button size="lg" className="gap-2 bg-white text-blue-600 hover:bg-blue-800 hover:text-white font-semibold px-6 sm:px-8 w-full sm:w-auto">
                                    <span className="text-sm sm:text-base">Mulai Konsultasi Gratis</span>
                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>
                            </Link>
                            <Link href="/portfolio">
                                <Button size="lg" variant="outline" className="bg-amber-400 text-white hover:bg-blue-800 hover:text-white font-semibold px-6 sm:px-8 w-full sm:w-auto">
                                    <span className="text-sm sm:text-base">Lihat Portfolio</span>
                                </Button>
                            </Link>
                        </div>
                        <div className={`mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 sm:gap-20 border-t border-white/20 pt-8 sm:pt-12 px-4 ${heroVisible ? 'animate-fade-in-up opacity-0 animate-delay-400' : 'opacity-0'}`}>
                            <div>
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">200+</div>
                                <div className="mt-1 sm:mt-2 text-xs sm:text-3xl text-blue-200">Projects Completed</div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">98%</div>
                                <div className="mt-1 sm:mt-2 text-xs sm:text-3xl text-blue-200">Client Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-8 sm:h-12 bg-linear-to-b from-transparent to-white"></div>
            </section>

            {/* SERVICES SECTION */}
            <section id="services" ref={servicesRef} className="bg-white py-12 sm:py-16 lg:py-20 px-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className={`mb-10 sm:mb-12 lg:mb-16 text-center ${servicesVisible ? 'animate-fade-in-up opacity-0' : 'opacity-0'}`}>
                        <div className="mb-3 sm:mb-4 inline-block rounded-full bg-blue-100 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-blue-600">
                            OUR SERVICES
                        </div>
                        <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-4xl font-bold tracking-tight text-gray-900 px-4">
                            Solusi Teknis Lengkap untuk Kebutuhan Anda
                        </h2>
                        <p className="mx-auto max-w-4xl text-sm sm:text-base lg:text-lg text-gray-600 px-4">
                            Kami Menyediakan berbagai layanan instalasi, maintenance, IT support, dan web development dengan standar profesional tinggi
                        </p>
                    </div>
                    
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                        {services && services.length > 0 ? (
                            services.map((service, index) => {
                                const IconComponent = getIconComponent(service.icon);
                                return (
                                    <Card 
                                        key={service.id} 
                                        className={`group relative overflow-hidden border-gray-200 bg-white transition-all hover:shadow-xl hover:-translate-y-1 ${servicesVisible ? `animate-scale-in opacity-0 animate-delay-${Math.min(index * 100, 600)}` : 'opacity-0'}`}
                                    >
                                        <div className="absolute top-0 right-0 h-24 w-24 sm:h-32 sm:w-32 bg-linear-to-br from-blue-50 to-transparent rounded-bl-full opacity-50"></div>
                                        
                                        <CardHeader className="p-4 sm:p-6">
                                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white">
                                                <IconComponent className="h-7 w-7" />
                                            </div>
                                            
                                            <CardTitle className="text-lg sm:text-xl text-gray-900">
                                                {service.title}
                                            </CardTitle>
                                            
                                            <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                                {service.description || service.description}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="p-4 sm:p-6 pt-0">
                                            {service.features && service.features.length > 0 && (
                                                <ul className="space-y-2 sm:space-y-3">
                                                    {service.features.slice(0, 3).map((feature, idx) => (
                                                        <li key={idx} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
                                                            <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-blue-100 shrink-0">
                                                                <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-600" />
                                                            </div>
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </CardContent>
                                    </Card>
                                )})
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">Belum ada layanan tersedia.</p>
                            </div>
                        )}
                    </div>

                    {services && services.length > 0 && (
                        <div className={`mt-8 sm:mt-12 text-center ${servicesVisible ? 'animate-fade-in-up opacity-0 animate-delay-400' : 'opacity-0'}`}>
                            <Link href="/layanan">
                                <Button 
                                    size="lg" 
                                    variant="outline" 
                                    className="px-9 py-7 border-gray-300 bg-gray-900 text-white hover:-translate-y-1 font-semibold w-full sm:w-auto"
                                >
                                    Lihat Semua Layanan
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Portfolio Section */}
            <section id="portfolio" ref={portfolioRef} className="bg-gray-50 py-12 sm:py-16 lg:py-20 px-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className={`mb-10 sm:mb-12 lg:mb-16 text-center ${portfolioVisible ? 'animate-fade-in-up opacity-0' : 'opacity-0'}`}>
                        <div className="mb-3 sm:mb-4 inline-block rounded-full bg-blue-100 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-blue-600">
                            PORTFOLIO
                        </div>
                        <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-3xl font-bold tracking-tight text-gray-900 px-4">
                            Project yang Telah Kami Kerjakan
                        </h2>
                        <p className="mx-auto max-w-1xl text-sm sm:text-base lg:text-lg text-gray-600 px-4">
                            Lihat berbagai proyek instalasi, maintenance, IT support, dan web development yang telah kami selesaikan dengan hasil memuaskan
                        </p>
                    </div>
                    
                    <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                        {safePortfolios.length > 0 ? (
                            safePortfolios.map((item, index) => (
                                <Card
                                    key={item.id}
                                    className={`group overflow-hidden transition-all hover:shadow-2xl bg-white ${portfolioVisible ? `animate-scale-in opacity-0 animate-delay-${Math.min(index * 100, 600)}` : 'opacity-0'}`}
                                >
                                    <div className="relative aspect-16/10 overflow-hidden">
                                        <img
                                            src={item?.image ?? '/asset/default.jpg'}
                                            alt={item?.title ?? 'Portfolio'}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                                        {item?.service?.title && (
                                            <div className="absolute bottom-4 left-4">
                                                <span className="rounded-full bg-blue-600 px-3 py-1 text-sm">
                                                    {item.service.title}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <CardHeader className="text-black">
                                        <CardTitle className="text-xl">
                                            {item?.title ?? 'Untitled Project'}
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                                            {item?.client_name && <span>{item.client_name}</span>}
                                            {item?.client_name && item?.project_date && <span>•</span>}
                                            {item?.project_date && (
                                                <span>{new Date(item.project_date).getFullYear()}</span>
                                            )}
                                        </div>
                                        <CardDescription>
                                            {item?.short_description ??
                                                item?.description ??
                                                'No description available.'}
                                        </CardDescription>
                                    </CardHeader>
                                            
                                    {Array.isArray(item?.features) && item.features.length > 0 && (
                                        <CardContent className="text-black">
                                            <h4 className="mb-2 font-semibold">Features</h4>
                                            <ul className="grid grid-cols-2 gap-2">
                                                {item.features.map((feature, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-start gap-2 text-sm"
                                                    >
                                                        <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 col-span-full">
                                Belum ada portfolio.
                            </p>
                        )}
                    </div>
                    
                    <div className={`mt-8 sm:mt-12 text-center ${portfolioVisible ? 'animate-fade-in-up opacity-0 animate-delay-400' : 'opacity-0'}`}>
                        <Link href="/portfolio">
                            <Button size="lg" variant="outline" className="px-9 py-3 border-gray-300 bg-gray-900 text-white hover:-translate-y-1 font-semibold w-full sm:w-auto">
                                Lihat Semua Proyek
                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" ref={featuresRef} className="bg-white py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className={`mb-12 text-center ${featuresVisible ? 'animate-fade-in-up opacity-0' : 'opacity-0'}`}>
                        <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-600">
                            WHY CHOOSE US
                        </div>
                        <h2 className="mb-3 text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                            Keunggulan Layanan Kami
                        </h2>
                        <p className="mx-auto max-w-1xl text-base text-gray-600">
                            Kami menggabungkan keahlian teknis, pengalaman industri, dan pendekatan customer-centric untuk memberikan hasil terbaik
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {features.map((feature, index) => (
                            <div key={index} className={`flex flex-col items-start gap-4 ${featuresVisible ? `animate-fade-in-up opacity-0 animate-delay-${Math.min(index * 100, 600)}` : 'opacity-0'}`}>
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50">
                                    <feature.icon className="h-7 w-7 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className={`mt-16 mx-auto w-full sm:w-11/12 lg:w-9/12 ${featuresVisible ? 'animate-scale-in opacity-0 animate-delay-400' : 'opacity-0'}`}>
                        <div className="bg-white rounded-3xl shadow-xl py-8 px-6 flex flex-col sm:flex-row items-center justify-between text-center gap-8">
                            <div>
                                <div className="text-blue-600 text-xl font-bold">95%</div>
                                <div className="text-gray-700 text-sm mt-1">Kepuasan Klien</div>
                            </div>
                            <div>
                                <div className="text-blue-600 text-xl font-bold">188+</div>
                                <div className="text-gray-700 text-sm mt-1">Proyek Selesai</div>
                            </div>
                            <div>
                                <div className="text-blue-600 text-xl font-bold">20+</div>
                                <div className="text-gray-700 text-sm mt-1">Teknisi Ahli</div>
                            </div>
                            <div>
                                <div className="text-blue-600 text-xl font-bold">10+</div>
                                <div className="text-gray-700 text-sm mt-1">Tahun Berpengalaman</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section ref={testimonialsRef} className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-4 ${testimonialsVisible ? 'animate-fade-in-down opacity-0' : 'opacity-0'}`}>
                        <span className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                            Dipercaya Oleh
                        </span>
                    </div>
                    
                    <h2 className={`text-center text-3xl font-bold text-gray-900 mb-2 ${testimonialsVisible ? 'animate-fade-in-up opacity-0 animate-delay-100' : 'opacity-0'}`}>
                        Klien yang Telah Bekerja Sama dengan Kami
                    </h2>
                    
                    <p className={`text-center max-w-1xl mx-auto text-gray-600 mb-12 ${testimonialsVisible ? 'animate-fade-in-up opacity-0 animate-delay-200' : 'opacity-0'}`}>
                        Bergabunglah dengan ratusan klien yang puas dan mempercayakan kebutuhan teknis mereka kepada kami.
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
                        {safeCompanies.length > 0 ? (
                            safeCompanies.map((company, index) => (
                                <div key={company.id} className={`text-center group ${testimonialsVisible ? `animate-scale-in opacity-0 animate-delay-${Math.min(index * 100, 600)}` : 'opacity-0'}`}>
                                    <div className="mx-auto h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden shadow hover:shadow-lg transition-shadow">
                                        {company.logo ? (
                                            <img 
                                                src={company.logo} 
                                                alt={company.name}
                                                className="h-full w-full object-contain p-2"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-2xl font-bold">
                                                {company.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-3 text-gray-700 text-sm font-medium group-hover:text-blue-600 transition-colors">
                                        {company.name}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">
                                Belum ada data klien.
                            </p>
                        )}
                    </div>
                    
                    <div className={`bg-white rounded-3xl shadow-xl p-8 md:p-10 max-w-4xl mx-auto border border-gray-100 ${testimonialsVisible ? 'animate-fade-in-up opacity-0 animate-delay-400' : 'opacity-0'}`}>
                        <div className="flex items-start gap-4 mb-6">
                            <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                BS
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">Budi Santoso</h3>
                                <p className="text-gray-600 text-sm">Direktur Operasional, PT Maju Bersama</p>
                            </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4 text-base">
                            "Bekerja dengan Skynusa Tech sangat memuaskan. Tim mereka menyelesaikan instalasi sistem kelistrikan gedung kami dengan profesional dan tepat waktu. Hasil kerja sangat rapi dan sesuai standar. Kami sangat merekomendasikan layanan mereka."
                        </p>
                        <div className="flex text-yellow-400 text-2xl mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>★</span>
                            ))}
                        </div>
                    </div>
                    
                    <div className={`mt-8 sm:mt-12 text-center ${testimonialsVisible ? 'animate-fade-in-up opacity-0 animate-delay-500' : 'opacity-0'}`}>
                        <Link href="/kontak">
                            <Button size="lg" variant="outline" className="px-14 py-7 border-gray-300 bg-gray-900 text-white hover:-translate-y-1 font-semibold w-full sm:w-auto">
                                Hubungi Kami Sekarang
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section id="tim" ref={teamRef} className="bg-white py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className={`mb-12 lg:mb-16 text-center ${teamVisible ? 'animate-fade-in-up opacity-0' : 'opacity-0'}`}>
                        <span className="inline-block mb-4 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-600">
                            OUR TEAM
                        </span>
                        <h2 className="mb-4 text-3xl lg:text-5xl font-bold tracking-tight text-gray-900">
                            SKYNUSA TEAM
                        </h2>
                        <p className="mx-auto max-w-2xl text-base lg:text-lg text-gray-600">
                            Tim profesional yang solid dan berpengalaman untuk kesuksesan project Anda
                        </p>
                    </div>
                    
                    <div className="relative">
                        {/* CEO */}
                        <div className="flex justify-center mb-12">
                            <div className={`relative ${teamVisible ? 'animate-fade-in-down opacity-0 animate-delay-100' : 'opacity-0'}`}>
                                <Card className="w-64 sm:w-72 border-2 border-blue-600 bg-linear-to-br from-blue-50/80 to-white shadow-xl hover:shadow-2xl transition">
                                    <CardContent className="p-6 text-center">
                                        <div className="h-20 w-20 rounded-full overflow-hidden bg-blue-600/20 mx-auto mb-4 shadow">
                                            <img src="asset/royce.png" className="w-full h-full object-cover" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Royce Francis M.M</h3>
                                        <p className="text-base font-semibold text-blue-600 mb-1">CEO & Founder</p>
                                        <p className="text-xs text-gray-600 mb-3">Business Strategy</p>
                                    </CardContent>
                                </Card>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full h-8 w-0.5 bg-blue-300"></div>
                            </div>
                        </div>
                        
                        <div className="flex justify-center mb-12">
                            <div className="w-full max-w-5xl h-0.5 bg-blue-300"></div>
                        </div>
                        
                        {/* SECOND LEVEL */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto mb-8">
                            {[
                                { name: 'Mahayasa Wibawa', role: 'Chief Technology Officer', subRole: 'Technical Leadership', img: 'asset/id.png', color: 'blue' },
                                { name: 'Arnold Tamelan', role: 'Head of Operations', subRole: 'Project Management', img: 'asset/arnold.jpeg', color: 'indigo' },
                                { name: 'Bagus Wisnu', role: 'Head of Design', subRole: 'UI/UX & Creative', img: 'asset/bgw.jpg', color: 'purple' },
                                { name: 'Hassan', role: 'Head of Engineer', subRole: 'Electronic Engineering', img: 'asset/hassan.jpeg', color: 'red' },
                                { name: 'Frans', role: 'Head of Internet of Things', subRole: 'Electrical Insatalation', img: 'asset/frans.jpg', color: 'red' }
                            ].map((member, index) => (
                                <div key={index} className={`relative ${teamVisible ? `animate-fade-in-up opacity-0 animate-delay-${200 + index * 100}` : 'opacity-0'}`}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-blue-300"></div>
                                    <Card className={`border-2 border-${member.color}-500 bg-white shadow-lg hover:shadow-xl transition`}>
                                        <CardContent className="p-6 text-center">
                                            <div className="h-20 w-20 rounded-full overflow-hidden bg-blue-600/20 mx-auto mb-4 shadow">
                                                <img src={member.img} className="w-full h-full object-cover" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                                            <p className={`text-sm font-semibold text-${member.color}-600 mb-1`}>{member.role}</p>
                                            <p className="text-xs text-gray-600">{member.subRole}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex justify-start mb-10">
                            <div className="ml-8 w-60 h-0.5 bg-blue-300"></div>
                            <div className="ml-12 w-65 h-0.5 bg-blue-300"></div>
                            <div className="ml-8 w-64 h-0.5 bg-blue-300"></div>
                            <div className="ml-12 w-65 h-0.5 bg-blue-300"></div>
                        </div>
                        
                        {/* THIRD LEVEL */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {[
                                { name: 'Rudi', role: 'Front-end Developer', image: '/asset/profile.png' },
                                { name: 'Anjani', role: 'Administrator', image: '/asset/profile.png' },
                                { name: 'Agus Surya', role: 'UI/UX Designer', image: '/asset/agus.jpg' },
                                { name: 'Rihaf', role: 'Lighting Installation', image: '/asset/profile.png' },
                            ].map((m, i) => (
                                <div key={i} className={`relative ${teamVisible ? `animate-scale-in opacity-0 animate-delay-${400 + i * 100}` : 'opacity-0'}`}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-blue-300"></div>
                                    <Card className="border border-gray-200 bg-white hover:shadow-md transition">
                                        <CardContent className="p-4 text-center">
                                            <div className="h-14 w-14 rounded-full overflow-hidden mx-auto mb-3 shadow">
                                                <img 
                                                    src={m.image} 
                                                    alt={m.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-900">{m.name}</h3>
                                            <p className="text-xs text-gray-600">{m.role}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gray-900 py-8 sm:py-12 text-white animate-fade-in-up">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <img src="asset/footer-logo.png" alt="SKYNUSA TECH Logo" className="mb-5 h-8 w-auto sm:h-8 max-w-[180px] sm:max-w-[220px]" />
                            </div>
                            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                                Solusi profesional untuk instalasi, maintenance, IT support, dan web development.
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold">Menu Cepat</h3>
                            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                                <li><Link href="/tentang-kami" className="hover:text-blue-400 transition-colors">Tentang Kami</Link></li>
                                <li><Link href="#portfolio" className="hover:text-blue-400 transition-colors">Portfolio</Link></li>
                                <li><Link href="#layanan" className="hover:text-blue-400 transition-colors">Layanan</Link></li>
                                <li><Link href="#tim" className="hover:text-blue-400 transition-colors">Tim Kami</Link></li>
                                <li><Link href="/kontak" className="hover:text-blue-400 transition-colors">Kontak</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold">Layanan Kami</h3>
                            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Instalasi Elektronik</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Service AC</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Maintenance</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">IT Support</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Web Development</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold">Hubungi Kami</h3>
                            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                                <li>
                                    <a href="mailto:Roycegroupbali@gmail.com" className="hover:text-blue-400 transition-colors">
                                        Email: Roycegroupbali@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+62881080888361" className="hover:text-blue-400 transition-colors">
                                        Phone: +62 881-080-888-361
                                    </a>
                                </li>
                                <li>Royce Group, Purimas Regency 2 Kav 8, Jimbaran, Bali</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-6 sm:mt-8 lg:mt-12 border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-500">
                        <p>Developed by © 2025 SKYNUSA TECH.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}