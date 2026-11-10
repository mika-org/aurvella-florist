import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { parseFinanceBody, serializeEntry } from '@/lib/finance';

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
    const existing = await prisma.financeEntry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Data keuangan tidak ditemukan' }, { status: 404 });
    }

    const parsed = parseFinanceBody(await req.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const entry = await prisma.financeEntry.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ success: true, entry: serializeEntry(entry) });
  } catch (error: any) {
    console.error('Error updating finance entry:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memperbarui transaksi keuangan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.financeEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Data keuangan tidak ditemukan' }, { status: 404 });
    }
    console.error('Error deleting finance entry:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menghapus transaksi keuangan' },
      { status: 500 }
    );
  }
}
