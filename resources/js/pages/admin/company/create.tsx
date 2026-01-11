// resources/js/pages/admin/company/create.tsx
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Companies', href: '/admin/companies' },
    { title: 'Tambah Perusahaan', href: '/admin/companies/create' },
];

export default function CompanyCreate() {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        logo: null as File | null,
        website: '',
        email: '',
        phone: '',
        address: '',
        is_active: true,
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/companies', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Perusahaan" />

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
                            <h1 className="text-3xl font-bold text-gray-900">Tambah Perusahaan</h1>
                            <p className="text-gray-600 mt-1">Buat data perusahaan baru</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Informasi Dasar</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nama Perusahaan <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Contoh: PT Teknologi Indonesia"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="email@company.com"
                                                className={errors.email ? 'border-red-500' : ''}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">{errors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Telepon</Label>
                                            <Input
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="021-12345678"
                                                className={errors.phone ? 'border-red-500' : ''}
                                            />
                                            {errors.phone && (
                                                <p className="text-sm text-red-500">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="https://www.company.com"
                                            className={errors.website ? 'border-red-500' : ''}
                                        />
                                        {errors.website && (
                                            <p className="text-sm text-red-500">{errors.website}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Alamat</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Alamat lengkap perusahaan..."
                                            rows={4}
                                            className={errors.address ? 'border-red-500' : ''}
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-500">{errors.address}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Logo */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Logo Perusahaan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="logo">Logo</Label>
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className={errors.logo ? 'border-red-500' : ''}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Format: JPG, PNG, SVG, WebP (Maks. 1MB)
                                        </p>
                                        {errors.logo && (
                                            <p className="text-sm text-red-500">{errors.logo}</p>
                                        )}
                                        {logoPreview && (
                                            <div className="mt-4">
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo Preview"
                                                    className="w-32 h-32 object-contain bg-gray-100 rounded-lg p-2"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Settings */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Pengaturan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="is_active">Status Aktif</Label>
                                            <p className="text-xs text-gray-500">
                                                Tampilkan di website
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Info Card */}
                            <Card className="shadow-md bg-blue-50 text-black">
                                <CardHeader>
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        Informasi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-gray-600">
                                        Data perusahaan akan digunakan untuk menampilkan klien pada halaman portfolio.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <Card className="shadow-md bg-white text-black">
                                <CardContent className="p-4 space-y-2">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Menyimpan...' : 'Simpan Perusahaan'}
                                    </Button>
                                    <Link href="/admin/companies">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full bg-white"
                                        >
                                            Batal
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}