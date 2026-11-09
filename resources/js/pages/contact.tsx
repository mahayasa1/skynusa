import { Head, useForm } from '@inertiajs/react';
import Turnstile from '@/components/turnstile';
import { useT } from '@/i18n';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import PublicLayout from '@/layouts/public-layout';
import SEOHead from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';
import { useSite } from '@/hooks/use-site';

export default function Contact() {
    const t = useT();
    const { contact } = useSite();
    const { data: formData, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        captcha: '',
    });
    const [captchaReset, setCaptchaReset] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/kontak', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                Swal.fire({
                    icon: 'success',
                    title: t('contact.successTitle'),
                    text: t('contact.successText'),
                    confirmButtonText: t('contact.close'),
                });
            },
            onFinish: () => {
                setData('captcha', '');
                setCaptchaReset((n) => n + 1);
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setData(e.target.name as keyof typeof formData, e.target.value);

    return (
        <PublicLayout>
            <SEOHead
                title={t('contact.seoTitle')}
                description={t('contact.seoDesc')}
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
                            <span className="text-xl font-extrabold text-white">{t('contact.badge')}</span>
                        </div>
                        <h1 className="mb-6 text-4xl lg:text-5xl font-bold text-white">
                            {t('contact.heroTitle')}
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-blue-100">
                            {t('contact.heroDesc')}
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
                                            <h3 className="font-semibold text-gray-900 mb-1">{t('contact.address')}</h3>
                                            <p className="text-sm text-gray-600">
                                                {contact.address}
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
                                            <h3 className="font-semibold text-gray-900 mb-1">{t('contact.phone')}</h3>
                                            <p className="text-sm text-gray-600">
                                                {contact.phone}
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
                                            <h3 className="font-semibold text-gray-900 mb-1">{t('contact.email')}</h3>
                                            <p className="text-sm text-gray-600">
                                                {contact.email}
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
                                            <h3 className="font-semibold text-gray-900 mb-1">{t('contact.hours')}</h3>
                                            <p className="text-sm text-gray-600">
                                                {contact.hours_weekday || t('contact.hoursWeek')}<br />
                                                {contact.hours_weekend || t('contact.hoursWeekend')}<br />
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
                                        {t('contact.formTitle')}
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        {t('contact.formDesc')}
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className='text-black'>{t('contact.name')} <span className='text-red-600'>*</span></Label>
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
                                                <Label htmlFor="email">{t('contact.email')} *</Label>
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
                                                <Label htmlFor="phone">{t('contact.phoneLabel')} *</Label>
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
                                                <Label htmlFor="subject">{t('contact.subject')}</Label>
                                                <Input
                                                    id="subject"
                                                    name="subject"
                                                    placeholder={t('contact.subjectPh')}
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">{t('contact.message')} *</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder={t('contact.messagePh')}
                                                className="min-h-[150px]"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Turnstile onVerify={(t) => setData('captcha', t)} resetKey={captchaReset} />
                                            {errors.captcha && <p className="text-sm text-red-600">{errors.captcha}</p>}
                                        </div>

                                        <Button type="submit" size="lg" className="w-full md:w-auto" disabled={processing || !formData.captcha}>
                                            {processing ? t('contact.sending') : t('contact.send')}
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
                            {t('contact.mapTitle')}
                        </h2>
                        <p className="text-gray-600">
                            {t('contact.mapDesc')}
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
                        {contact.map_embed_url ? (
                            <iframe
                                title={`Peta lokasi ${contact.address}`}
                                src={contact.map_embed_url}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-500">{contact.address}</div>
                        )}
                    </div>
                </div>
            </section>

            {/* Quick Contact CTA */}
            <section className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 py-16">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-6 text-3xl lg:text-4xl font-bold text-white">
                        {t('contact.urgentTitle')}
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                        {t('contact.urgentDesc')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold"
                        >
                            <a
                                href={`https://wa.me/${contact.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('contact.whatsapp')}
                            </a>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}