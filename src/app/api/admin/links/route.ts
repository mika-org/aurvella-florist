import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { socialLinkSchema } from '@/lib/validations';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const links = await prisma.socialLink.findMany({
    orderBy: { order: 'asc' },
  });

  return NextResponse.json({ links });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parseResult = socialLinkSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validasi link gagal', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const created = await prisma.socialLink.create({
      data: parseResult.data,
    });

    if (created.type === 'INSTAGRAM') {
      await prisma.siteSetting.upsert({
        where: { key: 'instagram_url' },
        update: { value: created.url },
        create: { key: 'instagram_url', value: created.url },
      });
    } else if (created.type === 'SHOPEE') {
      await prisma.siteSetting.upsert({
        where: { key: 'shopee_url' },
        update: { value: created.url },
        create: { key: 'shopee_url', value: created.url },
      });
    } else if (created.type === 'TIKTOK') {
      await prisma.siteSetting.upsert({
        where: { key: 'tiktok_url' },
        update: { value: created.url },
        create: { key: 'tiktok_url', value: created.url },
      });
    }

    revalidatePath('/', 'layout');
    revalidatePath('/link');
    revalidatePath('/admin/pengaturan');
    revalidatePath('/admin/link');

    return NextResponse.json({ success: true, link: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menyimpan link' }, { status: 500 });
  }
}
