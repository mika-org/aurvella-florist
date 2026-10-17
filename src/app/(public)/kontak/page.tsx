import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ContactSection from '@/components/sections/ContactSection';
import GoogleMapsSection from '@/components/sections/GoogleMapsSection';


export const metadata: Metadata = {
  title: 'Kontak & Lokasi Workshop Florist Bandung | Aurvella Florist',
  description:
    'Hubungi Customer Service Aurvella Florist Bandung via WhatsApp 24 Jam 0857-7018-7018 untuk konsultasi dan pemesanan standing flower kilat. Kunjungi workshop resmi di Jl. Jamrud No.16 Arcamanik, Kota Bandung.',
  alternates: {
    canonical: '/kontak',
  },
  openGraph: {
    title: 'Kontak & Lokasi Workshop - Aurvella Florist Bandung',
    description:
      'Konsultasi 24 jam & pemesanan standing flower kilat same day delivery ke seluruh Kota Bandung.',
    url: 'https://aurvellaflorist.com/kontak',
    type: 'website',
    images: ['/images/hero-banner-2.png'],
  },
};

export default async function ContactPage() {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const whatsappNumber = settingsMap.whatsapp_international || '6285770187018';

  return (
    <div className="py-6">
      <ContactSection
        whatsappNumber={whatsappNumber}
        address={settingsMap.address}
        serviceHours={settingsMap.service_hours}
        instagramUrl={settingsMap.instagram_url}
        shopeeUrl={settingsMap.shopee_url}
        tiktokUrl={settingsMap.tiktok_url}
      />
      <GoogleMapsSection
        address={settingsMap.address}
        mapsEmbedUrl={settingsMap.maps_embed_url}
        mapsDirectionUrl={settingsMap.maps_direction_url}
      />
    </div>
  );
}
