import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-gray-900 py-8 sm:py-12 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-4">
                    
                    {/* Company Info - full width on mobile */}
                    <div className="col-span-2 sm:col-span-1">
                        <img 
                            src="/asset/footer-logo.png" 
                            alt="SKYNUSA TECH Logo" 
                            className="mb-4 h-7 sm:h-8 w-auto max-w-[150px]" 
                        />
                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                            Solusi profesional untuk instalasi, maintenance, IT support, dan web development.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-3 text-xs sm:text-sm font-semibold">Menu Cepat</h3>
                        <ul className="space-y-1.5 text-xs text-gray-400">
                            <li><Link href="/tentang-kami" className="hover:text-blue-400 transition-colors">Tentang Kami</Link></li>
                            <li><Link href="/layanan" className="hover:text-blue-400 transition-colors">Layanan</Link></li>
                            <li><Link href="/tim" className="hover:text-blue-400 transition-colors">Tim Kami</Link></li>
                            <li><Link href="/kontak" className="hover:text-blue-400 transition-colors">Kontak</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="mb-3 text-xs sm:text-sm font-semibold">Layanan Kami</h3>
                        <ul className="space-y-1.5 text-xs text-gray-400">
                            <li>Instalasi Elektronik</li>
                            <li>Service AC</li>
                            <li>Maintenance</li>
                            <li>IT Support</li>
                            <li>Web Development</li>
                        </ul>
                    </div>

                    {/* Contact - full width on mobile */}
                    <div className="col-span-2 sm:col-span-1">
                        <h3 className="mb-3 text-xs sm:text-sm font-semibold">Hubungi Kami</h3>
                        <ul className="space-y-1.5 text-xs text-gray-400">
                            <li>
                                <a href="mailto:Roycegroupbali@gmail.com" className="hover:text-blue-400 transition-colors break-all">
                                    Roycegroupbali@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+62881080888361" className="hover:text-blue-400 transition-colors">
                                    +62 881-080-888-361
                                </a>
                            </li>
                            <li className="leading-relaxed">Royce Group, Purimas Regency 2 Kav 8, Jimbaran, Bali</li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
                    <p>Developed by © 2025 SKYNUSA TECH. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}