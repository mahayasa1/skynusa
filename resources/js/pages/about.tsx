import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import SEOHead from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, TrendingUp, Shield, CheckCircle, CircleDivide, CircleIcon, UserCog, Briefcase, Heart, Badge, Eye, Target } from 'lucide-react';

export default function About() {
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
                            Tentang Skynusa Tech
                        </h1>
                        <p className=" max-w-3xl text-lg text-blue-100 mb-8">
                            Kami adalah tim teknisi profesional dan berpengalaman yang berdedikasi memberikan solusi instalasi, maintenance, IT support, dan web development terbaik.
                        </p>
                        <p className=" max-w-3xl text-lg text-blue-100 mb-8">
                            Sejak 2015, kami telah melayani berbagai klien mulai dari rumah tinggal, perkantoran, hingga industri manufaktur dengan hasil yang memuaskan.
                        </p>
                    </div>
                </div>
            </section>

            {/* Company Overview */}
            <section className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                                Siapa Kami?
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    SKYNUSA TECH adalah perusahaan penyedia layanan teknis profesional yang berdiri sejak 2025. Kami fokus memberikan solusi terbaik dalam bidang instalasi elektronik, perawatan AC, maintenance perangkat, dukungan IT, dan pengembangan website.
                                </p>
                                <p>
                                    Tim kami terdiri dari teknisi bersertifikat dan engineer berpengalaman yang berkomitmen memberikan layanan berkualitas tinggi dengan standar industri terbaik.
                                </p>
                                <p>
                                    Kepuasan klien adalah prioritas utama kami. Setiap proyek dikerjakan dengan dedikasi penuh dan perhatian terhadap detail untuk memastikan hasil yang optimal.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <img 
                                src="/asset/about.jpeg" 
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
                            Nilai-Nilai Kami
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Prinsip yang kami Junjung
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Nilai-nilai fundamental yang menjadi fondasi dalam setiap pekerjaan yang kami lakukan.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Target,
                                title: 'Profesionalisme',
                                description: 'Kami berkomitmen memberikan layanan profesional dengan standar kualitas tertinggi.'
                            },
                            {
                                icon: Heart,
                                title: 'Dedikasi',
                                description: 'Tim kami berdedikasi penuh untuk memastikan kepuasan dan keberhasilan setiap proyek.'
                            },
                            {
                                icon: Award,
                                title: 'Integritas',
                                description: 'Kami menjunjung tinggi kejujuran dan transparansi dalam setiap hubungan dengan klien.'
                            },
                            {
                                icon: Eye,
                                title: 'Inovasi',
                                description: 'Kami selalu mengikuti perkembangan teknologi dan metode terbaru di industri.'
                            }
                        ].map((value, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-white">
                                <CardContent className="pt-8 pb-6">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                                        <value.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements Section */}
            <section className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Pencapaian Kami
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { number: '10+', label: 'Tahun Pengalaman' },
                            { number: '188+', label: 'Project Selesai' },
                            { number: '95%', label: 'Kepuasan Klien' },
                            { number: '20+', label: 'Teknisi Profesional' }
                        ].map((stat, index) => (
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
                    Memberikan solusi teknis berkualitas tinggi dengan harga kompetitif, didukung oleh teknis profesional dan pelayanan customer service yang responsif untuk menaikkan kepuasan setiap klien.
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
                    Menjadi penyedia layanan instalasi, maintenance, IT support, dan web development terdepan dan terpercaya di Indonesia, dikenal karena kualitas kerja dan kepuasan pelanggan yang konsisten.
                </p>
            </div>
        </div>
    </div>
</section>
        </PublicLayout>
    );
}