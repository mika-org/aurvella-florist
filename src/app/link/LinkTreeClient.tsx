'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Flower2,
  Phone,
  FileText,
  Instagram,
  ShoppingBag,
  Send,
  Globe,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Download,
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface SocialLinkItem {
  id: string;
  title: string;
  url: string;
  type: string;
  description: string | null;
  icon: string | null;
  order: number;
}

interface LinkTreeClientProps {
  links: SocialLinkItem[];
  businessName: string;
  tagline: string;
}

export default function LinkTreeClient({
  links,
  businessName,
  tagline,
}: LinkTreeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ornamentRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // GSAP animate links entrance safely with clearProps to avoid stuck opacity
      if (linksRef.current) {
        const items = linksRef.current.querySelectorAll('.link-card-item');
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { y: 15, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.04,
              duration: 0.45,
              ease: 'power2.out',
              clearProps: 'all',
            }
          );
        }
      }

      // GSAP animate floating butterflies & leaves
      if (ornamentRef.current) {
        const b1 = ornamentRef.current.querySelector('.gsap-butterfly-1');
        if (b1) {
          gsap.to(b1, {
            x: 25,
            y: -18,
            rotation: 12,
            duration: 4.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        const b2 = ornamentRef.current.querySelector('.gsap-butterfly-2');
        if (b2) {
          gsap.to(b2, {
            x: -20,
            y: -22,
            rotation: -10,
            duration: 5.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        const leaves = ornamentRef.current.querySelectorAll('.gsap-leaf');
        leaves.forEach((leaf, i) => {
          gsap.to(leaf, {
            y: i % 2 === 0 ? -15 : 12,
            rotation: i % 2 === 0 ? 15 : -12,
            duration: 4 + i * 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      }
    },
    { scope: containerRef }
  );

  const getThemeForType = (type: string) => {
    switch (type) {
      case 'WHATSAPP':
        return {
          icon: <Phone className="w-5 h-5 text-[#16A34A] fill-[#16A34A]" />,
          iconBg: 'bg-[#DCFCE7] border-[#86EFAC]',
          cardBorder: 'border-2 border-[#25D366]/60 hover:border-[#25D366]',
          cardBg: 'bg-gradient-to-r from-white via-white to-[#F0FDF4]',
          badgeText: 'WhatsApp 24/7',
          badgeBg: 'bg-[#DCFCE7] text-[#15803D]',
        };
      case 'GOOGLE_DRIVE':
        return {
          icon: <FileText className="w-5 h-5 text-[#B45309]" />,
          iconBg: 'bg-[#FEF3C7] border-[#FDE68A]',
          cardBorder: 'border-2 border-[#DFB758]/70 hover:border-[#B89223]',
          cardBg: 'bg-gradient-to-r from-white via-white to-[#FFFDF5]',
          badgeText: 'Pricelist PDF',
          badgeBg: 'bg-[#FEF3C7] text-[#92400E]',
        };
      case 'INSTAGRAM':
        return {
          icon: <Instagram className="w-5 h-5 text-[#DB2777]" />,
          iconBg: 'bg-[#FCE7F3] border-[#FBCFE8]',
          cardBorder: 'border-2 border-[#FBCFE8] hover:border-[#DB2777]',
          cardBg: 'bg-white',
          badgeText: 'Instagram',
          badgeBg: 'bg-[#FCE7F3] text-[#BE185D]',
        };
      case 'SHOPEE':
        return {
          icon: <ShoppingBag className="w-5 h-5 text-[#EA580C]" />,
          iconBg: 'bg-[#FFEDD5] border-[#FED7AA]',
          cardBorder: 'border-2 border-[#FED7AA] hover:border-[#EA580C]',
          cardBg: 'bg-white',
          badgeText: 'Shopee Official',
          badgeBg: 'bg-[#FFEDD5] text-[#C2410C]',
        };
      case 'TIKTOK':
        return {
          icon: <Send className="w-5 h-5 text-[#1E1719]" />,
          iconBg: 'bg-[#F3F4F6] border-[#E5E7EB]',
          cardBorder: 'border-2 border-[#E5E7EB] hover:border-[#1E1719]',
          cardBg: 'bg-white',
          badgeText: 'TikTok Official',
          badgeBg: 'bg-[#F3F4F6] text-[#374151]',
        };
      case 'MAPS':
        return {
          icon: <MapPin className="w-5 h-5 text-[#DC2626]" />,
          iconBg: 'bg-[#FEE2E2] border-[#FECACA]',
          cardBorder: 'border-2 border-[#FECACA] hover:border-[#DC2626]',
          cardBg: 'bg-white',
          badgeText: 'Google Maps',
          badgeBg: 'bg-[#FEE2E2] text-[#B91C1C]',
        };
      default:
        return {
          icon: <ExternalLink className="w-5 h-5 text-[#B83253]" />,
          iconBg: 'bg-[#FFF0F4] border-[#F8B4C4]',
          cardBorder: 'border-2 border-[#F8B4C4] hover:border-[#B83253]',
          cardBg: 'bg-white',
          badgeText: 'Tautan Resmi',
          badgeBg: 'bg-[#FFF0F4] text-[#B83253]',
        };
    }
  };

  // Group links by categories for neat visual hierarchy
  const orderLinks = links.filter((l) => l.type === 'WHATSAPP');
  const catalogLinks = links.filter((l) => l.type === 'GOOGLE_DRIVE');
  const socialLinks = links.filter((l) =>
    ['INSTAGRAM', 'SHOPEE', 'TIKTOK'].includes(l.type)
  );
  const locationLinks = links.filter((l) => l.type === 'MAPS');
  const otherLinks = links.filter(
    (l) =>
      !['WHATSAPP', 'GOOGLE_DRIVE', 'INSTAGRAM', 'SHOPEE', 'TIKTOK', 'MAPS'].includes(
        l.type
      )
  );

  const sections = [
    {
      title: 'Pemesanan & Konsultasi Langsung',
      items: orderLinks,
    },
    {
      title: 'Download Pricelist & Katalog Standing Flower',
      items: catalogLinks,
    },
    {
      title: 'Kanal Media Sosial & Marketplace',
      items: socialLinks,
    },
    {
      title: 'Lokasi Workshop & Navigasi',
      items: [...locationLinks, ...otherLinks],
    },
  ].filter((s) => s.items.length > 0);

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#FFF0F4] via-[#FAF6F8] to-[#FCEEF2] py-10 px-4 sm:px-6"
    >
      {/* GSAP Animated Butterflies, Flowers, Leaves Ornament Container */}
      <div
        ref={ornamentRef}
        className="pointer-events-none absolute inset-0 overflow-hidden z-10"
        aria-hidden="true"
      >
        <div className="gsap-butterfly-1 absolute top-16 left-[10%] sm:left-[22%] w-10 h-10 opacity-70">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#E56A88]">
            <path
              d="M50 50 C40 20 10 30 20 60 C30 80 50 55 50 50 Z"
              fill="currentColor"
              fillOpacity="0.75"
            />
            <path
              d="M50 50 C60 20 90 30 80 60 C70 80 50 55 50 50 Z"
              fill="#D4AF37"
              fillOpacity="0.85"
            />
            <ellipse cx="50" cy="52" rx="2" ry="12" fill="#2D2527" />
          </svg>
        </div>

        <div className="gsap-butterfly-2 absolute bottom-28 right-[10%] sm:right-[20%] w-12 h-12 opacity-65">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#DFB758]">
            <path
              d="M50 50 C40 20 10 30 20 60 C30 80 50 55 50 50 Z"
              fill="currentColor"
              fillOpacity="0.8"
            />
            <path
              d="M50 50 C60 20 90 30 80 60 C70 80 50 55 50 50 Z"
              fill="#F8B4C4"
              fillOpacity="0.8"
            />
            <ellipse cx="50" cy="52" rx="2" ry="12" fill="#2D2527" />
          </svg>
        </div>

        <div className="gsap-leaf absolute top-36 right-[8%] sm:right-[25%] w-8 h-8 opacity-60">
          <svg viewBox="0 0 50 50" fill="none" className="w-full h-full text-[#F8B4C4]">
            <path d="M25 0 C40 15 40 35 25 50 C10 35 10 15 25 0 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="gsap-leaf absolute bottom-48 left-[8%] sm:left-[18%] w-9 h-9 opacity-50">
          <svg viewBox="0 0 50 50" fill="none" className="w-full h-full text-[#D4AF37]">
            <path d="M25 0 C40 15 40 35 25 50 C10 35 10 15 25 0 Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="max-w-lg mx-auto relative z-20">
        {/* Top Back Link */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#4A3E42] bg-white hover:bg-[#FAF3F5] shadow-sm border border-[#F5D5DE] transition-all hover:scale-105"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B83253]" />
            <span>Kembali ke Website</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8E6D14] bg-white px-3 py-1.5 rounded-full border border-[#DFB758]/50 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#DFB758]" />
            Official Portal
          </span>
        </div>

        {/* Profile Header */}
        <div className="text-center mb-8 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-[#F5E2E7] shadow-sm">
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#F8B4C4] via-[#DFB758] to-[#E56A88] p-1 shadow-xl mx-auto">
              <div className="relative w-full h-full rounded-full bg-white overflow-hidden shadow-inner flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt={`${businessName} Logo`}
                  fill
                  priority
                  className="object-cover"
                  sizes="112px"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#25D366] text-white p-1.5 rounded-full shadow-md border-2 border-white">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
            </div>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1E1719] mt-4 tracking-tight">
            {businessName}
          </h1>
          <p className="text-xs font-bold text-[#B89223] uppercase tracking-widest mt-1">
            Standing Flower Specialist Bandung
          </p>
          <p className="text-xs text-[#524448] font-medium mt-2 max-w-sm mx-auto leading-relaxed">
            {tagline}
          </p>
        </div>

        {/* Categorized Links List */}
        <div ref={linksRef} className="space-y-6">
          {sections.map((section, sIdx) => (
            <div key={section.title} className="space-y-2.5">
              {/* Category Header */}
              <div className="px-1 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8A757B]">
                  {section.title}
                </span>
                <span className="h-[1px] flex-1 ml-3 bg-[#E8D5DA]" />
              </div>

              {/* Items in Category */}
              <div className="space-y-2.5">
                {section.items.map((link) => {
                  const theme = getThemeForType(link.type);

                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`link-card-item group flex items-center justify-between p-4 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${theme.cardBorder} ${theme.cardBg}`}
                      style={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Icon Container */}
                        <div
                          className={`w-12 h-12 rounded-2xl ${theme.iconBg} border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}
                        >
                          {theme.icon}
                        </div>

                        {/* Title & Description */}
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <h2 className="font-bold text-sm sm:text-base text-[#1E1719] group-hover:text-[#B83253] transition-colors truncate">
                              {link.title}
                            </h2>
                          </div>
                          {link.description && (
                            <p className="text-xs text-[#5C4D52] font-medium truncate mt-0.5">
                              {link.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Tag & Chevron */}
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span
                          className={`hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${theme.badgeBg}`}
                        >
                          {theme.badgeText}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#FAF3F5] group-hover:bg-[#B83253] group-hover:text-white flex items-center justify-center text-[#B83253] transition-all shadow-xs">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info in link tree */}
        <div className="text-center mt-12 text-xs text-[#7A6D72] pb-6">
          <p className="font-semibold text-[#2D2527]">
            © {new Date().getFullYear()} {businessName} Bandung
          </p>
          <p className="text-[11px] text-[#B89223] mt-1 font-bold">
            Gratis Ongkir Bandung • Same Day Delivery
          </p>
          <div className="mt-3">
            <Link
              href="/"
              className="text-[11px] text-[#B83253] font-semibold underline underline-offset-4 hover:opacity-80"
            >
              Kunjungi Website Utama &amp; Lihat Katalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
