import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useMemo, useState, useSyncExternalStore } from 'react';

export interface FootprintProject {
    id: number;
    title: string;
    slug: string;
    location: string | null;
    image: string | null;
    service?: string | null;
}

/**
 * Peta digital Bali.
 * - Siluet pulau = ilustrasi bergaya (diproyeksikan dari titik koordinat pesisir, bukan data survei).
 * - Penanda proyek HANYA muncul untuk wilayah yang cocok dengan kolom `location` proyek di database.
 * - Tanpa data lokasi, peta tetap tampil sebagai elemen brand tanpa penanda proyek.
 */

// ── Proyeksi: lon/lat → koordinat SVG (viewBox 900 x 580) ──
const LON0 = 114.4;
const LAT0 = -8.04;
const SCALE = 640;
const px = (lon: number) => 30 + (lon - LON0) * SCALE;
const py = (lat: number) => 30 + (LAT0 - lat) * SCALE;

// Titik pesisir Bali (lon, lat), searah jarum jam dari ujung barat.
const COAST: [number, number][] = [
    [114.43, -8.18], [114.51, -8.14], [114.65, -8.15], [114.85, -8.17], [115.03, -8.16],
    [115.2, -8.1], [115.34, -8.13], [115.47, -8.19], [115.59, -8.27], [115.67, -8.33],
    [115.7, -8.41], [115.65, -8.47], [115.57, -8.5], [115.51, -8.53], [115.43, -8.55],
    [115.33, -8.62], [115.265, -8.7], [115.235, -8.76], [115.225, -8.81], [115.19, -8.845],
    [115.12, -8.85], [115.085, -8.83], [115.1, -8.79], [115.15, -8.775], [115.17, -8.72],
    [115.15, -8.67], [115.1, -8.62], [115.0, -8.59], [114.9, -8.5], [114.8, -8.42],
    [114.7, -8.39], [114.6, -8.37], [114.52, -8.28],
];

/** Kurva halus (Catmull-Rom → Bezier) menutup di titik awal. */
function smoothClosedPath(points: [number, number][]): string {
    const pts = points.map(([lon, lat]) => [px(lon), py(lat)] as const);
    const n = pts.length;
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n; i++) {
        const p0 = pts[(i - 1 + n) % n];
        const p1 = pts[i];
        const p2 = pts[(i + 1) % n];
        const p3 = pts[(i + 2) % n];
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d + ' Z';
}

interface Region {
    key: string;
    name: string;
    lon: number;
    lat: number;
    aliases: string[];
}

export interface FootprintConfig {
    note?: string;
    hq?: { name: string; place: string; lon: number; lat: number };
    regions?: Region[];
}

// Nilai bawaan bila data dari Admin > Konten Situs > Peta belum tersedia.
const DEFAULT_REGIONS: Region[] = [
    { key: 'jembrana', name: 'Jembrana', lon: 114.62, lat: -8.34, aliases: ['jembrana', 'negara', 'gilimanuk', 'medewi', 'pekutatan', 'melaya', 'mendoyo'] },
    { key: 'buleleng', name: 'Buleleng', lon: 115.09, lat: -8.2, aliases: ['buleleng', 'singaraja', 'lovina', 'seririt', 'gerokgak', 'pemuteran', 'kubutambahan', 'sukasada'] },
    { key: 'tabanan', name: 'Tabanan', lon: 115.07, lat: -8.5, aliases: ['tabanan', 'tanah lot', 'kediri', 'penebel', 'bedugul', 'soka'] },
    { key: 'badung', name: 'Badung', lon: 115.17, lat: -8.6, aliases: ['badung', 'mengwi', 'kuta', 'legian', 'seminyak', 'canggu', 'kerobokan', 'umalas', 'jimbaran', 'nusa dua', 'uluwatu', 'pecatu', 'ungasan', 'tanjung benoa', 'abiansemal', 'dalung', 'petang'] },
    { key: 'denpasar', name: 'Denpasar', lon: 115.23, lat: -8.66, aliases: ['denpasar', 'sanur', 'renon', 'sesetan', 'panjer', 'tohpati', 'ubung'] },
    { key: 'gianyar', name: 'Gianyar', lon: 115.32, lat: -8.52, aliases: ['gianyar', 'ubud', 'sukawati', 'tegallalang', 'payangan', 'tampaksiring', 'blahbatuh', 'ketewel', 'celuk'] },
    { key: 'bangli', name: 'Bangli', lon: 115.36, lat: -8.38, aliases: ['bangli', 'kintamani', 'penelokan'] },
    { key: 'klungkung', name: 'Klungkung', lon: 115.4, lat: -8.54, aliases: ['klungkung', 'semarapura', 'nusa penida', 'nusa lembongan', 'nusa ceningan', 'banjarangkan'] },
    { key: 'karangasem', name: 'Karangasem', lon: 115.55, lat: -8.4, aliases: ['karangasem', 'amlapura', 'candidasa', 'amed', 'tulamben', 'sidemen'] },
];

const DEFAULT_HQ = { name: 'SkyNusa Tech', place: 'Jimbaran', lon: 115.165, lat: -8.775 };
const DEFAULT_NOTE = 'Siluet pulau berupa ilustrasi bergaya, bukan peta survei.';

function matchRegion(regions: Region[], location: string | null): string | null {
    if (!location) return null;
    const text = location.toLowerCase();
    for (const r of regions) {
        if (r.aliases.some((a) => a && text.includes(a.toLowerCase()))) return r.key;
    }
    return null;
}

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (onChange: () => void) => {
    const mq = window.matchMedia(MOTION_QUERY);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
};
const motionSnapshot = () => window.matchMedia(MOTION_QUERY).matches;

export default function BaliFootprint({ projects, config }: { projects: FootprintProject[]; config?: FootprintConfig }) {
    const island = useMemo(() => smoothClosedPath(COAST), []);
    const REGIONS = config?.regions && config.regions.length > 0 ? config.regions : DEFAULT_REGIONS;
    const HQ = config?.hq ?? DEFAULT_HQ;
    const note = config?.note ?? DEFAULT_NOTE;

    const byRegion = useMemo(() => {
        const map = new Map<string, FootprintProject[]>();
        for (const p of projects) {
            const key = matchRegion(REGIONS, p.location);
            if (!key) continue;
            map.set(key, [...(map.get(key) ?? []), p]);
        }
        return map;
    }, [projects, REGIONS]);

    const active = REGIONS.filter((r) => byRegion.has(r.key));
    const mappedCount = active.reduce((n, r) => n + (byRegion.get(r.key)?.length ?? 0), 0);

    const [selected, setSelected] = useState<string | null>(null);
    const [hover, setHover] = useState<string | null>(null);
    const current = selected && byRegion.has(selected) ? selected : active[0]?.key ?? null;
    const currentRegion = REGIONS.find((r) => r.key === current) ?? null;
    const currentProjects = current ? byRegion.get(current) ?? [] : [];
    const reduceMotion = useSyncExternalStore(subscribeMotion, motionSnapshot, () => false);
    const animate = !reduceMotion;

    const hx = px(HQ.lon);
    const hy = py(HQ.lat);

    const linkPath = (r: Region) => {
        const x = px(r.lon);
        const y = py(r.lat);
        const mx = (hx + x) / 2;
        const my = (hy + y) / 2;
        const dx = x - hx;
        const dy = y - hy;
        const len = Math.hypot(dx, dy) || 1;
        // lengkung ke samping supaya terlihat seperti jalur data
        const cx = mx + (-dy / len) * 38;
        const cy = my + (dx / len) * 38;
        return `M${hx.toFixed(1)} ${hy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    };

    const hovered = REGIONS.find((r) => r.key === hover);

    return (
        <div className="grid items-start gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
            {/* ── Peta ── */}
            <div className="hud-frame relative rounded-2xl border border-neon/25 bg-[#0e2547]/70 p-2 sm:p-4">
                <svg
                    viewBox="0 0 900 580"
                    role="img"
                    aria-label="Peta digital Pulau Bali dengan titik-titik jaringan SkyNusa Tech"
                    className="h-auto w-full"
                >
                    <defs>
                        <linearGradient id="bali-fill" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor="#268bff" stopOpacity="0.38" />
                            <stop offset="1" stopColor="#20c9f5" stopOpacity="0.16" />
                        </linearGradient>
                        <linearGradient id="bali-scan" x1="0" x2="1">
                            <stop offset="0" stopColor="#20c9f5" stopOpacity="0" />
                            <stop offset="0.85" stopColor="#20c9f5" stopOpacity="0.28" />
                            <stop offset="1" stopColor="#20c9f5" stopOpacity="0.7" />
                        </linearGradient>
                        <clipPath id="bali-clip">
                            <path d={island} />
                        </clipPath>
                    </defs>

                    {/* grid lintang/bujur */}
                    <g stroke="#20c9f5" strokeOpacity="0.1" strokeWidth="1">
                        {Array.from({ length: 11 }, (_, i) => (
                            <line key={`v${i}`} x1={px(114.4 + i * 0.13)} y1="10" x2={px(114.4 + i * 0.13)} y2="570" />
                        ))}
                        {Array.from({ length: 8 }, (_, i) => (
                            <line key={`h${i}`} x1="10" y1={py(-8.04 - i * 0.12)} x2="890" y2={py(-8.04 - i * 0.12)} />
                        ))}
                    </g>

                    {/* pulau */}
                    <path d={island} fill="none" stroke="#20c9f5" strokeOpacity="0.22" strokeWidth="9" strokeLinejoin="round" />
                    <path d={island} fill="url(#bali-fill)" stroke="#5fe0ff" strokeWidth="1.6" strokeLinejoin="round" />

                    {/* efek pemindaian */}
                    {animate && (
                        <g clipPath="url(#bali-clip)">
                            <rect className="map-scan" x="0" y="0" width="120" height="580" fill="url(#bali-scan)" />
                        </g>
                    )}

                    {/* nama wilayah (dekoratif, tanpa klaim proyek) */}
                    <g className="max-sm:hidden" fill="#9cc8ff" fillOpacity="0.55" fontSize="12" textAnchor="middle" fontFamily="Inter, sans-serif">
                        {REGIONS.filter((r) => !byRegion.has(r.key)).map((r) => (
                            <text key={r.key} x={px(r.lon)} y={py(r.lat) + 4}>
                                {r.name}
                            </text>
                        ))}
                    </g>

                    {/* jalur data HQ → wilayah ber-proyek */}
                    {active.map((r, i) => {
                        const d = linkPath(r);
                        const isCur = r.key === current;
                        return (
                            <g key={`l-${r.key}`}>
                                <path d={d} fill="none" stroke="#20c9f5" strokeOpacity={isCur ? 0.95 : 0.5} strokeWidth={isCur ? 2 : 1.4} strokeDasharray="5 7" className="map-flow" />
                                {animate && (
                                    <circle r="3" fill="#fff">
                                        <animateMotion dur={`${3 + (i % 4) * 0.6}s`} repeatCount="indefinite" path={d} />
                                    </circle>
                                )}
                            </g>
                        );
                    })}

                    {/* HQ */}
                    <g>
                        <circle cx={hx} cy={hy} r="10" fill="#ff9d32" fillOpacity="0.35" className={animate ? 'map-ring' : ''} />
                        <circle cx={hx} cy={hy} r="7" fill="#ff9d32" stroke="#fff" strokeWidth="2" />
                        <text x={hx + 14} y={hy + 24} fill="#fff" fontSize="13" fontWeight="600" fontFamily="'Space Grotesk', sans-serif" className="max-sm:hidden">
                            {HQ.name} · {HQ.place}
                        </text>
                    </g>

                    {/* penanda proyek */}
                    {active.map((r) => {
                        const x = px(r.lon);
                        const y = py(r.lat);
                        const count = byRegion.get(r.key)?.length ?? 0;
                        const isCur = r.key === current;
                        return (
                            <g
                                key={r.key}
                                role="button"
                                tabIndex={0}
                                aria-label={`${r.name}, ${count} proyek`}
                                aria-pressed={isCur}
                                className="cursor-pointer outline-none"
                                onClick={() => setSelected(r.key)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setSelected(r.key);
                                    }
                                }}
                                onMouseEnter={() => setHover(r.key)}
                                onMouseLeave={() => setHover(null)}
                                onFocus={() => setHover(r.key)}
                                onBlur={() => setHover(null)}
                            >
                                <circle cx={x} cy={y} r="22" fill="transparent" />
                                <circle cx={x} cy={y} r="9" fill="#20c9f5" fillOpacity="0.3" className={animate ? 'map-ring' : ''} />
                                <circle cx={x} cy={y} r={isCur ? 9 : 7} fill={isCur ? '#fff' : '#20c9f5'} stroke={isCur ? '#20c9f5' : '#fff'} strokeWidth="2.5" />
                                <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={isCur ? '#0b2447' : '#0b2447'} fontFamily="Inter, sans-serif" pointerEvents="none">
                                    {count > 9 ? '9+' : count}
                                </text>
                            </g>
                        );
                    })}

                    {/* tooltip */}
                    {hovered && byRegion.has(hovered.key) && (
                        <g pointerEvents="none">
                            <rect
                                x={px(hovered.lon) - 62}
                                y={py(hovered.lat) - 52}
                                width="124"
                                height="34"
                                rx="8"
                                fill="#fff"
                                stroke="#268bff"
                            />
                            <text x={px(hovered.lon)} y={py(hovered.lat) - 31} textAnchor="middle" fontSize="13" fontWeight="700" fill="#142d4e" fontFamily="'Space Grotesk', sans-serif">
                                {hovered.name} · {byRegion.get(hovered.key)?.length} proyek
                            </text>
                        </g>
                    )}
                </svg>

                <p className="px-2 pb-1 pt-2 text-[11px] leading-snug text-blue-200/70 sm:px-1">
                    {note}
                </p>
            </div>

            {/* ── Panel info ── */}
            <div className="text-white">
                {active.length > 0 ? (
                    <>
                        <p className="text-sm text-blue-200">
                            {mappedCount} proyek tercatat di {active.length} wilayah Bali
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Pilih wilayah">
                            {active.map((r) => {
                                const on = r.key === current;
                                return (
                                    <button
                                        key={r.key}
                                        type="button"
                                        onClick={() => setSelected(r.key)}
                                        aria-pressed={on}
                                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                                            on
                                                ? 'border-neon bg-neon text-gray-900'
                                                : 'border-white/20 bg-white/5 text-white hover:border-neon/60 hover:bg-white/10'
                                        }`}
                                    >
                                        {r.name} <span className="opacity-70">{byRegion.get(r.key)?.length}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {currentRegion && (
                            <div className="mt-6 space-y-3">
                                <h3 className="flex items-center gap-2 text-lg font-semibold">
                                    <MapPin className="h-5 w-5 text-brand" aria-hidden="true" />
                                    {currentRegion.name}
                                </h3>
                                <ul className="space-y-3">
                                    {currentProjects.slice(0, 4).map((p) => (
                                        <li key={p.id}>
                                            <Link
                                                href={`/portfolio/${p.slug}`}
                                                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5 hover:border-neon/60 hover:bg-white/10"
                                            >
                                                {p.image ? (
                                                    <img src={p.image} alt="" loading="lazy" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="h-16 w-20 shrink-0 rounded-lg bg-white/10" />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold">{p.title}</p>
                                                    <p className="truncate text-xs text-blue-200">
                                                        {[p.service, p.location].filter(Boolean).join(' · ')}
                                                    </p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 shrink-0 text-neon opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                {currentProjects.length > 4 && (
                                    <Link href="/portfolio" className="inline-block text-sm font-medium text-neon hover:underline">
                                        Lihat {currentProjects.length - 4} proyek lainnya di portfolio
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-blue-100">
                        <p className="font-semibold text-white">Basis kami di {HQ.place}, Bali.</p>
                        <p className="mt-2">
                            Penanda proyek akan muncul otomatis di peta ini begitu kolom lokasi pada proyek di dashboard
                            admin terisi (misalnya &quot;Ubud, Gianyar&quot;).
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
