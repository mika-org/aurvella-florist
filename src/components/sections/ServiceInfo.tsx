'use client';

import React from 'react';
import { Truck, Clock, Headphones, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

interface ServiceInfoProps {
  freeOngkirInfo?: string;
  samedayInfo?: string;
  serviceHours?: string;
}

export default function ServiceInfo({
  freeOngkirInfo = 'Gratis ongkir untuk area Bandung Kota & sekitarnya sesuai area layanan aktif.',
  samedayInfo = 'Pesan hari ini, kirim hari ini (order sebelum 14:00 WIB & konfirmasi admin).',
  serviceHours = 'Admin WhatsApp siap melayani 24/7. Waktu produksi & kirim: 08:00 - 20:00 WIB.',
}: ServiceInfoProps) {
  const services = [
    {
      icon: Truck,
      title: 'Free Ongkir Bandung',
      description: freeOngkirInfo,
      highlight: 'S&K Berlaku',
    },
    {
      icon: Clock,
      title: 'Same Day Delivery',
      description: samedayInfo,
      highlight: 'Cepat & Aman',
    },
    {
      icon: Headphones,
      title: 'Pelayanan 24/7',
      description: serviceHours,
      highlight: 'Fast Response',
    },
    {
      icon: Sparkles,
      title: 'Fresh & Artificial Flower',
      description: 'Pilihan bunga segar wangi alami dan premium artificial impor tahan lama.',
      highlight: 'Pilihan Lengkap',
    },
    {
      icon: ShieldCheck,
      title: 'Produk Berkualitas',
      description: 'Papan akrilik 3mm, standing kayu halus 150cm, dan finishing floral premium.',
      highlight: 'Jaminan Rapi',
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 240,
        damping: 20,
      },
    },
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-[#FCF9FA] to-white border-y border-[#F3E5E8] relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#F8B4C4]/15 via-[#DFB758]/10 to-[#F8B4C4]/15 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0F4] border border-[#F8B4C4] text-[#B83253] text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B83253]" />
            <span>Keunggulan Layanan Kami</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-[#2D2527] mt-1 tracking-wide">
            Mengapa Memilih Aurvella Florist?
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#B83253] via-[#DFB758] to-[#B83253] mx-auto rounded-full my-3" />
          <p className="text-[#6B5E63] text-xs sm:text-sm md:text-base leading-relaxed">
            Standar pelayanan florist profesional dengan dedikasi penuh terhadap kualitas bunga, keindahan desain, dan kepuasan Anda di seluruh Kota Bandung.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6"
        >
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: '0 16px 32px -8px rgba(184, 50, 83, 0.14)',
                  transition: { duration: 0.25 },
                }}
                className="bg-white rounded-2xl p-6 border border-[#F5E2E7] hover:border-[#DFB758]/80 transition-colors shadow-xs flex flex-col justify-between group cursor-default"
              >
                <div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -6, 6, 0] }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 rounded-xl bg-[#FFF5F7] border border-[#F5D5DE] flex items-center justify-center text-[#B83253] group-hover:bg-[#B83253] group-hover:text-white transition-colors shadow-xs mb-4"
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <h3 className="font-bold text-base text-[#2D2527] group-hover:text-[#B83253] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B5E63] leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F8E8EC] flex items-center justify-between">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0F4] text-[#B83253] border border-[#F8B4C4]/60">
                    {item.highlight}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#8E6D14]">
                    #{String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
