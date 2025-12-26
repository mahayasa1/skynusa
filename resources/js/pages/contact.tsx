import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import SEOHead from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <PublicLayout>
            <SEOHead
                title="Kontak Kami - Hubungi SKYNUSA TECH untuk Konsultasi Gratis"
                description="Hubungi SKYNUSA TECH untuk konsultasi gratis layanan instalasi, maintenance, IT support. Respon cepat 24/7 untuk emergency. Lokasi: Bali, Indonesia. Tel: +62 812-3456-7890"
                keywords="kontak skynusa tech, hubungi teknisi bali, konsultasi instalasi, emergency service 24/7, alamat skynusa tech bali"
                canonical="https://skynusa-tech.com/kontak"
                ogImage="/asset/logo.png"
            />


            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-16">
                <div className="absolute inset-0 bg-[url('/asset/bg-main.png')] bg-cover bg-center opacity-20"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2">
                            <span className="text-xl font-extrabold text-white">HUBUNGI KAMI</span>
                        </div>
                        <h1 className="mb-6 text-4xl lg:text-5xl font-bold text-white">
                            Mari Berdiskusi Tentang Project Anda
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-blue-100">
                            Tim ahli kami siap membantu mewujudkan kebutuhan teknis bisnis Anda dengan solusi profesional
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className='bg-white'>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                            <MapPin className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Alamat Kantor</h3>
                                            <p className="text-sm text-gray-600">
                                                Royce Group, Purimas Regency 2 Kav 8, Jimbaran, Bali
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className='bg-white'>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                            <Phone className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                                            <p className="text-sm text-gray-600">
                                                +62 881-080-888-361
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className='bg-white'>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                            <Mail className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                            <p className="text-sm text-gray-600">
                                                Roycegroupbali@gmail.com
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className='bg-white'>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                            <Clock className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Jam Operasional</h3>
                                            <p className="text-sm text-gray-600">
                                                Senin - Jumat: 10:00 - 17:00<br />
                                                Sabtu - Minggu: Tutup<br />
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card className='bg-white'>
                                <CardContent className="p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Kirim Pesan
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Isi form dibawah ini dan tim kami akan menghubungi Anda dalam waktu 24 jam
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className='text-black'>Nama Lengkap <span className='text-red-600'>*</span></Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email *</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Nomor Telepon *</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    placeholder="+62 812-3456-7890"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="subject">Subjek</Label>
                                                <Input
                                                    id="subject"
                                                    name="subject"
                                                    placeholder="Konsultasi Project"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Pesan *</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Ceritakan kebutuhan project Anda..."
                                                className="min-h-[150px]"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <Button type="submit" size="lg" className="w-full md:w-auto">
                                            Kirim Pesan
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="bg-blue-200 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Lokasi Kami
                        </h2>
                        <p className="text-gray-600">
                            Kunjungi kantor kami atau jadwalkan pertemuan
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
                        <iframe
                        title="Royce Group Jimbaran"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.827654715452!2d115.14267627402164!3d-8.802256891250302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd24583f5b95ba9%3A0x22369bedb5e3736e!2sRoyce%20Group!5e0!3m2!1sid!2sid!4v1766566808620!5m2!1sid!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* Quick Contact CTA */}
            <section className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 py-16">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-6 text-3xl lg:text-4xl font-bold text-white">
                        Butuh Bantuan Segera?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                        Tim support kami siap membantu Anda 24/7 untuk kebutuhan emergency
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold">
                            Hubungi Emergency
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