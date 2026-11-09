import { useEffect, useRef } from 'react';

interface NetworkFieldProps {
    className?: string;
}

type Particle = { x: number; y: number; vx: number; vy: number; r: number; cyan: boolean };

/**
 * Jaringan titik yang saling terhubung (canvas 2D, tanpa library).
 * - Jumlah titik menyesuaikan lebar layar
 * - Berhenti saat tidak terlihat / tab tidak aktif
 * - "Reduce motion": hanya menggambar satu frame statis
 */
export default function NetworkField({ className = '' }: NetworkFieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mouse = { x: -9999, y: -9999 };
        let particles: Particle[] = [];
        let w = 0;
        let h = 0;
        let raf = 0;
        let inView = true;

        const build = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = rect.width;
            h = rect.height;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.round(Math.min(90, Math.max(24, (w * h) / 12000)));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.9,
                vy: (Math.random() - 0.5) * 0.9,
                r: 1.2 + Math.random() * 1.6,
                cyan: Math.random() > 0.6,
            }));
        };

        const LINK = 170;

        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d < LINK) {
                        const alpha = 0.35 + (1 - d / LINK) * 0.25; // selalu terang, tidak bergantung kursor
                        ctx.strokeStyle = a.cyan || b.cyan ? `rgba(32,201,245,${alpha})` : `rgba(38,139,255,${alpha})`;
                        ctx.lineWidth = 1.4;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
                const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
                if (dm < 170) {
                    ctx.strokeStyle = `rgba(32,201,245,${Math.min(1, 0.4 + (1 - dm / 170))})`;
                    ctx.lineWidth = 1.4;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            // Titik menyala (glow) supaya terasa "hidup"
            for (const p of particles) {
                const color = p.cyan ? 'rgba(32,201,245,1)' : 'rgba(38,139,255,1)';
                ctx.shadowColor = color;
                ctx.shadowBlur = 10;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r + 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 10;
        };

        const step = () => {
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                if (p.y > h + 10) p.y = -10;
            }
            draw();
            raf = requestAnimationFrame(step);
        };

        const start = () => {
            if (reduce || raf || !inView || document.hidden) return;
            raf = requestAnimationFrame(step);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };

        const onMove = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        };
        const onLeave = () => {
            mouse.x = -9999;
            mouse.y = -9999;
        };
        const onVisibility = () => (document.hidden ? stop() : start());

        build();
        draw();
        start();

        const io = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            if (inView) start();
            else stop();
        });
        io.observe(canvas);

        const ro = new ResizeObserver(() => {
            build();
            draw();
        });
        ro.observe(canvas);

        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerleave', onLeave);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            stop();
            io.disconnect();
            ro.disconnect();
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerleave', onLeave);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
