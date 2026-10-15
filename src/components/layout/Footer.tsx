import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flower2, Phone, MapPin, Instagram, ShoppingBag, Send, Sparkles, Lock } from 'lucide-react';

interface FooterProps {
  businessName?: string;
  address?: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  shopeeUrl?: string;
  tiktokUrl?: string;
  mapsUrl?: string;
}

export default function Footer({
  businessName = 'Aurvella Florist',
  address = 'Jl. Jamrud No.16, Cisaranten Kulon, Kec. Arcamanik, Kota Bandung, Jawa Barat 40293',
  whatsappNumber = '6285770187018',
  instagramUrl = 'https://instagram.com/aurvellaflorist',
  shopeeUrl = 'https://shopee.co.id/aurvellaflorist',
  tiktokUrl = 'https://tiktok.com/@aurvellaflorist',
  mapsUrl = 'https://maps.google.com/?q=Jl.+Jamrud+No.16,+Cisaranten+Kulon,+Kec.+Arcamanik,+Kota+Bandung,+Jawa+Barat+40293',
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#261E21] text-white/90 pt-16 pb-12 border-t-2 border-[#D4AF37]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white shadow-md border-2 border-[#F8B4C4]/60 shrink-0 p-0.5">
                <Image
                  src="/logo.png"
                  alt={`${businessName} Logo`}
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FDE8ED]">
                {businessName}
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Spesialis Standing Flower Bandung berkelas premium. Menghadirkan rangkaian bunga akrilik, standing cermin, papan PVC, dan bunga segar pilihan dengan gratis ongkir untuk area Bandung.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E56A88] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#EE4D2D] flex items-center justify-center text-white transition-colors"
                aria-label="Shopee"
              >
                <ShoppingBag className="w-4 h-4" />
              </a>
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-black flex items-center justify-center text-white transition-colors"
                aria-label="TikTok"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="/link"
                className="px-3 py-1.5 rounded-full bg-[#DFB758]/20 border border-[#D4AF37]/50 hover:bg-[#DFB758] hover:text-[#2D2527] text-xs font-medium text-[#F1D78B] transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#DFB758]" />
                Link Tree
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#DFB758] tracking-wide">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <Link href="/" className="hover:text-[#F8B4C4] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/produk" className="hover:text-[#F8B4C4] transition-colors">
                  Katalog Seluruh Produk
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-[#F8B4C4] transition-colors">
                  Hubungi Kami & Form Pesan
                </Link>
              </li>
              <li>
                <Link href="/link" className="hover:text-[#F8B4C4] transition-colors">
                  Link Tree Aurvella
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#B83253] text-white/70 hover:text-white transition-all text-xs border border-white/10"
                >
                  <Lock className="w-3.5 h-3.5 text-[#DFB758]" />
                  <span>Portal Admin</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kategori Populer */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#DFB758] tracking-wide">
              Koleksi Standing Flower
            </h3>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <Link href="/kategori/standing-acrylic" className="hover:text-[#F8B4C4] transition-colors">
                  Standing Acrylic Mewah
                </Link>
              </li>
              <li>
                <Link href="/kategori/standing-cermin" className="hover:text-[#F8B4C4] transition-colors">
                  Standing Cermin Wedding
                </Link>
              </li>
              <li>
                <Link href="/kategori/standing-pvc" className="hover:text-[#F8B4C4] transition-colors">
                  Standing PVC Grand Opening
                </Link>
              </li>
              <li>
                <Link href="/kategori/standing-fresh" className="hover:text-[#F8B4C4] transition-colors">
                  Standing Bunga Segar Asli
                </Link>
              </li>
              <li>
                <Link href="/kategori/standing-duka-cita" className="hover:text-[#F8B4C4] transition-colors">
                  Standing Bunga Duka Cita
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Alamat */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#DFB758] tracking-wide">
              Workshop Bandung
            </h3>
            <div className="space-y-3 text-sm text-white/75">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#DFB758] shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] font-medium transition-colors"
                >
                  0857-7018-7018 (WhatsApp 24 Jam)
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#DFB758] hover:underline"
                >
                  Petunjuk Arah Google Maps &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Portal CTA */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {currentYear} {businessName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="hidden sm:inline-block">
              Dibuat dengan dedikasi untuk keindahan momen spesial di Kota Bandung.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 hover:bg-[#B83253] text-white/60 hover:text-white transition-all text-[11px] border border-white/10"
            >
              <Lock className="w-3 h-3 text-[#DFB758]" />
              <span>Login Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
