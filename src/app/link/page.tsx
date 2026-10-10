import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import LinkTreeClient from './LinkTreeClient';

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: 'Aurvella Florist - Official Links & Pricelist',
  description:
    'Akses seluruh tautan resmi Aurvella Florist Bandung: WhatsApp order, pricelist & katalog Google Drive, Shopee, Instagram, dan lokasi workshop.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
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
