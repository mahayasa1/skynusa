import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Zap, AirVent, Monitor, Code, CheckCircle, ArrowRight } from 'lucide-react';

const services = [
    {
        icon: Zap,
        title: 'Instalasi dan Maintenance Listrik',
        description: 'Instalasi sistem kelistrikan yang aman dan sesuai standar untuk rumah, kantor, dan industri',
        features: [
            'Instalasi panel listrik lengkap',
            'Sistem grounding dan penangkal petir',
            'Instalasi penerangan indoor & outdoor',
            'Maintenance rutin sistem kelistrikan',
            'Troubleshooting dan perbaikan',
            'Upgrade kapasitas daya listrik'
        ],
        image: '/asset/cctv.jpeg'
    },
    {
        icon: AirVent,
        title: 'Instalasi dan Service AC',
        description: 'Pemasangan dan perawatan AC untuk kenyamanan optimal dengan efisiensi energi terbaik',
        features: [
            'Instalasi AC Split & Multi Split',
            'Instalasi AC Central & VRV',
            'Service berkala dan cleaning AC',
            'Perbaikan dan troubleshooting',
            'Isi freon dan cek kebocoran',
            'Konsultasi pemilihan AC yang tepat'
        ],
        image: '/asset/AC.jpeg'
    },
    {
        icon: Monitor,
        title: 'IT Support & Maintenance',
        description: 'Dukungan teknis IT profesional untuk komputer, jaringan, dan sistem teknologi informasi',
        features: [
            'Setup dan maintenance PC/Laptop',
            'Instalasi jaringan LAN/WAN',
            'Setup server dan cloud storage',
            'Troubleshooting hardware & software',
            'IT helpdesk dan remote support',
            'Data backup dan recovery'
        ],
        image: '/asset/IT Support.jpeg'
    },
    {
        icon: Code,
        title: 'Web Development',
        description: 'Pembuatan dan pemeliharaan website profesional untuk meningkatkan kehadiran online bisnis',
        features: [
            'Website company profile',
            'Toko online / E-commerce',
            'Web application custom',
            'Website maintenance & update',
            'SEO optimization',
            'Responsive & mobile-friendly design'
        ],
        image: '/asset/web.jpeg'
    }
];

export default function Services() {
    return (
        <PublicLayout>
            <Head title="Layanan Kami" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-16">
                <div className="absolute inset-0 bg-[url('/asset/bg-main.png')] bg-cover bg-center opacity-20"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2">
                            <span className="text-xl font-extrabold text-white">LAYANAN KAMI</span>
                        </div>
                        <h1 className="mb-6 text-4xl lg:text-5xl font-bold text-white">
                            Solusi Teknis Lengkap untuk Kebutuhan Anda
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-blue-100">
                            Kami menyediakan berbagai layanan instalasi, maintenance, IT support, dan web development dengan standar profesional tinggi
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Detail Section */}
            <section className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="space-y-20">
                        {services.map((service, index) => (
                            <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                                        <service.icon className="h-8 w-8" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        {service.title}
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        {service.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                                                    <CheckCircle className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button className="mt-8" size="lg">
                                        Konsultasi Gratis
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                        <img 
                                            src={service.image} 
                                            alt={service.title}
                                            className="w-full h-full object-cover aspect-[4/3]"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="bg-gray-50 py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Proses Kerja Kami
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Kami mengikuti proses sistematis untuk memastikan kepuasan maksimal
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Konsultasi', desc: 'Diskusi kebutuhan dan survey lokasi' },
                            { step: '02', title: 'Perencanaan', desc: 'Pembuatan proposal dan estimasi biaya' },
                            { step: '03', title: 'Eksekusi', desc: 'Pelaksanaan pekerjaan oleh tim ahli' },
                            { step: '04', title: 'Garansi', desc: 'Serah terima dan garansi layanan' }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-6 text-3xl lg:text-4xl font-bold text-white">
                        Butuh Layanan Profesional?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                        Hubungi kami sekarang untuk konsultasi gratis dan dapatkan solusi terbaik untuk kebutuhan Anda
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold">
                            Hubungi Kami Sekarang
                        </Button>
                        <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold">
                            Chat via WhatsApp
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}