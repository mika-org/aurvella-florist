'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import PromoCountdown from '@/components/ui/PromoCountdown';

interface HeroBannerProps {
  whatsappNumber?: string;
  promoProduct?: {
    name: string;
    normalPrice: number;
    promoPrice: number;
    sku: string;
    promoEnd?: Date | string | null;
  };
}

export default function HeroBanner({
  whatsappNumber = '6285770187018',
  promoProduct,
}: HeroBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ornamentRef = useRef<HTMLDivElement>(null);
  const cardPromoRef = useRef<HTMLDivElement>(null);

  // Auto-hide when promo expires
  const [isPromoExpired, setIsPromoExpired] = useState(() => {
    if (!promoProduct?.promoEnd) return false;
    return new Date(promoProduct.promoEnd).getTime() <= Date.now();
  });

  const showPromo = promoProduct && !isPromoExpired;

  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(textRef.current?.querySelectorAll('.gsap-fade-in') || [], {
        y: 32,
        opacity: 0,
        stagger: 0.14,
        duration: 0.9,
      });

      if (cardPromoRef.current) {
        tl.from(
          cardPromoRef.current,
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.5)',
          },
          '-=0.4'
        );
      }

      // GSAP Moving Flower Ornaments across all sides
      if (ornamentRef.current) {
        const tlCorner = ornamentRef.current.querySelector('.ornament-top-left');
        if (tlCorner) {
          gsap.to(tlCorner, {
            y: -14,
            x: 10,
            rotation: 6,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        const trCorner = ornamentRef.current.querySelector('.ornament-top-right');
        if (trCorner) {
          gsap.to(trCorner, {
            y: 12,
            x: -12,
            rotation: -8,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        const blCorner = ornamentRef.current.querySelector('.ornament-bottom-left');
        if (blCorner) {
          gsap.to(blCorner, {
            y: -15,
            x: 8,
            rotation: 7,
            duration: 5.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        const brCorner = ornamentRef.current.querySelector('.ornament-bottom-right');
        if (brCorner) {
          gsap.to(brCorner, {
            y: 16,
            x: -10,
            rotation: -6,
            duration: 6.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        const mlPetal = ornamentRef.current.querySelector('.ornament-mid-left');
        if (mlPetal) {
          gsap.to(mlPetal, {
            y: -20,
            x: 15,
            rotation: 12,
            duration: 4.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        const mrPetal = ornamentRef.current.querySelector('.ornament-mid-right');
        if (mrPetal) {
          gsap.to(mrPetal, {
            y: 18,
            x: -14,
            rotation: -14,
            duration: 5.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        const miniPetals = ornamentRef.current.querySelectorAll('.ornament-mini-petal');
        miniPetals.forEach((p, idx) => {
          gsap.to(p, {
            y: idx % 2 === 0 ? -18 : 16,
            x: idx % 2 === 0 ? 12 : -10,
            rotation: idx % 2 === 0 ? 20 : -20,
            duration: 4 + idx * 1.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* 1. Full Screen Background Image: hero-banner-2.png */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/hero-banner-2.png"
          alt="Standing Flower Bandung Spesialis - Aurvella Florist"
          fill
          priority
          className="object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          sizes="100vw"
        />
        {/* Luxury Vignette & Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 z-10" />
        <div className="absolute inset-0 bg-[#B83253]/15 mix-blend-overlay z-10" />
      </div>

      {/* 2. Moving Flower Ornaments on Every Side */}
      <div
        ref={ornamentRef}
        className="pointer-events-none absolute inset-0 overflow-hidden z-20"
        aria-hidden="true"
      >
        {/* TOP-LEFT FLOWER ORNAMENT */}
        <div className="ornament-top-left absolute top-4 left-4 sm:top-8 sm:left-8 w-28 h-28 sm:w-40 sm:h-40 opacity-85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
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
        </div>

        {/* TOP-RIGHT FLOWER ORNAMENT */}
        <div className="ornament-top-right absolute top-4 right-4 sm:top-8 sm:right-8 w-28 h-28 sm:w-40 sm:h-40 opacity-85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
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
        </div>

        {/* BOTTOM-LEFT FLOWER ORNAMENT */}
        <div className="ornament-bottom-left absolute bottom-6 left-4 sm:bottom-10 sm:left-8 w-28 h-28 sm:w-44 sm:h-44 opacity-85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
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
        </div>

        {/* BOTTOM-RIGHT FLOWER ORNAMENT */}
        <div className="ornament-bottom-right absolute bottom-6 right-4 sm:bottom-10 sm:right-8 w-28 h-28 sm:w-44 sm:h-44 opacity-85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
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
            <path d="M85 140 C70 155 60 140 75 130 Z" fill="#F8B4C4" fillOpacity="0.8" />
          </svg>
        </div>

        {/* MIDDLE-LEFT FLOATING ORNAMENT */}
        <div className="ornament-mid-left hidden sm:block absolute top-1/2 left-2 -translate-y-1/2 w-16 h-16 opacity-75">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <path
              d="M40 10 C60 25 60 55 40 70 C20 55 20 25 40 10 Z"
              fill="#F8B4C4"
              fillOpacity="0.7"
            />
            <circle cx="40" cy="40" r="8" fill="#DFB758" />
          </svg>
        </div>

        {/* MIDDLE-RIGHT FLOATING ORNAMENT */}
        <div className="ornament-mid-right hidden sm:block absolute top-1/2 right-2 -translate-y-1/2 w-16 h-16 opacity-75">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <path
              d="M40 10 C60 25 60 55 40 70 C20 55 20 25 40 10 Z"
              fill="#DFB758"
              fillOpacity="0.75"
            />
            <circle cx="40" cy="40" r="8" fill="#FDE2E8" />
          </svg>
        </div>

        {/* FLOATING DRIFTING PETALS */}
        <div className="ornament-mini-petal absolute top-1/4 left-[20%] w-7 h-7 opacity-70">
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full text-[#F8B4C4]">
            <path d="M20 0 C32 12 32 28 20 40 C8 28 8 12 20 0 Z" fill="currentColor" fillOpacity="0.6" />
          </svg>
        </div>
        <div className="ornament-mini-petal absolute top-1/3 right-[18%] w-8 h-8 opacity-65">
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full text-[#DFB758]">
            <path d="M20 0 C32 12 32 28 20 40 C8 28 8 12 20 0 Z" fill="currentColor" fillOpacity="0.7" />
          </svg>
        </div>
        <div className="ornament-mini-petal absolute bottom-1/4 left-[25%] w-6 h-6 opacity-60">
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full text-[#E56A88]">
            <path d="M20 0 C32 12 32 28 20 40 C8 28 8 12 20 0 Z" fill="currentColor" fillOpacity="0.55" />
          </svg>
        </div>
        <div className="ornament-mini-petal absolute bottom-1/3 right-[22%] w-7 h-7 opacity-70">
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full text-[#FDE2E8]">
            <path d="M20 0 C32 12 32 28 20 40 C8 28 8 12 20 0 Z" fill="currentColor" fillOpacity="0.75" />
          </svg>
        </div>
      </div>

      {/* 3. Hero Content on Top of Full Screen Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-30 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div
            ref={textRef}
            className={`space-y-6 text-white ${
              showPromo ? 'lg:col-span-8' : 'lg:col-span-10 lg:mx-auto text-center'
            }`}
          >
            <div className="gsap-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#FDE2E8] text-xs font-semibold tracking-wide shadow-lg">
              <Sparkles className="w-4 h-4 text-[#DFB758]" />
              <span>Florist Pilihan Terpercaya di Bandung & Cimahi</span>
            </div>

            <h1 className="gsap-fade-in font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-md">
              Spesialist Standing Flower{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8B4C4] via-[#FDE2E8] to-[#DFB758]">
                BANDUNG
              </span>
            </h1>

            <p className="gsap-fade-in text-xl sm:text-2xl font-semibold text-[#DFB758] tracking-wide drop-shadow">
              Fresh & Artificial | Free Ongkir
            </p>

            <p className={`gsap-fade-in text-sm sm:text-base text-white/90 leading-relaxed drop-shadow ${showPromo ? 'max-w-2xl' : 'max-w-3xl mx-auto'}`}>
              Rangkaian standing flower berkelas untuk perayaan akbar, grand opening toko, resepsi pernikahan, anniversary, ucapan selamat & sukses, hingga ungkapan belasungkawa khidmat. Dibuat rapi oleh florist berpengalaman dengan garansi bunga sampai segar dan tepat waktu.
            </p>

            {/* Countdown Banner in Hero (Auto-hidden if no promo or expired) */}
            {showPromo && promoProduct.promoEnd && (
              <div className="gsap-fade-in pt-1 pb-1">
                <PromoCountdown
                  targetDate={promoProduct.promoEnd}
                  variant="banner"
                  onExpire={() => setIsPromoExpired(true)}
                />
              </div>
            )}

            {/* Benefit badges */}
            <div className={`gsap-fade-in flex flex-wrap gap-y-2.5 gap-x-5 text-xs sm:text-sm font-semibold text-white/95 pt-1 ${showPromo ? '' : 'justify-center'}`}>
              <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> Free Ongkir Area Bandung
              </span>
              <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> Same Day Delivery
              </span>
              <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> Free Papan & Kartu Ucapan
              </span>
            </div>

            {/* CTAs */}
            <div className={`gsap-fade-in flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 ${showPromo ? '' : 'justify-center'}`}>
              <Link
                href="/produk"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-[#B83253] to-[#E56A88] hover:opacity-95 shadow-xl shadow-[#B83253]/35 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Lihat Katalog</span>
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
            </div>
          </div>

          {/* Right Floating Promo Glass Card (Auto-hidden if no promo or expired) */}
          {showPromo && (
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div
                ref={cardPromoRef}
                className="w-full max-w-sm bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border-2 border-white/60 hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center justify-between gap-2 pb-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#B83253] text-white shadow-sm">
                    PROMO EKSKLUSIF
                  </span>
                  <span className="text-xs text-[#8E6D14] font-bold">Hemat Rp 100.000</span>
                </div>

                <div className="relative aspect-video w-full rounded-2xl overflow-hidden my-3 border border-[#F5E6EA] bg-[#FAF8F8]">
                  <Image
                    src="/images/categories/standing-acrylic.png"
                    alt={promoProduct.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/90 text-[#4A3E42]">
                    {promoProduct.sku}
                  </span>
                </div>

                <h2 className="font-serif text-base font-bold text-[#2D2527] line-clamp-1">
                  {promoProduct.name}
                </h2>

                <div className="flex items-baseline gap-2.5 mt-2">
                  <span className="text-2xl font-extrabold text-[#B83253]">
                    Rp {promoProduct.promoPrice.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-[#8A7E82] line-through font-medium">
                    Rp {promoProduct.normalPrice.toLocaleString('id-ID')}
                  </span>
                </div>

                <p className="text-[11px] text-[#7A6D72] mt-1.5 line-clamp-2">
                  Papan akrilik 3mm bening elegan dengan rangkaian bunga fresh & artificial pastel premium.
                </p>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=Halo%20Aurvella%20Florist,%20saya%20ingin%20klaim%20harga%20promo%20untuk%20${encodeURIComponent(
                    promoProduct.name
                  )}%20(SKU:%20${promoProduct.sku})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#B83253] to-[#DF4D73] hover:opacity-95 shadow-md shadow-[#B83253]/25 transition-all"
                >
                  <span>Klaim Promo Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
