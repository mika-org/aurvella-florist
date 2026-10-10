import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import MessageManagementClient from './MessageManagementClient';


export default async function AdminMessagesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <MessageManagementClient initialMessages={messages} />;
}
