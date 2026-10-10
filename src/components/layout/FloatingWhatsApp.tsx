'use client';

import React from 'react';
import { Phone } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
}

export default function FloatingWhatsApp({
  whatsappNumber = '6285770187018',
}: FloatingWhatsAppProps) {
  return (
    <aside aria-label="Floating WhatsApp" className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      <a
        href={`https://wa.me/${whatsappNumber}?text=Halo%20Aurvella%20Florist,%20saya%20ingin%20konsultasi%20pemesanan%20standing%20flower`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Chat WhatsApp Admin"
      >
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wide pr-1">
          Chat WhatsApp
        </span>
        <div className="relative">
          <Phone className="w-5 h-5 fill-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
        </div>
      </a>
    </aside>
  );
}
