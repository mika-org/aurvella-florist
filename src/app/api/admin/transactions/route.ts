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
    deliveryDate: t.deliveryDate ? t.deliveryDate.toISOString() : null,
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
      customerName = '',
      customerPhone = '',
      customerAddress,
      boardGreeting,
      senderName,
      deliveryDate,
      paymentMethod = 'TRANSFER',
      paymentStatus = 'PAID',
      orderStatus = 'PROCESSING',
      notes,
      items,
      customDate,
      totalAmount: inputTotalAmount,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Minimal 1 produk harus dimasukkan dalam transaksi' },
        { status: 400 }
      );
    }

    // Generate unique invoice number: INV-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const invoicePrefix = `INV-${dateStr}-`;
    const nextInvoiceNumber = async (skip = 0) => {
      const last = await prisma.transaction.findFirst({
        where: { invoiceNumber: { startsWith: invoicePrefix } },
        orderBy: { invoiceNumber: 'desc' },
        select: { invoiceNumber: true },
      });
      const lastSeq = last ? parseInt(last.invoiceNumber.slice(invoicePrefix.length), 10) || 0 : 0;
      return `${invoicePrefix}${String(lastSeq + 1 + skip).padStart(4, '0')}`;
    };

    // Calculate total
    let computedTotal = 0;
    const itemsData = items.map((item: any) => {
      const price = Number(item.price);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const subtotal = item.subtotal !== undefined ? Number(item.subtotal) : price * quantity;
      computedTotal += subtotal;

      return {
        productId: item.productId || null,
        productName: item.productName || item.name,
        productSku: item.productSku || item.sku || '-',
        price,
        quantity,
        subtotal,
      };
    });

    const totalAmount = inputTotalAmount !== undefined && Number(inputTotalAmount) > 0
      ? Number(inputTotalAmount)
      : computedTotal;

    const txDate = customDate ? new Date(customDate) : new Date();
    const delivery = deliveryDate ? new Date(deliveryDate) : null;

    // Auto find or create customer
    const cleanPhone = String(customerPhone).trim().replace(/[^0-9]/g, '');
    const cleanName = String(customerName).trim();
    let customer = cleanPhone
      ? await prisma.customer.findUnique({ where: { whatsapp: cleanPhone } })
      : null;

    if (!cleanPhone) {
      // Data pembeli tidak lagi diinput; transaksi dicatat tanpa pelanggan.
    } else if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: cleanName || cleanPhone,
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
          name: cleanName || customer.name,
          address: customerAddress || customer.address,
          totalOrders: { increment: 1 },
          totalSpent: { increment: totalAmount },
          lastOrderAt: txDate,
        },
      });
    }

    const createTx = (invoiceNumber: string) =>
      prisma.transaction.create({
      data: {
        invoiceNumber,
        customerId: customer?.id ?? null,
        customerName: cleanName,
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
        deliveryDate: delivery,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });

    let newTransaction;
    for (let attempt = 0; ; attempt++) {
      try {
        newTransaction = await createTx(await nextInvoiceNumber(attempt > 2 ? attempt : 0));
        break;
      } catch (e: any) {
        if (e?.code === 'P2002' && attempt < 5) continue;
        throw e;
      }
    }

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
