// resources/js/pages/admin/portfolio/create.tsx
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Briefcase, X } from 'lucide-react';
import { useState } from 'react';
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

interface PortfolioCreateProps {
    services: Service[];
    companies: Company[];
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Portfolio', href: '/admin/portfolio' },
    { title: 'Tambah Portfolio', href: '/admin/portfolio/create' },
];

export default function PortfolioCreate({ services, companies, categories }: PortfolioCreateProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [technologies, setTechnologies] = useState<string[]>([]);
    const [features, setFeatures] = useState<string[]>([]);
    const [techInput, setTechInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        service_id: '',
        companies_id: '',
        categories_id: '',
        title: '',
        description: '',
        short_description: '',
        image: null as File | null,
        gallery: [] as File[],
        location: '',
        project_date: '',
        duration: '',
        technologies: [] as string[],
        features: [] as string[],
        project_url: '',
        is_active: true,
        is_featured: false,
        order: 0,
    });

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

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setData('gallery', files);
            
            const previews: string[] = [];
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    previews.push(reader.result as string);
                    if (previews.length === files.length) {
                        setGalleryPreviews(previews);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const addTechnology = () => {
        if (techInput.trim()) {
            const newTechs = [...technologies, techInput.trim()];
            setTechnologies(newTechs);
            setData('technologies', newTechs);
            setTechInput('');
        }
    };

    const removeTechnology = (index: number) => {
        const newTechs = technologies.filter((_, i) => i !== index);
        setTechnologies(newTechs);
        setData('technologies', newTechs);
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            const newFeatures = [...features, featureInput.trim()];
            setFeatures(newFeatures);
            setData('features', newFeatures);
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        const newFeatures = features.filter((_, i) => i !== index);
        setFeatures(newFeatures);
        setData('features', newFeatures);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/portfolio', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Portfolio" />

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
                            <h1 className="text-3xl font-bold text-gray-900">Tambah Portfolio</h1>
                            <p className="text-gray-600 mt-1">Buat portfolio proyek baru</p>
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
                                            Judul Portfolio <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Contoh: Instalasi CCTV Hotel Bintang 5"
                                            className={errors.title ? 'border-red-500' : ''}
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500">{errors.title}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="short_description">Deskripsi Singkat</Label>
                                        <Textarea
                                            id="short_description"
                                            value={data.short_description}
                                            onChange={(e) => setData('short_description', e.target.value)}
                                            placeholder="Deskripsi singkat untuk preview..."
                                            rows={3}
                                            className={errors.short_description ? 'border-red-500' : ''}
                                        />
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
                                            placeholder="Deskripsi detail proyek..."
                                            rows={6}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="service_id">
                                                Layanan <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={data.service_id}
                                                onValueChange={(value) => setData('service_id', value)}
                                            >
                                                <SelectTrigger className={errors.service_id ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Pilih layanan" />
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

                                        <div className="space-y-2">
                                            <Label htmlFor="companies_id">
                                                Klien <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={data.companies_id}
                                                onValueChange={(value) => setData('companies_id', value)}
                                            >
                                                <SelectTrigger className={errors.companies_id ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Pilih klien" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {companies.map((company) => (
                                                        <SelectItem key={company.id} value={company.id.toString()}>
                                                            {company.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.companies_id && (
                                                <p className="text-sm text-red-500">{errors.companies_id}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="categories_id">
                                                Kategori <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={data.categories_id}
                                                onValueChange={(value) => setData('categories_id', value)}
                                            >
                                                <SelectTrigger className={errors.categories_id ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Pilih kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id.toString()}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.categories_id && (
                                                <p className="text-sm text-red-500">{errors.categories_id}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Project Details */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Detail Proyek</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Lokasi</Label>
                                            <Input
                                                id="location"
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                placeholder="Contoh: Denpasar, Bali"
                                                className={errors.location ? 'border-red-500' : ''}
                                            />
                                            {errors.location && (
                                                <p className="text-sm text-red-500">{errors.location}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="project_date">Tanggal Proyek</Label>
                                            <Input
                                                id="project_date"
                                                type="date"
                                                value={data.project_date}
                                                onChange={(e) => setData('project_date', e.target.value)}
                                                className={errors.project_date ? 'border-red-500' : ''}
                                            />
                                            {errors.project_date && (
                                                <p className="text-sm text-red-500">{errors.project_date}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="duration">Durasi</Label>
                                            <Input
                                                id="duration"
                                                value={data.duration}
                                                onChange={(e) => setData('duration', e.target.value)}
                                                placeholder="Contoh: 2 Minggu"
                                                className={errors.duration ? 'border-red-500' : ''}
                                            />
                                            {errors.duration && (
                                                <p className="text-sm text-red-500">{errors.duration}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="project_url">URL Proyek</Label>
                                        <Input
                                            id="project_url"
                                            type="url"
                                            value={data.project_url}
                                            onChange={(e) => setData('project_url', e.target.value)}
                                            placeholder="https://www.example.com"
                                            className={errors.project_url ? 'border-red-500' : ''}
                                        />
                                        {errors.project_url && (
                                            <p className="text-sm text-red-500">{errors.project_url}</p>
                                        )}
                                    </div>

                                    {/* Technologies */}
                                    <div className="space-y-2">
                                        <Label>Teknologi yang Digunakan</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={techInput}
                                                onChange={(e) => setTechInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                                                placeholder="Ketik teknologi dan tekan Enter"
                                            />
                                            <Button type="button" onClick={addTechnology}>
                                                Tambah
                                            </Button>
                                        </div>
                                        {technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {technologies.map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                    >
                                                        {tech}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTechnology(index)}
                                                            className="hover:text-blue-600"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-2">
                                        <Label>Fitur Proyek</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={featureInput}
                                                onChange={(e) => setFeatureInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                                placeholder="Ketik fitur dan tekan Enter"
                                            />
                                            <Button type="button" onClick={addFeature}>
                                                Tambah
                                            </Button>
                                        </div>
                                        {features.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {features.map((feature, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                                    >
                                                        {feature}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFeature(index)}
                                                            className="hover:text-green-600"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Images */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Gambar Portfolio</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="image">Gambar Utama</Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className={errors.image ? 'border-red-500' : ''}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Format: JPG, PNG, WebP (Maks. 2MB)
                                        </p>
                                        {errors.image && (
                                            <p className="text-sm text-red-500">{errors.image}</p>
                                        )}
                                        {imagePreview && (
                                            <div className="mt-4">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gallery">Galeri (Multiple)</Label>
                                        <Input
                                            id="gallery"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleGalleryChange}
                                            className={errors.gallery ? 'border-red-500' : ''}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Pilih beberapa gambar untuk galeri
                                        </p>
                                        {errors.gallery && (
                                            <p className="text-sm text-red-500">{errors.gallery}</p>
                                        )}
                                        {galleryPreviews.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2 mt-4">
                                                {galleryPreviews.map((preview, index) => (
                                                    <img
                                                        key={index}
                                                        src={preview}
                                                        alt={`Gallery ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded"
                                                    />
                                                ))}
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

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="is_featured">Featured</Label>
                                            <p className="text-xs text-gray-500">
                                                Tampilkan di halaman utama
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_featured"
                                            checked={data.is_featured}
                                            onCheckedChange={(checked) => setData('is_featured', checked)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="order">Urutan Tampilan</Label>
                                        <Input
                                            id="order"
                                            type="number"
                                            value={data.order}
                                            onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Angka lebih kecil akan tampil lebih dulu
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Info Card */}
                            <Card className="shadow-md bg-blue-50 text-black">
                                <CardHeader>
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        Informasi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-gray-600">
                                        Portfolio akan ditampilkan di halaman portfolio dan dapat difilter berdasarkan layanan dan kategori.
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
                                        {processing ? 'Menyimpan...' : 'Simpan Portfolio'}
                                    </Button>
                                    <Link href="/admin/portfolio">
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