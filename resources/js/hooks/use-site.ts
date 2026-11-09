import { usePage } from '@inertiajs/react';

export interface SiteContact {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    hours_weekday: string;
    hours_weekend: string;
    footer_description: string;
    map_embed_url: string;
}

export interface SiteStats {
    projects: string;
    satisfaction: string;
    technicians: string;
    years: string;
    clients: string;
}

interface SiteProps {
    site?: { contact?: Partial<SiteContact>; stats?: Partial<SiteStats> };
    [key: string]: unknown;
}

const FALLBACK_CONTACT: SiteContact = {
    email: 'Roycegroupbali@gmail.com',
    phone: '+62 881-080-888-361',
    whatsapp: '6281339579969',
    address: 'Royce Group, Purimas Regency 2 Kav 8, Jimbaran, Bali',
    hours_weekday: '',
    hours_weekend: '',
    footer_description: '',
    map_embed_url: '',
};

const FALLBACK_STATS: SiteStats = {
    projects: '188+',
    satisfaction: '95%',
    technicians: '20+',
    years: '10+',
    clients: '150+',
};

/** Kontak & statistik situs, diedit di Admin > Konten Situs. */
export function useSite() {
    const { site } = usePage<SiteProps>().props;
    return {
        contact: { ...FALLBACK_CONTACT, ...(site?.contact ?? {}) } as SiteContact,
        stats: { ...FALLBACK_STATS, ...(site?.stats ?? {}) } as SiteStats,
    };
}
