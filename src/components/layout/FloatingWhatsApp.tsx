'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
}

export default function FloatingWhatsApp({
  whatsappNumber = '6285770187018',
}: FloatingWhatsAppProps) {
  return (
    <motion.aside
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.6 }}
      aria-label="Floating WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end"
    >
      <motion.a
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          y: {
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut',
          },
        }}
        href={`https://wa.me/${whatsappNumber}?text=Halo%20Aurvella%20Florist,%20saya%20ingin%20konsultasi%20pemesanan%20standing%20flower`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-xl shadow-[#25D366]/35 hover:bg-[#20bd5a] transition-colors cursor-pointer"
        aria-label="Chat WhatsApp Admin"
      >
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wide pr-1">
          Chat WhatsApp
        </span>
        <div className="relative">
          <Phone className="w-5 h-5 fill-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
        </div>
      </motion.a>
    </motion.aside>
  );
}
