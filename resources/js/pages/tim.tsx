import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Code, TrendingUp, Laptop, Wrench, Monitor, Lightbulb, Brush, Book } from 'lucide-react';

export default function Team() {
    return (
        <PublicLayout>
            <Head title="Tim Kami" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-16">
                <div className="absolute inset-0 bg-[url('/asset/bg-main.png')] bg-cover bg-center opacity-20"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2">
                            <span className="text-xl font-extrabold text-white">TIM SKYNUSA TECH</span>
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
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* CEO - Level 1 */}
                    <div className="flex justify-center mb-12">
                        <div className="relative">
                            <div className="flex flex-col items-center bg-white rounded-2xl border-2 border-blue-600 p-8 shadow-xl max-w-sm">
                                <div className="h-24 w-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 mb-4 shadow-lg">
                                    <img 
                                        src="/asset/Royce.jpg" 
                                        alt="Royce Francis M.M"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Royce Francis M.M</h3>
                                <p className="text-base font-semibold text-blue-600 mb-1">CEO & Founder</p>
                                <p className="text-sm text-gray-600">Business Strategy</p>
                            </div>
                            {/* Vertical Line */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full h-12 w-0.5 bg-blue-300"></div>
                        </div>
                    </div>

                    {/* Horizontal Line for Level 2 */}
                    <div className="flex justify-center mb-12">
                        <div className="w-full max-w-6xl h-0.5 bg-blue-300"></div>
                    </div>

                    {/* Management Team - Level 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
                        
                        {/* CTO */}
                        <div className="relative">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-0.5 bg-blue-300"></div>
                            <div className="flex flex-col items-center bg-white rounded-2xl border-2 border-blue-500 p-6 shadow-lg hover:shadow-xl transition">
                                <div className="h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 mb-4 shadow">
                                    <img 
                                        src="/asset/id.png" 
                                        alt="Mahayasa Wibawa"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 text-center">Mahayasa Wibawa</h3>
                                <p className="text-sm font-semibold text-blue-600 mb-1">Chief Technology Officer</p>
                                <p className="text-xs text-gray-600 text-center">Technical Leadership</p>
                            </div>
                        </div>

                        {/* Head of Operations */}
                        <div className="relative">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-0.5 bg-blue-300"></div>
                            <div className="flex flex-col items-center bg-white rounded-2xl border-2 border-indigo-500 p-6 shadow-lg hover:shadow-xl transition">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4 shadow">
                                    <TrendingUp className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 text-center">Arnold Tamelan</h3>
                                <p className="text-sm font-semibold text-indigo-600 mb-1">Head of Operations</p>
                                <p className="text-xs text-gray-600 text-center">Project Management</p>
                            </div>
                        </div>

                        {/* Head of Design */}
                        <div className="relative">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-0.5 bg-blue-300"></div>
                            <div className="flex flex-col items-center bg-white rounded-2xl border-2 border-purple-500 p-6 shadow-lg hover:shadow-xl transition">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 shadow">
                                    <Laptop className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 text-center">Bagus Wisnu</h3>
                                <p className="text-sm font-semibold text-purple-600 mb-1">Head of Design</p>
                                <p className="text-xs text-gray-600 text-center">UI/UX & Creative</p>
                            </div>
                        </div>

                        {/* Head of Engineer */}
                        <div className="relative">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-0.5 bg-blue-300"></div>
                            <div className="flex flex-col items-center bg-white rounded-2xl border-2 border-red-500 p-6 shadow-lg hover:shadow-xl transition">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4 shadow">
                                    <Wrench className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 text-center">Frans</h3>
                                <p className="text-sm font-semibold text-red-600 mb-1">Head of Engineer</p>
                                <p className="text-xs text-gray-600 text-center">Electronic Engineering</p>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Lines for Level 3 */}
                    <div className="flex justify-between mb-12 max-w-6xl mx-auto px-8">
                        <div className="w-56 h-0.5 bg-blue-300"></div>
                        <div className="w-56 h-0.5 bg-blue-300"></div>
                        <div className="w-56 h-0.5 bg-blue-300"></div>
                        <div className="w-56 h-0.5 bg-blue-300"></div>
                    </div>

                    {/* Team Members - Level 3 */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        
                        {/* Rudi */}
                        <div className="relative">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-0.5 bg-blue-300"></div>
                            <div className="flex flex-col items-center bg-white rounded-xl border border-gray-200 p-4 shadow hover:shadow-md transition">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center mb-3 shadow">
                                    <Code className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 text-center">Rudi</h3>
                                <p className="text-xs text-gray-600 text-center">Front-end Developer</p>
                            </div>
                        </div>

                        {/* Jelita */}
                        <div className="relative">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-0.5 bg-blue-300"></div>
                            <div className="flex flex-col items-center bg-white rounded-xl border border-gray-200 p-4 shadow hover:shadow-md transition">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center mb-3 shadow">
                                    <Book className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 text-center">Jelita</h3>
                                <p className="text-xs text-gray-600 text-center">Administrator</p>
                            </div>
                        </div>

                        {/* Agus Surya */}
                        <div className="relative">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-0.5 bg-blue-300"></div>
                            <div className="flex flex-col items-center bg-white rounded-xl border border-gray-200 p-4 shadow hover:shadow-md transition">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center mb-3 shadow">
                                    <Brush className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 text-center">Agus Surya</h3>
                                <p className="text-xs text-gray-600 text-center">UI/UX Designer</p>
                            </div>
                        </div>

                        {/* Rihaf */}
                        <div className="relative">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-0.5 bg-blue-300"></div>
                            <div className="flex flex-col items-center bg-white rounded-xl border border-gray-200 p-4 shadow hover:shadow-md transition">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center mb-3 shadow">
                                    <Lightbulb className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 text-center">Rihaf</h3>
                                <p className="text-xs text-gray-600 text-center">Lighting Installation</p>
                            </div>
                        </div>
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
                            Kami menciptakan lingkungan kerja yang mendukung pertumbuhan dan inovasi
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
                                Peluang berkembang dengan training dan sertifikasi profesional
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
                        Kami selalu mencari talenta terbaik untuk bergabung dengan tim profesional kami
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/kontak">
                            <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold">
                                Kirim Lamaran
                            </Button>
                        </Link>
                        <Link href="/tentang-kami">
                            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold">
                                Pelajari Lebih Lanjut
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}