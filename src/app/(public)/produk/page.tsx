import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { Sparkles, SlidersHorizontal } from 'lucide-react';


export const metadata: Metadata = {
  title: 'Katalog Standing Flower & Karangan Bunga Bandung | Aurvella Florist',
  description:
    'Koleksi terlengkap spesialis standing flower no. 1 di Bandung: Standing Acrylic modern, Standing Cermin wedding, Foam PVC, Bunga Segar, dan Bunga Papan Duka Cita. Free ongkir & same day delivery 2-4 jam se-Kota Bandung.',
  alternates: {
    canonical: '/produk',
  },
  openGraph: {
    title: 'Katalog Standing Flower & Karangan Bunga Bandung - Aurvella Florist',
    description:
      'Koleksi terlengkap standing flower akrilik, cermin wedding, PVC, fresh flower, dan bunga papan duka cita di Bandung. Gratis ongkir & garansi bunga segar.',
    url: 'https://aurvellaflorist.com/produk',
    type: 'website',
    images: ['/images/hero-banner-2.png'],
  },
};

interface ProductsPageProps {
  searchParams: Promise<{ kategori?: string; q?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.kategori;
  const searchQuery = resolvedParams.q;
  const sortOption = resolvedParams.sort || 'order';

  const whereClause: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (categoryFilter) {
    whereClause.category = { slug: categoryFilter };
  }

  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { sku: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { order: 'asc' };
  if (sortOption === 'price_asc') orderBy = { price: 'asc' };
  else if (sortOption === 'price_desc') orderBy = { price: 'desc' };
  else if (sortOption === 'newest') orderBy = { createdAt: 'desc' };

  const [products, categories, settings] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      orderBy,
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { order: 'asc' }, take: 1 },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.siteSetting.findMany(),
  ]);

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const whatsappNumber = settingsMap.whatsapp_international || '6285770187018';

  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
    promoPrice: p.promoPrice ? Number(p.promoPrice) : null,
    promoEnd: p.promoEnd ? p.promoEnd.toISOString() : null,
  }));

  return (
    <div className="py-12 bg-[#FAF8F8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#B83253] font-bold inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F4] border border-[#F8B4C4]/70 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#DFB758]" />
            Aurvella Florist by. Maharani Florist
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2D2527] mt-2 mb-3 tracking-wide">
            Katalog Karangan Bunga &amp; Standing Flower Bandung
          </h1>
          <p className="text-sm text-[#6B5E63] leading-relaxed max-w-2xl mx-auto">
            Koleksi terlengkap mulai dari Spesialis Standing Flower No. 1 di Bandung hingga Bunga Papan Dukacita resmi, dipersembahkan oleh Aurvella Florist cabang dari Maharani Florist.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 mb-8 shadow-sm border border-[#EFE4E7] flex flex-wrap items-center justify-between gap-4">
          {/* Categories Tab */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            <Link
              href="/produk"
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                !categoryFilter
                  ? 'bg-[#B83253] text-white shadow'
                  : 'bg-[#FAF3F5] text-[#4A3E42] hover:bg-[#F5E6EB]'
              }`}
            >
              Semua Kategori
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/produk?kategori=${c.slug}`}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === c.slug
                    ? 'bg-[#B83253] text-white shadow'
                    : 'bg-[#FAF3F5] text-[#4A3E42] hover:bg-[#F5E6EB]'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#6B5E63]">
            <SlidersHorizontal className="w-4 h-4 text-[#B83253]" />
            <span>Total: {products.length} Produk</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serializedProducts.map((p) => (
            <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#F3E2E6] shadow-sm max-w-lg mx-auto">
            <p className="text-lg text-[#2D2527] font-bold">
              Tidak ada produk ditemukan
            </p>
            <p className="text-xs text-[#7A6D72] mt-2 mb-6">
              Silakan pilih kategori lain atau hubungi admin langsung untuk custom rangkaian.
            </p>
            <Link
              href="/produk"
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#B83253]"
            >
              Kembali ke Semua Produk
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
