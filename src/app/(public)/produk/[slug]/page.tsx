import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { buildWhatsAppLink } from '@/lib/utils';
import ProductCard from '@/components/products/ProductCard';
import ProductDetailPricing from '@/components/products/ProductDetailPricing';

function checkIsPromoExpired(promoEnd?: Date | string | null): boolean {
  if (!promoEnd) return false;
  return new Date(promoEnd).getTime() <= Date.now();
}
import {
  Phone,
  ShieldCheck,
  Truck,
  Clock,
  Sparkles,
  ArrowLeft,
  Tag,
  CheckCircle2,
} from 'lucide-react';


interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurvellaflorist.com';
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, images: { take: 1 } },
  });

  if (!product) return { title: 'Produk Tidak Ditemukan - Aurvella Florist' };

  const title = `${product.seoTitle || product.name} - Standing Flower Bandung | Aurvella Florist`;
  const description =
    product.seoDescription ||
    product.description ||
    `Pesan ${product.name} (SKU: ${product.sku}) di Aurvella Florist Bandung. Spesialis standing flower no. 1 di Bandung dengan jaminan bunga segar & free ongkir.`;
  const imageUrl = product.images[0]?.url || `${siteUrl}/images/hero-banner-2.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `/produk/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/produk/${product.slug}`,
      siteName: 'Aurvella Florist Bandung',
      locale: 'id_ID',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
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

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
    },
  });

  if (!product) notFound();

  const settings = await prisma.siteSetting.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const whatsappNumber = settingsMap.whatsapp_international || '6285770187018';

  // Related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isPublished: true,
    },
    take: 4,
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { order: 'asc' }, take: 1 },
    },
  });

  const serializedRelated = relatedProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    promoPrice: p.promoPrice ? Number(p.promoPrice) : null,
    promoEnd: p.promoEnd ? p.promoEnd.toISOString() : null,
  }));

  const normalPrice = Number(product.price);
  const promoPrice = product.promoPrice ? Number(product.promoPrice) : null;
  const isPromoExpired = checkIsPromoExpired(product.promoEnd);
  const hasValidPromo =
    product.isPromo && promoPrice !== null && promoPrice < normalPrice && !isPromoExpired;

  const primaryImage =
    product.images[0]?.url || '/images/categories/standing-acrylic.png';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurvellaflorist.com';

  const waLink = buildWhatsAppLink(
    whatsappNumber,
    product.name,
    product.sku,
    `${siteUrl}/produk/${product.slug}`
  );

  const jsonLdProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((i) => i.url),
    description: product.description || product.seoDescription,
    sku: product.sku,
    category: product.category.name,
    brand: {
      '@type': 'Brand',
      name: 'Aurvella Florist',
    },
    offers: {
      '@type': 'Offer',
      price: hasValidPromo && promoPrice ? promoPrice : normalPrice,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/produk/${product.slug}`,
      priceValidUntil: product.promoEnd ? new Date(product.promoEnd).toISOString().split('T')[0] : '2027-12-31',
      seller: {
        '@type': 'Florist',
        name: 'Aurvella Florist by. Maharani Florist',
      },
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
        name: 'Katalog Produk',
        item: `${siteUrl}/produk`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category.name,
        item: `${siteUrl}/kategori/${product.category.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${siteUrl}/produk/${product.slug}`,
      },
    ],
  };

  return (
    <div className="py-10 bg-[#FAF8F8] min-h-screen">
      {/* Product & Breadcrumb JSON-LD for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B5E63] hover:text-[#B83253] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Produk</span>
          </Link>
        </div>

        {/* Product Detail Layout */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#F0E4E7] grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF8F8] border border-[#F4E6EB]">
              <Image
                src={primaryImage}
                alt={product.images[0]?.alt || product.name}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {hasValidPromo && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#B83253] text-white shadow-md">
                    <Tag className="w-3.5 h-3.5" />
                    HARGA PROMO
                  </span>
                </div>
              )}
            </div>

            {/* Sub-images thumbnail preview if multiple */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-[#DFB758] shrink-0"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Ordering */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <Link
                  href={`/kategori/${product.category.slug}`}
                  className="text-xs uppercase tracking-widest text-[#B89223] font-bold hover:underline"
                >
                  {product.category.name}
                </Link>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#FFF0F4] text-[#B83253] font-semibold border border-[#F8B4C4]">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-[#2D2527] leading-tight tracking-wide">
                {product.name}
              </h1>

              {/* Pricing Display with Live Promo Countdown & Auto-Hide */}
              <div className="mt-4">
                <ProductDetailPricing
                  normalPrice={normalPrice}
                  promoPrice={promoPrice}
                  isPromo={product.isPromo}
                  promoEnd={product.promoEnd ? product.promoEnd.toISOString() : null}
                />
              </div>

              {/* Status Stock & Penjualan Terbanyak */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                  <span className="text-[#2D2527]">
                    {product.isAvailable
                      ? 'Slot Pemesanan Tersedia Hari Ini'
                      : 'Pre-order Tersedia'}
                  </span>
                </div>

                {/* Info Penjualan */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                    (product.totalSold || 0) > 0
                      ? 'bg-[#FFF0F4] text-[#B83253] border border-[#F8B4C4]'
                      : 'bg-[#FAF3F5] text-[#7A6D72] border border-[#E8D9DC]'
                  }`}
                >
                  <span>
                    {(product.totalSold || 0) > 0
                      ? `🔥 Terjual ${product.totalSold} Rangkaian`
                      : `Terjual ${product.totalSold || 0} Rangkaian`}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="font-bold text-base text-[#2D2527] mb-2">
                  Deskripsi Produk
                </h2>
                <p className="text-sm text-[#5C4D52] leading-relaxed whitespace-pre-line">
                  {product.description ||
                    'Rangkaian standing flower eksklusif dengan material pilihan terbaik, dirangkai dengan teliti untuk momen istimewa Anda di Bandung.'}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div className="mt-6 p-4 rounded-xl bg-[#FAF6F8] border border-[#F2E4E8]">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#8E6D14] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#DFB758]" />
                    Spesifikasi & Material
                  </h3>
                  <div className="text-xs text-[#5C4D52] leading-relaxed whitespace-pre-line">
                    {product.specifications}
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp Direct Order Button */}
            <div className="pt-4 border-t border-[#F5E2E7] space-y-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:opacity-95 shadow-xl shadow-[#25D366]/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
              >
                <Phone className="w-5 h-5 fill-white" />
                <span>Pesan Produk Ini via WhatsApp</span>
              </a>

              {/* Quick guarantees */}
              <div className="grid grid-cols-2 gap-3 text-[11px] text-[#6B5E63] font-medium pt-2">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#DFB758]" /> Free Ongkir Area Bandung
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#DFB758]" /> Same Day Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> Termasuk Standing & Papan
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#25D366]" /> Garansi Foto Sebelum Kirim
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-[#2D2527] mb-6 tracking-tight">
              Produk Terkait di Kategori {product.category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {serializedRelated.map((rp) => (
                <ProductCard key={rp.id} product={rp} whatsappNumber={whatsappNumber} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
