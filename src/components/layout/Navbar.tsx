'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Phone, Sparkles, Flower2, ExternalLink } from 'lucide-react';

interface NavbarProps {
  businessName?: string;
  whatsappNumber?: string;
}

export default function Navbar({
  businessName = 'Aurvella Florist',
  whatsappNumber = '6285770187018',
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#F5E6EA] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shadow-md border-2 border-[#F8B4C4]/70 group-hover:scale-105 transition-transform shrink-0 p-0.5">
              <Image
                src="/logo.png"
                alt={`${businessName} Logo`}
                fill
                priority
                className="object-contain"
                sizes="48px"
              />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2D2527] group-hover:text-[#B83253] transition-colors block leading-tight">
                {businessName}
              </span>
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#B89223] font-semibold">
                STANDING FLOWER NO. 1 DI BANDUNG
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#4A3E42]">
            <Link
              href="/"
              className="hover:text-[#B83253] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#B83253] hover:after:w-full after:transition-all"
            >
              Beranda
            </Link>
            <Link
              href="/produk"
              className="hover:text-[#B83253] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#B83253] hover:after:w-full after:transition-all"
            >
              Katalog Produk
            </Link>
            <Link
              href="/#kategori"
              className="hover:text-[#B83253] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#B83253] hover:after:w-full after:transition-all"
            >
              Kategori
            </Link>
            <Link
              href="/#testimoni"
              className="hover:text-[#B83253] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#B83253] hover:after:w-full after:transition-all"
            >
              Testimoni
            </Link>
            <Link
              href="/kontak"
              className="hover:text-[#B83253] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#B83253] hover:after:w-full after:transition-all"
            >
              Kontak
            </Link>
            <Link
              href="/link"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF5F7] text-[#B83253] border border-[#F8B4C4] hover:bg-[#FDE2E8] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Link Tree
            </Link>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`https://wa.me/${whatsappNumber}?text=Halo%20Aurvella%20Florist,%20saya%20ingin%20konsultasi%20pemesanan%20standing%20flower`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:opacity-95 shadow-md shadow-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="w-4 h-4 fill-white" />
              Chat WhatsApp
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#25D366] text-white"
              aria-label="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#2D2527] hover:bg-[#FDE2E8] focus:outline-none"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-[#F5E6EA] bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-[#2D2527] hover:bg-[#FFF5F7] hover:text-[#B83253]"
          >
            Beranda
          </Link>
          <Link
            href="/produk"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-[#2D2527] hover:bg-[#FFF5F7] hover:text-[#B83253]"
          >
            Katalog Produk
          </Link>
          <Link
            href="/#kategori"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-[#2D2527] hover:bg-[#FFF5F7] hover:text-[#B83253]"
          >
            Kategori
          </Link>
          <Link
            href="/#testimoni"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-[#2D2527] hover:bg-[#FFF5F7] hover:text-[#B83253]"
          >
            Testimoni
          </Link>
          <Link
            href="/kontak"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-[#2D2527] hover:bg-[#FFF5F7] hover:text-[#B83253]"
          >
            Kontak
          </Link>
          <Link
            href="/link"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-md font-medium text-[#B83253] bg-[#FFF5F7]"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Link Tree Bisnis
            </span>
            <ExternalLink className="w-4 h-4" />
          </Link>
          <div className="pt-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=Halo%20Aurvella%20Florist,%20saya%20ingin%20konsultasi%20pemesanan`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold text-white bg-[#25D366] shadow"
            >
              <Phone className="w-4 h-4" />
              Chat WhatsApp (0857-7018-7018)
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
