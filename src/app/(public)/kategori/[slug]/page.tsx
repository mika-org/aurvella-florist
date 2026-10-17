import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/products/ProductCard';
import { ArrowLeft, Sparkles } from 'lucide-react';


interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurvellaflorist.com';
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return { title: 'Kategori Tidak Ditemukan - Aurvella Florist' };

  const title = `${category.name} Bandung - Spesialis Standing Flower | Aurvella Florist`;
  const description =
    category.description ||
    `Koleksi ${category.name} eksklusif di Bandung dengan pengiriman cepat, jaminan bunga segar, dan gratis ongkir area Kota Bandung dan sekitarnya.`;
  const imageUrl = category.image || `${siteUrl}/images/categories/standing-acrylic.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `/kategori/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/kategori/${category.slug}`,
      siteName: 'Aurvella Florist Bandung',
      locale: 'id_ID',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${category.name} Bandung - Aurvella Florist`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isPublished: true },
        orderBy: { order: 'asc' },
        include: {
          category: { select: { name: true, slug: true } },
          images: { orderBy: { order: 'asc' }, take: 1 },
        },
      },
    },
  });

  if (!category) notFound();

  const settings = await prisma.siteSetting.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const whatsappNumber = settingsMap.whatsapp_international || '6285770187018';

  const serializedProducts = category.products.map((p) => ({
    ...p,
    price: Number(p.price),
    promoPrice: p.promoPrice ? Number(p.promoPrice) : null,
    promoEnd: p.promoEnd ? p.promoEnd.toISOString() : null,
  }));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurvellaflorist.com';

  const jsonLdCategory = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Bandung`,
    description: category.description,
    url: `${siteUrl}/kategori/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: category.products.map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/produk/${p.slug}`,
        name: p.name,
      })),
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Kategori',
        item: `${siteUrl}/#kategori`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `${siteUrl}/kategori/${category.slug}`,
      },
    ],
  };

  return (
    <div className="py-12 bg-[#FAF8F8] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCategory) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/#kategori"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B5E63] hover:text-[#B83253] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Pilihan Kategori</span>
          </Link>
        </div>

        {/* Category Hero Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#F3E2E6] mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#B83253] font-bold inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#DFB758]" />
                Kategori Spesialis
              </span>
              <h1 className="font-heading text-3xl sm:text-5xl font-semibold text-[#2D2527] tracking-wide">
                {category.name}
              </h1>
              <p className="text-sm sm:text-base text-[#6B5E63] leading-relaxed max-w-2xl">
                {category.description ||
                  'Koleksi pilihan dengan material terbaik dan perangkaian profesional untuk acara istimewa Anda di Bandung.'}
              </p>
              <div className="pt-2 text-xs font-semibold text-[#8E6D14]">
                Tersedia {category.products.length} pilihan desain standing flower
              </div>
            </div>

            <div className="md:col-span-4 relative aspect-square rounded-2xl overflow-hidden bg-[#FAF6F8] border border-[#F4E6EB] shadow-md">
              <Image
                src={category.image || '/images/categories/standing-acrylic.png'}
                alt={category.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serializedProducts.map((p) => (
            <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
          ))}
        </div>

        {category.products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#F3E2E6] shadow-sm max-w-md mx-auto">
            <p className="text-base text-[#2D2527] font-bold">
              Belum ada produk di kategori ini.
            </p>
            <p className="text-xs text-[#7A6D72] mt-2 mb-6">
              Silakan hubungi WhatsApp kami untuk custom model ini.
            </p>
            <Link
              href="/produk"
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#B83253]"
            >
              Lihat Katalog Lainnya
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
