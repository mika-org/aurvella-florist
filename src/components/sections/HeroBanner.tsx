'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SkeletonImage from '@/components/ui/SkeletonImage';
import { Phone, ArrowRight, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Tag, Eye } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import PromoCountdown from '@/components/ui/PromoCountdown';
import { formatRupiah } from '@/lib/utils';

export interface HeroProductItem {
  id?: string;
  name: string;
  slug?: string;
  sku: string;
  normalPrice: number;
  promoPrice?: number | null;
  isPromo: boolean;
  promoEnd?: Date | string | null;
  imageUrl?: string | null;
  categoryName?: string;
  description?: string | null;
}

interface HeroBannerProps {
  whatsappNumber?: string;
  heroProducts?: HeroProductItem[];
  promoProduct?: {
    name: string;
    normalPrice: number;
    promoPrice: number;
    sku: string;
    promoEnd?: Date | string | null;
    imageUrl?: string | null;
    slug?: string;
  };
}

export default function HeroBanner({
  whatsappNumber = '6285770187018',
  heroProducts = [],
  promoProduct,
}: HeroBannerProps) {
  // Products list strictly from checked items in admin
  const productsList: HeroProductItem[] = React.useMemo(() => {
    if (heroProducts && heroProducts.length > 0) {
      return heroProducts;
    }
    if (promoProduct) {
      return [
        {
          name: promoProduct.name,
          normalPrice: promoProduct.normalPrice,
          promoPrice: promoProduct.promoPrice,
          sku: promoProduct.sku,
          isPromo: true,
          promoEnd: promoProduct.promoEnd,
          imageUrl: promoProduct.imageUrl || '/products/Standing Acrylik Artificial/800k.jpg',
          slug: promoProduct.slug || 'standing-acrylic-floral-symphony-pink-800k',
        },
      ];
    }
    return [];
  }, [heroProducts, promoProduct]);

  const totalSlides = productsList.length;

  // Current Slide Index with safe circular wrap
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeIndex = totalSlides > 0 ? ((currentIndex % totalSlides) + totalSlides) % totalSlides : 0;
  const activeProduct = totalSlides > 0 ? productsList[safeIndex] : null;

  // Auto-play slider every 5 seconds (pauses when user hovers or interacts)
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides, isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev <= 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  // Variants for staggered hero content
  const heroContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.1,
      },
    },
  };

  const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 1. Full Screen Background Image: hero-banner-2.png */}
      <div className="absolute inset-0 w-full h-full z-0">
        <SkeletonImage
          src="/images/hero-banner-2.png"
          alt="Standing Flower Bandung Spesialis - Aurvella Florist"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          sizes="100vw"
        />
        {/* Luxury Vignette & Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 z-10" />
        <div className="absolute inset-0 bg-[#B83253]/15 mix-blend-overlay z-10" />
      </div>

      {/* 2. Moving Flower Ornaments on Every Side with Framer Motion */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-20" aria-hidden="true">
        {/* TOP-LEFT FLOWER ORNAMENT */}
        <motion.div
          animate={{
            y: [-14, 10, -14],
            x: [0, 10, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="ornament-top-left absolute top-4 left-4 sm:top-8 sm:left-8 w-28 h-28 sm:w-40 sm:h-40 opacity-85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        >
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            <path
              d="M10 10 Q60 30 110 90 T140 140"
              stroke="#DFB758"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 2"
            />
            <circle cx="45" cy="45" r="22" fill="#F8B4C4" fillOpacity="0.85" />
            <circle cx="65" cy="40" r="18" fill="#FDE2E8" fillOpacity="0.9" />
            <circle cx="50" cy="65" r="18" fill="#E56A88" fillOpacity="0.75" />
            <circle cx="52" cy="50" r="10" fill="#D4AF37" />
            <path d="M70 25 C85 10 95 25 78 35 Z" fill="#D4AF37" fillOpacity="0.9" />
            <path d="M25 65 C10 80 25 90 35 75 Z" fill="#F8B4C4" fillOpacity="0.8" />
          </svg>
        </motion.div>

        {/* TOP-RIGHT FLOWER ORNAMENT */}
        <motion.div
          animate={{
            y: [14, -10, 14],
            x: [0, -12, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 5.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="ornament-top-right absolute top-4 right-4 sm:top-8 sm:right-8 w-28 h-28 sm:w-40 sm:h-40 opacity-85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        >
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            <path
              d="M150 10 Q100 40 60 100 T20 150"
              stroke="#DFB758"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="115" cy="45" r="20" fill="#FDE2E8" fillOpacity="0.9" />
            <circle cx="95" cy="40" r="17" fill="#F8B4C4" fillOpacity="0.85" />
            <circle cx="110" cy="65" r="17" fill="#E56A88" fillOpacity="0.75" />
            <circle cx="106" cy="48" r="9" fill="#DFB758" />
            <path d="M90 25 C75 10 65 25 82 35 Z" fill="#DFB758" fillOpacity="0.85" />
            <path d="M135 65 C150 80 135 90 125 75 Z" fill="#F8B4C4" fillOpacity="0.8" />
          </svg>
        </motion.div>

        {/* BOTTOM-LEFT FLOWER ORNAMENT */}
        <motion.div
          animate={{
            y: [16, -12, 16],
            x: [0, 12, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 5.1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="ornament-bottom-left absolute bottom-6 left-4 sm:bottom-10 sm:left-8 w-28 h-28 sm:w-44 sm:h-44 opacity-85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        >
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            <path
              d="M10 150 Q50 110 90 70 T150 20"
              stroke="#D4AF37"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="45" cy="115" r="24" fill="#F8B4C4" fillOpacity="0.85" />
            <circle cx="68" cy="120" r="19" fill="#E56A88" fillOpacity="0.8" />
            <circle cx="50" cy="95" r="19" fill="#FDE2E8" fillOpacity="0.9" />
            <circle cx="54" cy="112" r="11" fill="#DFB758" />
            <path d="M25 95 C10 80 20 70 35 85 Z" fill="#D4AF37" fillOpacity="0.9" />
            <path d="M75 140 C90 155 100 140 85 130 Z" fill="#F8B4C4" fillOpacity="0.85" />
          </svg>
        </motion.div>

        {/* BOTTOM-RIGHT FLOWER ORNAMENT */}
        <motion.div
          animate={{
            y: [-16, 12, -16],
            x: [0, -10, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 5.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="ornament-bottom-right absolute bottom-6 right-4 sm:bottom-10 sm:right-8 w-28 h-28 sm:w-44 sm:h-44 opacity-85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        >
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            <path
              d="M150 150 Q110 110 70 70 T20 20"
              stroke="#DFB758"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="115" cy="115" r="24" fill="#FDE2E8" fillOpacity="0.9" />
            <circle cx="92" cy="120" r="19" fill="#F8B4C4" fillOpacity="0.85" />
            <circle cx="110" cy="95" r="19" fill="#E56A88" fillOpacity="0.8" />
            <circle cx="106" cy="112" r="11" fill="#DFB758" />
            <path d="M135 95 C150 80 140 70 125 85 Z" fill="#DFB758" fillOpacity="0.9" />
            <path d="M85 140 C70 155 60 140 75 130 Z" fill="#F8B4C4" fillOpacity="0.85" />
          </svg>
        </motion.div>

        {/* Floating golden and pink dust particles with ambient animation */}
        <motion.div
          animate={{
            y: [-16, 16, -16],
            x: [0, 10, 0],
            opacity: [0.35, 0.7, 0.35],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          className="hero-dust absolute top-1/4 left-1/4 w-3.5 h-3.5 rounded-full bg-[#DFB758]/55 blur-xs"
        />
        <motion.div
          animate={{
            y: [16, -16, 16],
            x: [0, -12, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
          className="hero-dust absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-[#F8B4C4]/60 blur-xs"
        />
        <motion.div
          animate={{
            y: [-12, 14, -12],
            x: [0, 12, 0],
            opacity: [0.3, 0.65, 0.3],
            scale: [0.85, 1.15, 0.85],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="hero-dust absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full bg-[#DFB758]/45 blur-xs"
        />
      </div>

      {/* 3. Hero Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Text Content */}
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className={`space-y-6 ${productsList.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12 text-center max-w-3xl mx-auto'}`}
          >
            {/* Tagline Badge */}
            <motion.div
              variants={heroItemVariants}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#FDE2E8] text-xs uppercase tracking-wider font-semibold shadow-lg ${productsList.length > 0 ? '' : 'mx-auto'}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#DFB758] animate-pulse" />
              <span className="font-bold text-white">Aurvella Florist</span>
              <span className="text-[#DFB758] font-semibold lowercase">by.</span>
              <span className="font-bold text-[#FDE8ED]">Maharani Florist</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFB758]" />
              <span className="text-[#DFB758] font-bold text-[11px]">SPESIALIS NO. 1 DI BANDUNG</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={heroItemVariants}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md tracking-wide"
            >
              Spesialis Standing Flower{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8B4C4] via-[#FDE8ED] to-[#DFB758]">
                Mewah &amp; Elegan
              </span>{' '}
              di Bandung
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={heroItemVariants}
              className="text-sm sm:text-lg text-white/90 leading-relaxed font-light drop-shadow max-w-2xl"
            >
              <strong>Aurvella Florist by. Maharani Florist</strong> menghadirkan koleksi terlengkap standing flower akrilik, standing cermin wedding, papan PVC modern, bunga segar asli, hingga bunga papan duka cita. Tetap mengutamakan komitmen sebagai spesialis standing flower terbaik dengan garansi bunga sampai segar, rapi, dan tepat waktu di seluruh Kota Bandung.
            </motion.p>

            {/* Service Highlights Pills */}
            <motion.div
              variants={heroItemVariants}
              className={`flex flex-wrap gap-2.5 sm:gap-3 text-xs text-white/90 font-medium pt-1 ${productsList.length > 0 ? '' : 'justify-center'}`}
            >
              <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> Free Ongkir Bandung
              </span>
              <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> Same Day Delivery 2-4 Jam
              </span>
              <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> Free Papan &amp; Kartu Ucapan
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={heroItemVariants}
              className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 ${productsList.length > 0 ? '' : 'justify-center'}`}
            >
              <Link
                href="/produk"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-[#B83253] to-[#E56A88] hover:opacity-95 shadow-xl shadow-[#B83253]/35 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span>Lihat Katalog Produk</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Halo%20Aurvella%20Florist,%20saya%20ingin%20memesan%20standing%20flower`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-xl shadow-[#25D366]/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Pesan via WhatsApp</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Floating Promo Glass Card with Framer Motion Slider */}
          {activeProduct && (
            <div
              className="lg:col-span-4 flex justify-center lg:justify-end"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.25, type: 'spring', damping: 22 }}
                className="w-full max-w-sm bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl shadow-2xl border-2 border-white/70 transition-all duration-300 relative"
              >
                {/* Header Slider: Badge & Counter Controls */}
                <div className="flex items-center justify-between gap-2 pb-2">
                  <div className="flex items-center gap-1.5">
                    {activeProduct.isPromo && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#B83253] text-white shadow-xs flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>PROMO EKSKLUSIF</span>
                      </span>
                    )}
                    {activeProduct.categoryName && !activeProduct.isPromo && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF3F5] text-[#B83253] border border-[#F8B4C4]/60">
                        {activeProduct.categoryName}
                      </span>
                    )}
                    {activeProduct.isPromo && activeProduct.promoPrice && activeProduct.normalPrice > activeProduct.promoPrice && (
                      <span className="text-[11px] text-[#8E6D14] font-bold">
                        Hemat {formatRupiah(activeProduct.normalPrice - activeProduct.promoPrice)}
                      </span>
                    )}
                  </div>

                  {/* Slider Prev / Next Controls if multiple products */}
                  {totalSlides > 1 && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-gray-400 mr-1">
                        {safeIndex + 1}/{totalSlides}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePrev}
                        className="w-6 h-6 rounded-full bg-[#FAF3F5] hover:bg-[#B83253] hover:text-white text-[#4A3E42] flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Produk Sebelumnya"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleNext}
                        className="w-6 h-6 rounded-full bg-[#FAF3F5] hover:bg-[#B83253] hover:text-white text-[#4A3E42] flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Produk Selanjutnya"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Animated Slide Content with AnimatePresence */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`hero-slide-${activeProduct.sku || activeProduct.id || safeIndex}`}
                    initial={{ opacity: 0, x: 16, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -16, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="transition-all"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden my-3 border border-[#F5E6EA] bg-[#FAF8F8]">
                      <SkeletonImage
                        src={activeProduct.imageUrl || '/products/Standing Acrylik Artificial/800k.jpg'}
                        alt={activeProduct.name}
                        fill
                        loading="eager"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 350px"
                      />

                      {/* SKU Top Right */}
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/90 text-[#4A3E42] shadow-xs">
                        {activeProduct.sku}
                      </span>

                      {/* Floating Countdown Pill if promoEnd is set */}
                      {activeProduct.isPromo && activeProduct.promoEnd && (
                        <div className="absolute bottom-2 right-2 z-10">
                          <PromoCountdown
                            targetDate={activeProduct.promoEnd}
                            variant="card"
                          />
                        </div>
                      )}
                    </div>

                    {/* Product Title */}
                    <h2 className="text-base font-bold text-[#2D2527] line-clamp-1">
                      {activeProduct.name}
                    </h2>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2.5 mt-1.5">
                      {activeProduct.isPromo && activeProduct.promoPrice ? (
                        <>
                          <span className="text-2xl font-extrabold text-[#B83253]">
                            {formatRupiah(activeProduct.promoPrice)}
                          </span>
                          <span className="text-xs text-[#8A7E82] line-through font-medium">
                            {formatRupiah(activeProduct.normalPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-extrabold text-[#2D2527]">
                          {formatRupiah(activeProduct.normalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Short Description */}
                    <p className="text-[11px] text-[#7A6D72] mt-1 line-clamp-2">
                      {activeProduct.description ||
                        'Standing flower eksklusif dengan garansi bunga segar dan gratis ongkir area Bandung.'}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href={activeProduct.slug ? `/produk/${activeProduct.slug}` : '/produk'}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-[#4A3E42] bg-[#FAF3F5] hover:bg-[#F5E6EB] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#B83253]" />
                        <span>Lihat Detail</span>
                      </Link>

                      <a
                        href={`https://wa.me/${whatsappNumber}?text=Halo%20Aurvella%20Florist,%20saya%20tertarik%20dengan%20produk%20hero%20${encodeURIComponent(
                          activeProduct.name
                        )}%20(SKU:%20${activeProduct.sku})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#B83253] to-[#DF4D73] hover:opacity-95 shadow-md shadow-[#B83253]/25 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5 fill-white" />
                        <span>Pesan Promo</span>
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Slider Pagination Dots if multiple products */}
                {totalSlides > 1 && (
                  <div className="flex items-center justify-center gap-1 pt-3 mt-2 border-t border-[#F5E6EA]">
                    {productsList.map((_, dotIdx) => (
                      <button
                        key={`hero-dot-${dotIdx}`}
                        type="button"
                        onClick={() => setCurrentIndex(dotIdx)}
                        className="p-2 cursor-pointer focus:outline-none"
                        aria-label={`Lihat produk slide ${dotIdx + 1}`}
                      >
                        <span
                          className={`block h-1.5 rounded-full transition-all ${
                            safeIndex === dotIdx
                              ? 'w-6 bg-[#B83253]'
                              : 'w-2 bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
