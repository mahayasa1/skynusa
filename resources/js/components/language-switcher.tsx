import { useLanguage, type Lang } from '@/i18n';

const OPTIONS: Lang[] = ['id', 'en'];

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
    const { lang, setLang } = useLanguage();

    return (
        <div
            role="group"
            aria-label="Language"
            className={`items-center rounded-full border border-gray-200 bg-white p-0.5 text-xs font-semibold ${className || 'inline-flex'}`}
        >
            {OPTIONS.map((code) => (
                <button
                    key={code}
                    type="button"
                    aria-pressed={lang === code}
                    onClick={() => setLang(code)}
                    className={`rounded-full px-2.5 py-1 transition-colors ${
                        lang === code
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:text-blue-600'
                    }`}
                >
                    {code.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
