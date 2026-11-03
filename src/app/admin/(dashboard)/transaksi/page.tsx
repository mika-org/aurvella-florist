import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import TransactionManagementClient from './TransactionManagementClient';

export default async function AdminTransactionsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const transactions = await prisma.transaction.findMany({
    orderBy: { transactionDate: 'desc' },
    include: {
      items: {
        include: {
          product: {
            select: {
              images: { orderBy: { order: 'asc' }, take: 1 },
            },
          },
        },
      },
    },
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      products: {
        where: { isPublished: true },
        select: { id: true, price: true, sku: true },
        take: 1,
      },
    },
  });

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image || '/images/categories/standing-acrylic.png',
    sampleProductId: c.products[0]?.id || null,
    sampleSku: c.products[0]?.sku || c.slug.toUpperCase(),
    samplePrice: c.products[0] ? Number(c.products[0].price) : 500000,
  }));

  const serializedTransactions = transactions.map((t) => ({
    id: t.id,
    invoiceNumber: t.invoiceNumber,
    customerName: t.customerName,
    customerPhone: t.customerPhone,
    customerAddress: t.customerAddress,
    boardGreeting: t.boardGreeting,
    senderName: t.senderName,
    totalAmount: Number(t.totalAmount),
    paymentMethod: t.paymentMethod,
    paymentStatus: t.paymentStatus,
    orderStatus: t.orderStatus,
    notes: t.notes,
    transactionDate: t.transactionDate.toISOString(),
    createdAt: t.createdAt.toISOString(),
    items: t.items.map((it) => ({
      id: it.id,
      productId: it.productId,
      productName: it.productName,
      productSku: it.productSku,
      price: Number(it.price),
      quantity: it.quantity,
      subtotal: Number(it.subtotal),
      product: it.product
        ? {
            images: it.product.images.map((img) => ({ url: img.url })),
          }
        : null,
    })),
  }));

  return (
    <TransactionManagementClient
      initialTransactions={serializedTransactions}
      initialCategories={serializedCategories}
    />
  );
}
