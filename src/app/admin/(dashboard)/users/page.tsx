import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import UserManagementClient from './UserManagementClient';

export const metadata = {
  title: 'Manajemen User - Aurvella Florist Admin',
  description: 'Kelola akun pengguna, administrator, dan akses dashboard Aurvella Florist',
};

export default async function UsersManagementPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
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

  const serializedUsers = users.map((u) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }));

  return (
    <UserManagementClient
      initialUsers={serializedUsers}
      currentUserId={admin.id}
    />
  );
}
