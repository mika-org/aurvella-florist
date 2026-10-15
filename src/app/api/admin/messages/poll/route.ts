import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [latestMessage, unreadCount] = await Promise.all([
      prisma.contactMessage.findFirst({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count({
        where: { status: 'NEW' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      unreadCount,
      latestMessage: latestMessage
        ? {
            id: latestMessage.id,
            name: latestMessage.name,
            whatsapp: latestMessage.whatsapp,
            subject: latestMessage.subject,
            message: latestMessage.message,
            status: latestMessage.status,
            createdAt: latestMessage.createdAt.toISOString(),
          }
        : null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to poll messages' },
      { status: 500 }
    );
  }
}
