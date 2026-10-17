'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count?: { products: number };
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cmv2r6cqp0001u260o2yb7qwx',
    name: 'Standing Acrylic',
    slug: 'standing-acrylic',
    description: 'Rangkaian bunga standing papan akrilik mewah bernuansa soft pink & gold',
    image: '/images/categories/standing-acrylic.png',
  },
  {
    id: 'cmv2r6crb0002u260r904l3ey',
    name: 'Standing Cermin',
    slug: 'standing-cermin',
    description: 'Standing mirror florist elegan untuk momen pernikahan, engagement, dan grand opening',
    image: '/images/categories/standing-cermin.png',
  },
  {
    id: 'cmv2r6crl0003u2603o6xydk3',
    name: 'Standing PVC',
    slug: 'standing-pvc',
    description: 'Papan bunga standing foam PVC modern bernuansa premium untuk ucapan selamat & sukses',
    image: '/images/categories/standing-pvc.png',
  },
  {
    id: 'cmv2r6crx0004u260zd24azgp',
    name: 'Standing Fresh',
    slug: 'standing-fresh',
    description: 'Rangkaian bunga segar alami pilihan dengan keharuman bunga asli dan tampilan megah',
    image: '/images/categories/standing-fresh.png',
  },
  {
    id: 'cmv2r6cs90005u260p7ceirdq',
    name: 'Standing Duka Cita',
    slug: 'standing-duka-cita',
    description: 'Standing flower belasungkawa anggun bernuansa putih dan krem untuk penghormatan terbaik',
    image: '/products/Standing Dukacita Fresh Flower/1000k.jpg',
  },
  {
    id: 'cmv2r6cs90006u260p7ceirdz',
    name: 'Bunga Papan Dukacita',
    slug: 'bunga-papan-dukacita',
    description: 'Papan bunga duka cita khidmat dan megah dengan aneka ukuran untuk penghormatan serta simpati mendalam',
    image: '/products/Bunga Papan Dukacita/Dukacita 2x1,5 meter 1000k.jpg',
  },
];

interface CategorySectionProps {
  categories?: CategoryItem[];
  activeCategorySlug?: string;
  onSelectCategory?: (slug: string) => void;
}

export default function CategorySection({
  categories = [],
  activeCategorySlug,
  onSelectCategory,
}: CategorySectionProps) {
  const categoriesList = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    activeCategorySlug || null
  );
  const [prevActiveSlug, setPrevActiveSlug] = useState(activeCategorySlug);

  // Sync state if external prop changes during render
  if (activeCategorySlug !== prevActiveSlug) {
    setPrevActiveSlug(activeCategorySlug);
    setSelectedSlug(activeCategorySlug || null);
  }

  const handleCategoryClick = (slug: string) => {
    const isCurrentlyActive = selectedSlug === slug;
    const newSlug = isCurrentlyActive ? null : slug;
    setSelectedSlug(newSlug);

    if (onSelectCategory) {
      onSelectCategory(newSlug || '');
    }
  };

  const handlePillClick = (slug: string | null) => {
    setSelectedSlug(slug);

    if (onSelectCategory) {
      onSelectCategory(slug || '');
    }
  };

  const activeCategoryObj = categoriesList.find((c) => c.slug === selectedSlug);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <section
      id="kategori"
      className="py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-[#FCFAFA] to-white overflow-hidden relative"
    >
      {/* Decorative ambient background accents with motion pulse */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#F8B4C4]/20 via-[#DFB758]/15 to-[#F8B4C4]/20 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F8B4C4]/70 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B83253]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#B83253] font-bold">
              Aurvella Florist by. Maharani Florist
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-[#2D2527] tracking-wide">
            Katalog Lengkap Karangan Bunga &amp; Standing Flower
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-[#B83253] via-[#DFB758] to-[#B83253] mx-auto rounded-full my-3.5" />

          <p className="text-[#6B5E63] text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Kini hadir semakin kumplit sebagai bagian dari <strong className="text-[#2D2527]">Maharani Florist Bandung</strong>. Menghadirkan koleksi terlengkap mulai dari <strong className="text-[#B83253]">Spesialis Standing Flower No. 1 di Bandung</strong> (Acrylic, Cermin, PVC, &amp; Bunga Segar) hingga <strong className="text-[#2D2527]">Bunga Papan Dukacita</strong> resmi dengan pengerjaan rapi dan layanan 24 jam.
          </p>
        </motion.div>

        {/* Maharani Florist Synergy Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#FFF5F7] via-[#FFFDF8] to-[#FFF5F7] border border-[#F8B4C4]/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B83253] to-[#8E1F3B] text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md">
              AF
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <span className="font-bold text-sm sm:text-base text-[#2D2527]">
                  Aurvella Florist by. Maharani Florist
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DFB758]/20 text-[#8E6D14] border border-[#DFB758]/40">
                  Cabang Resmi Maharani Florist
                </span>
              </div>
              <p className="text-xs text-[#6B5E63] mt-1 leading-relaxed">
                Kini katalog kami semakin lengkap untuk melayani seluruh pesanan karangan bunga &amp; standing flower di Kota Bandung, dengan tetap mengutamakan kualitas nomor 1.
              </p>
            </div>
          </div>
          <Link
            href="/produk"
            className="shrink-0 px-4 py-2.5 rounded-full bg-[#B83253] hover:bg-[#962340] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-102"
          >
            <span>Lihat Semua Katalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Quick Filter Pills with Framer Motion interactive feedback */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 sm:mb-10 no-scrollbar justify-start sm:justify-center px-1"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => handlePillClick(null)}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs ${
              selectedSlug === null
                ? 'bg-[#B83253] text-white shadow-md shadow-[#B83253]/25 ring-2 ring-[#B83253]/30'
                : 'bg-white text-[#4A3E42] border border-[#E8D9DC] hover:border-[#B83253] hover:text-[#B83253]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua Kategori</span>
          </motion.button>

          {categoriesList.map((cat) => {
            const isPillActive = selectedSlug === cat.slug;
            return (
              <motion.button
                key={`pill-${cat.id}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handlePillClick(cat.slug)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isPillActive
                    ? 'bg-[#B83253] text-white shadow-md shadow-[#B83253]/25 ring-2 ring-[#B83253]/30'
                    : 'bg-white text-[#4A3E42] border border-[#E8D9DC] hover:border-[#B83253] hover:text-[#B83253]'
                }`}
              >
                <span>{cat.name}</span>
                {cat._count?.products !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isPillActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F5E6EA] text-[#B83253]'
                    }`}
                  >
                    {cat._count.products}
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Category Cards Grid with Framer Motion Layout & Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 items-stretch"
        >
          {categoriesList.map((cat, index) => {
            const isSelected = selectedSlug === cat.slug;
            const hasAnySelected = selectedSlug !== null;
            const isLastOnMobile = index === categoriesList.length - 1 && categoriesList.length % 2 !== 0;

            return (
              <motion.div
                key={cat.id}
                variants={cardVariants}
                animate={
                  isSelected
                    ? { y: -8, scale: 1.03, zIndex: 20 }
                    : hasAnySelected
                    ? { y: 0, scale: 0.97, opacity: 0.85, zIndex: 1 }
                    : { y: 0, scale: 1, opacity: 1, zIndex: 1 }
                }
                whileHover={
                  !isSelected
                    ? { y: -6, scale: 1.02, transition: { duration: 0.25 } }
                    : {}
                }
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 transition-colors duration-300 relative flex flex-col justify-between border select-none ${
                  isLastOnMobile ? 'col-span-2 sm:col-span-1' : 'col-span-1'
                } ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#FFF5F7] via-white to-[#FFF0F4] border-[#B83253] shadow-xl shadow-[#B83253]/20 ring-2 ring-[#B83253]'
                    : hasAnySelected
                    ? 'bg-white border-[#F0E4E7] shadow-xs hover:border-[#B83253]/50'
                    : 'bg-white hover:bg-gradient-to-b hover:from-white hover:to-[#FFF9FB] border-[#F0E4E7] hover:border-[#DFB758] hover:shadow-xl hover:shadow-[#DFB758]/15'
                }`}
              >
                <div>
                  {/* Category Image with glow & active badge */}
                  <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-[#FCFAFA] to-[#F5EFF2] mb-3 sm:mb-4 border border-[#F5E6EA] shadow-inner group-hover:shadow-md transition-shadow">
                    <Image
                      src={cat.image || '/images/categories/standing-acrylic.png'}
                      alt={cat.name}
                      fill
                      className={`object-cover object-center transition-transform duration-500 ease-out ${
                        isSelected ? 'scale-110' : 'group-hover:scale-106'
                      }`}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />

                    {/* Gradient Overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Active badge with AnimatePresence */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.6, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.6, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-[#B83253] text-white shadow-md flex items-center gap-1 z-10"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>Dipilih</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Category Info */}
                  <h3
                    className={`font-bold transition-colors leading-tight text-sm sm:text-base lg:text-lg ${
                      isSelected
                        ? 'text-[#B83253]'
                        : 'text-[#2D2527] group-hover:text-[#B83253]'
                    }`}
                  >
                    {cat.name}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-[#7A6D72] mt-1 sm:mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description ||
                      'Koleksi standing flower pilihan berkelas untuk berbagai momen berharga.'}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-3 sm:pt-4 mt-2 sm:mt-3 border-t border-[#F5E6EA] flex items-center justify-between">
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold ${
                      isSelected ? 'text-[#B83253]' : 'text-[#8E6D14]'
                    }`}
                  >
                    {cat._count?.products !== undefined
                      ? `${cat._count.products} Model`
                      : 'Lihat Produk'}
                  </span>

                  <Link
                    href={`/kategori/${cat.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#B83253] text-white border-[#B83253] shadow-md scale-105'
                        : 'bg-white group-hover:bg-[#B83253] group-hover:text-white border-[#E8D9DC] text-[#2D2527]'
                    }`}
                    aria-label={`Buka halaman kategori ${cat.name}`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Selected Category Highlight Banner with AnimatePresence */}
        <AnimatePresence>
          {activeCategoryObj && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 sm:mt-10 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#FFF5F7] via-white to-[#FFF5F7] border border-[#F8B4C4] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#B83253]/10 text-[#B83253] flex items-center justify-center shrink-0 border border-[#B83253]/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#B83253] font-bold">
                    Kategori Terpilih
                  </div>
                  <h4 className="font-heading text-xl sm:text-2xl font-semibold text-[#2D2527]">
                    {activeCategoryObj.name} Bandung
                  </h4>
                  <p className="text-xs text-[#6B5E63] mt-0.5 max-w-xl">
                    {activeCategoryObj.description ||
                      'Rangkaian eksklusif dengan garansi bunga segar dan gratis ongkir area Kota Bandung.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <Link
                  href={`/kategori/${activeCategoryObj.slug}`}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#B83253] hover:bg-[#962340] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-[#B83253]/20 hover:scale-102 transition-all cursor-pointer"
                >
                  <span>Buka Koleksi {activeCategoryObj.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
