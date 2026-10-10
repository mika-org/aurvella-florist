import React from 'react';
import prisma from '@/lib/prisma';
import HeroBanner from '@/components/sections/HeroBanner';
import CategorySection from '@/components/sections/CategorySection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import ServiceInfo from '@/components/sections/ServiceInfo';
import TestimonialSection from '@/components/sections/TestimonialSection';
import FaqSection from '@/components/sections/FaqSection';
import ContactSection from '@/components/sections/ContactSection';
import GoogleMapsSection from '@/components/sections/GoogleMapsSection';


export default async function HomePage() {
  const [categories, products, testimonials, faqs, settings] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { order: 'asc' },
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { order: 'asc' }, take: 1 },
      },
    }),
    prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { date: 'desc' },
      take: 8,
    }),
    prisma.faq.findMany({
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

  // Find promo product for hero
  const promoProduct = products.find((p) => p.isPromo && p.promoPrice);
  const heroPromo = promoProduct
    ? {
        name: promoProduct.name,
        normalPrice: Number(promoProduct.price),
        promoPrice: Number(promoProduct.promoPrice),
        sku: promoProduct.sku,
        promoEnd: promoProduct.promoEnd ? promoProduct.promoEnd.toISOString() : null,
      }
    : undefined;

  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
    promoPrice: p.promoPrice ? Number(p.promoPrice) : null,
    promoEnd: p.promoEnd ? p.promoEnd.toISOString() : null,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner */}
      <HeroBanner whatsappNumber={whatsappNumber} promoProduct={heroPromo} />

      {/* 2. Pilih Kategori */}
      <CategorySection categories={categories} />

      {/* 3. Produk Unggulan */}
      <FeaturedProducts
        products={serializedProducts}
        categories={categories}
        whatsappNumber={whatsappNumber}
      />

      {/* 4. Informasi Layanan */}
      <ServiceInfo
        freeOngkirInfo={settingsMap.free_ongkir_info}
        samedayInfo={settingsMap.sameday_info}
        serviceHours={settingsMap.service_hours}
      />

      {/* 5. Section Testimoni (Wajib berada di atas section Contact Us) */}
      <TestimonialSection testimonials={testimonials} />

      {/* 6. Section FAQ (Frequently Asked Questions) */}
      <FaqSection faqs={faqs} whatsappNumber={whatsappNumber} />

      {/* 7. Section Contact Us & Form Kirim Pesan */}
      <ContactSection
        whatsappNumber={whatsappNumber}
        address={settingsMap.address}
        serviceHours={settingsMap.service_hours}
        instagramUrl={settingsMap.instagram_url}
        shopeeUrl={settingsMap.shopee_url}
        tiktokUrl={settingsMap.tiktok_url}
      />

      {/* 7. Section Google Maps */}
      <GoogleMapsSection
        address={settingsMap.address}
        mapsEmbedUrl={settingsMap.maps_embed_url}
        mapsDirectionUrl={settingsMap.maps_direction_url}
      />
    </div>
  );
}
