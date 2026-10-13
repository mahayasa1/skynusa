import { Link } from '@inertiajs/react';
import { Menu, X, ChevronDown, LogIn } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const [openPesanan, setOpenPesanan] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobilePesananOpen, setMobilePesananOpen] = useState(false);

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenAbout(false);
        setOpenPesanan(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileAboutOpen(false);
    setMobilePesananOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/asset/logo.png"
              alt="SKYNUSA TECH Logo"
              className="h-7 sm:h-9 w-auto max-w-[140px] sm:max-w-[200px]"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div ref={menuRef} className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-6">
            <Link href="/" className={`text-sm font-medium transition-colors ${currentPath === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              Home
            </Link>
            <Link href="/layanan" className={`text-sm font-medium transition-colors ${currentPath === '/layanan' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              Layanan
            </Link>
            <Link href="/portfolio" className={`text-sm font-medium transition-colors ${currentPath === '/portfolio' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              Portfolio
            </Link>

            {/* About Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setOpenAbout(!openAbout); setOpenPesanan(false); }}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${openAbout ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                About
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openAbout ? "rotate-180" : ""}`} />
              </button>
              {openAbout && (
                <div className="absolute left-0 mt-2 w-44 rounded-xl border bg-white shadow-xl z-50 animate-[fadeIn_.2s_ease-out_forwards]">
                  <div className="p-1">
                    <Link href="/tim" className="block px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">Tim Kami</Link>
                    <Link href="/kontak" className="block px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">Kontak</Link>
                    <Link href="/tentang-kami" className="block px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">Tentang Kami</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Pesanan Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setOpenPesanan(!openPesanan); setOpenAbout(false); }}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${openPesanan ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Pesanan
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openPesanan ? "rotate-180" : ""}`} />
              </button>
              {openPesanan && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl border bg-white shadow-xl z-50 animate-[fadeIn_.2s_ease-out_forwards]">
                  <div className="p-1">
                    <Link href="/pesanan/order" className="block px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">Order Pesanan</Link>
                    <Link href="/pesanan/tracking" className="block px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">Tracking Pesanan</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/berita" className={`text-sm font-medium transition-colors ${currentPath === '/berita' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              Berita
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow hover:shadow-md transition-all duration-200"
            >
              <LogIn className="w-3.5 h-3.5" />
              Login
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-3 py-3 space-y-0.5">
            <Link href="/" onClick={closeMobileMenu} className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentPath === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>Home</Link>
            <Link href="/layanan" onClick={closeMobileMenu} className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentPath === '/layanan' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>Layanan</Link>
            <Link href="/portfolio" onClick={closeMobileMenu} className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentPath === '/portfolio' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>Portfolio</Link>

            {/* About */}
            <div>
              <button
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                About
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAboutOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileAboutOpen && (
                <div className="ml-3 mt-0.5 border-l-2 border-blue-100 pl-3 space-y-0.5">
                  <Link href="/tim" onClick={closeMobileMenu} className={`block py-2 text-sm rounded transition-colors ${currentPath === '/tim' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Tim Kami</Link>
                  <Link href="/kontak" onClick={closeMobileMenu} className={`block py-2 text-sm rounded transition-colors ${currentPath === '/kontak' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Kontak</Link>
                  <Link href="/tentang-kami" onClick={closeMobileMenu} className={`block py-2 text-sm rounded transition-colors ${currentPath === '/tentang-kami' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Tentang Kami</Link>
                </div>
              )}
            </div>

            {/* Pesanan */}
            <div>
              <button
                onClick={() => setMobilePesananOpen(!mobilePesananOpen)}
                className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                Pesanan
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobilePesananOpen ? "rotate-180" : ""}`} />
              </button>
              {mobilePesananOpen && (
                <div className="ml-3 mt-0.5 border-l-2 border-blue-100 pl-3 space-y-0.5">
                  <Link href="/pesanan/order" onClick={closeMobileMenu} className={`block py-2 text-sm rounded transition-colors ${currentPath === '/pesanan/order' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Order Pesanan</Link>
                  <Link href="/pesanan/tracking" onClick={closeMobileMenu} className={`block py-2 text-sm rounded transition-colors ${currentPath === '/pesanan/tracking' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Tracking Pesanan</Link>
                </div>
              )}
            </div>

            <Link href="/berita" onClick={closeMobileMenu} className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentPath === '/berita' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>Berita</Link>

            <div className="pt-2 mt-1 border-t border-gray-100">
              <Link href="/login" onClick={closeMobileMenu} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow transition-all duration-200">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </nav>
  );
}