import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Layanan', href: '/layanan' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Tim Kami', href: '/tim' },
    { label: 'Tentang Kami', href: '/tentang-kami' },
];

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <img 
                            src="/asset/logo.png" 
                            alt="SKYNUSA TECH Logo" 
                            className="h-8 w-auto sm:h-10 max-w-[180px] sm:max-w-[220px]" 
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-4 lg:gap-8 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${
                                    currentPath === item.href
                                        ? 'text-blue-600'
                                        : 'text-gray-700 hover:text-blue-600'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:flex">
                        <Button 
                            className="bg-blue-600 text-white hover:bg-blue-700" 
                            size="sm"
                        >
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-700"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        <div className="flex flex-col space-y-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                                        currentPath === item.href
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="px-4 pt-2">
                                <Button 
                                    className="w-full bg-blue-600 text-white hover:bg-blue-700" 
                                    size="sm"
                                >
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}