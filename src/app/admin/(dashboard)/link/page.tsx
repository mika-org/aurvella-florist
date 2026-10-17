import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import LinkManagementClient from './LinkManagementClient';


export default async function AdminLinksPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const links = await prisma.socialLink.findMany({
    orderBy: { order: 'asc' },
  });

  return <LinkManagementClient initialLinks={links} />;
}
