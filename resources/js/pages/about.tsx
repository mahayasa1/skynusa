import PublicLayout from '@/layouts/public-layout';
import SEOHead from '@/components/seo-head';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Heart, Eye, Target } from 'lucide-react';
import { useSite } from '@/hooks/use-site';

interface AboutContent {
    hero_title: string; hero_p1: string; hero_p2: string;
    who_title: string; who_paragraphs: string[]; who_image_url: string | null;
    values_badge: string; values_title: string; values_desc: string;
    values: { title: string; description: string }[];
    achievements_title: string; mission: string; vision: string;
}

// Ikon nilai berurutan; kalau nilainya lebih dari 4 ikon diulang.
const VALUE_ICONS = [Target, Heart, Award, Eye];

export default function About({ about }: { about: AboutContent }) {
    const { stats } = useSite();
    const achievements = [
        { number: stats.years, label: 'Tahun Pengalaman' },
        { number: stats.projects, label: 'Project Selesai' },
        { number: stats.satisfaction, label: 'Kepuasan Klien' },
        { number: stats.technicians, label: 'Teknisi Profesional' },
    ];
    return (
        <PublicLayout>
             <SEOHead
                title="Tentang Kami - SKYNUSA TECH | Perusahaan Teknisi Profesional Bali"
                description="SKYNUSA TECH adalah perusahaan penyedia layanan teknis profesional sejak 2015. Tim teknisi bersertifikat dengan 188+ proyek berhasil dan tingkat kepuasan klien 95%."
                keywords="tentang skynusa tech, perusahaan teknisi bali, jasa instalasi profesional, teknisi bersertifikat, layanan teknis bali"
                canonical="https://skynusa-tech.com/tentang-kami"
                ogImage="/asset/logo.png"
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-16">
                <div className="absolute inset-0 bg-[url('/asset/bg-main.png')] bg-cover bg-center opacity-20"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-start mx-14">
                        <h1 className="mb-6 mt-6 text-4xl lg:text-5xl font-bold text-white">
                            {about.hero_title}
                        </h1>
                        {about.hero_p1 && (
                            <p className=" max-w-3xl text-lg text-blue-100 mb-8">{about.hero_p1}</p>
                        )}
                        {about.hero_p2 && (
                            <p className=" max-w-3xl text-lg text-blue-100 mb-8">{about.hero_p2}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Company Overview */}
            <section className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                                {about.who_title}
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                {about.who_paragraphs.map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <img 
                                src={about.who_image_url ?? '/asset/about.jpeg'} 
                                alt="Team Working" 
                                className="rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-gray-50 py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block mb-4 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-600">
                            {about.values_badge}
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            {about.values_title}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {about.values_desc}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {about.values.map((value, index) => {
                            const ValueIcon = VALUE_ICONS[index % VALUE_ICONS.length];
                            return (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-white">
                                <CardContent className="pt-8 pb-6">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                                        <ValueIcon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Achievements Section */}
            <section className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            {about.achievements_title}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {achievements.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-5xl font-bold text-blue-600 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 py-16 lg:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Misi Kami Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-10">
                    <div className="bg-white/20 rounded-full p-2">
                        <Target className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold text-white">MISI KAMI</h3>
                </div>
                <p className="text-white/90 leading-relaxed">
                    {about.mission}
                </p>
            </div>

            {/* Visi Kami Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-10">
                    <div className="bg-white/20 rounded-full p-2">
                        <Eye className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold text-white">VISI KAMI</h3>
                </div>
                <p className="text-white/90 leading-relaxed">
                    {about.vision}
                </p>
            </div>
        </div>
    </div>
</section>
        </PublicLayout>
    );
}