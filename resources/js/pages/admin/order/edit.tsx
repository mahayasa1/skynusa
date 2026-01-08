// resources/js/pages/admin/pesanan/edit.tsx
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Service {
    id: number;
    title: string;
}

interface Pesanan {
    id: number;
    code: string;
    name: string;
    email: string;
    telp: string;
    description: string;
    due_date: string;
    status: string;
    service_id: number;
    service: Service;
    created_at: string;
}

interface PesananEditProps {
    pesanan: Pesanan;
    services: Service[];
    statuses: Record<string, string>;
}

export default function PesananEdit({ pesanan, services, statuses }: PesananEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Pesanan', href: '/admin/pesanan' },
        { title: pesanan.code, href: `/admin/pesanan/${pesanan.id}` },
        { title: 'Edit', href: `/admin/pesanan/${pesanan.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        service_id: pesanan.service_id.toString(),
        name: pesanan.name,
        email: pesanan.email,
        telp: pesanan.telp,
        description: pesanan.description,
        due_date: pesanan.due_date,
        status: pesanan.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/pesanan/${pesanan.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Pesanan ${pesanan.code}`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/admin/pesanan/${pesanan.id}`}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Pesanan</h1>
                            <p className="text-gray-600 mt-1">Kode: {pesanan.code}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Information */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Informasi Pelanggan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nama Lengkap <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Nama lengkap pelanggan"
                                                className={errors.name ? 'border-red-500' : ''}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="email@example.com"
                                                className={errors.email ? 'border-red-500' : ''}
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
                                                value={data.telp}
                                                onChange={(e) => setData('telp', e.target.value)}
                                                placeholder="08xxxxxxxxxx"
                                                className={errors.telp ? 'border-red-500' : ''}
                                            />
                                            {errors.telp && (
                                                <p className="text-sm text-red-500">{errors.telp}</p>
                                            )}
                                        </div>

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
                                                        <SelectItem 
                                                            key={service.id} 
                                                            value={service.id.toString()}
                                                        >
                                                            {service.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.service_id && (
                                                <p className="text-sm text-red-500">{errors.service_id}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Details */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Detail Pesanan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Deskripsi Pesanan <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Jelaskan detail pesanan Anda..."
                                            rows={8}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500">{errors.description}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Status & Timeline */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Status & Timeline</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">
                                            Status Pesanan <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(statuses).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="text-sm text-red-500">{errors.status}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="due_date">
                                            Target Selesai <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="due_date"
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            className={errors.due_date ? 'border-red-500' : ''}
                                        />
                                        {errors.due_date && (
                                            <p className="text-sm text-red-500">{errors.due_date}</p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            Tentukan kapan pesanan ini harus selesai
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Information */}
                            <Card className="shadow-md bg-gray-50 text-black">
                                <CardHeader>
                                    <CardTitle className="text-sm">Informasi Pesanan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-600">Kode Pesanan</p>
                                        <p className="text-sm font-mono font-semibold text-gray-900">
                                            {pesanan.code}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Tanggal Order</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {new Date(pesanan.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
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
                                    <Link href={`/admin/pesanan/${pesanan.id}`}>
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