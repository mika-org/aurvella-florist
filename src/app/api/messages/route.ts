import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { contactMessageSchema } from '@/lib/validations';

// Simple in-memory rate limiting map (IP -> timestamps)
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((time) => now - time < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Silakan tunggu 1 menit.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Check honeypot
    if (body.hpField && body.hpField.trim().length > 0) {
      return NextResponse.json({ error: 'Permintaan tidak sah' }, { status: 400 });
    }

    const validationResult = contactMessageSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validasi form gagal',
          issues: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, whatsapp, email, subject, message } = validationResult.data;

    const savedMessage = await prisma.contactMessage.create({
      data: {
        name,
        whatsapp,
        email: email || null,
        subject,
        message,
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      messageId: savedMessage.id,
    });
  } catch (error: any) {
    console.error('Error saving contact message:', error);
    return NextResponse.json(
      { error: 'Terjadi kegagalan server saat menyimpan pesan.' },
      { status: 500 }
    );
  }
}
