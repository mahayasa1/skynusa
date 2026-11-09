import { useRef, type ReactNode } from 'react';

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    /** Sudut miring maksimum (derajat). Default halus: 5 */
    max?: number;
}

/** Pembungkus kartu: miring 3D tipis + sorotan cyan mengikuti kursor (hanya mouse, bukan sentuhan). */
export default function TiltCard({ children, className = '', max = 5 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== 'mouse') return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--rx', `${((0.5 - py) * max * 2).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${((px - 0.5) * max * 2).toFixed(2)}deg`);
        el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    };

    const onLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
    };

    return (
        <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`tilt ${className}`}>
            {children}
        </div>
    );
}
