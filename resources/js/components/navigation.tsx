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

  // Close dropdown when clicking outside
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

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileAboutOpen(false);
    setMobilePesananOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/asset/logo.png"
              alt="SKYNUSA TECH Logo"
              className="h-8 w-auto sm:h-10 max-w-[180px] sm:max-w-[220px]"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div
            ref={menuRef}
            className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-4 lg:gap-8"
          >
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                currentPath === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>

            <Link
              href="/layanan"
              className={`text-sm font-medium transition-colors ${
                currentPath === '/layanan' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Layanan
            </Link>

            <Link
              href="/portfolio"
              className={`text-sm font-medium transition-colors ${
                currentPath === '/portfolio' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Portfolio
            </Link>

            {/* About Dropdown - Desktop */}
            <div className="relative">
              <button
                onClick={() => {
                  setOpenAbout(!openAbout);
                  setOpenPesanan(false);
                }}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  openAbout ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                About
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  openAbout ? "rotate-180" : ""
                }`} />
              </button>

              {openAbout && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl border bg-white shadow-xl transition-all duration-200 ease-out opacity-0 translate-y-2 scale-95 animate-[fadeIn_.2s_ease-out_forwards]">
                  <div className="p-1">
                    <Link
                      href="/tim"
                      className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Tim Kami
                    </Link>
                    <Link
                      href="/kontak"
                      className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Kontak
                    </Link>
                    <Link
                      href="/tentang-kami"
                      className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Tentang Kami
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Pesanan Dropdown - Desktop */}
            <div className="relative">
              <button
                onClick={() => {
                  setOpenPesanan(!openPesanan);
                  setOpenAbout(false);
                }}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  openPesanan ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Pesanan
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  openPesanan ? "rotate-180" : ""
                }`} />
              </button>

              {openPesanan && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl border bg-white shadow-xl transition-all duration-200 ease-out opacity-0 translate-y-2 scale-95 animate-[fadeIn_.2s_ease-out_forwards]">
                  <div className="p-1">
                    <Link
                      href="/pesanan/order"
                      className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Order Pesanan
                    </Link>
                    <Link
                      href="/pesanan/tracking"
                      className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Tracking Pesanan
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Berita */}
            <Link
              href="/berita"
              className={`text-sm font-medium transition-colors ${
                currentPath === '/berita' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Berita
            </Link>
            
          </div>

          {/* Right Side - Login Button & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Desktop Login Button */}
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                currentPath === '/' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Home
            </Link>

            <Link
              href="/layanan"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                currentPath === '/layanan' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Layanan
            </Link>

            <Link
              href="/portfolio"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                currentPath === '/portfolio' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Portfolio
            </Link>

            {/* About Dropdown - Mobile */}
            <div>
              <button
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <span>About</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                  mobileAboutOpen ? "rotate-180" : ""
                }`} />
              </button>
              {mobileAboutOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    href="/tim"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                      currentPath === '/tim' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    Tim Kami
                  </Link>
                  <Link
                    href="/kontak"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                      currentPath === '/kontak' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    Kontak
                  </Link>
                  <Link
                    href="/tentang-kami"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                      currentPath === '/tentang-kami' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    Tentang Kami
                  </Link>
                </div>
              )}
            </div>

            {/* Pesanan Dropdown - Mobile */}
            <div>
              <button
                onClick={() => setMobilePesananOpen(!mobilePesananOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <span>Pesanan</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                  mobilePesananOpen ? "rotate-180" : ""
                }`} />
              </button>
              {mobilePesananOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    href="/pesanan/order"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                      currentPath === '/pesanan/order' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    Order Pesanan
                  </Link>
                  <Link
                    href="/pesanan/tracking"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                      currentPath === '/pesanan/tracking' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    Tracking Pesanan
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/berita"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                currentPath === '/berita' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Berita
            </Link>

            {/* Mobile Login Button */}
            <div className="pt-3 mt-3 border-t border-gray-100">
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-md transition-all duration-200"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </nav>
  );
}