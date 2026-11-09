import { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import { useLanguage } from '@/i18n';

type Msg = { role: 'user' | 'assistant'; content: string };

const TEXT = {
    id: {
        title: 'Skybot',
        subtitle: 'Bingung? Tanya apa saja soal layanan kami',
        online: 'Online',
        placeholder: 'Tulis pertanyaan...',
        welcome:
            'Halo! Saya Skybot, asisten SKYNUSA TECH. Bingung mau pasang CCTV, bikin website, atau layanan lain? Tanya saja.',
        suggestions: ['Pasang CCTV butuh apa saja?', 'Website butuh apa saja?', 'Bagaimana cara memesan?'],
        error: 'Maaf, terjadi gangguan. Silakan coba lagi atau hubungi kami lewat WhatsApp.',
        note: 'Jawaban AI bisa keliru. Jangan kirim data pribadi. Untuk harga dan penawaran, hubungi tim kami.',
        open: 'Buka Skybot',
        close: 'Tutup Skybot',
        cta: 'Tanya Skybot',
        ctaClose: 'Tutup',
        send: 'Kirim',
        bubble: 'Halo! Ada yang bisa dibantu?',
        dismiss: 'Tutup sapaan',
    },
    en: {
        title: 'Skybot',
        subtitle: 'Not sure? Ask anything about our services',
        online: 'Online',
        placeholder: 'Type your question...',
        welcome:
            "Hi! I'm Skybot, the SKYNUSA TECH assistant. Not sure what you need for CCTV, a website, or another service? Just ask.",
        suggestions: ['What do I need for CCTV?', 'What does a website need?', 'How do I place an order?'],
        error: 'Sorry, something went wrong. Please try again or contact us via WhatsApp.',
        note: 'AI answers may be inaccurate. Do not share personal data. For pricing and quotes, contact our team.',
        open: 'Open Skybot',
        close: 'Close Skybot',
        cta: 'Ask Skybot',
        ctaClose: 'Close',
        send: 'Send',
        bubble: 'Hi! Need a hand?',
        dismiss: 'Dismiss greeting',
    },
} as const;

const MASCOT = '/asset/skybot.png';
const GREETED_KEY = 'skybot-greeted';

function xsrfToken(): string {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export default function AiChatWidget() {
    const { lang } = useLanguage();
    const tx = TEXT[lang];

    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false); // panel tetap ada sebentar agar animasi tutup terlihat
    const [messages, setMessages] = useState<Msg[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [waving, setWaving] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const sendRef = useRef<(text: string) => void>(() => {});

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages, loading, open]);

    const openPanel = () => {
        setShowBubble(false);
        setMounted(true);
        setOpen(true);
    };
    const closePanel = () => {
        setOpen(false);
        window.setTimeout(() => setMounted(false), 200);
    };

    // Sapaan: maskot melambai sekali, lalu gelembung muncul (sekali per sesi)
    useEffect(() => {
        let seen = false;
        try {
            seen = sessionStorage.getItem(GREETED_KEY) === '1';
        } catch {
            /* abaikan */
        }
        if (seen) return;
        const t1 = window.setTimeout(() => {
            setWaving(true);
            setShowBubble(true);
            try {
                sessionStorage.setItem(GREETED_KEY, '1');
            } catch {
                /* abaikan */
            }
        }, 2500);
        const t2 = window.setTimeout(() => setWaving(false), 4000);
        const t3 = window.setTimeout(() => setShowBubble(false), 11000);
        return () => {
            window.clearTimeout(t1);
            window.clearTimeout(t2);
            window.clearTimeout(t3);
        };
    }, []);

    const send = async (text: string) => {
        const content = text.trim();
        if (!content || loading) return;

        const next: Msg[] = [...messages, { role: 'user', content }];
        setMessages(next);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': xsrfToken(),
                },
                body: JSON.stringify({ messages: next.slice(-12), lang }),
            });
            if (!res.ok) throw new Error('bad status');
            const data = await res.json();
            setMessages([...next, { role: 'assistant', content: String(data.reply ?? tx.error) }]);
        } catch {
            setMessages([...next, { role: 'assistant', content: tx.error }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        sendRef.current = send;
    });

    // Tombol di bagian lain situs (mis. "Kenalan dengan Skybot") membuka widget lewat event ini
    useEffect(() => {
        const onOpen = (e: Event) => {
            const question = (e as CustomEvent<{ question?: string }>).detail?.question;
            setShowBubble(false);
            setMounted(true);
            setOpen(true);
            if (question) window.setTimeout(() => sendRef.current(question), 250);
            else window.setTimeout(() => inputRef.current?.focus(), 300);
        };
        window.addEventListener('skybot:open', onOpen);
        return () => window.removeEventListener('skybot:open', onOpen);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closePanel();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
            {mounted && (
                <div
                    role="dialog"
                    aria-label={tx.title}
                    className={`flex h-[min(34rem,calc(100dvh-9rem))] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-[0_30px_70px_-20px_rgba(22,119,232,0.45)] ${
                        open
                            ? 'skybot-chat-in'
                            : 'pointer-events-none translate-y-3 scale-95 opacity-0 transition duration-200 ease-in'
                    }`}
                >
                    {/* Header */}
                    <div className="relative flex items-center gap-3 border-b border-blue-100 bg-gradient-to-r from-blue-100 via-blue-50 to-white px-4 py-3">
                        <div className="relative">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-2 ring-blue-200">
                                <img
                                    src={MASCOT}
                                    alt=""
                                    className={`h-9 w-9 object-contain ${loading ? 'animate-[bot-think_0.9s_ease-in-out_infinite]' : ''}`}
                                />
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" title={tx.online} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-display text-sm font-semibold leading-tight text-gray-900">{tx.title}</p>
                            <p className="truncate text-xs text-gray-500">{tx.subtitle}</p>
                        </div>
                        <button
                            type="button"
                            onClick={closePanel}
                            aria-label={tx.close}
                            className="rounded-full p-1.5 text-gray-500 hover:bg-white hover:text-gray-900"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Pesan */}
                    <div className="flex-1 space-y-3 overflow-y-auto bg-blue-50/60 px-4 py-4 text-sm" aria-live="polite">
                        <div className="flex items-end gap-2">
                            <img src={MASCOT} alt="" className="h-8 w-8 shrink-0 object-contain" />
                            <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-blue-100 bg-white px-3.5 py-2.5 text-gray-800 shadow-sm">
                                {tx.welcome}
                            </div>
                        </div>

                        {messages.map((m, i) => (
                            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex items-end justify-start gap-2'}>
                                {m.role === 'assistant' && <img src={MASCOT} alt="" className="h-8 w-8 shrink-0 object-contain" />}
                                <div
                                    className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 shadow-sm ${
                                        m.role === 'user'
                                            ? 'rounded-br-sm bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                                            : 'rounded-bl-sm border border-blue-100 bg-white text-gray-800'
                                    }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex items-end gap-2" role="status" aria-label="Skybot sedang mengetik">
                                <img src={MASCOT} alt="" className="h-8 w-8 shrink-0 object-contain" />
                                <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-blue-100 bg-white px-4 py-3 shadow-sm">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:150ms]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-neon [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Balasan cepat + input */}
                    <div className="border-t border-blue-100 bg-white p-3">
                        <div className="-mx-1 mb-2 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
                            {tx.suggestions.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => send(s)}
                                    disabled={loading}
                                    className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:border-blue-500 hover:bg-white disabled:opacity-50"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        send(input);
                                    }
                                }}
                                maxLength={1000}
                                placeholder={tx.placeholder}
                                disabled={loading}
                                className="flex-1 rounded-full border border-blue-200 bg-blue-50/50 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                            />
                            <button
                                type="button"
                                onClick={() => send(input)}
                                disabled={loading || !input.trim()}
                                aria-label={tx.send}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md hover:from-blue-600 hover:to-blue-800 disabled:opacity-40"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="mt-2 text-center text-[11px] leading-snug text-gray-500">{tx.note}</p>
                    </div>
                </div>
            )}

            <div className="relative flex flex-col items-center">
                {showBubble && !open && (
                    <div className="skybot-chat-in absolute bottom-full right-0 mb-1 w-max max-w-[200px] rounded-2xl rounded-br-sm border border-blue-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-900 shadow-lg">
                        {tx.bubble}
                        <button
                            type="button"
                            onClick={() => setShowBubble(false)}
                            aria-label={tx.dismiss}
                            className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => (open ? closePanel() : openPanel())}
                    aria-label={open ? tx.close : tx.open}
                    aria-expanded={open}
                    className="group flex cursor-pointer flex-col items-center focus-visible:outline-none"
                >
                    <img
                        src={MASCOT}
                        alt=""
                        draggable={false}
                        className={`pointer-events-none h-20 w-20 object-contain drop-shadow-[0_6px_14px_rgba(11,36,71,0.35)] transition-transform duration-200 group-hover:scale-110 group-active:scale-95 sm:h-24 sm:w-24 ${
                            waving
                                ? 'animate-[bot-wave_1.4s_ease-in-out_2]'
                                : open
                                  ? ''
                                  : 'animate-[skybot-bob_3.4s_ease-in-out_infinite] motion-reduce:animate-none'
                        }`}
                    />
                    <span className="-mt-2 flex items-center gap-1.5 rounded-full bg-gray-900 py-1 pr-3 pl-1 text-xs font-semibold text-white shadow-lg ring-2 ring-white transition-colors group-hover:bg-blue-700 group-focus-visible:ring-brand">
                        {open ? (
                            <>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                                    <X className="h-3 w-3" />
                                </span>
                                {tx.ctaClose}
                            </>
                        ) : (
                            <>
                                <span className="flex h-5 items-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-gray-900">AI</span>
                                {tx.cta}
                            </>
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
}
