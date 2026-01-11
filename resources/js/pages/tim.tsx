import { Head, Link } from '@inertiajs/react';
import SEOHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Laptop, Monitor } from 'lucide-react';

const colorMap = {
    blue: {
        border: 'border-blue-500',
        text: 'text-blue-600',
    },
    indigo: {
        border: 'border-indigo-500',
        text: 'text-indigo-600',
    },
    purple: {
        border: 'border-purple-500',
        text: 'text-purple-600',
    },
    red: {
        border: 'border-red-500',
        text: 'text-red-600',
    },
};

export default function Team() {
    return (
        <PublicLayout>
            <SEOHead
                title="Tim Kami - Teknisi & Engineer Profesional Bersertifikat"
                description="Kenali tim profesional SKYNUSA TECH: teknisi bersertifikat, engineer berpengalaman 10+ tahun. Dipimpin CEO Royce Francis M.M dengan tim solid untuk kesuksesan project Anda."
                keywords="tim skynusa tech, teknisi profesional, engineer bersertifikat, cto mahayasa wibawa, team management, teknisi bali"
                canonical="https://skynusa.com/tim"
                ogImage="/asset/logo.png"
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-16">
                <div className="absolute inset-0 bg-[url('/asset/bg-main.png')] bg-cover bg-center opacity-20"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2">
                            <span className="text-xl font-extrabold text-white">
                                TIM SKYNUSA TECH
                            </span>
                        </div>
                        <h1 className="mb-6 text-4xl lg:text-5xl font-bold text-white">
                            Tim Profesional yang Solid dan Berpengalaman
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-blue-100">
                            Dikelola oleh para ahli di bidangnya untuk kesuksesan project Anda
                        </p>
                    </div>
                </div>
            </section>

            {/* Organization Chart */}
            <section className="bg-white py-16 lg:py-20">
                <div className="relative">
                    {/* CEO */}
                    <div className="flex justify-center mb-12">
                        <div className="relative">
                            <Card className="w-64 sm:w-72 border-2 border-blue-600 bg-linear-to-br from-blue-50/80 to-white shadow-xl">
                                <CardContent className="p-6 text-center">
                                    <div className="h-20 w-20 rounded-full overflow-hidden bg-blue-600/20 mx-auto mb-4 shadow">
                                        <img
                                            src="asset/royce.png"
                                            className="w-full h-full object-cover"
                                            alt="Royce Francis"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Royce Francis M.M
                                    </h3>
                                    <p className="text-base font-semibold text-blue-600 mb-1">
                                        CEO & Founder
                                    </p>
                                    <p className="text-xs text-gray-600 mb-3">
                                        Business Strategy
                                    </p>
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
                            {
                                name: 'Mahayasa Wibawa',
                                role: 'Chief Technology Officer',
                                subRole: 'Technical Leadership',
                                img: 'asset/id.png',
                                color: 'blue',
                            },
                            {
                                name: 'Arnold Tamelan',
                                role: 'Head of Operations',
                                subRole: 'Project Management',
                                img: 'asset/arnold.jpeg',
                                color: 'indigo',
                            },
                            {
                                name: 'Bagus Wisnu',
                                role: 'Head of Design',
                                subRole: 'UI/UX & Creative',
                                img: 'asset/bgw.jpg',
                                color: 'purple',
                            },
                            {
                                name: 'Hassan',
                                role: 'Head of Engineer',
                                subRole: 'Electronic Engineering',
                                img: 'asset/hassan.jpeg',
                                color: 'red',
                            },
                            {
                                name: 'Frans',
                                role: 'Head of Internet of Things',
                                subRole: 'Electrical Installation',
                                img: 'asset/frans.jpg',
                                color: 'red',
                            },
                        ].map((member, index) => {
                            const colors =
                                colorMap[
                                    member.color as keyof typeof colorMap
                                ];

                            return (
                                <div key={index} className="relative">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-blue-300"></div>
                                    <Card
                                        className={`border-2 ${colors.border} bg-white shadow-lg`}
                                    >
                                        <CardContent className="p-6 text-center">
                                            <div className="h-20 w-20 rounded-full overflow-hidden bg-blue-600/20 mx-auto mb-4 shadow">
                                                <img
                                                    src={member.img}
                                                    className="w-full h-full object-cover"
                                                    alt={member.name}
                                                />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {member.name}
                                            </h3>
                                            <p
                                                className={`text-sm font-semibold ${colors.text} mb-1`}
                                            >
                                                {member.role}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {member.subRole}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-start mb-10">
                        <div className="ml-8 w-60 h-0.5 bg-blue-300"></div>
                        <div className="ml-12 w-60 h-0.5 bg-blue-300"></div>
                        <div className="ml-8 w-60 h-0.5 bg-blue-300"></div>
                        <div className="ml-12 w-60 h-0.5 bg-blue-300"></div>
                    </div>

                    {/* THIRD LEVEL */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {[
                            {
                                name: 'Rudi',
                                role: 'Front-end Developer',
                                image: '/asset/profile.png',
                            },
                            {
                                name: 'Anjani',
                                role: 'Administrator',
                                image: '/asset/profile.png',
                            },
                            {
                                name: 'Agus Surya',
                                role: 'UI/UX Designer',
                                image: '/asset/agus.jpg',
                            },
                            {
                                name: 'Rihaf',
                                role: 'Lighting Installation',
                                image: '/asset/profile.png',
                            },
                        ].map((m, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-blue-300"></div>
                                <Card className="border border-gray-200 bg-white">
                                    <CardContent className="p-4 text-center">
                                        <div className="h-14 w-14 rounded-full overflow-hidden mx-auto mb-3 shadow">
                                            <img
                                                src={m.image}
                                                alt={m.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            {m.name}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            {m.role}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-gray-50 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Kenapa Bergabung dengan Tim Kami?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Kami menciptakan lingkungan kerja yang mendukung
                            pertumbuhan dan inovasi
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                                <TrendingUp className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Pengembangan Karir
                            </h3>
                            <p className="text-gray-600">
                                Peluang berkembang dengan training dan sertifikasi
                                profesional
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                                <Laptop className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Teknologi Terkini
                            </h3>
                            <p className="text-gray-600">
                                Bekerja dengan tools dan teknologi modern
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                                <Monitor className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Work-Life Balance
                            </h3>
                            <p className="text-gray-600">
                                Flexible working hours dan remote work options
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-6 text-3xl lg:text-4xl font-bold text-white">
                        Tertarik Bergabung dengan Tim Kami?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                        Kami selalu mencari talenta terbaik untuk bergabung
                        dengan tim profesional kami
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/kontak">
                            <Button
                                size="lg"
                                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold"
                            >
                                Kirim Lamaran
                            </Button>
                        </Link>
                        <Link href="/tentang-kami">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
                            >
                                Pelajari Lebih Lanjut
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
