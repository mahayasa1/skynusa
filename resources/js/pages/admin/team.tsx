// resources/js/pages/admin/team.tsx
// Admin > Tim: bagan organisasi di beranda dan halaman /tim.
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Plus, Save, Trash2, Users, X } from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Tim', href: '/admin/tim' },
];

interface Member {
    id: number;
    name: string;
    role: string;
    sub_role: string | null;
    photo: string | null;
    photo_url: string;
    level: 'ceo' | 'management' | 'staff';
    order: number;
    is_active: boolean;
}

interface Props {
    members: Member[];
    levels: Record<string, string>;
}

const emptyForm = {
    name: '',
    role: '',
    sub_role: '',
    level: 'staff' as Member['level'],
    order: '' as string | number,
    is_active: true,
    photo: null as File | null,
    remove_photo: false,
};

export default function TeamAdmin({ members, levels }: Props) {
    const [editing, setEditing] = useState<Member | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm(emptyForm);

    const startEdit = (m: Member) => {
        setEditing(m);
        setPreview(null);
        clearErrors();
        setData({
            name: m.name,
            role: m.role,
            sub_role: m.sub_role ?? '',
            level: m.level,
            order: m.order,
            is_active: m.is_active,
            photo: null,
            remove_photo: false,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancel = () => {
        setEditing(null);
        setPreview(null);
        reset();
        clearErrors();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(editing ? `/admin/tim/${editing.id}` : '/admin/tim', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: cancel,
        });
    };

    const remove = (m: Member) => {
        if (!window.confirm(`Hapus ${m.name} dari tim?`)) return;
        router.delete(`/admin/tim/${m.id}`, { preserveScroll: true });
    };

    const currentPhoto = preview ?? (editing && !data.remove_photo ? editing.photo_url : null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tim" />
            <div className="max-w-4xl space-y-6 p-6">
                <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold">Tim</h1>
                        <p className="text-sm text-muted-foreground">Bagan organisasi di beranda dan halaman Tim. Urutan tampil mengikuti kolom urutan (angka kecil lebih dulu).</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{editing ? `Ubah: ${editing.name}` : 'Tambah anggota'}</CardTitle>
                        <CardDescription>Bagan hanya punya satu kotak pimpinan. Memilih "CEO / Pimpinan" untuk orang baru memindahkan pimpinan lama ke Manajemen.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Nama</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="role">Jabatan</Label>
                                <Input id="role" value={data.role} onChange={(e) => setData('role', e.target.value)} />
                                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="sub_role">Keterangan (opsional)</Label>
                                <Input id="sub_role" value={data.sub_role} onChange={(e) => setData('sub_role', e.target.value)} />
                                {errors.sub_role && <p className="text-sm text-destructive">{errors.sub_role}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="level">Tingkat</Label>
                                <select id="level" value={data.level} onChange={(e) => setData('level', e.target.value as Member['level'])}
                                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                                    {Object.entries(levels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                                {errors.level && <p className="text-sm text-destructive">{errors.level}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="order">Urutan</Label>
                                <Input id="order" type="number" min={0} placeholder="Otomatis di paling akhir" value={data.order}
                                    onChange={(e) => setData('order', e.target.value)} />
                                {errors.order && <p className="text-sm text-destructive">{errors.order}</p>}
                            </div>
                            <label className="flex items-center gap-2 self-end pb-2 text-sm">
                                <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                                Tampilkan di website
                            </label>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="photo">Foto (JPG/PNG/WebP, maks 2 MB)</Label>
                                {currentPhoto && <img src={currentPhoto} alt="Foto anggota" className="h-20 w-20 rounded-full object-cover" />}
                                <Input id="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setData('photo', file);
                                    setPreview(file ? URL.createObjectURL(file) : null);
                                }} />
                                {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
                                {editing?.photo && (
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={data.remove_photo} onChange={(e) => setData('remove_photo', e.target.checked)} />
                                        Hapus foto (pakai foto profil standar)
                                    </label>
                                )}
                            </div>

                            <div className="flex gap-2 sm:col-span-2">
                                <Button type="submit" disabled={processing}>
                                    {editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                    {processing ? 'Menyimpan...' : editing ? 'Simpan perubahan' : 'Tambah anggota'}
                                </Button>
                                {editing && (
                                    <Button type="button" variant="outline" onClick={cancel}>
                                        <X className="h-4 w-4" /> Batal
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {(['ceo', 'management', 'staff'] as const).map((level) => {
                    const list = members.filter((m) => m.level === level);
                    return (
                        <Card key={level}>
                            <CardHeader><CardTitle>{levels[level]}</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {list.length === 0 && <p className="text-sm text-muted-foreground">Belum ada.</p>}
                                {list.map((m) => (
                                    <div key={m.id} className="flex items-center gap-3 rounded-lg border p-3">
                                        <img src={m.photo_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">
                                                {m.name} {!m.is_active && <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">disembunyikan</span>}
                                            </p>
                                            <p className="truncate text-sm text-muted-foreground">
                                                {[m.role, m.sub_role].filter(Boolean).join(' · ')} · urutan {m.order}
                                            </p>
                                        </div>
                                        <Button type="button" variant="outline" size="icon" aria-label={`Ubah ${m.name}`} onClick={() => startEdit(m)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button type="button" variant="outline" size="icon" aria-label={`Hapus ${m.name}`} onClick={() => remove(m)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </AppLayout>
    );
}
