import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { serializeEntry } from '@/lib/finance';
import FinanceManagementClient from './FinanceManagementClient';

export default async function AdminFinancePage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const entries = await prisma.financeEntry.findMany({
    orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
  });

  return <FinanceManagementClient initialEntries={entries.map(serializeEntry)} />;
}
