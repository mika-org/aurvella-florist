import React from 'react';
import { Phone, Clock, MapPin, Instagram, ShoppingBag, Send } from 'lucide-react';
import ContactMessageForm from './ContactMessageForm';

interface ContactSectionProps {
  whatsappNumber?: string;
  address?: string;
  serviceHours?: string;
  instagramUrl?: string;
  shopeeUrl?: string;
  tiktokUrl?: string;
}

export default function ContactSection({
  whatsappNumber = '6285770187018',
  address = 'Jl. Jamrud No.16, Cisaranten Kulon, Kec. Arcamanik, Kota Bandung, Jawa Barat 40293',
  serviceHours = 'Layanan Pemesanan 24/7 (Pengiriman Operasional 08:00 - 20:00 WIB)',
  instagramUrl = 'https://instagram.com/aurvellaflorist',
  shopeeUrl = 'https://shopee.co.id/aurvellaflorist',
  tiktokUrl = 'https://tiktok.com/@aurvellaflorist',
}: ContactSectionProps) {
  return (
    <section id="kontak" className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#FAF6F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B83253] font-bold">
            Hubungi Kami
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2527] mt-2">
            Konsultasi & Pemesanan Standing Flower
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#F8B4C4] to-[#DFB758] mx-auto rounded-full mt-3" />
          <p className="text-[#6B5E63] text-sm sm:text-base mt-3 leading-relaxed">
            Butuh rekomendasi model standing flower atau ingin custom tulisan dan warna bunga? Tim spesialis kami siap membantu Anda 24 jam sehari.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contacts */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Highlight Box */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#128C7E] to-[#25D366] text-white shadow-xl shadow-[#25D366]/20">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 uppercase tracking-wider inline-block mb-4">
                Fast Response 24/7
              </span>
              <h3 className="font-serif text-2xl font-bold mb-2">
                Chat via WhatsApp
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mb-6 leading-relaxed">
                Kirim detail acara, foto referensi, atau diskusikan jadwal pengiriman langsung dengan florist kami.
              </p>
              <div className="flex items-center gap-3 mb-6 bg-black/15 p-4 rounded-2xl">
                <Phone className="w-6 h-6 text-white shrink-0" />
                <div>
                  <span className="text-xs text-white/70 block">Nomor Resmi Bisnis</span>
                  <span className="font-mono text-xl font-bold tracking-wider">
                    0857-7018-7018
                  </span>
                </div>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Halo%20Aurvella%20Florist,%20saya%20ingin%20konsultasi%20pemesanan%20standing%20flower`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-[#1F5133] bg-white hover:bg-[#F3FAF5] shadow transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 fill-[#1F5133]" />
                <span>Buka Chat WhatsApp Sekarang</span>
              </a>
            </div>

            {/* Business info cards */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4E2E7] shadow-sm space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] text-[#B83253] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#2D2527]">Alamat Workshop</h4>
                  <p className="text-xs text-[#6B5E63] mt-1 leading-relaxed">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-[#F8E8EC]">
                <div className="w-10 h-10 rounded-xl bg-[#FFF9ED] text-[#8E6D14] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#2D2527]">Jam Operasional</h4>
                  <p className="text-xs text-[#6B5E63] mt-1 leading-relaxed">{serviceHours}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F8E8EC]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#8A7E82] mb-3">
                  Kunjungi Media Sosial & Marketplace
                </h4>
                <div className="flex items-center gap-3">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFF0F4] text-[#B83253] hover:bg-[#FCE1E8] text-xs font-semibold transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFF4F0] text-[#EE4D2D] hover:bg-[#FFE5DC] text-xs font-semibold transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shopee</span>
                  </a>
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F4F4F6] text-[#2D2527] hover:bg-[#EAEAEF] text-xs font-semibold transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>TikTok</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <ContactMessageForm />
          </div>
        </div>
      </div>
    </section>
  );
}
