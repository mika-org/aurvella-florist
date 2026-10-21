'use client';

import Link from 'next/link';
import SkeletonImage from '@/components/ui/SkeletonImage';
import {
  Phone,
  FileText,
  Instagram,
  ShoppingBag,
  Send,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Heart,
} from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

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
          icon: <ExternalLink className="w-5 h-5 text-[#DF4D73]" />,
          iconBg: 'bg-[#FFF0F4] border-[#FBD0DA]',
          cardBorder: 'border-2 border-[#FBD0DA] hover:border-[#DF4D73]',
          cardBg: 'bg-white',
          badgeText: 'Tautan Resmi',
          badgeBg: 'bg-[#FFF0F4] text-[#C93059]',
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

  // Framer Motion animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FAF6F8] to-[#FCF4F6] py-10 px-4 sm:px-6">
      {/* SVG Definitions for Gradients */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="butterflyPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EE7796" />
            <stop offset="50%" stopColor="#F7A8BB" />
            <stop offset="100%" stopColor="#DF4D73" />
          </linearGradient>
          <linearGradient id="butterflyGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F1D78B" />
            <stop offset="60%" stopColor="#DFB758" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <linearGradient id="flowerPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5F7" />
            <stop offset="60%" stopColor="#FBD0DA" />
            <stop offset="100%" stopColor="#F7A8BB" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ambient background soft glow orbs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#F7A8BB]/35 via-[#FBD0DA]/30 to-transparent blur-3xl -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-gradient-to-tl from-[#F1D78B]/35 via-[#F7A8BB]/25 to-transparent blur-3xl -z-10"
      />
      <motion.div
        animate={{
          scale: [0.95, 1.15, 0.95],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-[#FBD0DA]/40 to-[#FAF6F0]/40 blur-3xl -z-10"
      />

      {/* Decorative Ornaments Container: Realistic Fluttering Butterflies, Flowers, & Petals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10" aria-hidden="true">
        {/* BUTTERFLY 1: Top-Left (Rose-Gold & Blush with multi-layer wings & 3D flapping) */}
        <motion.div
          animate={{
            x: [0, 24, -10, 0],
            y: [0, -22, -6, 0],
            rotate: [0, 12, -8, 0],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-14 left-[5%] sm:left-[16%] w-14 h-14 sm:w-16 sm:h-16 opacity-85 drop-shadow-[0_4px_12px_rgba(238,119,150,0.35)]"
        >
          <motion.div
            animate={{
              scaleX: [1, 0.28, 1, 0.35, 1],
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              {/* Antennas */}
              <path d="M47 26 C43 14 32 10 28 12" stroke="#8E6D14" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="27" cy="12" r="1.5" fill="#D4AF37" />
              <path d="M53 26 C57 14 68 10 72 12" stroke="#8E6D14" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="73" cy="12" r="1.5" fill="#D4AF37" />
              {/* Left Forewing */}
              <path d="M50 42 C38 16 10 16 8 38 C6 54 30 60 50 48 Z" fill="url(#butterflyPinkGrad)" />
              <path d="M46 40 C36 22 18 22 16 38 C14 48 30 54 46 46 Z" fill="#FFF5F7" fillOpacity="0.45" />
              <circle cx="22" cy="34" r="2.5" fill="#F1D78B" />
              <circle cx="16" cy="42" r="1.8" fill="#F1D78B" />
              {/* Right Forewing */}
              <path d="M50 42 C62 16 90 16 92 38 C94 54 70 60 50 48 Z" fill="url(#butterflyPinkGrad)" />
              <path d="M54 40 C64 22 82 22 84 38 C86 48 70 54 54 46 Z" fill="#FFF5F7" fillOpacity="0.45" />
              <circle cx="78" cy="34" r="2.5" fill="#F1D78B" />
              <circle cx="84" cy="42" r="1.8" fill="#F1D78B" />
              {/* Left Hindwing */}
              <path d="M50 48 C38 56 22 60 26 76 C32 88 46 76 50 58 Z" fill="url(#butterflyGoldGrad)" />
              <circle cx="34" cy="68" r="2" fill="#FFF5F7" />
              {/* Right Hindwing */}
              <path d="M50 48 C62 56 78 60 74 76 C68 88 54 76 50 58 Z" fill="url(#butterflyGoldGrad)" />
              <circle cx="66" cy="68" r="2" fill="#FFF5F7" />
              {/* Butterfly Body */}
              <ellipse cx="50" cy="46" rx="2.8" ry="15" fill="#2D2527" />
              <circle cx="50" cy="28" r="3.2" fill="#D4AF37" />
            </svg>
          </motion.div>
        </motion.div>

        {/* FLOWER ORNAMENT 1: Top-Right Blooming Peony Flower */}
        <motion.div
          animate={{
            rotate: [0, 8, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-[4%] sm:right-[15%] w-16 h-16 sm:w-20 sm:h-20 opacity-80 drop-shadow-md"
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {/* Leaves */}
            <path d="M75 75 C95 85 95 65 85 55 C75 65 75 75 75 75 Z" fill="#DFB758" fillOpacity="0.65" />
            <path d="M25 75 C5 85 5 65 15 55 C25 65 25 75 25 75 Z" fill="#DFB758" fillOpacity="0.65" />
            {/* Petals */}
            <circle cx="50" cy="30" r="18" fill="url(#flowerPetalGrad)" />
            <circle cx="70" cy="45" r="18" fill="#F7A8BB" fillOpacity="0.9" />
            <circle cx="62" cy="70" r="18" fill="#EE7796" fillOpacity="0.85" />
            <circle cx="38" cy="70" r="18" fill="#FBD0DA" fillOpacity="0.95" />
            <circle cx="30" cy="45" r="18" fill="url(#flowerPetalGrad)" />
            {/* Center petals */}
            <circle cx="50" cy="38" r="10" fill="#FFF5F7" fillOpacity="0.75" />
            <circle cx="58" cy="48" r="10" fill="#FFF5F7" fillOpacity="0.7" />
            <circle cx="42" cy="48" r="10" fill="#FFF5F7" fillOpacity="0.7" />
            {/* Golden Core Stamen */}
            <circle cx="50" cy="50" r="9" fill="#DFB758" />
            <circle cx="50" cy="50" r="6" fill="#F1D78B" />
            <circle cx="50" cy="50" r="2.5" fill="#FFF5F7" />
          </svg>
        </motion.div>

        {/* BUTTERFLY 2: Mid/Bottom-Right (Golden Luxury with delicate flutter) */}
        <motion.div
          animate={{
            x: [0, -22, 12, 0],
            y: [0, -25, -8, 0],
            rotate: [0, -12, 8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 right-[5%] sm:right-[14%] w-13 h-13 sm:w-15 sm:h-15 opacity-80 drop-shadow-md"
        >
          <motion.div
            animate={{
              scaleX: [1, 0.3, 1, 0.4, 1],
            }}
            transition={{
              duration: 0.65,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              {/* Antennas */}
              <path d="M47 26 C43 14 32 10 28 12" stroke="#8E6D14" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="27" cy="12" r="1.5" fill="#DF4D73" />
              <path d="M53 26 C57 14 68 10 72 12" stroke="#8E6D14" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="73" cy="12" r="1.5" fill="#DF4D73" />
              {/* Forewings */}
              <path d="M50 42 C38 16 10 16 8 38 C6 54 30 60 50 48 Z" fill="url(#butterflyGoldGrad)" />
              <path d="M46 40 C36 22 18 22 16 38 C14 48 30 54 46 46 Z" fill="#FFFDF5" fillOpacity="0.5" />
              <path d="M50 42 C62 16 90 16 92 38 C94 54 70 60 50 48 Z" fill="url(#butterflyGoldGrad)" />
              <path d="M54 40 C64 22 82 22 84 38 C86 48 70 54 54 46 Z" fill="#FFFDF5" fillOpacity="0.5" />
              {/* Hindwings */}
              <path d="M50 48 C38 56 22 60 26 76 C32 88 46 76 50 58 Z" fill="url(#butterflyPinkGrad)" />
              <path d="M50 48 C62 56 78 60 74 76 C68 88 54 76 50 58 Z" fill="url(#butterflyPinkGrad)" />
              {/* Body */}
              <ellipse cx="50" cy="46" rx="2.8" ry="15" fill="#2D2527" />
              <circle cx="50" cy="28" r="3.2" fill="#DF4D73" />
            </svg>
          </motion.div>
        </motion.div>

        {/* FLOWER ORNAMENT 2: Mid-Left Delicate Cherry Blossom & Branch */}
        <motion.div
          animate={{
            y: [-12, 14, -12],
            rotate: [-6, 6, -6],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[38%] left-[4%] sm:left-[14%] w-14 h-14 sm:w-16 sm:h-16 opacity-75 drop-shadow-sm"
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {/* Branch */}
            <path d="M15 85 Q 50 50 85 15" stroke="#8E6D14" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="50" r="14" fill="#F7A8BB" fillOpacity="0.85" />
            <circle cx="62" cy="42" r="12" fill="#FDE8ED" fillOpacity="0.9" />
            <circle cx="42" cy="38" r="12" fill="#EE7796" fillOpacity="0.8" />
            <circle cx="38" cy="58" r="12" fill="#FBD0DA" fillOpacity="0.85" />
            <circle cx="58" cy="62" r="12" fill="#F7A8BB" fillOpacity="0.85" />
            <circle cx="50" cy="50" r="5" fill="#DFB758" />
          </svg>
        </motion.div>

        {/* FLOWER ORNAMENT 3: Bottom-Left Peony & Golden Petals */}
        <motion.div
          animate={{
            rotate: [0, -10, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-28 left-[6%] sm:left-[17%] w-14 h-14 sm:w-18 sm:h-18 opacity-75 drop-shadow-md"
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="50" cy="32" r="16" fill="#FBD0DA" fillOpacity="0.85" />
            <circle cx="68" cy="45" r="16" fill="#EE7796" fillOpacity="0.8" />
            <circle cx="60" cy="66" r="16" fill="#F7A8BB" fillOpacity="0.85" />
            <circle cx="40" cy="66" r="16" fill="url(#flowerPetalGrad)" />
            <circle cx="32" cy="45" r="16" fill="#F8B4C4" fillOpacity="0.85" />
            <circle cx="50" cy="50" r="8" fill="#D4AF37" />
            <circle cx="50" cy="50" r="4" fill="#FFF5F7" />
          </svg>
        </motion.div>

        {/* DRIFTING CUTE PETALS */}
        {/* Petal 1 */}
        <motion.div
          animate={{
            y: [-20, 25, -20],
            x: [0, 15, 0],
            rotate: [0, 45, 90, 0],
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 left-[28%] w-6 h-6 opacity-60"
        >
          <svg viewBox="0 0 50 50" fill="none" className="w-full h-full text-[#EE7796]">
            <path d="M25 0 C42 15 42 35 25 50 C8 35 8 15 25 0 Z" fill="currentColor" fillOpacity="0.75" />
          </svg>
        </motion.div>

        {/* Petal 2 */}
        <motion.div
          animate={{
            y: [20, -25, 20],
            x: [0, -18, 0],
            rotate: [45, 120, 45],
          }}
          transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-40 right-[25%] w-7 h-7 opacity-60"
        >
          <svg viewBox="0 0 50 50" fill="none" className="w-full h-full text-[#F1D78B]">
            <path d="M25 0 C42 15 42 35 25 50 C8 35 8 15 25 0 Z" fill="currentColor" fillOpacity="0.8" />
          </svg>
        </motion.div>

        {/* Floating Sparkles 1 */}
        <motion.div
          animate={{
            scale: [0.8, 1.3, 0.8],
            opacity: [0.4, 0.9, 0.4],
            rotate: [0, 90, 180],
          }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-48 right-[30%] w-5 h-5 text-[#DFB758]"
        >
          <Sparkles className="w-full h-full fill-[#DFB758]" />
        </motion.div>

        {/* Floating Sparkles 2 */}
        <motion.div
          animate={{
            scale: [0.75, 1.25, 0.75],
            opacity: [0.35, 0.85, 0.35],
            rotate: [180, 90, 0],
          }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-60 left-[26%] w-4 h-4 text-[#EE7796]"
        >
          <Sparkles className="w-full h-full fill-[#EE7796]" />
        </motion.div>
      </div>

      {/* Main Content Box */}
      <div className="max-w-lg mx-auto relative z-20">
        {/* Top Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex justify-between items-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#4A3E42] bg-white/90 hover:bg-white hover:text-[#C93059] shadow-xs border border-[#FBD0DA] transition-all hover:scale-103"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#DF4D73]" />
            <span>Kembali ke Website</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8E6D14] bg-white/90 px-3 py-1.5 rounded-full border border-[#F1D78B] shadow-xs">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Official Portal</span>
          </span>
        </motion.div>

        {/* Profile Card Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8 bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-[#FBD0DA]/80 shadow-[0_15px_40px_-15px_rgba(238,119,150,0.2)]"
        >
          {/* Logo with Blooming Halo Ring */}
          <div className="relative inline-block">
            <motion.div
              animate={{
                boxShadow: [
                  '0 10px 30px -5px rgba(247, 168, 187, 0.5)',
                  '0 14px 35px -5px rgba(223, 183, 88, 0.55)',
                  '0 10px 30px -5px rgba(247, 168, 187, 0.5)',
                ],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-26 h-26 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#F7A8BB] via-[#F1D78B] to-[#EE7796] p-1 shadow-xl mx-auto"
            >
              <div className="relative w-full h-full rounded-full bg-white overflow-hidden shadow-inner flex items-center justify-center">
                <SkeletonImage
                  src="/logo.png"
                  alt={`${businessName} Logo`}
                  fill
                  priority
                  className="object-contain p-2"
                  sizes="112px"
                />
              </div>
            </motion.div>

            {/* Cute mini heart badge */}
            <div className="absolute -bottom-1 -right-1 bg-[#EE7796] text-white p-1.5 rounded-full shadow-md border-2 border-white">
              <Heart className="w-3.5 h-3.5 fill-white" />
            </div>
          </div>

          {/* Brand Header Typography (Playfair Display & Plus Jakarta Sans) */}
          <div className="flex items-baseline justify-center gap-1.5 flex-wrap mt-4">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D2527] tracking-tight">
              Aurvella Florist
            </h1>
            <span className="font-serif text-xs sm:text-sm font-semibold text-[#C93059] italic">
              by. Maharani Florist
            </span>
          </div>

          <p className="text-[11px] sm:text-xs font-bold text-[#8E6D14] uppercase tracking-widest mt-1">
            SPESIALIS STANDING FLOWER NO. 1 DI BANDUNG
          </p>

          <p className="text-xs text-[#6B5E63] font-medium mt-2 max-w-sm mx-auto leading-relaxed">
            {tagline}
          </p>
        </motion.div>

        {/* Categorized Links List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              {/* Category Header with Playfair Display & delicate floral divider */}
              <div className="px-1 flex items-center justify-between gap-3">
                <h2 className="font-heading text-sm sm:text-base font-bold text-[#2D2527] tracking-wide">
                  {section.title}
                </h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#FBD0DA] via-[#F1D78B]/70 to-transparent" />
              </div>

              {/* Items in Category */}
              <div className="space-y-2.5">
                {section.items.map((link) => {
                  const theme = getThemeForType(link.type);

                  return (
                    <motion.a
                      key={link.id}
                      variants={itemVariants}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-200 shadow-xs hover:shadow-xl ${theme.cardBorder} ${theme.cardBg}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Icon Container */}
                        <div
                          className={`w-12 h-12 rounded-2xl ${theme.iconBg} border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform`}
                        >
                          {theme.icon}
                        </div>

                        {/* Title & Description */}
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-sans font-bold text-sm sm:text-base text-[#2D2527] group-hover:text-[#C93059] transition-colors truncate">
                              {link.title}
                            </span>
                          </div>
                          {link.description && (
                            <p className="font-sans text-xs text-[#6B5E63] font-medium truncate mt-0.5">
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
                        <div className="w-8 h-8 rounded-full bg-[#FFF5F7] group-hover:bg-[#C93059] group-hover:text-white flex items-center justify-center text-[#DF4D73] transition-all shadow-xs">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Footer info in link tree */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 text-xs text-[#6B5E63] pb-6"
        >
          <p className="font-heading font-bold text-sm text-[#2D2527]">
            © {new Date().getFullYear()} {businessName} Bandung
          </p>
          <p className="text-[11px] text-[#8E6D14] mt-1 font-bold">
            Gratis Ongkir Bandung • Same Day Delivery 2-4 Jam
          </p>
          <div className="mt-3">
            <Link
              href="/"
              className="text-[11px] text-[#C93059] font-bold underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Kunjungi Website Utama &amp; Lihat Katalog Lengkap
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
