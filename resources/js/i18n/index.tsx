import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import en from './en';
import id from './id';

export type Lang = 'id' | 'en';
export type TranslationKey = keyof typeof id;

const DEFAULT_LANG: Lang = 'id'; // bahasa default
const STORAGE_KEY = 'skynusa-lang';
const dictionaries: Record<Lang, Record<TranslationKey, string>> = { id, en };

interface LanguageContextValue {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
    lang: DEFAULT_LANG,
    setLang: () => {},
    t: (key) => id[key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Selalu mulai dari Indonesia (aman untuk SSR), lalu ikuti pilihan tersimpan
    const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'id' || saved === 'en') setLangState(saved);
        } catch {
            /* localStorage tidak tersedia */
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const setLang = useCallback((next: Lang) => {
        setLangState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* abaikan */
        }
    }, []);

    const t = useCallback(
        (key: TranslationKey) => dictionaries[lang][key] ?? id[key] ?? key,
        [lang],
    );

    const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
export const useT = () => useContext(LanguageContext).t;
