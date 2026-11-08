import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
    children: ReactNode;
    /** Jeda dalam ms, berguna untuk elemen berurutan (mis. 0, 100, 200) */
    delay?: number;
    className?: string;
}

/** Elemen muncul halus (fade + naik sedikit) saat masuk layar. */
export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
                visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            } ${className}`}
        >
            {children}
        </div>
    );
}
