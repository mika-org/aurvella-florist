import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await prisma.siteSetting.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return NextResponse.json({ settings: settingsMap });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json(); // Record<string, string>

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    // Auto-sync social links in Bio Link Tree
    if (body.instagram_url) {
      await prisma.socialLink.updateMany({
        where: { type: 'INSTAGRAM' },
        data: { url: body.instagram_url },
      });
    }

    if (body.shopee_url) {
      await prisma.socialLink.updateMany({
        where: { type: 'SHOPEE' },
        data: { url: body.shopee_url },
      });
    }

    if (body.tiktok_url) {
      await prisma.socialLink.updateMany({
        where: { type: 'TIKTOK' },
        data: { url: body.tiktok_url },
      });
    }

    if (body.whatsapp_international) {
      const waUrl = `https://wa.me/${body.whatsapp_international}?text=Halo%20Aurvella%20Florist,%20saya%20ingin%20tanya%20standing%20flower`;
      await prisma.socialLink.updateMany({
        where: { type: 'WHATSAPP' },
        data: { url: waUrl },
      });
    }

    // Instant cache invalidation
    revalidatePath('/', 'layout');
    revalidatePath('/link');
    revalidatePath('/admin/pengaturan');
    revalidatePath('/admin/link');

    return NextResponse.json({
      success: true,
      message: 'Pengaturan website berhasil disimpan dan disinkronkan',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan pengaturan' },
      { status: 500 }
    );
  }
}
