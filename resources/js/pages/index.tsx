import { Link } from '@inertiajs/react';
import SEOHead from '@/components/seo-head';
import OrgChart from '@/components/OrgChart';
import PublicLayout from '@/layouts/public-layout';
import {
    ArrowRight,
    Users,
    TrendingUp,
    Award,
    Zap,
    Shield,
    HeadphonesIcon,
    CheckCircle,
    MapPin,
    MessageCircle,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useState, useRef, useEffect, type ComponentType, type RefObject } from 'react';
import Reveal from '@/components/reveal';
import NetworkField from '@/components/fx/network-field';
import TiltCard from '@/components/fx/tilt-card';
import CountUp from '@/components/fx/count-up';
import Magnetic from '@/components/fx/magnetic';
import CircuitDivider from '@/components/fx/circuit-divider';
import BaliFootprint, { type FootprintProject } from '@/components/bali-footprint';

// Hook untuk animasi OrgChart (dipertahankan dari versi sebelumnya)
const useIntersectionObserver = <T extends HTMLElement>(
    options: IntersectionObserverInit = {},
): readonly [RefObject<T | null>, boolean] => {
    const elementRef = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1, ...options },
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
    service?: { id: number; title: string; slug: string };
}
interface Company {
    id: number; name: string; slug: string; logo: string | null; website: string | null;
}
interface IndexPageProps {
    services: Service[]; portfolios: Portfolio[]; companies: Company[];
    footprint?: FootprintProject[];
    hero?: { mode?: 'video' | 'foto' | 'keduanya'; video_url: string | null; poster_url: string | null };
}

const getIconComponent = (iconName: string) => {
    const Icons = LucideIcons as unknown as Record<string, ComponentType<{ className?: string }>>;
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
    { icon: TrendingUp, title: 'Track Record Terbukti', description: `Lebih dari ${STATS.projects} proyek selesai dengan tingkat kepuasan klien ${STATS.satisfaction}.` },
];

const SKYBOT_QUESTIONS = ['Pasang CCTV butuh apa saja?', 'Website butuh apa saja?', 'Bagaimana cara memesan?'];

/** Membuka widget Skybot (ai-chat-widget.tsx mendengarkan event ini). */
const openSkybot = (question?: string) => {
    window.dispatchEvent(new CustomEvent('skybot:open', { detail: { question } }));
};

export default function IndexPage({ services, portfolios, companies, footprint, hero }: IndexPageProps) {
    const heroPoster = hero?.poster_url ?? '/asset/bg-main.png';
    const heroVideo = hero?.video_url ?? null;
    const heroMode = hero?.mode ?? 'video';
    const showVideo = heroMode !== 'foto';
    const showPhoto = heroMode !== 'video';
    const safeServices = Array.isArray(services) ? services : [];
    const safePortfolios = Array.isArray(portfolios) ? portfolios : [];
    const safeCompanies = Array.isArray(companies) ? companies : [];
    const safeFootprint = Array.isArray(footprint) ? footprint : [];
    const [teamRef, teamVisible] = useIntersectionObserver<HTMLElement>();
    const [filter, setFilter] = useState<string>('all');

    const serviceFilters = Array.from(
        new Set(safePortfolios.map((p) => p.service?.title).filter((t): t is string => Boolean(t))),
    );
    const filtered = safePortfolios.filter((p) => filter === 'all' || p.service?.title === filter);
    const visiblePortfolios = filter === 'all' ? filtered.slice(0, 6) : filtered;

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
            <section id="home" className="relative isolate overflow-hidden bg-gradient-to-b from-white via-blue-50 to-blue-100 pt-14 sm:pt-16">
                <div className="bg-grid-tech absolute inset-0 -z-10" aria-hidden="true" />
                <NetworkField className="absolute inset-0 -z-10 h-full w-full" />

                <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:py-28">
                    <div className="max-w-2xl">
                        <Reveal>
                            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-sm font-medium text-blue-700 backdrop-blur">
                                <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
                                Teknisi lokal di Jimbaran, Bali
                            </p>
                        </Reveal>
                        <Reveal delay={80}>
                            <h1 className="mb-5 text-4xl font-bold leading-[1.05] text-gray-900 sm:text-5xl lg:text-6xl">
                                Instalasi, AC, IT support, dan website. Satu tim sampai tuntas.
                            </h1>
                        </Reveal>
                        <Reveal delay={160}>
                            <p className="mb-8 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
                                Dari instalasi listrik dan perawatan AC sampai jaringan kantor dan pembuatan website, untuk rumah, villa, kantor, dan industri.
                            </p>
                        </Reveal>
                        <Reveal delay={240}>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Magnetic>
                                    <Link
                                        href="/kontak"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-gray-900 shadow-[0_10px_30px_-10px_rgba(255,157,50,0.9)] hover:bg-brand-strong sm:w-auto"
                                    >
                                        Konsultasi gratis <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>
                                </Magnetic>
                                <Magnetic>
                                    <Link
                                        href="/portfolio"
                                        className="inline-flex w-full items-center justify-center rounded-full border border-blue-600/40 bg-white/70 px-7 py-3.5 text-base font-semibold text-blue-700 backdrop-blur hover:border-blue-600 hover:bg-white sm:w-auto"
                                    >
                                        Lihat portfolio
                                    </Link>
                                </Magnetic>
                            </div>
                        </Reveal>
                        <Reveal delay={320}>
                            <dl className="mt-12 flex gap-10 border-t border-blue-200 pt-6">
                                <div>
                                    <dd className="font-display text-3xl font-bold text-blue-600">{STATS.projects}</dd>
                                    <dt className="mt-1 text-sm text-gray-500">Proyek selesai</dt>
                                </div>
                                <div>
                                    <dd className="font-display text-3xl font-bold text-blue-600">{STATS.satisfaction}</dd>
                                    <dt className="mt-1 text-sm text-gray-500">Klien puas</dt>
                                </div>
                            </dl>
                        </Reveal>
                    </div>

                    {/* Visual: bingkai HUD + media dari Admin > Hero Beranda + maskot */}
                    <Reveal delay={200} className="relative mx-auto w-full max-w-xl lg:max-w-none">
                        <div className="hud-frame relative">
                            <div className="relative aspect-[4/3.3] overflow-hidden rounded-3xl border border-blue-200 bg-blue-100 shadow-[0_30px_80px_-30px_rgba(22,119,232,0.55)]">
                                {/* Mode diatur dari Admin > Hero Beranda: video | foto | keduanya. */}
                                <img
                                    src={heroPoster}
                                    alt=""
                                    aria-hidden="true"
                                    className={`absolute inset-0 h-full w-full object-cover ${showPhoto ? '' : 'hidden motion-reduce:block'}`}
                                />
                                {showVideo && (
                                    <video
                                        key={heroVideo ?? 'static'}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        poster={heroPoster}
                                        aria-hidden="true"
                                        className={`absolute inset-0 h-full w-full object-cover motion-reduce:hidden ${heroMode === 'keduanya' ? 'opacity-70' : ''}`}
                                    >
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
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 via-transparent to-neon/25 mix-blend-multiply" aria-hidden="true" />
                                <div className="scanline" aria-hidden="true" />

                                <p className="caret absolute left-3 top-3 z-[4] rounded-md bg-white/90 px-2.5 py-1 font-mono text-[11px] text-blue-700 shadow backdrop-blur sm:text-xs">
                                    &gt; beyond technology. beyond limits.
                                </p>

                                {safeServices.length > 0 && (
                                    <ul className="absolute bottom-3 right-3 z-[4] flex flex-col items-end gap-1.5">
                                        {safeServices.slice(0, 3).map((s) => (
                                            <li key={s.id} className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 shadow backdrop-blur">
                                                {s.title}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <img
                                src="/asset/skybot.png"
                                alt="Skybot, maskot SKYNUSA TECH"
                                width={240}
                                height={230}
                                className="absolute -bottom-8 -left-3 z-10 w-28 animate-[float-y_4s_ease-in-out_infinite] drop-shadow-[0_14px_20px_rgba(11,36,71,0.35)] motion-reduce:animate-none sm:-left-10 sm:w-40 lg:w-44"
                            />
                        </div>
                    </Reveal>
                </div>
                <CircuitDivider className="absolute inset-x-0 bottom-0" />
            </section>

            {/* ── Layanan / Expertise ── */}
            <section id="services" className="bg-blue-50 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="mb-10 text-center sm:mb-14">
                        <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                            Solusi Teknis Lengkap untuk Kebutuhan Anda
                        </h2>
                        <p className="mx-auto max-w-2xl text-base text-gray-500 sm:text-lg">
                            Layanan instalasi, maintenance, IT support, dan web development dengan standar profesional tinggi
                        </p>
                    </Reveal>

                    {safeServices.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {safeServices.map((service, index) => {
                                const Icon = getIconComponent(service.icon);
                                return (
                                    <Reveal key={service.id} delay={Math.min(index, 5) * 70} className="h-full">
                                        <TiltCard className="glow-card flex h-full flex-col rounded-2xl p-6">
                                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[0_8px_20px_-8px_rgba(22,119,232,0.8)]">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="mb-2 text-lg font-semibold text-gray-900">{service.title}</h3>
                                            <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-500">{service.description}</p>
                                            {service.features && service.features.length > 0 && (
                                                <ul className="mb-5 space-y-2">
                                                    {service.features.slice(0, 3).map((feature, idx) => (
                                                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-800">
                                                            <CheckCircle className="h-4 w-4 shrink-0 text-neon" aria-hidden="true" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <Link
                                                href={`/layanan/${service.slug}`}
                                                className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 after:absolute after:inset-0 after:rounded-2xl hover:text-blue-700"
                                            >
                                                Lihat detail <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                            </Link>
                                        </TiltCard>
                                    </Reveal>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="py-10 text-center text-sm text-gray-500">Belum ada layanan tersedia.</p>
                    )}

                    {safeServices.length > 0 && (
                        <div className="mt-10 text-center">
                            <Link
                                href="/layanan"
                                className="inline-flex items-center rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:text-base"
                            >
                                Lihat Semua Layanan
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Portfolio ── */}
            <section id="portfolio" className="bg-white py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="mb-8 text-center sm:mb-10">
                        <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                            Project yang Telah Kami Kerjakan
                        </h2>
                        <p className="mx-auto max-w-2xl text-base text-gray-500 sm:text-lg">
                            Proyek instalasi, maintenance, IT support, dan web development yang telah kami selesaikan
                        </p>
                    </Reveal>

                    {serviceFilters.length > 1 && (
                        <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter proyek berdasarkan layanan">
                            {['all', ...serviceFilters].map((f) => (
                                <button
                                    key={f}
                                    type="button"
                                    onClick={() => setFilter(f)}
                                    aria-pressed={filter === f}
                                    className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                                        filter === f
                                            ? 'border-blue-600 bg-blue-600 text-white shadow-[0_6px_18px_-8px_rgba(22,119,232,0.9)]'
                                            : 'border-blue-200 bg-white text-gray-800 hover:border-blue-500 hover:text-blue-700'
                                    }`}
                                >
                                    {f === 'all' ? 'Semua' : f}
                                </button>
                            ))}
                        </div>
                    )}

                    {visiblePortfolios.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {visiblePortfolios.map((item, index) => (
                                <Reveal key={item.id} delay={Math.min(index, 5) * 70} className="h-full">
                                    <article className="glow-card group relative h-full overflow-hidden rounded-2xl">
                                        <div className="relative aspect-video overflow-hidden bg-blue-100">
                                            <img
                                                src={item.image ?? '/asset/default.jpg'}
                                                alt={item.title ?? 'Portfolio'}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                                            {item.service?.title && (
                                                <span className="absolute bottom-3 left-3 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white">
                                                    {item.service.title}
                                                </span>
                                            )}
                                            <span className="absolute right-3 top-3 inline-flex translate-y-1 items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-700 opacity-0 shadow transition-all group-hover:translate-y-0 group-hover:opacity-100">
                                                Lihat proyek <ArrowRight className="h-3 w-3" aria-hidden="true" />
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                                                <Link href={`/portfolio/${item.slug}`} className="after:absolute after:inset-0">
                                                    {item.title ?? 'Untitled Project'}
                                                </Link>
                                            </h3>
                                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                                {item.client_name && <span>{item.client_name}</span>}
                                                {item.project_date && <span>{new Date(item.project_date).getFullYear()}</span>}
                                                {item.location && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 text-blue-500" aria-hidden="true" />
                                                        {item.location}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                                                {item.short_description ?? item.description ?? ''}
                                            </p>
                                        </div>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <p className="col-span-full py-10 text-center text-sm text-gray-500">Belum ada portfolio.</p>
                    )}

                    <div className="mt-10 text-center">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:text-base"
                        >
                            Lihat Semua Proyek <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Keunggulan ── */}
            <section id="features" className="bg-blue-50 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="mb-10 text-center sm:mb-14">
                        <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">Keunggulan Layanan Kami</h2>
                        <p className="mx-auto max-w-2xl text-base text-gray-500 sm:text-lg">
                            Keahlian teknis, pengalaman industri, dan pendekatan customer-centric untuk hasil terbaik
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <Reveal key={feature.title} delay={Math.min(index, 5) * 70} className="h-full">
                                <div className="glow-card flex h-full items-start gap-4 rounded-2xl p-6">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 text-base font-semibold text-gray-900">{feature.title}</h3>
                                        <p className="text-sm leading-relaxed text-gray-500">{feature.description}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal delay={150} className="mt-10 sm:mt-14">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 px-4 py-8 text-white shadow-[0_30px_60px_-30px_rgba(22,119,232,0.8)] sm:px-10 sm:py-10">
                            <div className="bg-grid-tech-dark absolute inset-0 opacity-60" aria-hidden="true" />
                            <dl className="relative grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
                                {[
                                    { value: STATS.satisfaction, label: 'Kepuasan Klien' },
                                    { value: STATS.projects, label: 'Proyek Selesai' },
                                    { value: STATS.technicians, label: 'Teknisi Ahli' },
                                    { value: STATS.years, label: 'Tahun Berpengalaman' },
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <dd className="font-display text-4xl font-bold sm:text-5xl">
                                            <CountUp value={stat.value} />
                                        </dd>
                                        <dt className="mt-1 text-sm text-blue-100">{stat.label}</dt>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── Our Digital Footprint — Bali ── */}
            <section id="footprint" className="relative overflow-hidden bg-gradient-to-b from-blue-950 to-[#12315f] py-16 text-white sm:py-20 lg:py-24">
                <div className="bg-grid-tech-dark absolute inset-0 opacity-70" aria-hidden="true" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="mb-10 max-w-2xl sm:mb-12">
                        <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Our Digital Footprint</h2>
                        <p className="font-display text-xl text-neon sm:text-2xl">Connecting Bali Through Technology</p>
                        <p className="mt-4 text-base leading-relaxed text-blue-100">
                            Dari basis kami di Jimbaran, tim SkyNusa mengerjakan instalasi, jaringan, dan sistem digital di berbagai wilayah Bali.
                        </p>
                    </Reveal>
                    <Reveal delay={100}>
                        <BaliFootprint projects={safeFootprint} />
                    </Reveal>
                </div>
            </section>

            {/* ── Meet SKYBOT AI ── */}
            <section id="skybot" className="bg-white py-16 sm:py-20 lg:py-24">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
                    <Reveal className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
                        <div className="absolute inset-4 rounded-full border border-dashed border-blue-300 motion-safe:animate-[orbit-spin_40s_linear_infinite]" aria-hidden="true">
                            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-neon shadow-[0_0_14px_3px_rgba(32,201,245,0.7)]" />
                        </div>
                        <div className="absolute inset-12 rounded-full border border-blue-200 motion-safe:animate-[orbit-spin_28s_linear_infinite_reverse]" aria-hidden="true">
                            <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-brand" />
                        </div>
                        <div className="absolute inset-20 rounded-full bg-gradient-to-br from-blue-100 to-white" aria-hidden="true" />
                        <img
                            src="/asset/skybot.png"
                            alt="Skybot, asisten AI SKYNUSA TECH"
                            width={320}
                            height={307}
                            loading="lazy"
                            className="relative w-3/5 animate-[float-y_4.5s_ease-in-out_infinite] drop-shadow-[0_18px_24px_rgba(11,36,71,0.3)] motion-reduce:animate-none"
                        />
                    </Reveal>

                    <Reveal delay={120}>
                        <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">Kenalan dengan Skybot</h2>
                        <p className="mb-6 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
                            Bingung mau pasang CCTV, bikin website, atau layanan lain? Tanya Skybot, asisten AI SKYNUSA TECH. Untuk harga dan penawaran, tim kami yang akan menjawab langsung.
                        </p>
                        <div className="mb-7 flex flex-wrap gap-2">
                            {SKYBOT_QUESTIONS.map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => openSkybot(q)}
                                    className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:border-blue-500 hover:bg-white"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                        <Magnetic>
                            <button
                                type="button"
                                onClick={() => openSkybot()}
                                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-[0_12px_30px_-12px_rgba(22,119,232,0.9)] hover:bg-blue-700"
                            >
                                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                                Mulai ngobrol dengan Skybot
                            </button>
                        </Magnetic>
                    </Reveal>
                </div>
            </section>

            {/* ── Klien ── */}
            <section className="bg-blue-50 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="mb-10 text-center sm:mb-12">
                        <h2 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">Klien yang Telah Bekerja Sama</h2>
                        <p className="text-base text-gray-500">
                            Bergabunglah dengan ratusan klien yang mempercayakan kebutuhan teknis mereka kepada kami.
                        </p>
                    </Reveal>
                    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 sm:gap-6 lg:grid-cols-6">
                        {safeCompanies.length > 0 ? (
                            safeCompanies.map((company, index) => (
                                <Reveal key={company.id} delay={Math.min(index, 6) * 50}>
                                    <div className="group text-center">
                                        <div className="glow-card mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl sm:h-20 sm:w-20">
                                            {company.logo ? (
                                                <img src={company.logo} alt={company.name} loading="lazy" className="h-full w-full object-contain p-2" />
                                            ) : (
                                                <span className="text-lg font-bold text-gray-500">{company.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <p className="mt-2 line-clamp-2 text-xs font-medium text-gray-800 transition-colors group-hover:text-blue-600">
                                            {company.name}
                                        </p>
                                    </div>
                                </Reveal>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-sm text-gray-500">Belum ada data klien.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Tim ── */}
            <section id="tim" ref={teamRef} className="bg-white py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="mb-10 text-center sm:mb-12">
                        <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">SKYNUSA TEAM</h2>
                        <p className="mx-auto max-w-xl text-base text-gray-500">
                            Tim profesional yang solid dan berpengalaman untuk kesuksesan project Anda
                        </p>
                    </Reveal>
                    <OrgChart teamVisible={teamVisible} />
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 py-16 text-white sm:py-20">
                <div className="bg-grid-tech-dark absolute inset-0 opacity-60" aria-hidden="true" />
                <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Siap mulai proyek Anda?</h2>
                    <p className="mx-auto mb-8 max-w-xl text-base text-blue-100 sm:text-lg">
                        Ceritakan kebutuhan Anda. Tim kami di Bali siap membantu dari konsultasi sampai tuntas.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Magnetic>
                            <Link href="/kontak" className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-base font-semibold text-gray-900 hover:bg-brand-strong">
                                Konsultasi gratis <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </Magnetic>
                        <Magnetic>
                            <Link href="/pesanan/order" className="inline-flex items-center rounded-full border border-white/50 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10">
                                Pesan layanan
                            </Link>
                        </Magnetic>
                    </div>
                </Reveal>
            </section>
        </PublicLayout>
    );
}
