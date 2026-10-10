import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const faqs = await prisma.faq.findMany({
    orderBy: { order: 'asc' },
  });

  return NextResponse.json({ faqs });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { question, answer, order = 0, isActive = true } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Pertanyaan dan jawaban wajib diisi' },
        { status: 400 }
      );
    }

    const created = await prisma.faq.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        order: Number(order) || 0,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ success: true, faq: created });
  } catch (error: any) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menambahkan FAQ' },
      { status: 500 }
    );
  }
}
