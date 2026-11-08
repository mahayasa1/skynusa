import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, options: Record<string, unknown>) => string;
            reset: (id: string) => void;
            remove: (id: string) => void;
        };
    }
}

const SCRIPT_SRC =
    'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileProps {
    /** Dipanggil dengan token saat lolos, dan '' saat token kedaluwarsa/error */
    onVerify: (token: string) => void;
    /** Naikkan angka ini (mis. setCount(n => n + 1)) untuk mengulang captcha */
    resetKey?: number;
    className?: string;
}

export default function Turnstile({ onVerify, resetKey = 0, className }: TurnstileProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const onVerifyRef = useRef(onVerify);
    onVerifyRef.current = onVerify;

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

    useEffect(() => {
        if (!siteKey) {
            // Site key belum diisi (dev): biarkan form tetap bisa dipakai
            onVerifyRef.current('dev-no-site-key');
            return;
        }

        let cancelled = false;

        const render = () => {
            if (cancelled || !containerRef.current || !window.turnstile || widgetId.current) return;
            widgetId.current = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                theme: 'auto',
                language: 'id',
                callback: (token: string) => onVerifyRef.current(token),
                'expired-callback': () => onVerifyRef.current(''),
                'error-callback': () => onVerifyRef.current(''),
            });
        };

        let script = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
        if (window.turnstile) {
            render();
        } else {
            if (!script) {
                script = document.createElement('script');
                script.src = SCRIPT_SRC;
                script.async = true;
                script.defer = true;
                script.dataset.turnstile = '1';
                document.head.appendChild(script);
            }
            script.addEventListener('load', render);
        }

        return () => {
            cancelled = true;
            script?.removeEventListener('load', render);
            if (widgetId.current && window.turnstile) {
                window.turnstile.remove(widgetId.current);
            }
            widgetId.current = null;
        };
    }, [siteKey]);

    useEffect(() => {
        if (resetKey > 0 && widgetId.current && window.turnstile) {
            window.turnstile.reset(widgetId.current);
            onVerifyRef.current('');
        }
    }, [resetKey]);

    if (!siteKey) {
        return (
            <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Captcha belum aktif: VITE_TURNSTILE_SITE_KEY belum terbaca. Isi di .env lalu restart npm run dev.
            </p>
        );
    }

    return <div ref={containerRef} className={className} />;
}
