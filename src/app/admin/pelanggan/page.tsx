import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import CustomerManagementClient from './CustomerManagementClient';

export const metadata = {
  title: 'Data Pelanggan - Aurvella Florist Admin',
  description: 'Kelola basis data pelanggan dan pemesan standing flower',
};

export default async function CustomersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const customers = await prisma.customer.findMany({
    orderBy: [{ totalOrders: 'desc' }, { totalSpent: 'desc' }],
    include: {
      _count: { select: { transactions: true } },
    },
  });

  const serialized = customers.map((c) => ({
    id: c.id,
    name: c.name,
    whatsapp: c.whatsapp,
    email: c.email,
    address: c.address,
    notes: c.notes,
    totalOrders: c.totalOrders,
    totalSpent: Number(c.totalSpent),
    lastOrderAt: c.lastOrderAt ? c.lastOrderAt.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
  }));

  return <CustomerManagementClient initialCustomers={serialized} />;
}
