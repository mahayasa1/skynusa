import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { ComponentType } from 'react';
import PublicLayout from '@/layouts/public-layout';
import SEOHead from '@/components/seo-head';

interface ServiceDetail {
    id: number;
    title: string;
    slug: string;
    description: string;
    icon: string | null;
    image: string | null;
    features: string[];
}

interface RelatedService {
    id: number;
    title: string;
    slug: string;
    icon: string | null;
}

const iconFor = (name: string | null) => {
    const Icons = LucideIcons as unknown as Record<string, ComponentType<{ className?: string }>>;
    return (name && Icons[name]) || LucideIcons.Code;
};

export default function ServiceShow({ service, relatedServices }: { service: ServiceDetail; relatedServices: RelatedService[] }) {
    const Icon = iconFor(service.icon);

    return (
        <PublicLayout>
            <SEOHead
                title={`${service.title} - SKYNUSA TECH`}
                description={service.description.slice(0, 160)}
                ogImage={service.image || '/asset/logo.png'}
            />

            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <Link href="/layanan" className="mb-6 inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white">
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Semua layanan
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 text-white">
                            <Icon className="h-7 w-7" />
                        </span>
                        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{service.title}</h1>
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 lg:py-16">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
                        <div>
                            <p className="whitespace-pre-line leading-relaxed text-gray-600">{service.description}</p>

                            {service.features.length > 0 && (
                                <ul className="mt-8 space-y-3">
                                    {service.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-800">
                                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="mt-10 flex flex-wrap gap-3">
                                <Link href="/pesanan/order" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">
                                    Pesan layanan <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                                <Link href="/kontak" className="inline-flex items-center rounded-full border border-blue-600 px-7 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                                    Konsultasi gratis
                                </Link>
                            </div>
                        </div>

                        {service.image && (
                            <img src={service.image} alt={service.title} className="w-full rounded-2xl object-cover shadow-xl" />
                        )}
                    </div>
                </div>
            </section>

            {relatedServices.length > 0 && (
                <section className="bg-gray-50 py-12">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">Layanan lainnya</h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {relatedServices.map((r) => {
                                const RIcon = iconFor(r.icon);
                                return (
                                    <Link key={r.id} href={`/layanan/${r.slug}`} className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm hover:shadow-md">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                            <RIcon className="h-5 w-5" />
                                        </span>
                                        <span className="font-semibold text-gray-900">{r.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
