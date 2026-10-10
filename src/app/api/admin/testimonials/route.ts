import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { testimonialSchema } from '@/lib/validations';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parseResult = testimonialSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const created = await prisma.testimonial.create({
      data: parseResult.data,
    });

    return NextResponse.json({ success: true, testimonial: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menyimpan testimoni' }, { status: 500 });
  }
}
