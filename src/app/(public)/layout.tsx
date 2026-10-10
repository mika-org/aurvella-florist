import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import prisma from '@/lib/prisma';


export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const businessName = settingsMap.business_name || 'Aurvella Florist';
  const whatsappNumber = settingsMap.whatsapp_international || '6285770187018';
  const address =
    settingsMap.address ||
    'Jl. Jamrud No.16, Cisaranten Kulon, Kec. Arcamanik, Kota Bandung, Jawa Barat 40293';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar businessName={businessName} whatsappNumber={whatsappNumber} />
      <main className="flex-1">{children}</main>
      <Footer
        businessName={businessName}
        whatsappNumber={whatsappNumber}
        address={address}
        instagramUrl={settingsMap.instagram_url}
        shopeeUrl={settingsMap.shopee_url}
        tiktokUrl={settingsMap.tiktok_url}
        mapsUrl={settingsMap.maps_direction_url}
      />
      <FloatingWhatsApp whatsappNumber={whatsappNumber} />
    </div>
  );
}
