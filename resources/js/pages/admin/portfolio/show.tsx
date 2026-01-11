// resources/js/pages/admin/portfolio/show.tsx
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Edit,
    Trash,
    Eye,
    EyeOff,
    Star,
    Calendar,
    MapPin,
    Clock,
    ExternalLink,
    Building2,
    Tag,
    Briefcase,
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Service {
    id: number;
    title: string;
}

interface Company {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Portfolio {
    id: number;
    title: string;
    slug: string;
    description: string;
    short_description: string;
    image: string | null;
    gallery: string[] | null;
    location: string | null;
    project_date: string | null;
    duration: string | null;
    technologies: string[] | null;
    features: string[] | null;
    project_url: string | null;
    is_active: boolean;
    is_featured: boolean;
    order: number;
    created_at: string;
    updated_at: string;
    service: Service;
    company: Company;
    category: Category;
}

interface PortfolioShowProps {
    portfolio: Portfolio;
}

export default function PortfolioShow({ portfolio }: PortfolioShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Portfolio', href: '/admin/portfolio' },
        { title: portfolio.title, href: `/admin/portfolio/${portfolio.id}` },
    ];

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus portfolio ini?')) {
            router.delete(`/admin/portfolio/${portfolio.id}`, {
                onSuccess: () => {
                    router.visit('/admin/portfolio');
                },
            });
        }
    };

    const toggleStatus = () => {
        router.patch(`/admin/portfolio/${portfolio.id}/toggle-status`);
    };

    const toggleFeatured = () => {
        router.patch(`/admin/portfolio/${portfolio.id}/toggle-featured`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={portfolio.title} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/portfolio">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Detail Portfolio</h1>
                            <p className="text-gray-600 mt-1">{portfolio.title}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={toggleFeatured}
                            className={portfolio.is_featured ? 'bg-yellow-100' : ''}
                        >
                            <Star className={`mr-2 h-4 w-4 ${portfolio.is_featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                            {portfolio.is_featured ? 'Featured' : 'Set Featured'}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={toggleStatus}
                            className={portfolio.is_active ? 'bg-green-100' : 'bg-gray-100'}
                        >
                            {portfolio.is_active ? (
                                <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Aktif
                                </>
                            ) : (
                                <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Tidak Aktif
                                </>
                            )}
                        </Button>

                        <Link href={`/admin/portfolio/${portfolio.id}/edit`}>
                            <Button variant="outline" className="bg-yellow-400">
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
                                <div className={`p-4 rounded-xl ${portfolio.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                                    {portfolio.is_active ? (
                                        <Eye className="h-8 w-8 text-green-600" />
                                    ) : (
                                        <EyeOff className="h-8 w-8 text-gray-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status Portfolio</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {portfolio.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Badge className={portfolio.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                    {portfolio.is_active ? 'Aktif' : 'Tidak Aktif'}
                                </Badge>
                                {portfolio.is_featured && (
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                        <Star className="h-3 w-3 mr-1 fill-yellow-500" />
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
                        {/* Main Image */}
                        {portfolio.image && (
                            <Card className="shadow-md bg-white">
                                <CardContent className="p-0">
                                    <img
                                        src={`/storage/${portfolio.image}`}
                                        alt={portfolio.title}
                                        className="w-full h-96 object-cover rounded-t-lg"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Description */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle>Deskripsi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {portfolio.short_description && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Ringkasan</h4>
                                        <p className="text-gray-900">{portfolio.short_description}</p>
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Deskripsi Lengkap</h4>
                                    <p className="text-gray-900 whitespace-pre-wrap">{portfolio.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Technologies */}
                        {portfolio.technologies && portfolio.technologies.length > 0 && (
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Teknologi yang Digunakan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {portfolio.technologies.map((tech, index) => (
                                            <Badge key={index} className="bg-blue-100 text-blue-800">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Features */}
                        {portfolio.features && portfolio.features.length > 0 && (
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Fitur Proyek</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {portfolio.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-green-600 mt-1">✓</span>
                                                <span className="text-gray-900">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Gallery */}
                        {portfolio.gallery && portfolio.gallery.length > 0 && (
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Galeri</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {portfolio.gallery.map((image, index) => (
                                            <img
                                                key={index}
                                                src={`/storage/${image}`}
                                                alt={`Gallery ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Project Info */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" />
                                    Informasi Proyek
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3 pb-4 border-b">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Tag className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">Layanan</p>
                                        <p className="text-base font-semibold text-gray-900 mt-1">
                                            {portfolio.service.title}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 pb-4 border-b">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Building2 className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">Klien</p>
                                        <p className="text-base font-semibold text-gray-900 mt-1">
                                            {portfolio.company.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 pb-4 border-b">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Tag className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">Kategori</p>
                                        <p className="text-base font-semibold text-gray-900 mt-1">
                                            {portfolio.category.name}
                                        </p>
                                    </div>
                                </div>

                                {portfolio.location && (
                                    <div className="flex items-start gap-3 pb-4 border-b">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <MapPin className="h-4 w-4 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-600">Lokasi</p>
                                            <p className="text-base font-semibold text-gray-900 mt-1">
                                                {portfolio.location}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {portfolio.project_date && (
                                    <div className="flex items-start gap-3 pb-4 border-b">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <Calendar className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-600">Tanggal Proyek</p>
                                            <p className="text-base font-semibold text-gray-900 mt-1">
                                                {new Date(portfolio.project_date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {portfolio.duration && (
                                    <div className="flex items-start gap-3 pb-4 border-b">
                                        <div className="p-2 bg-yellow-100 rounded-lg">
                                            <Clock className="h-4 w-4 text-yellow-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-600">Durasi</p>
                                            <p className="text-base font-semibold text-gray-900 mt-1">
                                                {portfolio.duration}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {portfolio.project_url && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <ExternalLink className="h-4 w-4 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-600">URL Proyek</p>
                                            <a
                                                href={portfolio.project_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-sm mt-1 break-all"
                                            >
                                                {portfolio.project_url}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Meta Info */}
                        <Card className="shadow-md bg-gray-50 text-black">
                            <CardHeader>
                                <CardTitle className="text-sm">Meta Informasi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-600">Slug</p>
                                    <p className="text-sm font-mono font-semibold text-gray-900">
                                        {portfolio.slug}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Urutan</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {portfolio.order}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Dibuat</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(portfolio.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Terakhir Diupdate</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(portfolio.updated_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
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
                                <Link href={`/portfolio/${portfolio.slug}`} target="_blank">
                                    <Button variant="outline" className="w-full bg-white justify-start">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Lihat di Website
                                    </Button>
                                </Link>
                                <Link href={`/admin/portfolio/${portfolio.id}/edit`}>
                                    <Button variant="outline" className="w-full bg-white justify-start">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Portfolio
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="w-full bg-white justify-start"
                                    onClick={toggleFeatured}
                                >
                                    <Star className="mr-2 h-4 w-4" />
                                    {portfolio.is_featured ? 'Unfeature' : 'Set Featured'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}