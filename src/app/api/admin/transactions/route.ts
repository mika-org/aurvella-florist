import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';

  const whereClause: any = {};

  if (q) {
    whereClause.OR = [
      { invoiceNumber: { contains: q, mode: 'insensitive' } },
      { customerName: { contains: q, mode: 'insensitive' } },
      { customerPhone: { contains: q, mode: 'insensitive' } },
      { boardGreeting: { contains: q, mode: 'insensitive' } },
      { senderName: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (status) {
    whereClause.orderStatus = status;
  }

  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    orderBy: { transactionDate: 'desc' },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              images: { orderBy: { order: 'asc' }, take: 1 },
            },
          },
        },
      },
    },
  });

  const serialized = transactions.map((t) => ({
    ...t,
    totalAmount: Number(t.totalAmount),
    transactionDate: t.transactionDate.toISOString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    items: t.items.map((item) => ({
      ...item,
      price: Number(item.price),
      subtotal: Number(item.subtotal),
      createdAt: item.createdAt.toISOString(),
    })),
  }));

  return NextResponse.json({ transactions: serialized });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerAddress,
      boardGreeting,
      senderName,
      paymentMethod = 'TRANSFER',
      paymentStatus = 'PAID',
      orderStatus = 'COMPLETED',
      notes,
      items,
      customDate,
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Nama pembeli dan Nomor WhatsApp/Telepon wajib diisi' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Minimal 1 produk harus dimasukkan dalam transaksi' },
        { status: 400 }
      );
    }

    // Generate unique invoice number: INV-YYYYMMDD-XXXX
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const countToday = await prisma.transaction.count({
      where: {
        transactionDate: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        },
      },
    });
    const invoiceNumber = `INV-${dateStr}-${String(countToday + 1).padStart(4, '0')}`;

    // Calculate total
    let totalAmount = 0;
    const itemsData = items.map((item: any) => {
      const price = Number(item.price);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const subtotal = price * quantity;
      totalAmount += subtotal;

      return {
        productId: item.productId || null,
        productName: item.productName || item.name,
        productSku: item.productSku || item.sku || '-',
        price,
        quantity,
        subtotal,
      };
    });

    const txDate = customDate ? new Date(customDate) : new Date();

    // Auto find or create customer
    const cleanPhone = customerPhone.trim().replace(/[^0-9]/g, '');
    let customer = await prisma.customer.findUnique({
      where: { whatsapp: cleanPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName.trim(),
          whatsapp: cleanPhone,
          address: customerAddress || null,
          totalOrders: 1,
          totalSpent: totalAmount,
          lastOrderAt: txDate,
        },
      });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: customerName.trim(),
          address: customerAddress || customer.address,
          totalOrders: { increment: 1 },
          totalSpent: { increment: totalAmount },
          lastOrderAt: txDate,
        },
      });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        invoiceNumber,
        customerId: customer.id,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerAddress: customerAddress || null,
        boardGreeting: boardGreeting || null,
        senderName: senderName || null,
        totalAmount,
        paymentMethod,
        paymentStatus,
        orderStatus,
        notes: notes || null,
        transactionDate: txDate,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });

    // Increment totalSold on each product
    for (const item of itemsData) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            totalSold: { increment: item.quantity },
          },
        }).catch((e) => console.error('Failed to increment totalSold:', e));
      }
    }

    return NextResponse.json({
      success: true,
      transaction: {
        ...newTransaction,
        totalAmount: Number(newTransaction.totalAmount),
      },
    });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan transaksi' },
      { status: 500 }
    );
  }
}
