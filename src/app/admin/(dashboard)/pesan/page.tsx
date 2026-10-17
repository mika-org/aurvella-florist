import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import MessageManagementClient from './MessageManagementClient';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminMessagesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const serializedMessages = messages.map((m) => ({
    id: m.id,
    name: m.name,
    whatsapp: m.whatsapp,
    email: m.email,
    subject: m.subject,
    message: m.message,
    status: m.status,
    createdAt: m.createdAt.toISOString(),
  }));

  return <MessageManagementClient initialMessages={serializedMessages} />;
}
