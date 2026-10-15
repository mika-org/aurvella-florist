'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

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
    image: '/images/categories/standing-duka-cita.png',
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

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Sync state if external prop changes
  useEffect(() => {
    if (activeCategorySlug !== undefined) {
      setSelectedSlug(activeCategorySlug || null);
    }
  }, [activeCategorySlug]);

  const animateCardSelection = (newSlug: string | null, targetIndex?: number) => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const isMobile = window.innerWidth < 768;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      if (!newSlug) {
        // Reset all cards when deselected
        gsap.to(card, {
          y: 0,
          scale: 1,
          opacity: 1,
          zIndex: 1,
          duration: 0.35,
          ease: 'power2.out',
          clearProps: 'zIndex',
        });
      } else if (i === targetIndex) {
        // Active card: lift up and scale up with spring physics
        gsap.timeline()
          .to(card, {
            scale: 0.98,
            duration: 0.1,
            ease: 'power1.in',
          })
          .to(card, {
            y: isMobile ? -4 : -8,
            scale: isMobile ? 1.02 : 1.04,
            opacity: 1,
            zIndex: 20,
            duration: 0.35,
            ease: 'back.out(2)',
          });
      } else {
        // Inactive cards: subtle scale down and soft opacity
        gsap.to(card, {
          y: 0,
          scale: isMobile ? 0.98 : 0.96,
          opacity: 0.82,
          zIndex: 2,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    // Animate banner if newly selected
    if (newSlug && bannerRef.current) {
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'opacity,transform' }
      );
    }
  };

  const handleCategoryClick = (slug: string, index: number) => {
    const isCurrentlyActive = selectedSlug === slug;
    const newSlug = isCurrentlyActive ? null : slug;
    setSelectedSlug(newSlug);

    if (onSelectCategory) {
      onSelectCategory(newSlug || '');
    }

    animateCardSelection(newSlug, isCurrentlyActive ? undefined : index);
  };

  const handlePillClick = (slug: string | null) => {
    setSelectedSlug(slug);

    if (onSelectCategory) {
      onSelectCategory(slug || '');
    }

    if (!slug) {
      animateCardSelection(null);
    } else {
      const idx = categoriesList.findIndex((c) => c.slug === slug);
      if (idx !== -1) {
        animateCardSelection(slug, idx);
      }
    }
  };

  // GSAP Initial Entrance Animation with safe fromTo & clearProps
  useGSAP(
    () => {
      if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          // Double ensure all elements have inline styles cleared so nothing stays hidden
          if (headerRef.current) {
            gsap.set(headerRef.current.children, { clearProps: 'opacity,transform' });
          }
          if (pillsRef.current) {
            gsap.set(pillsRef.current.children, { clearProps: 'opacity,transform' });
          }
          const valid = cardsRef.current.filter(Boolean);
          if (valid.length > 0) {
            gsap.set(valid, { clearProps: 'opacity,transform' });
          }
        },
      });

      // Animate Section Header
      if (headerRef.current && headerRef.current.children.length > 0) {
        tl.fromTo(
          headerRef.current.children,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            clearProps: 'opacity,transform',
          }
        );
      }

      // Animate Pills
      if (pillsRef.current && pillsRef.current.children.length > 0) {
        tl.fromTo(
          pillsRef.current.children,
          { scale: 0.95, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            stagger: 0.03,
            duration: 0.45,
            clearProps: 'opacity,transform',
          },
          '-=0.3'
        );
      }

      // Animate Cards with luxury 3D feel
      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        tl.fromTo(
          validCards,
          { y: 30, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.06,
            duration: 0.6,
            ease: 'back.out(1.4)',
            clearProps: 'opacity,transform',
          },
          '-=0.3'
        );
      }

      return () => {
        // Immediate cleanup in React Strict Mode so elements are never frozen at opacity: 0
        if (headerRef.current) {
          gsap.set(headerRef.current.children, { clearProps: 'opacity,transform' });
        }
        if (pillsRef.current) {
          gsap.set(pillsRef.current.children, { clearProps: 'opacity,transform' });
        }
        const valid = cardsRef.current.filter(Boolean);
        if (valid.length > 0) {
          gsap.set(valid, { clearProps: 'opacity,transform' });
        }
      };
    },
    { scope: containerRef, dependencies: [categoriesList] }
  );

  const activeCategoryObj = categoriesList.find((c) => c.slug === selectedSlug);

  return (
    <section
      id="kategori"
      ref={containerRef}
      className="py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-[#FCFAFA] to-white overflow-hidden relative"
    >
      {/* Decorative ambient background accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#F8B4C4]/15 via-[#DFB758]/10 to-[#F8B4C4]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F8B4C4]/60 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B83253]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#B83253] font-bold">
              Koleksi Eksklusif Aurvella
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D2527] tracking-tight">
            Pilihan Kategori Standing Flower
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-[#B83253] via-[#DFB758] to-[#B83253] mx-auto rounded-full my-3.5" />

          <p className="text-[#6B5E63] text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Hadir dalam 5 pilihan material premium untuk grand opening, pernikahan, anniversary, ucapan selamat & sukses, hingga duka cita khidmat.
          </p>
        </div>

        {/* Quick Filter Pills (Smooth scroll on mobile, centered on desktop) */}
        <div
          ref={pillsRef}
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 sm:mb-10 no-scrollbar justify-start sm:justify-center px-1"
        >
          <button
            type="button"
            onClick={() => handlePillClick(null)}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs ${
              selectedSlug === null
                ? 'bg-[#B83253] text-white shadow-md shadow-[#B83253]/25 ring-2 ring-[#B83253]/30 scale-105'
                : 'bg-white text-[#4A3E42] border border-[#E8D9DC] hover:border-[#B83253] hover:text-[#B83253]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua Kategori</span>
          </button>

          {categoriesList.map((cat) => {
            const isPillActive = selectedSlug === cat.slug;
            return (
              <button
                key={`pill-${cat.id}`}
                type="button"
                onClick={() => handlePillClick(cat.slug)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isPillActive
                    ? 'bg-[#B83253] text-white shadow-md shadow-[#B83253]/25 ring-2 ring-[#B83253]/30 scale-105'
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
              </button>
            );
          })}
        </div>

        {/* Category Cards Grid
            - Mobile (<640px): 2 columns for items 1-4, 5th item spans 2 columns as a highlight card
            - Tablet (640px-1024px): 3 columns
            - Laptop/Desktop (>=1024px): 5 columns side by side */}
        <div
          ref={cardsGridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-5 xl:gap-6 items-stretch"
        >
          {categoriesList.map((cat, index) => {
            const isSelected = selectedSlug === cat.slug;
            const hasAnySelected = selectedSlug !== null;
            const isLastOnMobile = index === 4;

            return (
              <div
                key={cat.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onClick={() => handleCategoryClick(cat.slug, index)}
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 transition-all duration-300 relative flex flex-col justify-between border will-change-transform select-none ${
                  isLastOnMobile ? 'col-span-2 sm:col-span-1' : 'col-span-1'
                } ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#FFF5F7] via-white to-[#FFF0F4] border-[#B83253] shadow-xl shadow-[#B83253]/20 ring-2 ring-[#B83253]'
                    : hasAnySelected
                    ? 'bg-white border-[#F0E4E7] shadow-xs hover:border-[#B83253]/50'
                    : 'bg-white hover:bg-gradient-to-b hover:from-white hover:to-[#FFF9FB] border-[#F0E4E7] hover:border-[#DFB758] hover:shadow-xl hover:shadow-[#DFB758]/15'
                }`}
                style={{
                  transformOrigin: 'center center',
                }}
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

                    {/* Active badge */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-[#B83253] text-white shadow-md flex items-center gap-1 z-10 animate-fade-in">
                        <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>Dipilih</span>
                      </div>
                    )}
                  </div>

                  {/* Category Info */}
                  <h3
                    className={`font-serif font-bold transition-colors leading-tight text-sm sm:text-base lg:text-lg ${
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
              </div>
            );
          })}
        </div>

        {/* Selected Category Highlight Banner */}
        {activeCategoryObj && (
          <div
            ref={bannerRef}
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
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#2D2527]">
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
          </div>
        )}
      </div>
    </section>
  );
}
