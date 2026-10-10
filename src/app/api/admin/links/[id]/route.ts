import { NextRequest, NextResponse } from 'next/server';
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
    return NextResponse.json({ success: true, message: 'Link berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal menghapus link' }, { status: 500 });
  }
}
