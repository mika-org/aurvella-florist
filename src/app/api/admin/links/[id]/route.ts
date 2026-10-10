import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { socialLinkSchema } from '@/lib/validations';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const parseResult = socialLinkSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validasi link gagal', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.socialLink.update({
      where: { id },
      data: parseResult.data,
    });

    // Auto-sync back to siteSettings if it is a major social channel
    if (updated.type === 'INSTAGRAM') {
      await prisma.siteSetting.upsert({
        where: { key: 'instagram_url' },
        update: { value: updated.url },
        create: { key: 'instagram_url', value: updated.url },
      });
    } else if (updated.type === 'SHOPEE') {
      await prisma.siteSetting.upsert({
        where: { key: 'shopee_url' },
        update: { value: updated.url },
        create: { key: 'shopee_url', value: updated.url },
      });
    } else if (updated.type === 'TIKTOK') {
      await prisma.siteSetting.upsert({
        where: { key: 'tiktok_url' },
        update: { value: updated.url },
        create: { key: 'tiktok_url', value: updated.url },
      });
    }

    revalidatePath('/', 'layout');
    revalidatePath('/link');
    revalidatePath('/admin/pengaturan');
    revalidatePath('/admin/link');

    return NextResponse.json({ success: true, link: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal update link' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.socialLink.delete({ where: { id } });

    revalidatePath('/', 'layout');
    revalidatePath('/link');
    revalidatePath('/admin/pengaturan');
    revalidatePath('/admin/link');

    return NextResponse.json({ success: true, message: 'Link berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal menghapus link' }, { status: 500 });
  }
}
