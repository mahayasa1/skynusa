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
    const { data, setData, post, processing, errors, reset } = useForm<Record<string, string>>({
        service_id: '',
        name: '',
        email: '',
        telp: '',
        description: '',
        due_date: '',
    });

    const [copied, setCopied] = React.useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/pesanan/order', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    };

    const copyToClipboard = () => {
        if (flash?.tracking_code) {
            navigator.clipboard.writeText(flash.tracking_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    const dateRef = React.useRef<HTMLInputElement>(null);
    
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

    return (
        <PublicLayout>
            <SEOHead
                title="Buat Pesanan - SKYNUSA TECH"
                description="Pesan layanan instalasi, maintenance, IT support, dan web development dari SKYNUSA TECH"
                canonical="https://skynusa-tech.com/order"
            />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-16">
                <div className="absolute inset-0 bg-[url('/asset/bg-main.png')] bg-cover bg-center opacity-20"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2">
                            <ShoppingCart className="h-5 w-5 text-white" />
                            <span className="text-xl font-extrabold text-white">BUAT PESANAN</span>
                        </div>
                        <h1 className="mb-6 text-4xl lg:text-5xl font-bold text-white">
                            Pesan Layanan Kami
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-blue-100">
                            Isi form di bawah ini untuk membuat pesanan. Tim kami akan segera memproses pesanan Anda
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
                                    
                                    <div className="bg-white rounded-lg border border-green-300 p-4">
                                        <p className="text-sm text-gray-700 mb-2">
                                            Kode Tracking Pesanan Anda:
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <code className="flex-1 text-2xl font-bold text-green-700 font-mono bg-gray-50 px-4 py-3 rounded border border-gray-200">
                                                {flash.tracking_code}
                                            </code>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={copyToClipboard}
                                                className="h-12 w-12"
                                            >
                                                {copied ? (
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <Copy className="h-5 w-5" />
                                                )}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-3">
                                            💡 Simpan kode ini untuk melacak status pesanan Anda
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            asChild
                                            variant="default"
                                            className="flex-1"
                                        >
                                            <a href="/pesanan/tracking">
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                Lacak Pesanan
                                            </a>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => window.location.reload()}
                                        >
                                            Buat Pesanan Baru
                                        </Button>
                                    </div>
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
                            <CardTitle className="text-2xl">Form Pesanan</CardTitle>
                            <CardDescription>
                                Lengkapi data berikut untuk membuat pesanan layanan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Service Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="service_id">
                                        Pilih Layanan <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.service_id} onValueChange={(value) => setData('service_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="-- Pilih Layanan --" />
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
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Masukkan nama lengkap"
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
                                            Email <span className="text-red-500">*</span>
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
                                            No. Telepon <span className="text-red-500">*</span>
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
                                        Tanggal Target Selesai <span className="text-red-500">*</span>
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
                                        Deskripsi Pesanan <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        rows={6}
                                        placeholder="Jelaskan detail pesanan Anda (lokasi, spesifikasi, kebutuhan khusus, dll)"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={errors.description ? 'border-red-500' : ''}
                                        disabled={processing}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Maksimal 5000 karakter
                                    </p>
                                </div>

                                {/* Info Box */}
                                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">Informasi:</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Pesanan akan diverifikasi oleh tim kami dalam 1x24 jam</li>
                                        <li>• Anda akan menerima kode tracking untuk memantau status pesanan</li>
                                        <li>• Tim kami akan menghubungi Anda untuk konfirmasi detail</li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="flex-1"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="animate-spin mr-2">⏳</span>
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                Buat Pesanan
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