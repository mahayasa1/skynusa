import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import SEOHead from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const portfolios = [
    {
        title: 'Instalasi CCTV & Sistem Keamanan',
        category: 'Instalasi Elektronik',
        client: 'PT Maju Bersama',
        year: '2024',
        description: 'Instalasi 24 kamera CCTV IP dengan monitoring real-time untuk keamanan area pabrik seluas 5000m2',
        features: ['IP Camera 4MP', 'NVR 32 Channel', 'POE Switch 24 Port', 'Monitoring Room Setup'],
        image: '/asset/cctv.jpeg',
        results: [
            'Peningkatan keamanan area pabrik',
            'Real-time monitoring 24/7',
            'Recording 30 hari',
            'Remote viewing via mobile app'
        ]
    },
    {
        title: 'Instalasi AC Central & Perawatan',
        category: 'Instalasi & Service AC',
        client: 'Hotel Sejahtera',
        year: '2024',
        description: 'Instalasi sistem AC central untuk 50 kamar hotel dengan kontrol suhu otomatis dan efisiensi energi tinggi',
        features: ['Chiller Unit 100 TR', 'AHU System', 'Ducting Network', 'BMS Integration'],
        image: '/asset/AC.jpeg',
        results: [
            'Pengurangan biaya listrik 30%',
            'Temperatur stabil di seluruh area',
            'Maintenance 6 bulan pertama gratis',
            'Garansi 2 tahun'
        ]
    },
    {
        title: 'Website Company Profile & E-Commerce',
        category: 'Web Development',
        client: 'CV Mandiri Jaya',
        year: '2024',
        description: 'Pembuatan website company profile dan toko online dengan fitur e-commerce lengkap',
        features: ['React & Laravel', 'Admin Dashboard', 'Payment Gateway', 'SEO Optimized'],
        image: '/asset/web.jpeg',
        results: [
            'Peningkatan penjualan online 150%',
            'Mobile responsive',
            '1000+ visitors per hari',
            'Google ranking page 1'
        ]
    },
    {
        title: 'Setup Infrastruktur IT & Jaringan',
        category: 'IT Support',
        client: 'Kantor Pusat ABC',
        year: '2024',
        description: 'Setup lengkap server, jaringan LAN, dan sistem IT untuk kantor 3 lantai dengan 100+ workstation',
        features: ['Dell Server R740', 'Switch Cisco 48 Port', 'Ubiquiti Access Point', 'Structured Cabling'],
        image: '/asset/IT Support.jpeg',
        results: [
            'Network speed 1 Gbps',
            'Uptime 99.9%',
            'Backup system terpadu',
            'Remote management'
        ]
    },
    {
        title: 'Instalasi Panel Listrik Industri',
        category: 'Instalasi Elektronik',
        client: 'Pabrik Tekstil Jaya',
        year: '2024',
        description: 'Instalasi panel listrik 3 phase 500 kVA dengan sistem proteksi lengkap',
        features: ['MDP Panel', 'SDP Panel', 'Grounding System', 'Lightning Protection'],
        image: '/asset/cctv.jpeg',
        results: [
            'Daya listrik stabil',
            'Proteksi overload',
            'Sertifikat laik operasi',
            'Garansi 1 tahun'
        ]
    },
    {
        title: 'Maintenance AC & Cleaning Berkala',
        category: 'Service AC',
        client: 'Gedung Plaza Bintang',
        year: '2024',
        description: 'Kontrak maintenance 80 unit AC split dan VRV untuk gedung perkantoran 10 lantai',
        features: ['Monthly Service', 'AC Cleaning', 'Freon Check', 'Emergency Call 24/7'],
        image: '/asset/AC.jpeg',
        results: [
            'Pengurangan breakdown 80%',
            'Efisiensi energi meningkat',
            'Response time < 2 jam',
            'Cost saving 25%'
        ]
    }
];

export default function Portfolio() {
    return (
        <PublicLayout>
            <SEOHead
                title="Portfolio Project - Instalasi CCTV, AC, IT & Website"
                description="Lihat portfolio 188+ project berhasil kami: instalasi CCTV & sistem keamanan, instalasi AC central, setup infrastruktur IT, dan web development untuk berbagai klien di Bali."
                keywords="portfolio instalasi, project cctv, instalasi ac hotel, web development portfolio, it infrastructure, instalasi panel listrik"
                canonical="https://skynusa-tech.com/portfolio"
                ogImage="/asset/logo.png"
            />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-16">
                <div className="absolute inset-0 bg-[url('/asset/bg-main.png')] bg-cover bg-center opacity-20"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2">
                            <span className="text-xl font-extrabold text-white">PORTFOLIO</span>
                        </div>
                        <h1 className="mb-6 text-4xl lg:text-5xl font-bold text-white">
                            Project yang Telah Kami Kerjakan
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-blue-100">
                            Lihat berbagai proyek instalasi, maintenance, IT support, dan web development yang telah kami selesaikan dengan hasil memuaskan
                        </p>
                    </div>
                </div>
            </section>

            {/* Portfolio Grid */}
            <section className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-2">
                        {portfolios.map((item, index) => (
                            <Card key={index} className="group overflow-hidden hover:shadow-2xl transition-all">
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl">{item.title}</CardTitle>
                                    <div className="flex gap-4 text-sm text-gray-600">
                                        <span>{item.client}</span>
                                        <span>•</span>
                                        <span>{item.year}</span>
                                    </div>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Features:</h4>
                                        <ul className="grid grid-cols-2 gap-2">
                                            {item.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm">
                                                    <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Results:</h4>
                                        <ul className="space-y-2">
                                            {item.results.map((result, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <span className="text-blue-600">✓</span>
                                                    <span>{result}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gray-50 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Statistik Project
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { number: '188+', label: 'Total Projects' },
                            { number: '95%', label: 'Success Rate' },
                            { number: '150+', label: 'Happy Clients' },
                            { number: '24/7', label: 'Support Available' }
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

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-6 text-3xl lg:text-4xl font-bold text-white">
                        Ingin Project Anda Selanjutnya?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                        Mari diskusikan kebutuhan project Anda dengan tim ahli kami
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold">
                            Konsultasi Gratis
                        </Button>
                        <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold">
                            Hubungi Kami
                        </Button>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}