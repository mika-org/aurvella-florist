import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { parseFinanceBody, serializeEntry } from '@/lib/finance';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const entries = await prisma.financeEntry.findMany({
    orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json({ entries: entries.map(serializeEntry) });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const parsed = parseFinanceBody(await req.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const entry = await prisma.financeEntry.create({ data: parsed.data });
    return NextResponse.json({ success: true, entry: serializeEntry(entry) });
  } catch (error: any) {
    console.error('Error creating finance entry:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan transaksi keuangan' },
      { status: 500 }
    );
  }
}
