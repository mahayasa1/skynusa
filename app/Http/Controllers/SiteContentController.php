<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\SiteSetting;
use App\Support\Media;
use App\Support\SiteDefaults;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin > Konten Situs.
 * Semua teks/angka yang dulu tertulis di kode (beranda, statistik, peta, kontak, tentang kami)
 * diedit dari sini.
 */
class SiteContentController extends Controller
{
    public function edit(): Response
    {
        $peta = SiteSetting::group('peta');
        // aliases disajikan sebagai teks "a, b, c" supaya mudah diedit.
        $peta['regions'] = array_map(
            fn ($r) => array_merge($r, ['aliases' => implode(', ', $r['aliases'] ?? [])]),
            $peta['regions']
        );

        $tentang = SiteSetting::group('tentang');
        $tentang['who_image_url'] = Media::url($tentang['who_image'] ?? null);

        return Inertia::render('admin/content', [
            'beranda'   => SiteSetting::group('beranda'),
            'statistik' => SiteSetting::group('statistik'),
            'peta'      => $peta,
            'kontak'    => SiteSetting::group('kontak'),
            'tentang'   => $tentang,
            'mapStatus' => $this->mapStatus(SiteSetting::group('peta')),
        ]);
    }

    public function update(Request $request, string $group): RedirectResponse
    {
        abort_unless(in_array($group, SiteDefaults::GROUPS, true), 404);

        $data = match ($group) {
            'beranda'   => $this->beranda($request),
            'statistik' => $this->statistik($request),
            'peta'      => $this->peta($request),
            'kontak'    => $this->kontak($request),
            'tentang'   => $this->tentang($request),
        };

        SiteSetting::saveGroup($group, $data);

        return back()->with('success', 'Konten berhasil disimpan.');
    }

    /* ---------------- per kelompok ---------------- */

    private function beranda(Request $r): array
    {
        $v = $r->validate([
            'hero_badge'         => 'required|string|max:120',
            'hero_title'         => 'required|string|max:200',
            'hero_subtitle'      => 'required|string|max:500',
            'hero_tagline'       => 'nullable|string|max:120',
            'hero_cta_primary'   => 'required|string|max:60',
            'hero_cta_secondary' => 'required|string|max:60',
            'services_title'     => 'required|string|max:200',
            'services_subtitle'  => 'nullable|string|max:300',
            'portfolio_title'    => 'required|string|max:200',
            'portfolio_subtitle' => 'nullable|string|max:300',
            'features_title'     => 'required|string|max:200',
            'features_subtitle'  => 'nullable|string|max:300',
            'features'           => 'array|max:12',
            'features.*.icon'    => 'required|string|max:50|regex:/^[A-Za-z0-9]+$/',
            'features.*.title'   => 'required|string|max:100',
            'features.*.description' => 'required|string|max:300',
            'skybot_title'       => 'required|string|max:120',
            'skybot_desc'        => 'nullable|string|max:500',
            'skybot_questions'   => 'array|max:6',
            'skybot_questions.*' => 'nullable|string|max:120',
            'clients_title'      => 'required|string|max:200',
            'clients_desc'       => 'nullable|string|max:300',
            'team_title'         => 'required|string|max:120',
            'team_desc'          => 'nullable|string|max:300',
            'cta_title'          => 'required|string|max:200',
            'cta_desc'           => 'nullable|string|max:300',
        ]);

        $v['features'] = array_values($v['features'] ?? []);
        $v['skybot_questions'] = $this->cleanList($v['skybot_questions'] ?? []);

        return $v;
    }

    private function statistik(Request $r): array
    {
        return $r->validate([
            'projects'     => 'required|string|max:20',
            'satisfaction' => 'required|string|max:20',
            'technicians'  => 'required|string|max:20',
            'years'        => 'required|string|max:20',
            'clients'      => 'required|string|max:20',
        ]);
    }

    private function peta(Request $r): array
    {
        $v = $r->validate([
            'title'   => 'required|string|max:120',
            'tagline' => 'nullable|string|max:160',
            'desc'    => 'nullable|string|max:500',
            'note'    => 'nullable|string|max:200',
            'hq.name'  => 'required|string|max:80',
            'hq.place' => 'required|string|max:80',
            'hq.lon'   => 'required|numeric|between:114,116',
            'hq.lat'   => 'required|numeric|between:-9.3,-7.8',
            'regions'  => 'array|max:30',
            'regions.*.name'    => 'required|string|max:60',
            'regions.*.lon'     => 'required|numeric|between:114,116',
            'regions.*.lat'     => 'required|numeric|between:-9.3,-7.8',
            'regions.*.aliases' => 'nullable|string|max:500',
        ], [
            'hq.lon.between' => 'Longitude harus di sekitar Bali (114 sampai 116).',
            'hq.lat.between' => 'Latitude harus di sekitar Bali (-9.3 sampai -7.8).',
            'regions.*.lon.between' => 'Longitude wilayah harus di sekitar Bali (114 sampai 116).',
            'regions.*.lat.between' => 'Latitude wilayah harus di sekitar Bali (-9.3 sampai -7.8).',
        ]);

        $used = [];
        $regions = [];
        foreach ($v['regions'] ?? [] as $row) {
            $key = Str::slug($row['name']) ?: 'wilayah';
            $base = $key; $i = 2;
            while (in_array($key, $used, true)) { $key = $base . '-' . $i++; }
            $used[] = $key;

            $aliases = $this->cleanList(explode(',', (string) ($row['aliases'] ?? '')));
            // Nama wilayah sendiri selalu ikut dicocokkan.
            $aliases = array_values(array_unique(array_merge([Str::lower($row['name'])], array_map([Str::class, 'lower'], $aliases))));

            $regions[] = [
                'key' => $key, 'name' => $row['name'],
                'lon' => (float) $row['lon'], 'lat' => (float) $row['lat'],
                'aliases' => $aliases,
            ];
        }

        $v['hq'] = ['name' => $v['hq']['name'], 'place' => $v['hq']['place'], 'lon' => (float) $v['hq']['lon'], 'lat' => (float) $v['hq']['lat']];
        $v['regions'] = $regions;

        return $v;
    }

    private function kontak(Request $r): array
    {
        // Boleh tempel seluruh kode <iframe ...>; ambil src-nya saja.
        $embed = (string) $r->input('map_embed_url', '');
        if (preg_match('/src=["\']([^"\']+)["\']/i', $embed, $m)) {
            $embed = html_entity_decode($m[1]);
        }
        $r->merge(['map_embed_url' => trim($embed)]);

        $r->merge(['whatsapp' => preg_replace('/\D+/', '', (string) $r->input('whatsapp', ''))]);

        return $r->validate([
            'email'    => 'required|email|max:120',
            'phone'    => 'required|string|max:40',
            'whatsapp' => 'nullable|digits_between:8,16',
            'address'  => 'required|string|max:300',
            'hours_weekday' => 'nullable|string|max:120',
            'hours_weekend' => 'nullable|string|max:120',
            'footer_description' => 'nullable|string|max:300',
            'map_embed_url' => ['nullable', 'string', 'max:1500', 'regex:#^https://www\.google\.com/maps/embed\?#'],
        ], [
            'map_embed_url.regex' => 'Gunakan tautan "Embed a map" dari Google Maps (diawali https://www.google.com/maps/embed).',
            'whatsapp.digits_between' => 'Nomor WhatsApp berisi angka saja, contoh 6281234567890.',
        ]);
    }

    private function tentang(Request $r): array
    {
        $v = $r->validate([
            'hero_title' => 'required|string|max:150',
            'hero_p1'    => 'nullable|string|max:600',
            'hero_p2'    => 'nullable|string|max:600',
            'who_title'  => 'required|string|max:150',
            'who_paragraphs'   => 'array|max:6',
            'who_paragraphs.*' => 'nullable|string|max:1000',
            'who_image'        => 'nullable|image|mimes:jpeg,jpg,png,webp|max:3072',
            'values_badge' => 'nullable|string|max:60',
            'values_title' => 'required|string|max:150',
            'values_desc'  => 'nullable|string|max:300',
            'values'               => 'array|max:8',
            'values.*.title'       => 'required|string|max:80',
            'values.*.description' => 'required|string|max:300',
            'achievements_title' => 'required|string|max:120',
            'mission' => 'required|string|max:800',
            'vision'  => 'required|string|max:800',
        ]);

        $current = SiteSetting::group('tentang');
        $image = $current['who_image'] ?? null;

        if ($r->hasFile('who_image')) {
            // Hapus unggahan lama saja; file bawaan di public/asset jangan disentuh.
            if ($image && !str_starts_with($image, 'asset/')) {
                Storage::disk('public')->delete($image);
            }
            $image = $r->file('who_image')->store('about', 'public');
        }

        $v['who_image'] = $image;
        $v['who_paragraphs'] = $this->cleanList($v['who_paragraphs'] ?? []);
        $v['values'] = array_values($v['values'] ?? []);

        return $v;
    }

    /* ---------------- bantu ---------------- */

    private function cleanList(array $items): array
    {
        return array_values(array_filter(array_map(fn ($s) => trim((string) $s), $items), fn ($s) => $s !== ''));
    }

    /**
     * Proyek aktif yang punya lokasi tapi tidak cocok dengan wilayah mana pun
     * (tidak akan muncul di peta) — ditampilkan sebagai peringatan di admin.
     */
    private function mapStatus(array $peta): array
    {
        $mapped = 0;
        $unmapped = [];
        $noLocation = 0;

        foreach (Portfolio::active()->get(['id', 'title', 'location']) as $p) {
            if (blank($p->location)) { $noLocation++; continue; }
            $text = Str::lower($p->location);
            $hit = collect($peta['regions'])->contains(
                fn ($r) => collect($r['aliases'] ?? [])->contains(fn ($a) => $a !== '' && str_contains($text, $a))
            );
            if ($hit) {
                $mapped++;
            } else {
                $unmapped[] = ['id' => $p->id, 'title' => $p->title, 'location' => $p->location];
            }
        }

        return ['mapped' => $mapped, 'unmapped' => $unmapped, 'no_location' => $noLocation];
    }
}
