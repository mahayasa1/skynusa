// resources/js/pages/admin/services/show.tsx
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Edit,
    Trash,
    Star,
    CheckCircle,
    XCircle,
    Package,
    FileText,
    Image as ImageIcon,
    List
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Service {
    id: number;
    title: string;
    slug: string;
    description: string;
    short_description: string;
    icon: string;
    image: string;
    features: string[];
    order: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

interface ServicesShowProps {
    service: Service;
}

export default function ServicesShow({ service }: ServicesShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Layanan', href: '/admin/layanan' },
        { title: service.title, href: `/admin/layanan/${service.id}` },
    ];

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus layanan ini?')) {
            router.delete(`/admin/layanan/${service.id}`, {
                onSuccess: () => {
                    router.visit('/admin/layanan');
                },
            });
        }
    };

    const handleToggleStatus = () => {
        router.patch(`/admin/layanan/${service.id}/toggle-status`);
    };

    const handleToggleFeatured = () => {
        router.patch(`/admin/layanan/${service.id}/toggle-featured`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={service.title} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/layanan">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Detail Layanan</h1>
                            <p className="text-gray-600 mt-1">{service.title}</p>
                        </div>
                    </div>

                    <div className="text-black flex gap-2">

                        <Button
                            variant="outline"
                            onClick={handleToggleStatus}
                            className={service.is_active ? 'bg-green-50' : 'bg-red-50'}
                        >
                            {service.is_active ? (
                                <>
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                    Nonaktifkan
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Aktifkan
                                </>
                            )}
                        </Button>
                        
                        <Link href={`/admin/layanan/${service.id}/edit`}>
                            <Button variant="outline" className='bg-yellow-400'>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                {/* Status Card */}
                <Card className="border-2 bg-white shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-xl ${service.is_active ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <Package className={`h-8 w-8 ${service.is_active ? 'text-green-600' : 'text-red-600'}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status Layanan</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {service.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Badge className={service.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                                    {service.is_active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                                {service.is_featured && (
                                    <Badge className="bg-yellow-500 text-white">
                                        <Star className="w-3 h-3 mr-1" />
                                        Featured
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Informasi Dasar
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Judul Layanan
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        {service.title}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Slug
                                    </label>
                                    <p className="text-base font-mono text-gray-900 mt-1">
                                        {service.slug}
                                    </p>
                                </div>

                                {service.short_description && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Deskripsi Singkat
                                        </label>
                                        <p className="text-base text-gray-900 mt-1">
                                            {service.short_description}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Deskripsi Lengkap
                                    </label>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900 whitespace-pre-wrap">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        {service.features && service.features.length > 0 && (
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <List className="h-5 w-5" />
                                        Fitur Layanan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {service.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-900">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Media */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    Media
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {service.image && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Gambar Layanan
                                        </label>
                                        <div className="mt-2">
                                            <img
                                                src={`/storage/${service.image}`}
                                                alt={service.title}
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                )}

                                {service.icon && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Icon Layanan
                                        </label>
                                        <div className="mt-2">
                                            <img
                                                src={`/storage/${service.icon}`}
                                                alt={`${service.title} icon`}
                                                className="w-24 h-24 object-contain bg-gray-100 rounded-lg p-2"
                                            />
                                        </div>
                                    </div>
                                )}

                                {!service.image && !service.icon && (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        Tidak ada media
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Settings Info */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle>Pengaturan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Urutan</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {service.order}
                                    </p>
                                </div>

                                <div className="pt-4 border-t space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Status Aktif</span>
                                        {service.is_active ? (
                                            <Badge className="bg-green-500">Aktif</Badge>
                                        ) : (
                                            <Badge className="bg-red-500">Nonaktif</Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Featured</span>
                                        {service.is_featured ? (
                                            <Badge className="bg-yellow-500">
                                                <Star className="w-3 h-3 mr-1" />
                                                Ya
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-gray-400">Tidak</Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timestamps */}
                        <Card className="shadow-md bg-gray-50 text-black">
                            <CardHeader>
                                <CardTitle className="text-sm">Informasi Waktu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-600">Dibuat</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(service.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Terakhir Diupdate</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(service.updated_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}