import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare,
    FileCheck,
    FileTextIcon,
    TrendingUp,
    Users,
    RefreshCw,
} from 'lucide-react'
import { type BreadcrumbItem } from '@/types'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { useEffect, useState, useCallback } from 'react'

/* =======================
   TYPES
======================= */

interface DashboardStats {
    total_pesanan?: number
    pending_pesanan?: number
    completed_pesanan?: number
    processing_pesanan?: number
    total_feedback?: number
    total_berita?: number
}

interface ChartData {
    month: string
    pesanan: number
    kunjungan: number
}

interface VisitorLocation {
    city: string
    coordinates: [number, number]
    visitors: number
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
    chart_data?: ChartData[]
    visitor_locations?: VisitorLocation[]
}

/* =======================
   CONSTANT DATA (OUTSIDE COMPONENT)
======================= */

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
]

const defaultChartData: ChartData[] = [
    { month: 'Jan', pesanan: 12, kunjungan: 450 },
    { month: 'Feb', pesanan: 19, kunjungan: 520 },
    { month: 'Mar', pesanan: 15, kunjungan: 480 },
    { month: 'Apr', pesanan: 25, kunjungan: 620 },
    { month: 'May', pesanan: 22, kunjungan: 590 },
    { month: 'Jun', pesanan: 30, kunjungan: 720 },
    { month: 'Jul', pesanan: 28, kunjungan: 680 },
    { month: 'Aug', pesanan: 35, kunjungan: 810 },
    { month: 'Sep', pesanan: 32, kunjungan: 750 },
    { month: 'Oct', pesanan: 40, kunjungan: 920 },
    { month: 'Nov', pesanan: 38, kunjungan: 880 },
    { month: 'Dec', pesanan: 45, kunjungan: 1050 },
]

const defaultLocations: VisitorLocation[] = [
    { city: 'Jakarta', coordinates: [106.8456, -6.2088], visitors: 1250 },
    { city: 'Surabaya', coordinates: [112.7521, -7.2575], visitors: 890 },
    { city: 'Bandung', coordinates: [107.6191, -6.9175], visitors: 650 },
    { city: 'Medan', coordinates: [98.6722, 3.5952], visitors: 520 },
    { city: 'Denpasar', coordinates: [115.2126, -8.6705], visitors: 980 },
    { city: 'Makassar', coordinates: [119.4327, -5.1477], visitors: 420 },
    { city: 'Semarang', coordinates: [110.4203, -6.9932], visitors: 380 },
    { city: 'Yogyakarta', coordinates: [110.3695, -7.7956], visitors: 610 },
]

/* =======================
   COMPONENT
======================= */

export default function AdminDashboard({
    stats: initialStats,
    recent_pesanan: initialPesanan = [],
    recent_pesan: initialPesan = [],
    chart_data: initialChartData = [],
    visitor_locations: initialLocations = [],
}: DashboardProps) {
    const [stats, setStats] = useState(initialStats)
    const [recentPesanan, setRecentPesanan] = useState(initialPesanan)
    const [recentPesan, setRecentPesan] = useState(initialPesan)
    const [chartData, setChartData] = useState(initialChartData)
    const [locations, setLocations] = useState(initialLocations)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(new Date())

    /* =======================
       FETCH DATA
    ======================= */

    const fetchDashboardData = useCallback(async () => {
        setIsRefreshing(true)

        router.reload({
            only: [
                'stats',
                'recent_pesanan',
                'recent_pesan',
                'chart_data',
                'visitor_locations',
            ],
            onSuccess: (page) => {
                const props = page.props as any
                setStats(props.stats)
                setRecentPesanan(props.recent_pesanan || [])
                setRecentPesan(props.recent_pesan || [])
                setChartData(props.chart_data || defaultChartData)
                setLocations(props.visitor_locations || defaultLocations)
                setLastUpdate(new Date())
                setIsRefreshing(false)
            },
            onError: () => {
                setIsRefreshing(false)
            },
        })
    }, [])

    /* =======================
       AUTO REFRESH
    ======================= */

    useEffect(() => {
        const interval = setInterval(() => {
            fetchDashboardData()
        }, 30000)

        return () => clearInterval(interval)
    }, [fetchDashboardData])

    /* =======================
       DISPLAY DATA
    ======================= */

    const displayChartData =
        chartData.length > 0 ? chartData : defaultChartData
    const displayLocations =
        locations.length > 0 ? locations : defaultLocations

    const totalVisitors = displayLocations.reduce(
        (sum, loc) => sum + loc.visitors,
        0,
    )

    const formatLastUpdate = () => {
        const now = new Date()
        const diff = Math.floor(
            (now.getTime() - lastUpdate.getTime()) / 1000,
        )

        if (diff < 60) return `${diff} detik yang lalu`
        if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`
        return lastUpdate.toLocaleTimeString('id-ID')
    }

    const statCards = [
        {
            title: 'Total Pesanan',
            value: stats.total_pesanan || 0,
            icon: FileText,
            bg: 'bg-blue-100',
            color: 'text-blue-600',
        },
        {
            title: 'Pesanan Pending',
            value: stats.pending_pesanan || 0,
            icon: Clock,
            bg: 'bg-yellow-100',
            color: 'text-yellow-600',
        },
        {
            title: 'Pesanan Selesai',
            value: stats.completed_pesanan || 0,
            icon: CheckCircle2,
            bg: 'bg-green-100',
            color: 'text-green-600',
        },
        {
            title: 'Pesanan Proses',
            value: stats.processing_pesanan || 0,
            icon: RefreshCw,
            bg: 'bg-purple-100',
            color: 'text-purple-600',
        },
        {
            title: 'Total Feedback',
            value: stats.total_feedback || 0,
            icon: MessageSquare,
            bg: 'bg-pink-100',
            color: 'text-pink-600',
        },
        {
            title: 'Total Berita',
            value: stats.total_berita || 0,
            icon: FileCheck,
            bg: 'bg-indigo-100',
            color: 'text-indigo-600',
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-6 space-y-6 bg-gray-50">

                {/* Header dengan Refresh Button */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Update terakhir: {formatLastUpdate()}
                        </p>
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        disabled={isRefreshing}
                        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all ${
                            isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Memperbarui...' : 'Refresh'}
                    </button>
                </div>

                {/* Live Indicator */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                    <span>Live - Auto refresh setiap 30 detik</span>
                </div>

                {/* ======== STAT CARDS ======== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statCards.map((card, i) => (
                        <Card
                            key={i}
                            className="rounded-2xl border-0 shadow-md bg-white hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            <CardContent className="p-5">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-3xl text-gray-700 font-bold animate-fade-in">
                                            {card.value}
                                        </p>
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

                {/* ======== CHARTS & MAP SECTION ======== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* LINE CHART */}
                    <Card className="shadow-md border-0 bg-white">
                        <CardHeader>
                            <CardTitle className="text-base text-black font-semibold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                Statistik Bulanan
                                <div className="ml-auto">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={displayChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey="month" 
                                        stroke="#6b7280"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis 
                                        stroke="#6b7280"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="pesanan" 
                                        stroke="#10b981" 
                                        strokeWidth={2}
                                        dot={{ fill: '#10b981', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name="Pesanan"
                                        animationDuration={1000}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="kunjungan" 
                                        stroke="#3b82f6" 
                                        strokeWidth={2}
                                        dot={{ fill: '#3b82f6', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name="Kunjungan"
                                        animationDuration={1000}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* VISITOR MAP */}
                    <Card className="shadow-md border-0 bg-white">
                        <CardHeader>
                            <CardTitle className="text-base text-black font-semibold flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-600" />
                                Pengunjung Website ({totalVisitors.toLocaleString()})
                                <div className="ml-auto">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] bg-gray-50 rounded-lg overflow-hidden">
                            </div>
                            
                            {/* City Legend */}
                            <div className="mt-4 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                                {displayLocations.map((loc) => (
                                    <div key={loc.city} className="flex items-center gap-2 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
                                        <span className="text-gray-700">{loc.city}</span>
                                        <span className="text-gray-500">({loc.visitors})</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ======== RECENT SECTION ======== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* PESANAN */}
                    <Card className="shadow-md border-0 bg-white">
                        <CardHeader>
                            <CardTitle className="text-base text-black font-semibold flex items-center gap-2">
                                Pesanan Terbaru
                                <div className="ml-auto">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentPesanan.length ? (
                                recentPesanan.slice(0, 5).map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/admin/pesanan/${p.id}`}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all hover:translate-x-1"
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
                            <CardTitle className="text-base text-black font-semibold flex items-center gap-2">
                                Pesan Terbaru
                                <div className="ml-auto">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentPesan?.length ? (
                                recentPesan.slice(0, 5).map((m, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all hover:translate-x-1"
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

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.5s ease-in-out;
                }
            `}</style>
        </AppLayout>
    )
}