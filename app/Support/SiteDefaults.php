<?php

namespace App\Support;

/**
 * Isi bawaan situs (sama dengan teks yang sebelumnya tertulis langsung di kode).
 * Dipakai sebagai nilai awal; admin bisa menimpanya lewat Admin > Konten Situs.
 */
class SiteDefaults
{
    public const GROUPS = ['beranda', 'statistik', 'peta', 'kontak', 'tentang'];

    public static function for(string $group): array
    {
        return match ($group) {
            'beranda'   => self::beranda(),
            'statistik' => self::statistik(),
            'peta'      => self::peta(),
            'kontak'    => self::kontak(),
            'tentang'   => self::tentang(),
            default     => [],
        };
    }

    public static function beranda(): array
    {
        return [
            'hero_badge'        => 'Teknisi lokal di Jimbaran, Bali',
            'hero_title'        => 'Instalasi, AC, IT support, dan website. Satu tim sampai tuntas.',
            'hero_subtitle'     => 'Dari instalasi listrik dan perawatan AC sampai jaringan kantor dan pembuatan website, untuk rumah, villa, kantor, dan industri.',
            'hero_tagline'      => '> beyond technology. beyond limits.',
            'hero_cta_primary'  => 'Konsultasi gratis',
            'hero_cta_secondary' => 'Lihat portfolio',

            'services_title'    => 'Solusi Teknis Lengkap untuk Kebutuhan Anda',
            'services_subtitle' => 'Layanan instalasi, maintenance, IT support, dan web development dengan standar profesional tinggi',

            'portfolio_title'    => 'Project yang Telah Kami Kerjakan',
            'portfolio_subtitle' => 'Proyek instalasi, maintenance, IT support, dan web development yang telah kami selesaikan',

            'features_title'    => 'Keunggulan Layanan Kami',
            'features_subtitle' => 'Keahlian teknis, pengalaman industri, dan pendekatan customer-centric untuk hasil terbaik',
            'features' => [
                ['icon' => 'Award', 'title' => 'Standar Profesional', 'description' => 'Mengikuti standar industri terbaik dan prosedur keamanan yang ketat untuk setiap proyek.'],
                ['icon' => 'Users', 'title' => 'Tim Berpengalaman', 'description' => 'Teknisi bersertifikasi dengan pengalaman bertahun-tahun di bidang elektronik, AC, IT, dan web.'],
                ['icon' => 'Zap', 'title' => 'Respon Cepat', 'description' => 'Respon cepat untuk layanan darurat dan penyelesaian sesuai timeline yang disepakati.'],
                ['icon' => 'Headphones', 'title' => 'Dukungan Penuh', 'description' => 'Customer support responsif dan maintenance berkala untuk menjaga sistem Anda optimal.'],
                ['icon' => 'Shield', 'title' => 'Garansi Terjamin', 'description' => 'Setiap pekerjaan dilengkapi garansi resmi dan jaminan kepuasan klien.'],
                ['icon' => 'TrendingUp', 'title' => 'Track Record Terbukti', 'description' => 'Lebih dari {proyek} proyek selesai dengan tingkat kepuasan klien {kepuasan}.'],
            ],

            'skybot_title' => 'Kenalan dengan Skybot',
            'skybot_desc'  => 'Bingung mau pasang CCTV, bikin website, atau layanan lain? Tanya Skybot, asisten AI SKYNUSA TECH. Untuk harga dan penawaran, tim kami yang akan menjawab langsung.',
            'skybot_questions' => ['Pasang CCTV butuh apa saja?', 'Website butuh apa saja?', 'Bagaimana cara memesan?'],

            'clients_title' => 'Klien yang Telah Bekerja Sama',
            'clients_desc'  => 'Bergabunglah dengan ratusan klien yang mempercayakan kebutuhan teknis mereka kepada kami.',

            'team_title' => 'SKYNUSA TEAM',
            'team_desc'  => 'Tim profesional yang solid dan berpengalaman untuk kesuksesan project Anda',

            'cta_title' => 'Siap mulai proyek Anda?',
            'cta_desc'  => 'Ceritakan kebutuhan Anda. Tim kami di Bali siap membantu dari konsultasi sampai tuntas.',
        ];
    }

    public static function statistik(): array
    {
        return [
            'projects'     => '188+',
            'satisfaction' => '95%',
            'technicians'  => '20+',
            'years'        => '10+',
            'clients'      => '150+',
        ];
    }

    public static function peta(): array
    {
        return [
            'title'   => 'Our Digital Footprint',
            'tagline' => 'Connecting Bali Through Technology',
            'desc'    => 'Dari basis kami di Jimbaran, tim SkyNusa mengerjakan instalasi, jaringan, dan sistem digital di berbagai wilayah Bali.',
            'note'    => 'Peta ini menampilkan lokasi portofolio proyek SkyNusa Tech di Bali.',
            'hq' => ['name' => 'SkyNusa Tech', 'place' => 'Jimbaran', 'lon' => 115.165, 'lat' => -8.775],
            'regions' => [
                ['key' => 'jembrana', 'name' => 'Jembrana', 'lon' => 114.62, 'lat' => -8.34, 'aliases' => ['jembrana', 'negara', 'gilimanuk', 'medewi', 'pekutatan', 'melaya', 'mendoyo']],
                ['key' => 'buleleng', 'name' => 'Buleleng', 'lon' => 115.09, 'lat' => -8.2, 'aliases' => ['buleleng', 'singaraja', 'lovina', 'seririt', 'gerokgak', 'pemuteran', 'kubutambahan', 'sukasada']],
                ['key' => 'tabanan', 'name' => 'Tabanan', 'lon' => 115.07, 'lat' => -8.5, 'aliases' => ['tabanan', 'tanah lot', 'kediri', 'penebel', 'bedugul', 'soka']],
                ['key' => 'badung', 'name' => 'Badung', 'lon' => 115.17, 'lat' => -8.6, 'aliases' => ['badung', 'mengwi', 'kuta', 'legian', 'seminyak', 'canggu', 'kerobokan', 'umalas', 'jimbaran', 'nusa dua', 'uluwatu', 'pecatu', 'ungasan', 'tanjung benoa', 'abiansemal', 'dalung', 'petang']],
                ['key' => 'denpasar', 'name' => 'Denpasar', 'lon' => 115.23, 'lat' => -8.66, 'aliases' => ['denpasar', 'sanur', 'renon', 'sesetan', 'panjer', 'tohpati', 'ubung']],
                ['key' => 'gianyar', 'name' => 'Gianyar', 'lon' => 115.32, 'lat' => -8.52, 'aliases' => ['gianyar', 'ubud', 'sukawati', 'tegallalang', 'payangan', 'tampaksiring', 'blahbatuh', 'ketewel', 'celuk']],
                ['key' => 'bangli', 'name' => 'Bangli', 'lon' => 115.36, 'lat' => -8.38, 'aliases' => ['bangli', 'kintamani', 'penelokan']],
                ['key' => 'klungkung', 'name' => 'Klungkung', 'lon' => 115.4, 'lat' => -8.54, 'aliases' => ['klungkung', 'semarapura', 'nusa penida', 'nusa lembongan', 'nusa ceningan', 'banjarangkan']],
                ['key' => 'karangasem', 'name' => 'Karangasem', 'lon' => 115.55, 'lat' => -8.4, 'aliases' => ['karangasem', 'amlapura', 'candidasa', 'amed', 'tulamben', 'sidemen']],
            ],
        ];
    }

    public static function kontak(): array
    {
        return [
            'email'    => 'Roycegroupbali@gmail.com',
            'phone'    => '+62 881-080-888-361',
            'whatsapp' => '6281339579969',
            'address'  => 'Royce Group, Purimas Regency 2 Kav 8, Jimbaran, Bali',
            // Kosong = pakai teks bawaan (mengikuti pilihan bahasa ID/EN).
            'hours_weekday' => '',
            'hours_weekend' => '',
            'footer_description' => '',
            'map_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.827654715452!2d115.14267627402164!3d-8.802256891250302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd24583f5b95ba9%3A0x22369bedb5e3736e!2sRoyce%20Group!5e0!3m2!1sid!2sid!4v1766566808620!5m2!1sid!2sid',
        ];
    }

    public static function tentang(): array
    {
        return [
            'hero_title' => 'Tentang Skynusa Tech',
            'hero_p1'    => 'Kami adalah tim teknisi profesional dan berpengalaman yang berdedikasi memberikan solusi instalasi, maintenance, IT support, dan web development terbaik.',
            'hero_p2'    => 'Sejak 2015, kami telah melayani berbagai klien mulai dari rumah tinggal, perkantoran, hingga industri manufaktur dengan hasil yang memuaskan.',

            'who_title' => 'Siapa Kami?',
            'who_paragraphs' => [
                'SKYNUSA TECH adalah perusahaan penyedia layanan teknis profesional yang berdiri sejak 2025. Kami fokus memberikan solusi terbaik dalam bidang instalasi elektronik, perawatan AC, maintenance perangkat, dukungan IT, dan pengembangan website.',
                'Tim kami terdiri dari teknisi bersertifikat dan engineer berpengalaman yang berkomitmen memberikan layanan berkualitas tinggi dengan standar industri terbaik.',
                'Kepuasan klien adalah prioritas utama kami. Setiap proyek dikerjakan dengan dedikasi penuh dan perhatian terhadap detail untuk memastikan hasil yang optimal.',
            ],
            'who_image' => 'asset/about.jpeg',

            'values_badge' => 'Nilai-Nilai Kami',
            'values_title' => 'Prinsip yang kami Junjung',
            'values_desc'  => 'Nilai-nilai fundamental yang menjadi fondasi dalam setiap pekerjaan yang kami lakukan.',
            'values' => [
                ['title' => 'Profesionalisme', 'description' => 'Kami berkomitmen memberikan layanan profesional dengan standar kualitas tertinggi.'],
                ['title' => 'Dedikasi', 'description' => 'Tim kami berdedikasi penuh untuk memastikan kepuasan dan keberhasilan setiap proyek.'],
                ['title' => 'Integritas', 'description' => 'Kami menjunjung tinggi kejujuran dan transparansi dalam setiap hubungan dengan klien.'],
                ['title' => 'Inovasi', 'description' => 'Kami selalu mengikuti perkembangan teknologi dan metode terbaru di industri.'],
            ],

            'achievements_title' => 'Pencapaian Kami',

            'mission' => 'Memberikan solusi teknis berkualitas tinggi dengan harga kompetitif, didukung oleh teknis profesional dan pelayanan customer service yang responsif untuk menaikkan kepuasan setiap klien.',
            'vision'  => 'Menjadi penyedia layanan instalasi, maintenance, IT support, dan web development terdepan dan terpercaya di Indonesia, dikenal karena kualitas kerja dan kepuasan pelanggan yang konsisten.',
        ];
    }
}
