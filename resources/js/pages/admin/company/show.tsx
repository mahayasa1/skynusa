// resources/js/pages/admin/company/show.tsx
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Edit,
    Trash,
    Globe,
    Mail,
    Phone,
    MapPin,
    Building2,
    CheckCircle,
    XCircle,
    Calendar
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Company {
    id: number;
    name: string;
    slug: string;
    logo: string;
    website: string;
    email: string;
    phone: string;
    address: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface CompanyShowProps {
    company: Company;
}

export default function CompanyShow({ company }: CompanyShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Companies', href: '/admin/companies' },
        { title: company.name, href: `/admin/companies/${company.id}` },
    ];

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus perusahaan ini?')) {
            router.delete(`/admin/companies/${company.id}`, {
                onSuccess: () => {
                    router.visit('/admin/companies');
                },
            });
        }
    };

    const handleToggleStatus = () => {
        router.patch(`/admin/companies/${company.id}/toggle-status`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={company.name} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/companies">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Detail Perusahaan</h1>
                            <p className="text-gray-600 mt-1">{company.name}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleToggleStatus}
                            className={company.is_active ? 'bg-green-50' : 'bg-red-50'}
                        >
                            {company.is_active ? (
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
                        
                        <Link href={`/admin/companies/${company.id}/edit`}>
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
                                <div className={`p-4 rounded-xl ${company.is_active ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <Building2 className={`h-8 w-8 ${company.is_active ? 'text-green-600' : 'text-red-600'}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status Perusahaan</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {company.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    </p>
                                </div>
                            </div>
                            <Badge className={company.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                                {company.is_active ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Company Info */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Informasi Perusahaan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {company.logo && (
                                    <div className="pb-4 border-b">
                                        <label className="text-sm font-medium text-gray-600">
                                            Logo
                                        </label>
                                        <div className="mt-2">
                                            <img
                                                src={`/storage/${company.logo}`}
                                                alt={company.name}
                                                className="w-32 h-32 object-contain bg-gray-100 rounded-lg p-2"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Nama Perusahaan
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        {company.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Slug
                                    </label>
                                    <p className="text-base font-mono text-gray-900 mt-1">
                                        {company.slug}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle>Informasi Kontak</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {company.email && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Mail className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-600">
                                                Email
                                            </label>
                                            <p className="text-base text-gray-900 mt-1">
                                                <a 
                                                    href={`mailto:${company.email}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {company.email}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {company.phone && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Phone className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-600">
                                                Telepon
                                            </label>
                                            <p className="text-base text-gray-900 mt-1">
                                                <a 
                                                    href={`tel:${company.phone}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {company.phone}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {company.website && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Globe className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-600">
                                                Website
                                            </label>
                                            <p className="text-base text-gray-900 mt-1">
                                                <a 
                                                    href={company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {company.website}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {company.address && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <MapPin className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-600">
                                                Alamat
                                            </label>
                                            <p className="text-base text-gray-900 mt-1 whitespace-pre-wrap">
                                                {company.address}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!company.email && !company.phone && !company.website && !company.address && (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        Tidak ada informasi kontak
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Timestamps */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Informasi Waktu
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-600">Dibuat</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(company.created_at).toLocaleDateString('id-ID', {
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
                                        {new Date(company.updated_at).toLocaleDateString('id-ID', {
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

                        {/* Quick Actions */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle>Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link href={`/admin/companies/${company.id}/edit`}>
                                    <Button variant="outline" className="w-full bg-white justify-start">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Perusahaan
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="w-full bg-white justify-start"
                                    onClick={handleToggleStatus}
                                >
                                    {company.is_active ? (
                                        <>
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Nonaktifkan
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Aktifkan
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}