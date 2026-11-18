import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getCurrentAdmin,
  hashPassword,
  signAdminToken,
  TOKEN_COOKIE_NAME,
} from '@/lib/auth';
import { userUpdateSchema } from '@/lib/validations';

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

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsed = userUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ||
        'Data pembaruan user tidak valid';
      return NextResponse.json(
        { error: firstError, details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, username, email, password, role } = parsed.data;

    const duplicateUsername = await prisma.user.findFirst({
      where: {
        username,
        id: { not: id },
      },
    });
    if (duplicateUsername) {
      return NextResponse.json(
        { error: `Username "${username}" sudah digunakan oleh akun lain.` },
        { status: 400 }
      );
    }

    const duplicateEmail = await prisma.user.findFirst({
      where: {
        email,
        id: { not: id },
      },
    });
    if (duplicateEmail) {
      return NextResponse.json(
        { error: `Email "${email}" sudah terdaftar pada akun lain.` },
        { status: 400 }
      );
    }

    const updateData: {
      name: string;
      username: string;
      email: string;
      role: string;
      password?: string;
    } = {
      name,
      username,
      email,
      role,
    };

    if (password && password.trim().length > 0) {
      updateData.password = await hashPassword(password.trim());
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });

    // If the logged-in admin updated their own profile, refresh the JWT cookie
    if (id === admin.id) {
      const newToken = await signAdminToken({
        id: updated.id,
        username: updated.username,
        email: updated.email,
        name: updated.name,
      });

      response.cookies.set({
        name: TOKEN_COOKIE_NAME,
        value: newToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memperbarui data user' },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (id === admin.id) {
      return NextResponse.json(
        {
          error:
            'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif login.',
        },
        { status: 400 }
      );
    }

    const totalUsers = await prisma.user.count();
    if (totalUsers <= 1) {
      return NextResponse.json(
        {
          error:
            'Tidak dapat menghapus satu-satunya akun pengelola yang tersisa di sistem.',
        },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menghapus user' },
      { status: 500 }
    );
  }
}
