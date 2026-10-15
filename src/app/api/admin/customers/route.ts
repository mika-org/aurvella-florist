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
  const sortBy = searchParams.get('sort') || 'orders'; // 'orders', 'spent', 'name', 'recent'

  const whereClause: any = {};
  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { whatsapp: { contains: q, mode: 'insensitive' } },
      { address: { contains: q, mode: 'insensitive' } },
    ];
  }

  let orderBy: any = { totalOrders: 'desc' };
  if (sortBy === 'spent') orderBy = { totalSpent: 'desc' };
  if (sortBy === 'name') orderBy = { name: 'asc' };
  if (sortBy === 'recent') orderBy = { lastOrderAt: 'desc' };

  try {
    const customers = await prisma.customer.findMany({
      where: whereClause,
      orderBy,
      include: {
        _count: { select: { transactions: true } },
      },
    });

    const serialized = customers.map((c) => ({
      ...c,
      totalSpent: Number(c.totalSpent),
      lastOrderAt: c.lastOrderAt ? c.lastOrderAt.toISOString() : null,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));

    return NextResponse.json({ customers: serialized });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal memuat pelanggan' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, whatsapp, email, address, notes } = body;

    if (!name || !whatsapp) {
      return NextResponse.json(
        { error: 'Nama pelanggan dan nomor WhatsApp wajib diisi' },
        { status: 400 }
      );
    }

    const cleanPhone = whatsapp.trim().replace(/[^0-9]/g, '');
    const existing = await prisma.customer.findUnique({
      where: { whatsapp: cleanPhone },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp sudah terdaftar atas nama pelanggan lain' },
        { status: 400 }
      );
    }

    const newCustomer = await prisma.customer.create({
      data: {
        name: name.trim(),
        whatsapp: cleanPhone,
        email: email ? email.trim() : null,
        address: address ? address.trim() : null,
        notes: notes ? notes.trim() : null,
      },
    });

    return NextResponse.json({
      success: true,
      customer: {
        ...newCustomer,
        totalSpent: Number(newCustomer.totalSpent),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal menambah pelanggan' },
      { status: 500 }
    );
  }
}
