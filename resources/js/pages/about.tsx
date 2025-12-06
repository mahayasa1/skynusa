import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, TrendingUp, Shield, CheckCircle } from 'lucide-react';

export default function About() {
    return (
        <PublicLayout>
            <Head title="Tentang Kami" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-16">
                <div className="absolute inset-0 bg-[url('/asset/bg-main.png')] bg-cover bg-center opacity-20"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2">
                            <span className="text-xl font-extrabold text-white">TENTANG KAMI</span>
                        </div>
                        <h1 className="mb-6 text-4xl lg:text-5xl font-bold text-white">
                            Mitra Terpercaya untuk Solusi Teknis Anda
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-blue-100 mb-8">
                            Dengan pengalaman lebih dari 10 tahun, kami telah membantu ratusan klien dalam memenuhi kebutuhan instalasi, maintenance, IT support, dan web development
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
                                    SKYNUSA TECH adalah perusahaan penyedia layanan teknis profesional yang berdiri sejak 2014. Kami fokus memberikan solusi terbaik dalam bidang instalasi elektronik, perawatan AC, maintenance perangkat, dukungan IT, dan pengembangan website.
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
                                src="/asset/cctv.jpeg" 
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
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Nilai-Nilai Kami
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Prinsip yang menjadi fondasi dalam setiap pekerjaan kami
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Award,
                                title: 'Profesionalitas',
                                description: 'Mengikuti standar industri dan prosedur keamanan terbaik'
                            },
                            {
                                icon: Users,
                                title: 'Integritas',
                                description: 'Jujur dan transparan dalam setiap layanan yang kami berikan'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Inovasi',
                                description: 'Terus berinovasi mengikuti perkembangan teknologi terkini'
                            },
                            {
                                icon: Shield,
                                title: 'Keandalan',
                                description: 'Memberikan solusi yang dapat diandalkan dan tahan lama'
                            }
                        ].map((value, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
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
            <section className="bg-gray-50 py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Mengapa Memilih Kami?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            'Tim teknisi bersertifikat dan berpengalaman',
                            'Garansi resmi untuk setiap pekerjaan',
                            'Respon cepat untuk layanan darurat',
                            'Harga kompetitif dan transparan',
                            'Peralatan modern dan berkualitas',
                            'Layanan after-sales yang responsif',
                            'Track record terbukti dengan klien satisfied',
                            'Mengikuti standar keamanan dan kualitas'
                        ].map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                <span className="text-gray-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-6 text-3xl lg:text-4xl font-bold text-white">
                        Mari Bekerja Sama dengan Kami
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                        Konsultasikan kebutuhan teknis Anda dengan tim ahli kami. Kami siap memberikan solusi terbaik untuk bisnis Anda.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold">
                            Hubungi Kami Sekarang
                        </Button>
                        <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold">
                            Lihat Portfolio
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}