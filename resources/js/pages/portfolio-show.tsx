import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Calendar, CheckCircle, Clock, ExternalLink, MapPin, Building2 } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import SEOHead from '@/components/seo-head';
import { Button } from '@/components/ui/button';

interface PortfolioDetail {
    id: number;
    title: string;
    slug: string;
    description: string;
    short_description: string | null;
    image: string | null;
    gallery: string[];
    client_name: string | null;
    location: string | null;
    project_date: string | null;
    duration: string | null;
    technologies: string[];
    features: string[];
    project_url: string | null;
    service: { title: string; slug: string } | null;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
}

interface RelatedProject {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    location: string | null;
    short_description: string | null;
}

export default function PortfolioShow({ portfolio, related }: { portfolio: PortfolioDetail; related: RelatedProject[] }) {
    const year = portfolio.project_date ? new Date(portfolio.project_date).getFullYear() : null;
    const meta = [
        portfolio.client_name && { icon: Building2, label: 'Klien', value: portfolio.client_name },
        portfolio.location && { icon: MapPin, label: 'Lokasi', value: portfolio.location },
        year && { icon: Calendar, label: 'Tahun', value: String(year) },
        portfolio.duration && { icon: Clock, label: 'Durasi', value: portfolio.duration },
    ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

    return (
        <PublicLayout>
            <SEOHead
                title={portfolio.meta_title || `${portfolio.title} - Portfolio SKYNUSA TECH`}
                description={portfolio.meta_description || portfolio.short_description || portfolio.title}
                keywords={portfolio.meta_keywords || undefined}
                ogImage={portfolio.image || '/asset/logo.png'}
            />

            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <Link href="/portfolio" className="mb-6 inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white">
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Semua proyek
                    </Link>
                    {portfolio.service && (
                        <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white">
                            {portfolio.service.title}
                        </p>
                    )}
                    <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{portfolio.title}</h1>
                    {portfolio.short_description && (
                        <p className="mt-4 max-w-3xl text-lg text-blue-100">{portfolio.short_description}</p>
                    )}
                </div>
            </section>

            <section className="bg-white py-12 lg:py-16">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {portfolio.image && (
                        <img
                            src={portfolio.image}
                            alt={portfolio.title}
                            className="mb-10 aspect-video w-full rounded-2xl object-cover shadow-xl"
                        />
                    )}

                    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-gray-900">Tentang proyek</h2>
                            <p className="whitespace-pre-line leading-relaxed text-gray-600">{portfolio.description}</p>

                            {portfolio.features.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="mb-3 text-xl font-semibold text-gray-900">Yang dikerjakan</h3>
                                    <ul className="grid gap-2 sm:grid-cols-2">
                                        {portfolio.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-700">
                                                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <aside className="space-y-6">
                            {meta.length > 0 && (
                                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                                    <dl className="space-y-4">
                                        {meta.map((m) => (
                                            <div key={m.label} className="flex items-start gap-3">
                                                <m.icon className="mt-0.5 h-5 w-5 text-blue-600" aria-hidden="true" />
                                                <div>
                                                    <dt className="text-xs uppercase tracking-wide text-gray-500">{m.label}</dt>
                                                    <dd className="font-medium text-gray-900">{m.value}</dd>
                                                </div>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            )}

                            {portfolio.technologies.length > 0 && (
                                <div>
                                    <h3 className="mb-2 text-sm font-semibold text-gray-900">Teknologi & perangkat</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {portfolio.technologies.map((t, i) => (
                                            <span key={i} className="rounded-full border border-blue-200 bg-white px-3 py-1 text-sm text-blue-700">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {portfolio.project_url && (
                                <Button asChild className="w-full">
                                    <a href={portfolio.project_url} target="_blank" rel="noopener noreferrer">
                                        Kunjungi proyek <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                                    </a>
                                </Button>
                            )}
                        </aside>
                    </div>

                    {portfolio.gallery.length > 0 && (
                        <div className="mt-12">
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">Galeri</h3>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {portfolio.gallery.map((g, i) => (
                                    <img key={i} src={g} alt={`${portfolio.title} ${i + 1}`} loading="lazy" className="aspect-video w-full rounded-xl object-cover" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {related.length > 0 && (
                <section className="bg-gray-50 py-12 lg:py-16">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">Proyek lain yang serupa</h2>
                        <div className="grid gap-6 sm:grid-cols-3">
                            {related.map((r) => (
                                <Link key={r.id} href={`/portfolio/${r.slug}`} className="group overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-lg">
                                    <div className="aspect-video overflow-hidden bg-blue-100">
                                        {r.image && <img src={r.image} alt={r.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900">{r.title}</h3>
                                        {r.location && <p className="mt-1 text-xs text-gray-500">{r.location}</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="bg-gradient-to-br from-blue-700 to-blue-500 py-14 text-center text-white">
                <div className="mx-auto max-w-2xl px-4">
                    <h2 className="mb-3 text-3xl font-bold">Punya proyek serupa?</h2>
                    <p className="mb-6 text-blue-100">Ceritakan kebutuhan Anda, tim kami siap membantu.</p>
                    <Link href="/kontak" className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 font-semibold text-gray-900 hover:bg-brand-strong">
                        Konsultasi gratis <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
