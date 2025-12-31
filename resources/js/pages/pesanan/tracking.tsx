import { useForm, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import SEOHead from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Package, AlertCircle, CheckCircle, Clock, Book, User, Mail, Phone, Calendar, Hourglass, FileSearch, Send, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import React from 'react';

interface PesananData {
    id: number;
    code: string;
    name: string;
    email: string;
    telp: string;
    description: string;
    due_date: string;
    status: string;
    created_at: string;
    service: {
        id: number;
        title: string;
    };
}

interface TrackingProps {
    pesanan?: PesananData;
    flash?: {
        pesanan?: PesananData;
    };
}

export default function OrderTracking({ pesanan, flash }: TrackingProps) {
    const orderData = pesanan || flash?.pesanan;
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/pesanan/tracking', {
            preserveScroll: false,
            onSuccess: () => {
                setTimeout(() => {
                    document.getElementById('tracking-result')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        });
    };

    // Status steps configuration
    const statusSteps = [
        { key: 'pending', label: 'Pending', icon: Hourglass },
        { key: 'verifikasi', label: 'Verifikasi', icon: FileSearch },
        { key: 'proses', label: 'Diproses', icon: Clock },
        { key: 'approval', label: 'Approval', icon: Send },
        { key: 'running', label: 'Tindak Lanjut', icon: MessageSquare },
        { key: 'selesai', label: 'Selesai', icon: CheckCircle },
    ];

    const getStatusIndex = (status: string) => {
        return statusSteps.findIndex(step => step.key === status);
    };

    const isStepActive = (stepIndex: number, currentStatus: string) => {
        const currentIndex = getStatusIndex(currentStatus);
        return stepIndex <= currentIndex;
    };

    const isStepNext = (stepIndex: number, currentStatus: string) => {
        const currentIndex = getStatusIndex(currentStatus);
        return stepIndex === currentIndex + 1;
    };

    return (
        <PublicLayout>
            <SEOHead
                title="Lacak Pesanan - SKYNUSA TECH"
                description="Lacak status pesanan Anda secara real-time"
                canonical="https://skynusa-tech.com/tracking"
            />
            
            {/* Custom CSS for animations */}
            <style>{`
                @keyframes pulse-ring {
                    0% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                    }
                    50% {
                        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }

                @keyframes rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes bounce-subtle {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }

                .pulse-ring-animation {
                    animation: pulse-ring 2s ease-out infinite;
                }

                .shimmer-animation {
                    background: linear-gradient(
                        90deg,
                        rgba(59, 130, 246, 0.1) 0%,
                        rgba(59, 130, 246, 0.3) 50%,
                        rgba(59, 130, 246, 0.1) 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                }

                .rotate-animation {
                    animation: rotate 2s linear infinite;
                }

                .bounce-animation {
                    animation: bounce-subtle 1.5s ease-in-out infinite;
                }

                .fade-in {
                    animation: fadeIn 0.5s ease-in;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .progress-line-animated {
                    position: relative;
                    overflow: hidden;
                }

                .progress-line-animated::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 30%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.6),
                        transparent
                    );
                    animation: shimmer 2s infinite;
                }
            `}</style>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-16">
                <div className="absolute inset-0 bg-[url('/asset/bg-main.png')] bg-cover bg-center opacity-20"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2">
                            <Package className="h-5 w-5 text-white" />
                            <span className="text-xl font-extrabold text-white">LACAK PESANAN</span>
                        </div>
                        <h1 className="mb-6 text-4xl lg:text-5xl font-bold text-white">
                            Tracking Pesanan
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-blue-100">
                            Masukkan kode pesanan Anda untuk melihat status terkini
                        </p>
                    </div>
                </div>
            </section>

            {/* Tracking Form */}
            <section className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Error Message */}
                    {errors?.code && (
                        <Alert className="mb-8 border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                                {errors.code}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Card className="shadow-lg bg-white text-black">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                <Search className="h-8 w-8 text-blue-600" />
                            </div>
                            <CardTitle className="text-2xl">Masukkan Kode Pesanan</CardTitle>
                            <CardDescription>
                                Kode pesanan telah dikirim ke email Anda saat membuat pesanan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Kode Pesanan</Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="Contoh: ORD-SKYNUSA-20251229-ABC12"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        className={`text-center text-lg font-mono ${errors.code ? 'border-red-500' : ''}`}
                                        disabled={processing}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            Mencari...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="mr-2 h-4 w-4" />
                                            Lacak Pesanan
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Info */}
                            <div className="mt-8 rounded-lg bg-gray-50 border border-gray-200 p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">💡 Tips:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Kode pesanan terdiri dari format: ORD-SKYNUSA-YYYYMMDD-XXXXX</li>
                                    <li>• Periksa email Anda (termasuk folder spam)</li>
                                    <li>• Pastikan memasukkan kode dengan benar (huruf besar)</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tracking Result */}
                    {orderData && (
                        <div id="tracking-result" className="mt-8 scroll-mt-8 fade-in">
                            {/* Status Stepper */}
                            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Status Pesanan</h3>
                                    <p className="text-sm text-gray-600">Kode: <span className="font-mono font-bold">{orderData.code}</span></p>
                                </div>

                                {/* Progress Stepper */}
                                <div className="relative">
                                    {/* Progress Line */}
                                    <div className="absolute top-10 left-0 right-0 h-1 bg-gray-200 hidden md:block" 
                                         style={{ left: '2.5rem', right: '2.5rem' }}>
                                        <div 
                                            className="h-full bg-blue-600 transition-all duration-1000 ease-out progress-line-animated"
                                            style={{ 
                                                width: `${(getStatusIndex(orderData.status) / (statusSteps.length - 1)) * 100}%` 
                                            }}
                                        />
                                    </div>

                                    {/* Steps */}
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-2 relative">
                                        {statusSteps.map((step, index) => {
                                            const Icon = step.icon;
                                            const isActive = isStepActive(index, orderData.status);
                                            const isCurrent = step.key === orderData.status;
                                            const isNext = isStepNext(index, orderData.status);

                                            return (
                                                <div key={step.key} className="flex flex-col items-center">
                                                    <div 
                                                        className={`
                                                            relative z-10 flex h-20 w-20 items-center justify-center rounded-full 
                                                            border-4 transition-all duration-500
                                                            ${isActive 
                                                                ? 'bg-blue-600 border-blue-600' 
                                                                : isNext
                                                                ? 'bg-white border-blue-300 shimmer-animation'
                                                                : 'bg-gray-100 border-gray-300'
                                                            }
                                                            ${isCurrent ? 'ring-4 ring-blue-200 scale-110 pulse-ring-animation' : ''}
                                                        `}
                                                    >
                                                        <Icon 
                                                            className={`
                                                                h-8 w-8 transition-all duration-500
                                                                ${isActive ? 'text-white' : isNext ? 'text-blue-400' : 'text-gray-400'}
                                                                ${isCurrent ? 'bounce-animation' : ''}
                                                                ${isNext ? 'rotate-animation' : ''}
                                                            `}
                                                        />
                                                    </div>
                                                    <div className="mt-3 text-center">
                                                        <p className={`
                                                            text-sm font-semibold transition-colors duration-300
                                                            ${isCurrent ? 'text-blue-600' : isNext ? 'text-blue-400' : 'text-gray-900'}
                                                        `}>
                                                            {step.label}
                                                        </p>
                                                        {isNext && (
                                                            <p className="text-xs text-blue-500 mt-1 animate-pulse">
                                                                Berikutnya...
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Status Description */}
                                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-start gap-3">
                                        <div className="shrink-0 mt-0.5">
                                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">ℹ️</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-blue-900 mb-1">
                                                Status Saat Ini: {statusSteps[getStatusIndex(orderData.status)]?.label}
                                            </h4>
                                            <p className="text-sm text-blue-700">
                                                {getStatusIndex(orderData.status) === statusSteps.length - 1 
                                                    ? '🎉 Pesanan Anda telah selesai! Terima kasih atas kepercayaan Anda.'
                                                    : `Pesanan Anda sedang dalam tahap ${statusSteps[getStatusIndex(orderData.status)]?.label.toLowerCase()}. Kami akan segera memproses ke tahap berikutnya.`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Card */}
                            <Card className="shadow-lg">
                                <CardHeader className="bg-linear-to-r from-blue-50 to-blue-100 border-b">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl text-gray-800">
                                                Detail Pesanan
                                            </CardTitle>
                                            <CardDescription className="text-gray-700">
                                                Informasi lengkap pesanan Anda
                                            </CardDescription>
                                        </div>
                                        <Package className="h-12 w-12 text-blue-600" />
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    {/* Order Details Grid */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-600">Layanan</p>
                                                <p className="font-semibold text-gray-900">
                                                    {orderData.service.title}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-600">Dibuat Pada</p>
                                                <p className="font-semibold text-gray-900">
                                                    {orderData.created_at}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <User className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-600">Nama</p>
                                                <p className="font-semibold text-gray-900">
                                                    {orderData.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-600">Target Selesai</p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(orderData.due_date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-semibold text-gray-900 break-all">
                                                    {orderData.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-600">Telepon</p>
                                                <p className="font-semibold text-gray-900">
                                                    {orderData.telp}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex gap-3">
                                            <Book className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 mb-2">Deskripsi Pesanan</p>
                                                <p className="text-gray-900 whitespace-pre-wrap">
                                                    {orderData.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-4">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                router.visit('/pesanan/tracking', {
                                                    method: 'get',
                                                    preserveScroll: false
                                                });
                                            }}
                                            className="w-full"
                                            size="lg"
                                        >
                                            Lacak Pesanan Lain
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}