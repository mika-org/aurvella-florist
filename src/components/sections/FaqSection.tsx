'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface FaqSectionProps {
  faqs: FaqItem[];
  whatsappNumber?: string;
}

export default function FaqSection({
  faqs,
  whatsappNumber = '6285770187018',
}: FaqSectionProps) {
  // First item open by default
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <section className="py-20 lg:py-24 bg-[#FAF6F8] relative overflow-hidden" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      {/* Decorative floral glow with motion */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#F8B4C4]/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-[#DFB758]/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F8B4C4] text-[#B83253] text-xs font-bold tracking-wide mb-3 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2D2527] tracking-wide">
            Pertanyaan yang Sering Diajukan
          </h2>

          <p className="text-sm sm:text-base text-[#6B5A60] mt-3 leading-relaxed">
            Semua hal yang perlu Anda ketahui tentang pemesanan standing flower, garansi bunga segar, dan pengiriman kilat di Bandung.
          </p>
        </motion.div>

        {/* Accordion FAQ List with Framer Motion AnimatePresence */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`rounded-2xl transition-colors duration-300 border overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#B83253]/40 shadow-lg shadow-[#B83253]/5'
                    : 'bg-white/80 hover:bg-white border-[#EFE4E7] shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-[#B83253] text-white shadow-xs'
                          : 'bg-[#FAF3F5] text-[#8E6D14]'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-base sm:text-lg font-bold transition-colors ${
                        isOpen ? 'text-[#B83253]' : 'text-[#2D2527]'
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-[#B83253] text-white'
                        : 'bg-[#FAF3F5] text-[#7A6D72]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Answer Content with smooth height and opacity animation */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`content-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-[#5C4D52] leading-relaxed border-t border-[#F8E8EC] mt-1">
                        <p className="whitespace-pre-line">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Help CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white via-[#FFF8FA] to-white border border-[#F5D5DE] shadow-sm text-center w-full flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-left">
            <span className="font-bold text-base text-[#2D2527] block">
              Punya pertanyaan khusus yang belum terjawab?
            </span>
            <span className="text-xs text-[#7A6D72] mt-0.5 block">
              Konsultasikan langsung dengan florist kami via WhatsApp (Layanan 24/7).
            </span>
          </div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={`https://wa.me/${whatsappNumber}?text=Halo%20Aurvella%20Florist,%20saya%20ingin%20bertanya%20tentang%20pemesanan%20standing%20flower`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-md shadow-[#25D366]/25 transition-all shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Tanya via WhatsApp</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
