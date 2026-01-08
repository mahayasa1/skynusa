// resources/js/pages/admin/pesanan/show.tsx
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ArrowLeft,
    Edit,
    Trash,
    Mail,
    Phone,
    Calendar,
    FileText,
    User,
    Package,
    ChevronDown,
    Clock,
    CheckCircle
} from 'lucide-react';
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
    status_label: string;
    status_color: string;
    created_at: string;
    updated_at: string;
    service: Service;
}

interface PesananShowProps {
    pesanan: Pesanan;
    statuses: Record<string, string>;
    nextStatusOptions: string[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500 text-yellow-800 border-yellow-200',
    verifikasi: 'bg-blue-500 text-blue-800 border-blue-200',
    proses: 'bg-indigo-500 text-indigo-800 border-indigo-200',
    approval: 'bg-purple-500 text-purple-800 border-purple-200',
    running: 'bg-orange-500 text-orange-800 border-orange-200',
    selesai: 'bg-green-500 text-green-800 border-green-200',
};

const statusIcons: Record<string, any> = {
    pending: Clock,
    verifikasi: FileText,
    proses: Package,
    approval: CheckCircle,
    running: Package,
    selesai: CheckCircle,
};

export default function PesananShow({ pesanan, statuses, nextStatusOptions }: PesananShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Pesanan', href: '/admin/pesanan' },
        { title: pesanan.code, href: `/admin/pesanan/${pesanan.id}` },
    ];

    const handleStatusUpdate = (newStatus: string) => {
        if (confirm(`Update status pesanan ke ${statuses[newStatus]}?`)) {
            router.patch(`/admin/pesanan/${pesanan.id}/update-status`, {
                status: newStatus,
            });
        }
    };

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus pesanan ini?')) {
            router.delete(`/admin/pesanan/${pesanan.id}`, {
                onSuccess: () => {
                    router.visit('/admin/pesanan');
                },
            });
        }
    };

    const StatusIcon = statusIcons[pesanan.status] || Clock;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pesanan ${pesanan.code}`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/pesanan">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Detail Pesanan</h1>
                            <p className="text-gray-600 mt-1">Kode: {pesanan.code}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {nextStatusOptions.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button>
                                        Update Status
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {nextStatusOptions.map((statusKey) => (
                                        <DropdownMenuItem
                                            key={statusKey}
                                            onClick={() => handleStatusUpdate(statusKey)}
                                        >
                                            {statuses[statusKey]}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        
                        <Link href={`/admin/pesanan/${pesanan.id}/edit`}>
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
                                <div className={`p-4 rounded-xl ${statusColors[pesanan.status]}`}>
                                    <StatusIcon className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-800">Status Pesanan</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {pesanan.status_label}
                                    </p>
                                </div>
                            </div>
                            <Badge 
                                className={`text-lg px-4 py-2 ${statusColors[pesanan.status]}`}
                            >
                                {pesanan.status_label}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Info */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informasi Pelanggan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Nama Lengkap
                                        </label>
                                        <p className="text-base font-semibold text-gray-900 mt-1">
                                            {pesanan.name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </label>
                                        <p className="text-base text-gray-900 mt-1">
                                            <a 
                                                href={`mailto:${pesanan.email}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {pesanan.email}
                                            </a>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            No. Telepon
                                        </label>
                                        <p className="text-base text-gray-900 mt-1">
                                            <a 
                                                href={`tel:${pesanan.telp}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {pesanan.telp}
                                            </a>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            Layanan
                                        </label>
                                        <p className="text-base font-semibold text-gray-900 mt-1">
                                            {pesanan.service.title}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Details */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Detail Pesanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Deskripsi Pesanan
                                    </label>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900 whitespace-pre-wrap">
                                            {pesanan.description}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Timeline Info */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3 pb-4 border-b">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">
                                            Tanggal Order
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 mt-1">
                                            {new Date(pesanan.created_at).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(pesanan.created_at).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })} WIB
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 pb-4 border-b">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Clock className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">
                                            Target Selesai
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 mt-1">
                                            {new Date(pesanan.due_date).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                        {new Date(pesanan.due_date) < new Date() && pesanan.status !== 'selesai' && (
                                            <Badge className="bg-red-100 text-red-800 mt-2">
                                                Terlambat
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Clock className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">
                                            Terakhir Diupdate
                                        </p>
                                        <p className="text-sm text-gray-900 mt-1">
                                            {new Date(pesanan.updated_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle>Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button 
                                    variant="outline" 
                                    className="w-full bg-white justify-start"
                                    onClick={() => window.location.href = `mailto:${pesanan.email}`}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Kirim Email
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full bg-white justify-start"
                                    onClick={() => window.location.href = `tel:${pesanan.telp}`}
                                >
                                    <Phone className="mr-2 h-4 w-4" />
                                    Hubungi Pelanggan
                                </Button>
                                <Link href={`/admin/pesanan/${pesanan.id}/edit`}>
                                    <Button variant="outline" className="w-full bg-white justify-start">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Pesanan
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}