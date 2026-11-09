// resources/js/pages/admin/content.tsx
// Admin > Konten Situs: semua teks/angka/peta/kontak yang tampil di situs publik.
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Plus, Save, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Konten Situs', href: '/admin/konten' },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
type Form = Record<string, any>;

interface Props {
    beranda: Form;
    statistik: Form;
    peta: Form;
    kontak: Form;
    tentang: Form;
    mapStatus: {
        mapped: number;
        no_location: number;
        unmapped: { id: number; title: string; location: string }[];
    };
}

const TABS = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'statistik', label: 'Statistik' },
    { id: 'peta', label: 'Peta Bali' },
    { id: 'kontak', label: 'Kontak & Footer' },
    { id: 'tentang', label: 'Tentang Kami' },
] as const;

/* ---------- komponen kecil ---------- */

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label>{label}</Label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

function SaveBar({ processing, saved }: { processing: boolean; saved: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <Button type="submit" disabled={processing}>
                <Save className="h-4 w-4" />
                {processing ? 'Menyimpan...' : 'Simpan perubahan'}
            </Button>
            {saved && (
                <span className="inline-flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" /> Tersimpan. Halaman publik langsung terbarui.
                </span>
            )}
        </div>
    );
}

/** Satu form per tab: kirim ke /admin/konten/{group}. */
function useGroupForm(group: string, initial: Form, files = false) {
    const form = useForm<Form>(initial);
    const [saved, setSaved] = useState(false);
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(false);
        form.post(`/admin/konten/${group}`, {
            preserveScroll: true,
            forceFormData: files,
            onSuccess: () => setSaved(true),
        });
    };
    return { ...form, saved, submit };
}

const err = (errors: Record<string, string>, key: string) => errors[key];

/* ---------- BERANDA ---------- */

function BerandaForm({ initial }: { initial: Form }) {
    const f = useGroupForm('beranda', initial);
    const { data, setData, errors } = f;
    const text = (key: string, label: string, opts: { area?: boolean; hint?: string } = {}) => (
        <Field label={label} error={err(errors, key)} hint={opts.hint}>
            {opts.area ? (
                <Textarea rows={3} value={data[key] ?? ''} onChange={(e) => setData(key, e.target.value)} />
            ) : (
                <Input value={data[key] ?? ''} onChange={(e) => setData(key, e.target.value)} />
            )}
        </Field>
    );

    const setFeature = (i: number, key: string, value: string) =>
        setData('features', data.features.map((x: Form, idx: number) => (idx === i ? { ...x, [key]: value } : x)));

    return (
        <form onSubmit={f.submit} className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Hero (bagian paling atas)</CardTitle>
                    <CardDescription>Video/foto latar diatur di menu Hero Beranda.</CardDescription></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">{text('hero_badge', 'Label kecil di atas judul')}</div>
                    <div className="sm:col-span-2">{text('hero_title', 'Judul utama', { area: true })}</div>
                    <div className="sm:col-span-2">{text('hero_subtitle', 'Deskripsi', { area: true })}</div>
                    {text('hero_cta_primary', 'Tombol utama')}
                    {text('hero_cta_secondary', 'Tombol kedua')}
                    <div className="sm:col-span-2">{text('hero_tagline', 'Teks di pojok gambar hero')}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Judul bagian</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    {text('services_title', 'Layanan: judul')}
                    {text('services_subtitle', 'Layanan: sub-judul')}
                    {text('portfolio_title', 'Portfolio: judul')}
                    {text('portfolio_subtitle', 'Portfolio: sub-judul')}
                    {text('clients_title', 'Klien: judul')}
                    {text('clients_desc', 'Klien: sub-judul')}
                    {text('team_title', 'Tim: judul')}
                    {text('team_desc', 'Tim: sub-judul')}
                    {text('cta_title', 'Ajakan di bawah: judul')}
                    {text('cta_desc', 'Ajakan di bawah: deskripsi')}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Keunggulan</CardTitle>
                    <CardDescription>
                        Tulis {'{proyek}'} dan {'{kepuasan}'} di deskripsi agar otomatis diganti angka dari tab Statistik.
                        Nama ikon mengikuti daftar di lucide.dev/icons (contoh: Award, Shield, Zap).
                    </CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {text('features_title', 'Judul bagian')}
                        {text('features_subtitle', 'Sub-judul')}
                    </div>
                    {data.features.map((ft: Form, i: number) => (
                        <div key={i} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[140px_1fr_auto]">
                            <Input aria-label="Ikon" placeholder="Ikon" value={ft.icon} onChange={(e) => setFeature(i, 'icon', e.target.value)} />
                            <div className="space-y-2">
                                <Input aria-label="Judul" placeholder="Judul" value={ft.title} onChange={(e) => setFeature(i, 'title', e.target.value)} />
                                <Textarea aria-label="Deskripsi" rows={2} placeholder="Deskripsi" value={ft.description} onChange={(e) => setFeature(i, 'description', e.target.value)} />
                            </div>
                            <Button type="button" variant="ghost" size="icon" aria-label="Hapus keunggulan"
                                onClick={() => setData('features', data.features.filter((_: Form, idx: number) => idx !== i))}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            {(errors[`features.${i}.title`] || errors[`features.${i}.description`] || errors[`features.${i}.icon`]) && (
                                <p className="text-sm text-destructive sm:col-span-3">Ikon, judul, dan deskripsi wajib diisi.</p>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm"
                        onClick={() => setData('features', [...data.features, { icon: 'Award', title: '', description: '' }])}>
                        <Plus className="h-4 w-4" /> Tambah keunggulan
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Skybot</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {text('skybot_title', 'Judul')}
                    {text('skybot_desc', 'Deskripsi', { area: true })}
                    <Field label="Pertanyaan contoh (satu per baris, maksimal 6)">
                        <Textarea rows={4}
                            value={(data.skybot_questions ?? []).join('\n')}
                            onChange={(e) => setData('skybot_questions', e.target.value.split('\n'))} />
                    </Field>
                </CardContent>
            </Card>

            <SaveBar processing={f.processing} saved={f.saved} />
        </form>
    );
}

/* ---------- STATISTIK ---------- */

function StatistikForm({ initial }: { initial: Form }) {
    const f = useGroupForm('statistik', initial);
    const items: [string, string][] = [
        ['projects', 'Proyek selesai'],
        ['satisfaction', 'Kepuasan klien'],
        ['technicians', 'Teknisi ahli'],
        ['years', 'Tahun berpengalaman'],
        ['clients', 'Jumlah klien'],
    ];
    return (
        <form onSubmit={f.submit} className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Angka statistik</CardTitle>
                    <CardDescription>Tampil di hero dan kartu statistik beranda, halaman Tentang Kami, dan halaman Portfolio. Tulis lengkap dengan tandanya, misalnya 188+ atau 95%.</CardDescription></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    {items.map(([key, label]) => (
                        <Field key={key} label={label} error={err(f.errors, key)}>
                            <Input value={f.data[key] ?? ''} onChange={(e) => f.setData(key, e.target.value)} />
                        </Field>
                    ))}
                </CardContent>
            </Card>
            <SaveBar processing={f.processing} saved={f.saved} />
        </form>
    );
}

/* ---------- PETA ---------- */

function PetaForm({ initial, status }: { initial: Form; status: Props['mapStatus'] }) {
    const f = useGroupForm('peta', initial);
    const { data, setData, errors } = f;
    const setHq = (key: string, value: string) => setData('hq', { ...data.hq, [key]: value });
    const setRegion = (i: number, key: string, value: string) =>
        setData('regions', data.regions.map((r: Form, idx: number) => (idx === i ? { ...r, [key]: value } : r)));

    return (
        <form onSubmit={f.submit} className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Status peta saat ini</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p>
                        <strong>{status.mapped}</strong> proyek aktif sudah muncul di peta.
                        {status.no_location > 0 && <> {status.no_location} proyek belum punya lokasi.</>}
                    </p>
                    {status.unmapped.length > 0 && (
                        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900">
                            <p className="mb-2 flex items-center gap-2 font-medium">
                                <AlertTriangle className="h-4 w-4" /> Lokasi proyek ini belum cocok dengan wilayah mana pun, jadi belum muncul di peta:
                            </p>
                            <ul className="space-y-1">
                                {status.unmapped.map((p) => (
                                    <li key={p.id}>
                                        <Link href={`/admin/portfolio/${p.id}/edit`} className="underline">{p.title}</Link>
                                        {' '}<span className="opacity-80">({p.location})</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-2">Perbaiki isi kolom Lokasi proyek, atau tambahkan nama tempatnya ke "Nama tempat yang dikenali" di wilayah yang sesuai (di bawah).</p>
                        </div>
                    )}
                    <p className="text-muted-foreground">
                        Cara kerja: peta mencocokkan kolom <em>Lokasi</em> tiap proyek (menu Portfolio) dengan daftar nama tempat di tiap wilayah. Proyek baru langsung muncul bila lokasinya cocok.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Teks bagian peta</CardTitle></CardHeader>
                <CardContent className="grid gap-4">
                    <Field label="Judul" error={errors.title}><Input value={data.title ?? ''} onChange={(e) => setData('title', e.target.value)} /></Field>
                    <Field label="Sub-judul" error={errors.tagline}><Input value={data.tagline ?? ''} onChange={(e) => setData('tagline', e.target.value)} /></Field>
                    <Field label="Deskripsi" error={errors.desc}><Textarea rows={3} value={data.desc ?? ''} onChange={(e) => setData('desc', e.target.value)} /></Field>
                    <Field label="Catatan kecil di bawah peta" error={errors.note}><Input value={data.note ?? ''} onChange={(e) => setData('note', e.target.value)} /></Field>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Lokasi kantor pusat (titik oranye)</CardTitle>
                    <CardDescription>Koordinat bisa diambil dari Google Maps (klik kanan pada lokasi, salin angkanya: latitude, longitude).</CardDescription></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nama" error={errors['hq.name']}><Input value={data.hq?.name ?? ''} onChange={(e) => setHq('name', e.target.value)} /></Field>
                    <Field label="Tempat" error={errors['hq.place']}><Input value={data.hq?.place ?? ''} onChange={(e) => setHq('place', e.target.value)} /></Field>
                    <Field label="Latitude (contoh -8.775)" error={errors['hq.lat']}><Input type="number" step="any" value={data.hq?.lat ?? ''} onChange={(e) => setHq('lat', e.target.value)} /></Field>
                    <Field label="Longitude (contoh 115.165)" error={errors['hq.lon']}><Input type="number" step="any" value={data.hq?.lon ?? ''} onChange={(e) => setHq('lon', e.target.value)} /></Field>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Wilayah di peta</CardTitle>
                    <CardDescription>Setiap wilayah punya satu penanda. "Nama tempat yang dikenali" dipisah koma; proyek yang lokasinya memuat salah satu nama itu akan masuk ke wilayah ini.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    {data.regions.map((r: Form, i: number) => (
                        <div key={i} className="space-y-3 rounded-lg border p-3">
                            <div className="grid gap-3 sm:grid-cols-[1fr_140px_140px_auto]">
                                <Input aria-label="Nama wilayah" placeholder="Nama wilayah" value={r.name} onChange={(e) => setRegion(i, 'name', e.target.value)} />
                                <Input aria-label="Latitude" type="number" step="any" placeholder="Latitude" value={r.lat} onChange={(e) => setRegion(i, 'lat', e.target.value)} />
                                <Input aria-label="Longitude" type="number" step="any" placeholder="Longitude" value={r.lon} onChange={(e) => setRegion(i, 'lon', e.target.value)} />
                                <Button type="button" variant="ghost" size="icon" aria-label="Hapus wilayah"
                                    onClick={() => setData('regions', data.regions.filter((_: Form, idx: number) => idx !== i))}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <Textarea aria-label="Nama tempat yang dikenali" rows={2} placeholder="Nama tempat yang dikenali, pisahkan dengan koma"
                                value={r.aliases} onChange={(e) => setRegion(i, 'aliases', e.target.value)} />
                            {(errors[`regions.${i}.name`] || errors[`regions.${i}.lat`] || errors[`regions.${i}.lon`]) && (
                                <p className="text-sm text-destructive">
                                    {errors[`regions.${i}.name`] || errors[`regions.${i}.lat`] || errors[`regions.${i}.lon`]}
                                </p>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm"
                        onClick={() => setData('regions', [...data.regions, { name: '', lat: '-8.5', lon: '115.2', aliases: '' }])}>
                        <Plus className="h-4 w-4" /> Tambah wilayah
                    </Button>
                </CardContent>
            </Card>

            <SaveBar processing={f.processing} saved={f.saved} />
        </form>
    );
}

/* ---------- KONTAK ---------- */

function KontakForm({ initial }: { initial: Form }) {
    const f = useGroupForm('kontak', initial);
    const { data, setData, errors } = f;
    const one = (key: string, label: string, hint?: string) => (
        <Field label={label} error={errors[key]} hint={hint}>
            <Input value={data[key] ?? ''} onChange={(e) => setData(key, e.target.value)} />
        </Field>
    );
    return (
        <form onSubmit={f.submit} className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Kontak</CardTitle>
                    <CardDescription>Dipakai di footer semua halaman, halaman Kontak, dan tombol WhatsApp.</CardDescription></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    {one('email', 'Email')}
                    {one('phone', 'Telepon')}
                    {one('whatsapp', 'Nomor WhatsApp', 'Angka saja, diawali kode negara. Contoh: 6281234567890')}
                    <div className="sm:col-span-2">{one('address', 'Alamat')}</div>
                    {one('hours_weekday', 'Jam operasional hari kerja', 'Kosongkan untuk memakai teks bawaan.')}
                    {one('hours_weekend', 'Jam operasional akhir pekan', 'Kosongkan untuk memakai teks bawaan.')}
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Footer</CardTitle></CardHeader>
                <CardContent>
                    <Field label="Deskripsi singkat perusahaan" error={errors.footer_description} hint="Kosongkan untuk memakai teks bawaan (mengikuti bahasa ID/EN).">
                        <Textarea rows={2} value={data.footer_description ?? ''} onChange={(e) => setData('footer_description', e.target.value)} />
                    </Field>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Peta Google di halaman Kontak</CardTitle>
                    <CardDescription>Di Google Maps: Bagikan, Sematkan peta, Salin HTML, lalu tempel seluruh kodenya di sini (atau cukup link src-nya).</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                    <Textarea rows={3} value={data.map_embed_url ?? ''} onChange={(e) => setData('map_embed_url', e.target.value)} />
                    {errors.map_embed_url && <p className="text-sm text-destructive">{errors.map_embed_url}</p>}
                </CardContent>
            </Card>
            <SaveBar processing={f.processing} saved={f.saved} />
        </form>
    );
}

/* ---------- TENTANG ---------- */

function TentangForm({ initial }: { initial: Form }) {
    const f = useGroupForm('tentang', { ...initial, who_image: null }, true);
    const { data, setData, errors } = f;
    const [preview, setPreview] = useState<string | null>(null);
    const text = (key: string, label: string, area = false) => (
        <Field label={label} error={errors[key]}>
            {area ? (
                <Textarea rows={3} value={data[key] ?? ''} onChange={(e) => setData(key, e.target.value)} />
            ) : (
                <Input value={data[key] ?? ''} onChange={(e) => setData(key, e.target.value)} />
            )}
        </Field>
    );
    const setValue = (i: number, key: string, value: string) =>
        setData('values', data.values.map((v: Form, idx: number) => (idx === i ? { ...v, [key]: value } : v)));

    return (
        <form onSubmit={f.submit} className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Bagian atas</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {text('hero_title', 'Judul')}
                    {text('hero_p1', 'Paragraf 1', true)}
                    {text('hero_p2', 'Paragraf 2', true)}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Siapa kami</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {text('who_title', 'Judul')}
                    <Field label="Paragraf (pisahkan dengan baris kosong)">
                        <Textarea rows={9}
                            value={(data.who_paragraphs ?? []).join('\n\n')}
                            onChange={(e) => setData('who_paragraphs', e.target.value.split(/\n\s*\n/))} />
                    </Field>
                    <Field label="Foto" error={errors.who_image} hint="JPG/PNG/WebP, maksimal 3 MB. Kosongkan bila tidak ingin mengganti.">
                        {(preview ?? initial.who_image_url) && (
                            <img src={preview ?? initial.who_image_url} alt="Foto saat ini" className="mb-2 h-40 rounded-lg object-cover" />
                        )}
                        <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setData('who_image', file);
                            setPreview(file ? URL.createObjectURL(file) : null);
                        }} />
                    </Field>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Nilai-nilai</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {text('values_badge', 'Label kecil')}
                    {text('values_title', 'Judul')}
                    {text('values_desc', 'Deskripsi', true)}
                    {data.values.map((v: Form, i: number) => (
                        <div key={i} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_auto]">
                            <div className="space-y-2">
                                <Input aria-label="Judul nilai" placeholder="Judul" value={v.title} onChange={(e) => setValue(i, 'title', e.target.value)} />
                                <Textarea aria-label="Deskripsi nilai" rows={2} placeholder="Deskripsi" value={v.description} onChange={(e) => setValue(i, 'description', e.target.value)} />
                            </div>
                            <Button type="button" variant="ghost" size="icon" aria-label="Hapus nilai"
                                onClick={() => setData('values', data.values.filter((_: Form, idx: number) => idx !== i))}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            {(errors[`values.${i}.title`] || errors[`values.${i}.description`]) && (
                                <p className="text-sm text-destructive sm:col-span-2">Judul dan deskripsi wajib diisi.</p>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm"
                        onClick={() => setData('values', [...data.values, { title: '', description: '' }])}>
                        <Plus className="h-4 w-4" /> Tambah nilai
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Pencapaian, misi, dan visi</CardTitle>
                    <CardDescription>Angka pencapaian diambil dari tab Statistik.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    {text('achievements_title', 'Judul pencapaian')}
                    {text('mission', 'Misi', true)}
                    {text('vision', 'Visi', true)}
                </CardContent>
            </Card>

            <SaveBar processing={f.processing} saved={f.saved} />
        </form>
    );
}

/* ---------- halaman ---------- */

export default function ContentAdmin({ beranda, statistik, peta, kontak, tentang, mapStatus }: Props) {
    const [tab, setTab] = useState<(typeof TABS)[number]['id']>('beranda');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Konten Situs" />
            <div className="max-w-4xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Konten Situs</h1>
                    <p className="text-sm text-muted-foreground">Ubah teks, angka, peta, dan kontak yang tampil di website. Layanan, portfolio, klien, tim, dan berita punya menu sendiri.</p>
                </div>

                <div className="flex flex-wrap gap-2" role="tablist">
                    {TABS.map((t) => (
                        <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${tab === t.id ? 'border-blue-600 bg-blue-600 text-white' : 'hover:bg-muted'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === 'beranda' && <BerandaForm initial={beranda} />}
                {tab === 'statistik' && <StatistikForm initial={statistik} />}
                {tab === 'peta' && <PetaForm initial={peta} status={mapStatus} />}
                {tab === 'kontak' && <KontakForm initial={kontak} />}
                {tab === 'tentang' && <TentangForm initial={tentang} />}
            </div>
        </AppLayout>
    );
}
