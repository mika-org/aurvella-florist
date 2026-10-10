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
    <TransactionManagementClient initialTransactions={serializedTransactions} />
  );
}
