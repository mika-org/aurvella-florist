'use client';

import React from 'react';
import { Phone, Clock, MapPin, Instagram, ShoppingBag, Send, Sparkles, MessageCircle } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
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
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const leftCardVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 180,
        damping: 22,
      },
    },
  };

  const rightCardVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 180,
        damping: 22,
        delay: 0.1,
      },
    },
  };

  return (
    <section id="kontak" className="py-16 sm:py-24 bg-gradient-to-b from-white via-[#FCF8FA] to-[#FAF6F8] relative overflow-hidden">
      {/* Decorative ambient glowing orbs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.28, 0.15],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-[#F8B4C4]/25 to-[#DFB758]/15 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.25, 0.12],
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-tl from-[#B83253]/15 to-[#DFB758]/20 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0F4] border border-[#F8B4C4] text-[#B83253] text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-3 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B83253]" />
            <span>Hubungi Kami</span>
          </motion.div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-[#2D2527] mt-1 tracking-wide">
            Konsultasi & Pemesanan Standing Flower
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-16 h-1 bg-gradient-to-r from-[#F8B4C4] via-[#DFB758] to-[#B83253] mx-auto rounded-full mt-3 origin-center"
          />
          <p className="text-[#6B5E63] text-sm sm:text-base mt-3 leading-relaxed">
            Butuh rekomendasi model standing flower atau ingin custom tulisan dan warna bunga? Tim spesialis kami siap membantu Anda 24 jam sehari.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start"
        >
          {/* Left Column: Direct Contacts */}
          <motion.div variants={leftCardVariants} className="lg:col-span-5 space-y-6">
            {/* WhatsApp Highlight Box */}
            <motion.div
              whileHover={{
                y: -5,
                boxShadow: '0 25px 35px -10px rgba(37, 211, 102, 0.35)',
                transition: { duration: 0.25 },
              }}
              className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#128C7E] via-[#0E7A6E] to-[#25D366] text-white shadow-xl shadow-[#25D366]/20 relative overflow-hidden group"
            >
              {/* Subtle background wave glow */}
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-xs uppercase tracking-wider inline-flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  Fast Response 24/7
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
                Chat via WhatsApp
              </h3>
              <p className="text-white/85 text-xs sm:text-sm mb-6 leading-relaxed">
                Kirim detail acara, foto referensi, atau diskusikan jadwal pengiriman langsung dengan florist kami.
              </p>

              <div className="flex items-center gap-3.5 mb-6 bg-black/20 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-[11px] text-white/75 block font-medium">Nomor Resmi Bisnis</span>
                  <span className="font-mono text-xl font-bold tracking-wider">
                    0857-7018-7018
                  </span>
                </div>
              </div>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/${whatsappNumber}?text=Halo%20Aurvella%20Florist,%20saya%20ingin%20konsultasi%20pemesanan%20standing%20flower`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-[#1F5133] bg-white hover:bg-[#F3FAF5] shadow-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base group/btn"
              >
                <Phone className="w-4 h-4 fill-[#1F5133] group-hover/btn:rotate-12 transition-transform duration-200" />
                <span>Buka Chat WhatsApp Sekarang</span>
              </motion.a>
            </motion.div>

            {/* Business info cards */}
            <motion.div
              whileHover={{
                y: -3,
                boxShadow: '0 16px 32px -10px rgba(184, 50, 83, 0.08)',
                transition: { duration: 0.25 },
              }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4E2E7] shadow-sm space-y-5"
            >
              <div className="flex items-start gap-4 group/item">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.3 }}
                  className="w-11 h-11 rounded-xl bg-[#FFF0F4] border border-[#F8B4C4]/50 text-[#B83253] flex items-center justify-center shrink-0 group-hover/item:bg-[#B83253] group-hover/item:text-white transition-colors duration-200"
                >
                  <MapPin className="w-5 h-5" />
                </motion.div>
                <div>
                  <h4 className="font-bold text-sm text-[#2D2527]">Alamat Workshop</h4>
                  <p className="text-xs text-[#6B5E63] mt-1 leading-relaxed">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-[#F8E8EC] group/item">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.3 }}
                  className="w-11 h-11 rounded-xl bg-[#FFF9ED] border border-[#DFB758]/40 text-[#8E6D14] flex items-center justify-center shrink-0 group-hover/item:bg-[#DFB758] group-hover/item:text-white transition-colors duration-200"
                >
                  <Clock className="w-5 h-5" />
                </motion.div>
                <div>
                  <h4 className="font-bold text-sm text-[#2D2527]">Jam Operasional</h4>
                  <p className="text-xs text-[#6B5E63] mt-1 leading-relaxed">{serviceHours}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F8E8EC]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#8A7E82] mb-3">
                  Kunjungi Media Sosial & Marketplace
                </h4>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF0F4] border border-[#F8B4C4]/60 text-[#B83253] hover:bg-[#B83253] hover:text-white text-xs font-semibold transition-all shadow-2xs"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF4F0] border border-[#FFD3C4] text-[#EE4D2D] hover:bg-[#EE4D2D] hover:text-white text-xs font-semibold transition-all shadow-2xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shopee</span>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F4F4F6] border border-[#E2E2E6] text-[#2D2527] hover:bg-[#2D2527] hover:text-white text-xs font-semibold transition-all shadow-2xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>TikTok</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Contact Message Form */}
          <motion.div variants={rightCardVariants} className="lg:col-span-7">
            <ContactMessageForm />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

