import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { transactionDate: 'desc' },
          include: { items: true },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Pelanggan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      customer: {
        ...customer,
        totalSpent: Number(customer.totalSpent),
        transactions: customer.transactions.map((t) => ({
          ...t,
          totalAmount: Number(t.totalAmount),
          items: t.items.map((i) => ({
            ...i,
            price: Number(i.price),
            subtotal: Number(i.subtotal),
          })),
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const { name, whatsapp, email, address, notes } = body;

    const cleanPhone = whatsapp ? whatsapp.trim().replace(/[^0-9]/g, '') : undefined;

    if (cleanPhone) {
      const existing = await prisma.customer.findFirst({
        where: { whatsapp: cleanPhone, id: { not: id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: 'Nomor WhatsApp sudah digunakan oleh pelanggan lain' },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(cleanPhone ? { whatsapp: cleanPhone } : {}),
        email: email !== undefined ? (email ? email.trim() : null) : undefined,
        address: address !== undefined ? (address ? address.trim() : null) : undefined,
        notes: notes !== undefined ? (notes ? notes.trim() : null) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      customer: {
        ...updated,
        totalSpent: Number(updated.totalSpent),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.customer.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
