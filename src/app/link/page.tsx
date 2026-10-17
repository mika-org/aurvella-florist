import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import LinkTreeClient from './LinkTreeClient';

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: 'Official Bio Link & Pricelist PDF | Aurvella Florist Bandung',
  description:
    'Akses seluruh portal resmi Aurvella Florist Bandung: Chat WhatsApp 24 Jam, Download Pricelist PDF & Katalog Standing Flower Google Drive, Official Shopee & Instagram.',
  alternates: {
    canonical: '/link',
  },
  openGraph: {
    title: 'Aurvella Florist - Official Links & Pricelist',
    description:
      'Pricelist katalog standing flower lengkap, chat WhatsApp order kilat, dan media sosial resmi.',
    url: 'https://aurvellaflorist.com/link',
    type: 'website',
    images: ['/logo.png'],
  },
};

export default async function LinkTreePage() {
  const [links, settings] = await Promise.all([
    prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.siteSetting.findMany(),
  ]);

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <LinkTreeClient
      links={links}
      businessName={settingsMap.business_name || 'Aurvella Florist'}
      tagline={
        settingsMap.tagline ||
        'Spesialist Standing Flower BANDUNG - Fresh & Artificial | Free Ongkir'
      }
    />
  );
}
