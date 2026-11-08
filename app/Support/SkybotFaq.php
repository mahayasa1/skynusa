<?php

namespace App\Support;

/**
 * Jawaban siap pakai Skybot (gratis, tanpa AI).
 * Tambah atau ubah entri di bawah sesuai kebutuhan. Jangan tulis harga di sini.
 */
class SkybotFaq
{
    private const WA = 'https://wa.me/6281339579969';

    /** Kata kunci harga: pertanyaan seperti ini tidak dijawab, langsung diarahkan ke tim. */
    public const PRICE_PATTERN = '/(harga|biaya|tarif|ongkos|diskon|promo|murah|mahal|budget|anggaran|berapa\s+(duit|rupiah|juta|ribu|bayar|biaya|harga)|\bprice|pricing|\bcost|quote|quotation|how\s+much|\bfee\b|discount|payment|bayar)/iu';

    /** Daftar kunci entri yang cocok dengan teks pengunjung. */
    public static function match(string $text): array
    {
        $t = mb_strtolower($text);
        $hits = [];
        foreach (self::entries() as $key => $entry) {
            foreach ($entry['patterns'] as $pattern) {
                if (preg_match('/' . $pattern . '/iu', $t)) {
                    $hits[] = $key;
                    break;
                }
            }
        }
        return $hits;
    }

    public static function answer(string $key, string $lang): string
    {
        $entry = self::entries()[$key];
        return $lang === 'en' ? $entry['en'] : $entry['id'];
    }

    private static function entries(): array
    {
        $wa = self::WA;

        return [
            'greeting' => [
                'patterns' => ['^\s*(halo|hai|hi|hello|hey|selamat\s+(pagi|siang|sore|malam)|permisi)\b'],
                'id' => "Halo! Saya Skybot, asisten SKYNUSA TECH. Anda bisa bertanya soal pasang CCTV, website, service AC, listrik, IT support, atau cara memesan layanan kami.",
                'en' => "Hi! I'm Skybot, the SKYNUSA TECH assistant. You can ask about CCTV installation, websites, AC service, electrical work, IT support, or how to order our services.",
            ],
            'thanks' => [
                'patterns' => ['^\s*(terima\s+kasih|makasih|thanks|thank\s+you)'],
                'id' => "Sama-sama! Kalau ada pertanyaan lain soal layanan kami, tanya saja.",
                'en' => "You're welcome! If you have other questions about our services, just ask.",
            ],
            'whoami' => [
                'patterns' => ['siapa\s+(kamu|anda)', 'skybot', 'who\s+are\s+you', 'what\s+are\s+you'],
                'id' => "Saya Skybot, asisten virtual SKYNUSA TECH. Saya membantu menjelaskan kebutuhan teknis dan cara memesan layanan. Untuk harga dan penawaran, tim kami yang akan membantu.",
                'en' => "I'm Skybot, the virtual assistant of SKYNUSA TECH. I help explain technical requirements and how to order. For pricing and quotations, our team will help you.",
            ],
            'tentang' => [
                'patterns' => ['tentang\s+(skynusa|perusahaan|kalian|kamu)', 'profil\s+perusahaan', 'perusahaan\s+apa', 'apa\s+itu\s+skynusa', 'about\s+(skynusa|you|the\s+company)', 'what\s+is\s+skynusa'],
                'id' => "SKYNUSA TECH adalah perusahaan penyedia layanan teknis yang berbasis di Jimbaran, Bali. Bidangnya: instalasi elektronik dan kelistrikan, instalasi dan service AC, maintenance, IT support, serta web development, dikerjakan oleh tim teknisi dan engineer. Selengkapnya ada di halaman Tentang Kami.",
                'en' => "SKYNUSA TECH is a technical services company based in Jimbaran, Bali. Our fields: electronics and electrical installation, AC installation and service, maintenance, IT support, and web development, handled by a team of technicians and engineers. More details are on the About Us page.",
            ],
            'layanan' => [
                'patterns' => ['layanan\s+apa', 'apa\s+saja\s+layanan', 'jasa\s+apa', 'bisa\s+bantu\s+apa', 'what\s+services', 'services\s+do\s+you', 'what\s+can\s+you\s+do'],
                'id' => "Layanan SKYNUSA TECH:\n1. Instalasi elektronik, termasuk CCTV\n2. Instalasi dan maintenance listrik\n3. Instalasi dan service AC\n4. IT support dan maintenance\n5. Web development\n\nKetik nama layanannya untuk penjelasan lebih lanjut, atau langsung pesan lewat menu Pesanan > Order Pesanan.",
                'en' => "SKYNUSA TECH services:\n1. Electronics installation, including CCTV\n2. Electrical installation and maintenance\n3. AC installation and service\n4. IT support and maintenance\n5. Web development\n\nType a service name for more details, or order directly through Orders > Place Order.",
            ],
            'cctv' => [
                'patterns' => ['\bcctv\b', 'kamera\s+pengawas', 'security\s+camera', 'surveillance'],
                'id' => "Untuk pasang CCTV, biasanya yang dibutuhkan:\n1. Kamera: jumlah titik, indoor atau outdoor, dan resolusi (misalnya 2MP atau 4MP).\n2. Perekam: DVR untuk kamera analog atau NVR untuk kamera IP.\n3. Hard disk penyimpanan rekaman, ukurannya menyesuaikan jumlah kamera dan lama penyimpanan.\n4. Kabel dan sumber listrik. Kamera IP bisa memakai PoE sehingga satu kabel jaringan cukup.\n5. Internet dan router bila ingin memantau lewat HP.\n6. Survei lokasi untuk menentukan titik kamera, panjang kabel, dan sudut pandang.\n\nCeritakan lokasi dan jumlah titik yang Anda inginkan lewat form pesanan atau WhatsApp: {$wa}",
                'en' => "For a CCTV installation you usually need:\n1. Cameras: number of spots, indoor or outdoor, and resolution (for example 2MP or 4MP).\n2. A recorder: DVR for analog cameras or NVR for IP cameras.\n3. A hard disk for recordings, sized to the number of cameras and how long you keep footage.\n4. Cabling and power. IP cameras can use PoE so one network cable is enough.\n5. Internet and a router if you want to view from your phone.\n6. A site survey to decide camera spots, cable length, and viewing angles.\n\nTell us the location and number of spots through the order form or WhatsApp: {$wa}",
            ],
            'website' => [
                'patterns' => ['\bwebsite\b', '\bweb\b', '\bsitus\b', 'landing\s+page', 'toko\s+online', 'online\s+shop', 'web\s+development'],
                'id' => "Kami membuat website company profile, toko online, web application custom, serta maintenance dan update website, semuanya dengan tampilan yang nyaman di HP.\n\nUntuk membuat website, biasanya dibutuhkan:\n1. Tujuan website (profil perusahaan, toko online, pendaftaran, dll) dan siapa pengunjungnya.\n2. Nama domain (alamat website) dan hosting.\n3. Konten: teks, logo, serta foto atau video.\n4. Desain: warna, gaya, dan contoh website yang Anda sukai.\n5. Fitur yang diinginkan, misalnya formulir kontak, pembayaran online, atau login.\n6. Siapa yang akan mengelola isi website setelah jadi.\n\nKalau sudah punya gambaran, kirim lewat form pesanan atau WhatsApp: {$wa}",
                'en' => "We build company profile websites, online shops, custom web applications, and provide website maintenance and updates, all designed to look good on phones.\n\nTo build a website you usually need:\n1. The goal (company profile, online shop, registration, etc.) and who the visitors are.\n2. A domain name (the web address) and hosting.\n3. Content: text, logo, and photos or videos.\n4. Design: colors, style, and examples of websites you like.\n5. Features you want, such as a contact form, online payment, or login.\n6. Who will manage the content after launch.\n\nIf you already have an idea, send it through the order form or WhatsApp: {$wa}",
            ],
            'ac' => [
                'patterns' => ['\bac\b', 'air\s+conditioner', 'air\s+conditioning', 'freon'],
                'id' => "Layanan AC kami mencakup: instalasi AC Split dan Multi Split, AC Central dan VRV, service berkala dan cleaning, perbaikan dan troubleshooting, isi freon dan cek kebocoran, serta konsultasi pemilihan AC.\n\nInformasi yang membantu: jenis AC (split, cassette, standing), jumlah unit, keluhan (kurang dingin, bocor, berisik, tidak menyala), lokasi, dan akses ke unit indoor dan outdoor. Jadwal dan penawaran bisa diatur lewat form pesanan atau WhatsApp: {$wa}",
                'en' => "Our AC services include: installation of Split and Multi Split AC, Central and VRV systems, regular service and cleaning, repair and troubleshooting, freon refill and leak checks, and advice on choosing the right AC.\n\nHelpful details: AC type (split, cassette, standing), number of units, the problem (not cold enough, leaking, noisy, not turning on), location, and access to the indoor and outdoor units. Scheduling and quotations can be arranged through the order form or WhatsApp: {$wa}",
            ],
            'listrik' => [
                'patterns' => ['listrik', 'kelistrikan', '\bpanel\b', 'penangkal\s+petir', 'grounding', 'electrical', 'electricity'],
                'id' => "Layanan listrik kami mencakup: instalasi panel listrik, sistem grounding dan penangkal petir, instalasi penerangan indoor dan outdoor, maintenance rutin, troubleshooting dan perbaikan, serta upgrade kapasitas daya.\n\nSiapkan info: jenis bangunan (rumah, kantor, industri), kebutuhan atau keluhan, dan lokasi. Kirim lewat form pesanan atau WhatsApp: {$wa}",
                'en' => "Our electrical services include: electrical panel installation, grounding and lightning protection, indoor and outdoor lighting installation, routine maintenance, troubleshooting and repair, and power capacity upgrades.\n\nPrepare: the building type (home, office, industrial), your need or problem, and the location. Send it through the order form or WhatsApp: {$wa}",
            ],
            'itsupport' => [
                'patterns' => ['it\s+support', 'jaringan', 'wifi', 'wi-fi', 'router', '\bnetwork\b', 'komputer', 'laptop', '\bpc\b', 'printer', '\bserver\b', 'backup', 'data\s+recovery', 'cloud'],
                'id' => "Layanan IT support dan maintenance kami mencakup: setup dan maintenance PC atau laptop, instalasi jaringan LAN/WAN, setup server dan cloud storage, troubleshooting hardware dan software, serta data backup dan recovery.\n\nSiapkan info: perangkat yang bermasalah, gejalanya, kapan mulai terjadi, dan lokasi. Kirim lewat form pesanan atau WhatsApp: {$wa}",
                'en' => "Our IT support and maintenance covers: PC and laptop setup and maintenance, LAN/WAN network installation, server and cloud storage setup, hardware and software troubleshooting, and data backup and recovery.\n\nPrepare: the affected device, the symptoms, when it started, and the location. Send it through the order form or WhatsApp: {$wa}",
            ],
            'instalasi' => [
                'patterns' => ['instalasi\s+elektronik', 'pemasangan\s+perangkat', 'electronics\s+installation'],
                'id' => "Instalasi elektronik mencakup pemasangan perangkat beserta kelistrikan pendukungnya. Siapkan: jenis perangkat atau kebutuhan, lokasi, foto atau denah area bila ada, dan target waktu pemasangan. Biasanya perlu survei lokasi dulu. Hubungi kami lewat form pesanan atau WhatsApp: {$wa}",
                'en' => "Electronics installation covers fitting devices along with the supporting electrical work. Prepare: the type of device or need, the location, photos or a floor plan if available, and your target date. A site survey is usually needed first. Contact us through the order form or WhatsApp: {$wa}",
            ],
            'maintenance' => [
                'patterns' => ['maintenance', 'perawatan', 'berkala'],
                'id' => "Maintenance atau perawatan berkala menjaga perangkat tetap berfungsi dan mencegah kerusakan. Siapkan daftar perangkat, lokasinya, dan seberapa sering Anda ingin dicek. Kebutuhan Anda bisa dibahas lewat form pesanan atau WhatsApp: {$wa}",
                'en' => "Regular maintenance keeps devices working and prevents breakdowns. Prepare a list of devices, their locations, and how often you want them checked. We can discuss your needs through the order form or WhatsApp: {$wa}",
            ],
            'konsultasi' => [
                'patterns' => ['konsultasi', 'consult', 'tanya\s+dulu', 'mau\s+tanya'],
                'id' => "Anda bisa berkonsultasi dulu sebelum memesan. Ceritakan kebutuhan Anda lewat form di halaman Kontak atau lewat WhatsApp: {$wa}. Tim kami akan menghubungi Anda dalam waktu 24 jam.",
                'en' => "You can consult with us before ordering. Tell us what you need through the form on the Contact page or via WhatsApp: {$wa}. Our team will get back to you within 24 hours.",
            ],
            'durasi' => [
                'patterns' => ['berapa\s+lama', 'lama\s+pengerjaan', 'kapan\s+selesai', 'how\s+long', 'estimasi\s+waktu', 'durasi', 'turnaround'],
                'id' => "Lama pengerjaan bergantung pada jenis dan skala pekerjaan. Perkiraan waktunya bisa dibahas dengan tim kami setelah kebutuhan Anda jelas. Di form pesanan Anda juga bisa mengisi tanggal target selesai. Tanya langsung lewat WhatsApp: {$wa}",
                'en' => "The time needed depends on the type and scale of the work. You can discuss a time estimate with our team once your needs are clear. You can also set a target completion date in the order form. Ask us directly via WhatsApp: {$wa}",
            ],
            'garansi' => [
                'patterns' => ['garansi', 'warranty', 'guarantee'],
                'id' => "Ketentuan garansi bergantung pada jenis pekerjaan dan perangkat. Tim kami yang bisa memastikannya untuk kebutuhan Anda, silakan tanyakan lewat WhatsApp: {$wa}",
                'en' => "Warranty terms depend on the type of work and the devices involved. Our team can confirm them for your case, please ask via WhatsApp: {$wa}",
            ],
            'area' => [
                'patterns' => ['area\s+layanan', 'wilayah', 'jangkauan', 'melayani\s+(di|daerah|area)', 'service\s+area', 'luar\s+bali', 'outside\s+bali', 'which\s+areas'],
                'id' => "Kantor kami berada di Jimbaran, Bali. Untuk memastikan lokasi Anda terjangkau, silakan tanyakan ke tim kami lewat WhatsApp: {$wa}",
                'en' => "Our office is in Jimbaran, Bali. To confirm whether your location is covered, please ask our team via WhatsApp: {$wa}",
            ],
            'darurat' => [
                'patterns' => ['darurat', 'emergency', 'mendesak', 'urgent'],
                'id' => "Untuk kebutuhan darurat, hubungi tim support kami lewat WhatsApp: {$wa}. Tim support kami siap membantu 24/7 untuk kebutuhan emergency.",
                'en' => "For urgent needs, contact our support team via WhatsApp: {$wa}. Our support team is available 24/7 for emergencies.",
            ],
            'order' => [
                'patterns' => ['cara\s+(pesan|memesan|order)', 'pesan\s+layanan', 'mau\s+(pesan|order|memesan)', 'bagaimana\s+(cara\s+)?(pesan|memesan|order)', 'how\s+(do\s+i|to|can\s+i)\s+(order|place)', 'place\s+(an\s+)?order'],
                'id' => "Cara memesan:\n1. Buka menu Pesanan > Order Pesanan.\n2. Pilih layanan, isi data diri, tanggal target selesai, dan deskripsi pesanan.\n3. Selesaikan verifikasi keamanan, lalu klik Buat Pesanan.\n4. Anda akan menerima kode tracking untuk memantau status. Tim kami memverifikasi pesanan dalam 1x24 jam.",
                'en' => "How to order:\n1. Open the Orders > Place Order menu.\n2. Choose a service and fill in your details, target completion date, and order description.\n3. Complete the security check, then click Place Order.\n4. You will receive a tracking code to monitor the status. Our team verifies orders within 24 hours.",
            ],
            'tracking' => [
                'patterns' => ['tracking', 'lacak', 'status\s+pesanan', 'kode\s+pesanan', '\btrack\b', 'order\s+status'],
                'id' => "Untuk cek status pesanan, buka menu Pesanan > Tracking Pesanan, lalu masukkan kode tracking yang Anda terima setelah memesan (formatnya seperti ORD-SKYNUSA-...).",
                'en' => "To check your order status, open Orders > Track Order and enter the tracking code you received after ordering (it looks like ORD-SKYNUSA-...).",
            ],
            'kontak' => [
                'patterns' => ['\bkontak\b', 'hubungi', 'whatsapp', '\bwa\b', '\balamat\b', 'lokasi\s+(kantor|kalian|anda|kami)', '\bdimana\b', 'jam\s+(buka|operasional|kerja)', 'buka\s+jam', '\bcontact\b', '\baddress\b', 'opening\s+hours', '\bhours\b', '\bphone\b', 'telepon', 'where\s+(are\s+you|is\s+your)'],
                'id' => "Kontak SKYNUSA TECH:\nWhatsApp: +62 813-3957-9969 ({$wa})\nTelepon: +62 881-080-888-361\nEmail: Roycegroupbali@gmail.com\nJam operasional: Senin - Jumat 10:00 - 17:00 (Sabtu dan Minggu tutup)\nAlamat: Royce Group, Purimas Regency 2 Kav 8, Jimbaran, Bali",
                'en' => "SKYNUSA TECH contact:\nWhatsApp: +62 813-3957-9969 ({$wa})\nPhone: +62 881-080-888-361\nEmail: Roycegroupbali@gmail.com\nOpening hours: Monday - Friday 10:00 - 17:00 (closed Saturday and Sunday)\nAddress: Royce Group, Purimas Regency 2 Kav 8, Jimbaran, Bali",
            ],
        ];
    }
}
