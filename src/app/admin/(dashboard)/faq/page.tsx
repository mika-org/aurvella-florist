import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import FaqManagementClient from './FaqManagementClient';

export default async function AdminFaqPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const faqs = await prisma.faq.findMany({
    orderBy: { order: 'asc' },
  });

  const serializedFaqs = faqs.map((f) => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }));

  return <FaqManagementClient initialFaqs={serializedFaqs} />;
}
