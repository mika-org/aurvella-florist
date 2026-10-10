import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import ProductManagementClient from './ProductManagementClient';


export default async function AdminProductsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: 'asc' } },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
    promoPrice: p.promoPrice ? Number(p.promoPrice) : null,
    promoEnd: p.promoEnd ? p.promoEnd.toISOString() : null,
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
    updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
  }));

  return (
    <ProductManagementClient
      initialProducts={serializedProducts}
      categories={categories}
    />
  );
}
