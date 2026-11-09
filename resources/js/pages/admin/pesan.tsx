// resources/js/pages/admin/pesan.tsx
// Admin > Pesan: kotak masuk dari formulir Kontak.
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pesan', href: '/admin/pesan' },
];

interface Pesan {
    id: number;
    name: string;
    email: string;
    telp: string;
    judul: string;
    isi: string;
    created_at: string;
}

interface Paginated {
    data: Pesan[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
}

export default function PesanAdmin({ pesans, filters }: { pesans: Paginated; filters: { search: string } }) {
    const [search, setSearch] = useState(filters.search ?? '');

    const doSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/pesan', { search }, { preserveState: true, replace: true });
    };

    const remove = (p: Pesan) => {
        if (!window.confirm(`Hapus pesan dari ${p.name}?`)) return;
        router.delete(`/admin/pesan/${p.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pesan" />
            <div className="max-w-4xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Pesan masuk</h1>
                    <p className="text-sm text-muted-foreground">{pesans.total} pesan dari formulir Kontak.</p>
                </div>

                <form onSubmit={doSearch} className="flex gap-2">
                    <Input placeholder="Cari nama, email, atau isi pesan" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <Button type="submit" variant="outline"><Search className="h-4 w-4" /> Cari</Button>
                </form>

                {pesans.data.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Belum ada pesan.</p>}

                <div className="space-y-3">
                    {pesans.data.map((p) => (
                        <Card key={p.id}>
                            <CardContent className="space-y-2 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold">{p.judul}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {p.name} · {new Date(p.created_at).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <Button type="button" variant="outline" size="icon" aria-label={`Hapus pesan dari ${p.name}`} onClick={() => remove(p)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="whitespace-pre-line text-sm">{p.isi}</p>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <a href={`mailto:${p.email}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline"><Mail className="h-4 w-4" /> {p.email}</a>
                                    <a href={`tel:${p.telp.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline"><Phone className="h-4 w-4" /> {p.telp}</a>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {pesans.links.length > 3 && (
                    <div className="flex flex-wrap gap-1">
                        {pesans.links.map((l, i) => (
                            l.url ? (
                                <Link key={i} href={l.url} preserveScroll
                                    className={`rounded border px-3 py-1 text-sm ${l.active ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
                                    dangerouslySetInnerHTML={{ __html: l.label }} />
                            ) : (
                                <span key={i} className="rounded border px-3 py-1 text-sm opacity-50" dangerouslySetInnerHTML={{ __html: l.label }} />
                            )
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
