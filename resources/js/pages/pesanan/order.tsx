import { useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import SEOHead from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Calendar, AlertCircle, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import React from 'react';
import Turnstile from '@/components/turnstile';
import { useT } from '@/i18n';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

interface FlashMessages {
  success?: string;
  error?: string;
  tracking_code?: string;
}

interface OrderCreateProps {
  services: Array<{
    id: number;
    title: string;
  }>;
  flash?: FlashMessages;
}

export default function OrderCreate({ services = [], flash }: OrderCreateProps) {
    const t = useT();
    const { data, setData, post, processing, errors, reset } = useForm<Record<string, string>>({
        service_id: '',
        name: '',
        email: '',
        telp: '',
        description: '',
        due_date: '',
        captcha: '',
    });
    const [captchaReset, setCaptchaReset] = React.useState(0);
    const resetCaptcha = () => { setData('captcha', ''); setCaptchaReset((n) => n + 1); };

    // Show success alert when order is created
    React.useEffect(() => {
        if (flash?.success && flash?.tracking_code) {
            Swal.fire({
                icon: 'success',
                width: 420,
                title: t('order.successTitle'),
                html: `
                    <div class="text-left text-sm space-y-4">
                        <p class="text-gray-700 mb-4">${flash.success}</p>
                `,
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'px-6 py-3 rounded-lg font-semibold',
                    cancelButton: 'px-6 py-3 rounded-lg font-semibold'
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInDown animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp animate__faster'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/pesanan/order';
                }
            });
        }
    }, [flash]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Get selected service name
        const selectedService = services.find(s => s.id.toString() === data.service_id);
        
        // Konfirmasi dengan SweetAlert
        const result = await Swal.fire({
            title: t('order.confirmTitle'),
            width: 420, // 👈 bikin popup lebih kecil
            html: `
                <div class="text-left text-sm space-y-2">
                    <p class="text-gray-600 mb-2">
                        ${t('order.confirmIntro')}
                    </p>

                    <div class="bg-gray-50 rounded-md p-3 space-y-1">
                        <div class="flex">
                            <span class="font-medium text-gray-700 w-28">${t('order.confirmService')}</span>
                            <span class="text-gray-600">${selectedService?.title || '-'}</span>
                        </div>
                        <div class="flex">
                            <span class="font-medium text-gray-700 w-28">${t('order.confirmName')}</span>
                            <span class="text-gray-600">${data.name || '-'}</span>
                        </div>
                        <div class="flex">
                            <span class="font-medium text-gray-700 w-28">${t('order.confirmEmail')}</span>
                            <span class="text-gray-600">${data.email || '-'}</span>
                        </div>
                        <div class="flex">
                            <span class="font-medium text-gray-700 w-28">${t('order.confirmPhone')}</span>
                            <span class="text-gray-600">${data.telp || '-'}</span>
                        </div>
                        <div class="flex">
                            <span class="font-medium text-gray-700 w-28">${t('order.confirmTarget')}</span>
                            <span class="text-gray-600">${data.due_date || '-'}</span>
                        </div>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: t('order.yes'),
            cancelButtonText: t('order.review'),

            buttonsStyling: false,
            customClass: {
                popup: 'rounded-lg p-4', // 👈 padding popup lebih kecil
                title: 'text-base font-semibold',
                confirmButton: 'px-3 py-2 text-sm rounded bg-blue-600 text-white',
                cancelButton: 'px-3 py-2 text-sm rounded bg-gray-300 text-gray-800 ml-2',
            },
        });

        
        if (!result.isConfirmed) {
            return;
        }

        // Show loading
        Swal.fire({
            width: 420,
            title: t('order.wait'),
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        post('/pesanan/order', {
            preserveScroll: true,
            onSuccess: () => {
                Swal.close();
                reset();
                resetCaptcha();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onError: (errors) => {
                Swal.close();
                resetCaptcha();
                
                // Show error alert
                Swal.fire({
                    icon: 'error',
                    title: t('order.errorTitle'),
                    width: 420,
                    html: `
                        <div class="text-left text-sm space-y-3">
                            <p class="text-gray-700 mb-3">${t('order.errorIntro')}</p>
                            <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p class="text-red-700 text-sm">
                                    ${Object.values(errors).join('<br>')}
                                </p>
                            </div>
                            <p class="text-gray-600 text-sm mt-3">${t('order.errorHint')}</p>
                        </div>
                    `,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'px-6 py-3 rounded-lg font-semibold'
                    }
                });
                
                console.error('Validation errors:', errors);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    };
    
    const dateRef = React.useRef<HTMLInputElement>(null);
    
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

    return (
        <PublicLayout>
            <SEOHead
                title={t('order.seoTitle')}
                description={t('order.seoDesc')}
                canonical="https://skynusa-tech.com/order"
            />

            {/* Add animate.css for animations */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
            />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-16">
                <div className="absolute inset-0 bg-[url('/asset/bg-main.png')] bg-cover bg-center opacity-20"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2">
                            <ShoppingCart className="h-5 w-5 text-white" />
                            <span className="text-xl font-extrabold text-white">{t('order.badge')}</span>
                        </div>
                        <h1 className="mb-6 text-4xl lg:text-5xl font-bold text-white">
                            {t('order.heroTitle')}
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-blue-100">
                            {t('order.heroDesc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Order Form */}
            <section className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Success Message with Tracking Code */}
                    {flash?.success && flash?.tracking_code && (
                        <Alert className="mb-8 border-green-200 bg-green-50">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <AlertDescription>
                                <div className="space-y-4">
                                    <p className="font-semibold text-green-800 text-lg">
                                        {flash.success}
                                    </p>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Error Message */}
                    {errors?.error && (
                        <Alert className="mb-8 border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                                {errors.error}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Card className="shadow-lg bg-white text-black">
                        <CardHeader>
                            <CardTitle className="text-2xl">{t('order.formTitle')}</CardTitle>
                            <CardDescription>
                                {t('order.formDesc')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Service Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="service_id">
                                        {t('order.service')} <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.service_id} onValueChange={(value) => setData('service_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('order.servicePh')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {services.map((service) => (
                                                <SelectItem key={service.id} value={service.id.toString()}>
                                                    {service.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.service_id && (
                                        <p className="text-sm text-red-500">{errors.service_id}</p>
                                    )}
                                </div>

                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        {t('order.name')} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder={t('order.namePh')}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                        disabled={processing}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email & Phone */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            {t('order.email')} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={errors.email ? 'border-red-500' : ''}
                                            disabled={processing}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="telp">
                                            {t('order.phone')} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="telp"
                                            type="tel"
                                            placeholder="08xx-xxxx-xxxx"
                                            value={data.telp}
                                            onChange={(e) => setData('telp', e.target.value)}
                                            className={errors.telp ? 'border-red-500' : ''}
                                            disabled={processing}
                                        />
                                        {errors.telp && (
                                            <p className="text-sm text-red-500">{errors.telp}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Due Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="due_date">
                                        {t('order.dueDate')} <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            ref={dateRef}
                                            type="date"
                                            className="pr-10"
                                            onClick={() => dateRef.current?.showPicker()}
                                            value={data.due_date}
                                            min={today.toISOString().split('T')[0]}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            disabled={processing}
                                        />
                                        <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.due_date && (
                                        <p className="text-sm text-red-500">{errors.due_date}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        {t('order.desc')} <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        rows={6}
                                        placeholder={t('order.descPh')}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={errors.description ? 'border-red-500' : ''}
                                        disabled={processing}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        {t('order.descMax')}
                                    </p>
                                </div>

                                {/* Info Box */}
                                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">{t('order.infoTitle')}</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• {t('order.info1')}</li>
                                        <li>• {t('order.info2')}</li>
                                        <li>• {t('order.info3')}</li>
                                    </ul>
                                </div>

                                {/* Captcha */}
                                <div className="space-y-2">
                                    <Turnstile onVerify={(t) => setData('captcha', t)} resetKey={captchaReset} />
                                    {errors.captcha && <p className="text-sm text-red-600">{errors.captcha}</p>}
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="flex-1"
                                        disabled={processing || !data.captcha}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="animate-spin mr-2">⏳</span>
                                                {t('order.processing')}
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                {t('order.submit')}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>

        </PublicLayout>
    );
}