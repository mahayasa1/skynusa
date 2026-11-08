import { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import { useLanguage } from '@/i18n';

type Msg = { role: 'user' | 'assistant'; content: string };

const TEXT = {
    id: {
        title: 'Skybot',
        subtitle: 'Bingung? Tanya apa saja soal layanan kami',
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
    },
    en: {
        title: 'Skybot',
        subtitle: 'Not sure? Ask anything about our services',
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
    },
} as const;

function xsrfToken(): string {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export default function AiChatWidget() {
    const { lang } = useLanguage();
    const tx = TEXT[lang];

    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages, loading, open]);

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

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
            {open && (
                <div className="flex h-[min(32rem,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-sm animate-[fadeIn_.2s_ease-out_forwards] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center gap-3 bg-linear-to-r from-blue-600 to-blue-800 px-4 py-3 text-white">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                            <img src="/asset/skybot.png" alt="" className="h-9 w-9 object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold leading-tight">{tx.title}</p>
                            <p className="truncate text-xs text-blue-100">{tx.subtitle}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label={tx.close}
                            className="rounded-full p-1.5 hover:bg-white/15"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Pesan */}
                    <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4 text-sm">
                        <div className="flex items-end gap-2">
                            <img src="/asset/skybot.png" alt="" className="h-8 w-8 shrink-0 object-contain" />
                            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-gray-800 shadow-sm">
                                {tx.welcome}
                            </div>
                        </div>

                        {messages.length === 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {tx.suggestions.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => send(s)}
                                        className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex items-end justify-start gap-2'}>
                                {m.role === 'assistant' && (
                                    <img src="/asset/skybot.png" alt="" className="h-8 w-8 shrink-0 object-contain" />
                                )}
                                <div
                                    className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 shadow-sm ${
                                        m.role === 'user'
                                            ? 'rounded-tr-sm bg-blue-600 text-white'
                                            : 'rounded-bl-sm bg-white text-gray-800'
                                    }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-200 bg-white p-3">
                        <div className="flex items-center gap-2">
                            <input
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
                                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => send(input)}
                                disabled={loading || !input.trim()}
                                aria-label={tx.send}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="mt-2 text-center text-[11px] leading-snug text-gray-500">{tx.note}</p>
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-label={open ? tx.close : tx.open}
                aria-expanded={open}
                className="group flex cursor-pointer flex-col items-center focus-visible:outline-none"
            >
                <img
                    src="/asset/skybot.png"
                    alt=""
                    draggable={false}
                    className={`pointer-events-none h-20 w-20 object-contain drop-shadow-[0_6px_14px_rgba(10,40,48,0.35)] transition-transform duration-200 group-hover:scale-110 group-active:scale-95 sm:h-24 sm:w-24 ${
                        open ? '' : 'animate-[skybot-bob_3.4s_ease-in-out_infinite] motion-reduce:animate-none'
                    }`}
                />
                <span className="-mt-2 flex items-center gap-1.5 rounded-full bg-gray-900 py-1 pr-3 pl-1 text-xs font-semibold text-white shadow-lg ring-2 ring-white transition-colors group-hover:bg-blue-800 group-focus-visible:ring-brand">
                    {open ? (
                        <>
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                                <X className="h-3 w-3" />
                            </span>
                            {tx.ctaClose}
                        </>
                    ) : (
                        <>
                            <span className="flex h-5 items-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-gray-900">
                                AI
                            </span>
                            {tx.cta}
                        </>
                    )}
                </span>
            </button>
        </div>
    );
}
