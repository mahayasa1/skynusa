// resources/js/pages/admin/services/edit.tsx
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
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
}

interface ServicesEditProps {
    service: Service;
}

export default function ServicesEdit({ service }: ServicesEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Layanan', href: '/admin/layanan' },
        { title: service.title, href: `/admin/layanan/${service.id}` },
        { title: 'Edit', href: `/admin/layanan/${service.id}/edit` },
    ];

    const [imagePreview, setImagePreview] = useState<string | null>(
        service.image ? `/storage/${service.image}` : null
    );
    const [iconPreview, setIconPreview] = useState<string | null>(
        service.icon ? `/storage/${service.icon}` : null
    );
    const [features, setFeatures] = useState<string[]>(
        service.features && service.features.length > 0 ? service.features : ['']
    );

    const { data, setData, post, processing, errors } = useForm({
        title: service.title,
        description: service.description,
        short_description: service.short_description || '',
        image: null as File | null,
        icon: null as File | null,
        features: service.features || [],
        order: service.order,
        is_active: service.is_active,
        is_featured: service.is_featured,
        _method: 'PUT',
    });

    useEffect(() => {
        setData('features', features.filter(f => f.trim() !== ''));
    }, [features]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('icon', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setIconPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addFeature = () => {
        setFeatures([...features, '']);
    };

    const removeFeature = (index: number) => {
        const newFeatures = features.filter((_, i) => i !== index);
        setFeatures(newFeatures);
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/layanan/${service.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${service.title}`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/admin/layanan/${service.id}`}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Layanan</h1>
                            <p className="text-gray-600 mt-1">{service.title}</p>
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
                                        <Label htmlFor="title">
                                            Judul Layanan <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Contoh: Instalasi CCTV Profesional"
                                            className={errors.title ? 'border-red-500' : ''}
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500">{errors.title}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="short_description">
                                            Deskripsi Singkat
                                        </Label>
                                        <Textarea
                                            id="short_description"
                                            value={data.short_description}
                                            onChange={(e) => setData('short_description', e.target.value)}
                                            placeholder="Deskripsi singkat untuk preview (maks. 200 karakter)"
                                            rows={3}
                                            maxLength={200}
                                            className={errors.short_description ? 'border-red-500' : ''}
                                        />
                                        <p className="text-xs text-gray-500">
                                            {data.short_description.length}/200 karakter
                                        </p>
                                        {errors.short_description && (
                                            <p className="text-sm text-red-500">{errors.short_description}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Deskripsi Lengkap <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Jelaskan detail layanan..."
                                            rows={8}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500">{errors.description}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Features */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Fitur Layanan</CardTitle>
                                        <Button type="button" size="sm" onClick={addFeature}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah Fitur
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={feature}
                                                onChange={(e) => updateFeature(index, e.target.value)}
                                                placeholder={`Fitur ${index + 1}`}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => removeFeature(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {features.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-4">
                                            Belum ada fitur. Klik tombol "Tambah Fitur" untuk menambah.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Media */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Media</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="image">Gambar Layanan</Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className={errors.image ? 'border-red-500' : ''}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Biarkan kosong jika tidak ingin mengubah gambar
                                        </p>
                                        {errors.image && (
                                            <p className="text-sm text-red-500">{errors.image}</p>
                                        )}
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="icon">Icon Layanan</Label>
                                        <Input
                                            id="icon"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleIconChange}
                                            className={errors.icon ? 'border-red-500' : ''}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Biarkan kosong jika tidak ingin mengubah icon
                                        </p>
                                        {errors.icon && (
                                            <p className="text-sm text-red-500">{errors.icon}</p>
                                        )}
                                        {iconPreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={iconPreview}
                                                    alt="Icon Preview"
                                                    className="w-24 h-24 object-contain bg-gray-100 rounded-lg p-2"
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
                                    <div className="space-y-2">
                                        <Label htmlFor="order">Urutan</Label>
                                        <Input
                                            id="order"
                                            type="number"
                                            value={data.order}
                                            onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                            min="0"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Semakin kecil angka, semakin atas urutannya
                                        </p>
                                    </div>

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

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="is_featured">Featured</Label>
                                            <p className="text-xs text-gray-500">
                                                Tampilkan di bagian unggulan
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_featured"
                                            checked={data.is_featured}
                                            onCheckedChange={(checked) => setData('is_featured', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Service Info */}
                            <Card className="shadow-md bg-gray-50 text-black">
                                <CardHeader>
                                    <CardTitle className="text-sm">Informasi Layanan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-600">Slug</p>
                                        <p className="text-sm font-mono font-semibold text-gray-900">
                                            {service.slug}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">ID</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            #{service.id}
                                        </p>
                                    </div>
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
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                    <Link href={`/admin/layanan/${service.id}`}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="bg-white text-black hover:bg-red-600 w-full"
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