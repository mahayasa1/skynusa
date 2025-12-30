import { Link } from '@inertiajs/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const [openPesanan, setOpenPesanan] = useState(false);

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  const menuRef = useRef<HTMLDivElement | null>(null);

  // close dropdown when clicking outside
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
          <div
            ref={menuRef}
            className="absolute left-1/2 hidden -translate-x-1/2 gap-6 lg:gap-10 md:flex"
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

            {/* ABOUT DROPDOWN */}
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
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${ openAbout ? "rotate-180" : "" }`} />
              </button>

              {openAbout && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl border bg-white shadow-xl p-1">
                  <Link
                    href="/tim"
                    className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                  >
                    Tim Kami
                  </Link>
                  <Link
                    href="/kontak"
                    className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                  >
                    Kontak
                  </Link>
                  <Link
                    href="/tentang-kami"
                    className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                  >
                    Tentang Kami
                  </Link>
                </div>
              )}
            </div>

            {/* PESANAN DROPDOWN */}
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
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${ openPesanan ? "rotate-180" : "" }`} />
              </button>

              {openPesanan && (
                <div className="absolute left-0 mt-2 w-52 rounded-xl border bg-white shadow-xl p-1">
                  <Link
                    href="/pesanan/order"
                    className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                  >
                    Order Pesanan
                  </Link>
                  <Link
                    href="/pesanan/tracking"
                    className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                  >
                    Tracking Pesanan
                  </Link>
                </div>
              )}
            </div>

            {/* BERITA */}
            <Link
              href="/berita"
              className={`text-sm font-medium transition-colors ${
                currentPath === '/berita' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Berita
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* MOBILE NAV */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-1">

            <Link href="/" className="block px-4 py-2 text-sm text-gray-700">
              Home
            </Link>

            <Link href="/layanan" className="block px-4 py-2 text-sm text-gray-700">
              Layanan
            </Link>

            <Link href="/portfolio" className="block px-4 py-2 text-sm text-gray-700">
              Portfolio
            </Link>

            <details className="px-4">
              <summary className="text-sm font-medium cursor-pointer py-2">
                About
              </summary>
              <div className="pl-4 space-y-1">
                <Link href="/tim" className="block text-sm py-1 text-gray-700">
                  Tim Kami
                </Link>
                <Link href="/kontak" className="block text-sm py-1 text-gray-700">
                  Kontak
                </Link>
                <Link href="/tentang-kami" className="block text-sm py-1 text-gray-700">
                  Tentang Kami
                </Link>
              </div>
            </details>

            <details className="px-4">
              <summary className="text-sm font-medium cursor-pointer py-2">
                Pesanan
              </summary>
              <div className="pl-4 space-y-1">
                <Link href="/pesanan/order" className="block text-sm py-1 text-gray-700">
                  Order Pesanan
                </Link>
                <Link href="/pesanan/tracking" className="block text-sm py-1 text-gray-700">
                  Tracking Pesanan
                </Link>
              </div>
            </details>

            <Link href="/berita" className="block px-4 py-2 text-sm text-gray-700">
              Berita
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
