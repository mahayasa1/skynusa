import { Link } from '@inertiajs/react';
import { useT } from '@/i18n';

export default function Footer() {
    const t = useT();
    return (
        <footer className="bg-gray-900 pt-12 pb-8 sm:pt-16 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-4">
                    
                    {/* Company Info - full width on mobile */}
                    <div className="col-span-2 sm:col-span-1">
                        <img 
                            src="/asset/footer-logo.png" 
                            alt="SKYNUSA TECH Logo" 
                            className="mb-4 h-7 sm:h-8 w-auto max-w-[150px]" 
                        />
                        <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
                            {t('footer.desc')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-white">{t('footer.quickLinks')}</h3>
                        <ul className="space-y-2.5 text-sm text-gray-300">
                            <li><Link href="/tentang-kami" className="hover:text-brand transition-colors">{t('nav.aboutUs')}</Link></li>
                            <li><Link href="/layanan" className="hover:text-brand transition-colors">{t('nav.services')}</Link></li>
                            <li><Link href="/tim" className="hover:text-brand transition-colors">{t('nav.team')}</Link></li>
                            <li><Link href="/kontak" className="hover:text-brand transition-colors">{t('nav.contact')}</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-white">{t('footer.ourServices')}</h3>
                        <ul className="space-y-2.5 text-sm text-gray-300">
                            <li>{t('footer.s1')}</li>
                            <li>{t('footer.s2')}</li>
                            <li>{t('footer.s3')}</li>
                            <li>{t('footer.s4')}</li>
                            <li>{t('footer.s5')}</li>
                        </ul>
                    </div>

                    {/* Contact - full width on mobile */}
                    <div className="col-span-2 sm:col-span-1">
                        <h3 className="mb-4 text-sm font-semibold text-white">{t('footer.contactUs')}</h3>
                        <ul className="space-y-2.5 text-sm text-gray-300">
                            <li>
                                <a href="mailto:Roycegroupbali@gmail.com" className="hover:text-brand transition-colors break-all">
                                    Roycegroupbali@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+62881080888361" className="hover:text-brand transition-colors">
                                    +62 881-080-888-361
                                </a>
                            </li>
                            <li className="leading-relaxed">Royce Group, Purimas Regency 2 Kav 8, Jimbaran, Bali</li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t border-white/10 pt-6 text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} SKYNUSA TECH. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
}