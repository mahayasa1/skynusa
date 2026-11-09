import { useEffect, useRef, useState } from 'react';

/**
 * Angka naik saat masuk layar. Menerima teks seperti "188+" atau "95%".
 * Teks awal = nilai akhir, jadi aman untuk SSR dan pengunjung "reduce motion".
 */
export default function CountUp({ value, className = '' }: { value: string; className?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [text, setText] = useState(value);

    useEffect(() => {
        const el = ref.current;
        const match = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
        if (!el || !match || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const [, prefix, num, suffix] = match;
        const target = parseFloat(num.replace(',', '.'));
        const decimals = /[.,]\d+$/.test(num) ? num.split(/[.,]/)[1].length : 0;
        let raf = 0;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                const start = performance.now();
                const dur = 1400;
                const tick = (now: number) => {
                    const t = Math.min(1, (now - start) / dur);
                    const eased = 1 - Math.pow(1 - t, 3);
                    setText(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
                    if (t < 1) raf = requestAnimationFrame(tick);
                    else setText(value);
                };
                raf = requestAnimationFrame(tick);
            },
            { threshold: 0.4 },
        );
        io.observe(el);

        return () => {
            io.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [value]);

    return (
        <span ref={ref} className={className}>
            {text}
        </span>
    );
}
