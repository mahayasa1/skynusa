// resources/js/pages/admin/pesanan/index.tsx
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { 
    Search, 
    MoreVertical, 
    Edit, 
    Trash, 
    Eye,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    Filter
} from 'lucide-react';
import { useState } from 'react';
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
    service: Service;
}

interface Statistics {
    total: number;
    pending: number;
    verifikasi: number;
    proses: number;
    approval: number;
    running: number;
    selesai: number;
    active: number;
}

interface PesananIndexProps {
    orders: {
        data: Pesanan[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    services: Service[];
    filters: {
        search?: string;
        status?: string;
        service_id?: string;
        per_page?: number;
    };
    statistics: Statistics;
    statuses: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pesanan', href: '/admin/pesanan' },
];

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-300 text-yellow-800',
    verifikasi: 'bg-blue-500 text-blue-800',
    proses: 'bg-indigo-500 text-indigo-800',
    approval: 'bg-purple-500 text-purple-800',
    running: 'bg-orange-500 text-orange-800',
    selesai: 'bg-green-500 text-green-800',
};

export default function PesananIndex({ 
    orders, 
    services, 
    filters, 
    statistics,
    statuses 
}: PesananIndexProps) {
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    const { data, setData, get } = useForm({
        search: filters.search || '',
        status: filters.status || 'all',
        service_id: filters.service_id || 'all',
        per_page: filters.per_page || 15,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Convert 'all' back to empty string for the API
        const searchData = {
            ...data,
            status: data.status === 'all' ? '' : data.status,
            service_id: data.service_id === 'all' ? '' : data.service_id,
        };
        router.get('/admin/pesanan', searchData, { preserveState: true });
    };

    const handleBulkDelete = () => {
        if (selectedOrders.length === 0) return;
        if (confirm(`Hapus ${selectedOrders.length} pesanan?`)) {
            router.post('/admin/pesanan/bulk-destroy', {
                ids: selectedOrders,
            }, {
                onSuccess: () => setSelectedOrders([]),
            });
        }
    };

    const handleBulkUpdateStatus = (status: string) => {
        if (selectedOrders.length === 0) return;
        if (confirm(`Update status ${selectedOrders.length} pesanan ke ${statuses[status]}?`)) {
            router.post('/admin/pesanan/bulk-update-status', {
                ids: selectedOrders,
                status: status,
            }, {
                onSuccess: () => setSelectedOrders([]),
            });
        }
    };

    const toggleSelectAll = () => {
        if (selectedOrders.length === orders.data.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.data.map((o) => o.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedOrders((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const statCards = [
        {
            title: 'Total Pesanan',
            value: statistics.total,
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
        },
        {
            title: 'Pending',
            value: statistics.pending,
            icon: AlertCircle,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100',
        },
        {
            title: 'Sedang Diproses',
            value: statistics.active,
            icon: Clock,
            color: 'text-orange-600',
            bg: 'bg-orange-100',
        },
        {
            title: 'Selesai',
            value: statistics.selesai,
            icon: CheckCircle2,
            color: 'text-green-600',
            bg: 'bg-green-100',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pesanan" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manajemen Pesanan</h1>
                        <p className="text-gray-600 mt-1">Kelola semua pesanan pelanggan</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card, i) => (
                        <Card key={i} className="bg-white border-0 shadow-md">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                                        <p className="text-gray-600 text-sm mt-1">{card.title}</p>
                                    </div>
                                    <div className={`${card.bg} p-3 rounded-xl`}>
                                        <card.icon className={`w-6 h-6 ${card.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <Card className="border-0 bg-white text-black shadow-md">
                    <CardContent className="p-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter className="h-5 w-5 text-gray-500" />
                                <h3 className="text-lg font-semibold">Filter Pesanan</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari kode, nama, email..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                <Select 
                                    value={data.status} 
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        {Object.entries(statuses).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select 
                                    value={data.service_id} 
                                    onValueChange={(value) => setData('service_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Layanan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Layanan</SelectItem>
                                        {services.map((service) => (
                                            <SelectItem key={service.id} value={service.id.toString()}>
                                                {service.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button type="submit" className="w-full">
                                    Terapkan Filter
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedOrders.length > 0 && (
                    <Card className="border-0 shadow-md bg-blue-100">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-900">
                                    {selectedOrders.length} pesanan dipilih
                                </span>
                                <div className="flex gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                Update Status
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {Object.entries(statuses).map(([key, label]) => (
                                                <DropdownMenuItem
                                                    key={key}
                                                    onClick={() => handleBulkUpdateStatus(key)}
                                                >
                                                    {label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        onClick={handleBulkDelete}
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Table */}
                <Card className="border-0 bg-white text-black shadow-md">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-blue-300 hover:bg-gray-0">
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedOrders.length === orders.data.length && orders.data.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead className="text-black">Kode Pesanan</TableHead>
                                        <TableHead className="text-black">Nama</TableHead>
                                        <TableHead className="text-black">Layanan</TableHead>
                                        <TableHead className="text-black">Status</TableHead>
                                        <TableHead className="text-black">Target Selesai</TableHead>
                                        <TableHead className="text-black">Tanggal Order</TableHead>
                                        <TableHead className="text-black text   -right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.length > 0 ? (
                                        orders.data.map((order) => (
                                            <TableRow key={order.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedOrders.includes(order.id)}
                                                        onCheckedChange={() => toggleSelect(order.id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-mono text-sm font-medium">
                                                    {order.code}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{order.name}</p>
                                                        <p className="text-xs text-gray-500">{order.email}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{order.service.title}</TableCell>
                                                <TableCell>
                                                    <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>
                                                        {order.status_label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(order.due_date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button className='bg-blue-200 hover:bg-blue-500' variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className='bg-white text-gray-600'>
                                                            <DropdownMenuItem asChild className='hover:bg-yellow-300'>
                                                                <Link href={`/admin/pesanan/${order.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Lihat Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/pesanan/${order.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => {
                                                                    if (confirm('Hapus pesanan ini?')) {
                                                                        router.delete(`/admin/pesanan/${order.id}`);
                                                                    }
                                                                }}
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                                Tidak ada pesanan ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Menampilkan {orders.data.length} dari {orders.total} pesanan
                        </p>
                        <div className="flex gap-2">
                            {orders.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}