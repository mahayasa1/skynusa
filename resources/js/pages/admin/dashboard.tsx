import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare,
    Star,
    FileCheck,
    FileTextIcon,
} from 'lucide-react'
import { type BreadcrumbItem } from '@/types'

interface DashboardStats {
    total_pesanan?: number
    pending_pesanan?: number
    completed_pesanan?: number
    processing_pesanan?: number
    total_feedback?: number
    total_berita?: number
}

interface RecentItem {
    id: number
    name?: string
    service?: {
        title: string
    }
    title?: string
}

interface DashboardProps {
    stats: DashboardStats
    recent_pesanan?: RecentItem[]
    recent_pesan?: RecentItem[]
    role: string
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
]

export default function AdminDashboard({
    stats,
    recent_pesanan = [],
    recent_pesan = [],
}: DashboardProps) {

    const statCards = [
        {
            title: 'Pesanan Masuk',
            value: stats.total_pesanan || 0,
            icon: FileTextIcon,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100',
        },
        {
            title: 'Pesanan Belum Diverifikasi',
            value: stats.pending_pesanan || 0,
            icon: AlertCircle,
            color: 'text-red-600',
            bg: 'bg-red-100',
        },
        {
            title: 'Pesanan Sedang Diproses',
            value: stats.processing_pesanan || 0,
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100',
        },
        {
            title: 'Pesanan Selesai',
            value: stats.completed_pesanan || 0,
            icon: CheckCircle2,
            color: 'text-green-600',
            bg: 'bg-green-100',
        },
        {
            title: 'Total Feedback Masuk',
            value: stats.total_feedback || 0,
            icon: MessageSquare,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
        },
        {
            title: 'Total Berita Dipublikasikan',
            value: stats.total_berita || 0,
            icon: FileCheck,
            color: 'text-gray-700',
            bg: 'bg-gray-200',
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-6 space-y-6 bg-white">

                {/* ======== STAT CARDS ======== */}
                <div className="grid grid-cols-1 md:grid-cols-2 bg-white lg:grid-cols-3 gap-4">

                    {statCards.map((card, i) => (
                        <Card
                            key={i}
                            className="rounded-2xl border-0 shadow-md bg-white hover:shadow-xl transition-all"
                        >
                            <CardContent className="p-5">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-3xl text-gray-700 font-bold">{card.value}</p>
                                        <p className="text-gray-600 text-sm">{card.title}</p>
                                    </div>

                                    <div className={`${card.bg} p-3 rounded-xl`}>
                                        <card.icon className={`w-6 h-6 ${card.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                </div>

                {/* ======== RECENT SECTION ======== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* PESANAN */}
                    <Card className="shadow-md border-0 bg-white">
                        <CardHeader>
                            <CardTitle className="text-base text-black font-semibold">
                                Pesanan Terbaru
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {recent_pesanan.length ? (
                                recent_pesanan.slice(0, 5).map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/admin/pesanan/${p.id}`}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="bg-gray-200 p-2 rounded-full">
                                            <FileText className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{p.service?.title}</p>
                                            <p className="text-xs text-gray-500">{p.name}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Belum ada pesanan.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* PESAN */}
                    <Card className="shadow-md bg-white border-0">
                        <CardHeader>
                            <CardTitle className="text-base text-black font-semibold">
                                Pesan Terbaru
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {recent_pesan?.length ? (
                                recent_pesan.slice(0, 5).map((m, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="bg-gray-200 p-2 rounded-full">
                                            <MessageSquare className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{m.title}</p>
                                            <p className="text-xs text-gray-500">{m.name}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Belum ada pesan.</p>
                            )}
                        </CardContent>
                    </Card>

                </div>

            </div>
        </AppLayout>
    )
}
