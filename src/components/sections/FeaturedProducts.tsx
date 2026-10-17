'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard, { ProductCardData } from '../products/ProductCard';

interface FeaturedProductsProps {
  products: ProductCardData[];
  categories: { id: string; name: string; slug: string }[];
  whatsappNumber?: string;
}

export default function FeaturedProducts({
  products = [],
  categories = [],
  whatsappNumber,
}: FeaturedProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category?.slug === selectedCategory);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B83253] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Aurvella Florist by. Maharani Florist
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[#2D2527] mt-2 tracking-wide">
              Produk Pilihan &amp; Unggulan
            </h2>
            <p className="text-[#6B5E63] text-sm sm:text-base mt-2 max-w-xl">
              Rangkaian standing flower paling favorit dan aneka karangan bunga pilihan terbaik untuk berbagai momen berharga di wilayah Bandung.
            </p>
          </div>

          <Link
            href="/produk"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#B83253] hover:text-[#912440] group self-start md:self-auto"
          >
            <span>Lihat Semua Katalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#B83253] text-white shadow-md'
                : 'bg-white text-[#4A3E42] border border-[#E8D9DC] hover:border-[#B83253]'
            }`}
          >
            Semua Produk
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.slug
                  ? 'bg-[#B83253] text-white shadow-md'
                  : 'bg-white text-[#4A3E42] border border-[#E8D9DC] hover:border-[#B83253]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E8D9DC]">
            <p className="text-[#7A6D72] text-sm">
              Belum ada produk di kategori ini.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
