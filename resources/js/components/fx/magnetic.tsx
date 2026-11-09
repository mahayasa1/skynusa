import { useRef, type ReactNode } from 'react';

/** Elemen "tertarik" sedikit ke arah kursor (hanya mouse). Cocok untuk tombol CTA. */
export default function Magnetic({ children, className = '', strength = 0.25 }: { children: ReactNode; className?: string; strength?: number }) {
    const ref = useRef<HTMLDivElement>(null);

    const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== 'mouse') return;
        const el = ref.current;
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };
    const onLeave = () => {
        if (ref.current) ref.current.style.transform = '';
    };

    return (
        <div
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            className={`inline-block transition-transform duration-200 ease-out ${className}`}
        >
            {children}
        </div>
    );
}
