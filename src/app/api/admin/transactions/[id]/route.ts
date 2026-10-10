import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const transaction = await prisma.transaction.findUnique({
    where: { id },
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

  if (!transaction) {
    return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({
    transaction: {
      ...transaction,
      totalAmount: Number(transaction.totalAmount),
      transactionDate: transaction.transactionDate.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
      items: transaction.items.map((item) => ({
        ...item,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      })),
    },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existingTx = await prisma.transaction.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingTx) {
      return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
    }

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

    // 1. Revert previous totalSold for products
    for (const oldItem of existingTx.items) {
      if (oldItem.productId) {
        await prisma.product.update({
          where: { id: oldItem.productId },
          data: {
            totalSold: { decrement: oldItem.quantity },
          },
        }).catch((e) => console.error('Error decrementing totalSold:', e));
      }
    }

    // 2. Prepare new items and calculate total
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

    const txDate = customDate ? new Date(customDate) : existingTx.transactionDate;

    // 3. Delete existing transaction items and recreate with updated data
    await prisma.transactionItem.deleteMany({
      where: { transactionId: id },
    });

    const updatedTx = await prisma.transaction.update({
      where: { id },
      data: {
        customerName,
        customerPhone,
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
      },
    });

    // 4. Increment new totalSold for products
    for (const newItem of itemsData) {
      if (newItem.productId) {
        await prisma.product.update({
          where: { id: newItem.productId },
          data: {
            totalSold: { increment: newItem.quantity },
          },
        }).catch((e) => console.error('Error incrementing totalSold:', e));
      }
    }

    return NextResponse.json({
      success: true,
      transaction: {
        ...updatedTx,
        totalAmount: Number(updatedTx.totalAmount),
      },
    });
  } catch (error: any) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memperbarui data transaksi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existingTx = await prisma.transaction.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingTx) {
      return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
    }

    // Revert product totalSold count
    for (const item of existingTx.items) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            totalSold: { decrement: item.quantity },
          },
        }).catch((e) => console.error('Error decrementing totalSold on delete:', e));
      }
    }

    // Delete transaction items first, then transaction
    await prisma.transactionItem.deleteMany({
      where: { transactionId: id },
    });

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Transaksi berhasil dihapus',
    });
  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menghapus transaksi' },
      { status: 500 }
    );
  }
}
