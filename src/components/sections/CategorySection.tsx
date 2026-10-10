'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
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

interface CategorySectionProps {
  categories: CategoryItem[];
  activeCategorySlug?: string;
  onSelectCategory?: (slug: string) => void;
}

export default function CategorySection({
  categories,
  activeCategorySlug,
  onSelectCategory,
}: CategorySectionProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    activeCategorySlug || null
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleCategoryClick = (slug: string, index: number) => {
    const isCurrentlyActive = selectedSlug === slug;
    const newSlug = isCurrentlyActive ? null : slug;
    setSelectedSlug(newSlug);

    if (onSelectCategory) {
      onSelectCategory(newSlug || '');
    }

    // GSAP Animation: Active card shifts to the left and expands larger than others
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      if (!newSlug) {
        // Reset all cards when deselected
        gsap.to(card, {
          x: 0,
          scale: 1,
          opacity: 1,
          zIndex: 1,
          duration: 0.35,
          ease: 'power2.out',
        });
      } else if (i === index) {
        // Active card: shifts to the left (-14px) and scales noticeably larger (1.08x)
        gsap.timeline()
          .to(card, {
            scale: 0.98,
            duration: 0.1,
            ease: 'power1.in',
          })
          .to(card, {
            x: -14,
            scale: 1.08,
            opacity: 1,
            zIndex: 25,
            duration: 0.35,
            ease: 'back.out(1.8)',
          });
      } else {
        // Inactive cards: slight scale-down (0.94x) and soft opacity
        gsap.to(card, {
          x: 4,
          scale: 0.94,
          opacity: 0.75,
          zIndex: 2,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });
  };

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      gsap.from(cardsRef.current.filter(Boolean), {
        y: 35,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power2.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="kategori" ref={containerRef} className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B83253] font-bold">
            Koleksi Terlengkap
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2527] mt-2 mb-4">
            Pilih Kategori Standing Flower
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#F8B4C4] to-[#DFB758] mx-auto rounded-full mb-4" />
          <p className="text-[#6B5E63] text-sm sm:text-base leading-relaxed">
            Klik kategori untuk melihat sorotan. Kategori yang dipilih akan tampil lebih besar dan bergeser fokus untuk memudahkan pilihan Anda.
          </p>
        </div>

        {/* Category Cards Grid with responsive spacing for shifting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-7 items-center">
          {categories.map((cat, index) => {
            const isSelected = selectedSlug === cat.slug;
            const hasAnySelected = selectedSlug !== null;

            return (
              <div
                key={cat.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onClick={() => handleCategoryClick(cat.slug, index)}
                className={`group cursor-pointer rounded-3xl p-5 transition-shadow duration-300 relative flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#FFF5F7] to-[#FFF0F4] border-[#B83253] shadow-2xl shadow-[#B83253]/25 ring-2 ring-[#B83253]'
                    : hasAnySelected
                    ? 'bg-[#FCFAFA] border-[#F0E4E7] shadow-sm'
                    : 'bg-[#FCFAFA] hover:bg-white border-[#F0E4E7] hover:border-[#DFB758] hover:shadow-lg'
                }`}
                style={{
                  transformOrigin: 'center center',
                }}
              >
                <div>
                  {/* Category Image */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white mb-4 border border-[#F5E6EA] shadow-inner">
                    <Image
                      src={cat.image || '/images/categories/standing-acrylic.png'}
                      alt={cat.name}
                      fill
                      className={`object-cover object-center transition-transform duration-500 ${
                        isSelected ? 'scale-110' : 'group-hover:scale-105'
                      }`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    />

                    {/* Active badge */}
                    {isSelected && (
                      <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#B83253] text-white shadow-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Kategori Aktif</span>
                      </div>
                    )}
                  </div>

                  {/* Category Info */}
                  <h3
                    className={`font-serif font-bold transition-colors leading-snug ${
                      isSelected
                        ? 'text-lg text-[#B83253]'
                        : 'text-base text-[#2D2527] group-hover:text-[#B83253]'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#7A6D72] mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description || 'Koleksi standing flower pilihan berkelas untuk berbagai momen berharga.'}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-3 border-t border-[#F5E6EA] flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold ${
                      isSelected ? 'text-[#B83253]' : 'text-[#8E6D14]'
                    }`}
                  >
                    {cat._count?.products !== undefined ? `${cat._count.products} Koleksi` : 'Lihat Produk'}
                  </span>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#B83253] text-white border-[#B83253] shadow-md'
                        : 'bg-white group-hover:bg-[#B83253] group-hover:text-white border-[#E8D9DC] text-[#2D2527]'
                    }`}
                    aria-label={`Buka halaman kategori ${cat.name}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
