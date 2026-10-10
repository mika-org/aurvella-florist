'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

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

  return (
    <section className="py-20 lg:py-24 bg-[#FAF6F8] relative overflow-hidden" id="faq">
      {/* Decorative floral glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#F8B4C4]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#DFB758]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F8B4C4] text-[#B83253] text-xs font-bold tracking-wide mb-3 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2527] tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>

          <p className="text-sm sm:text-base text-[#6B5A60] mt-3 leading-relaxed">
            Semua hal yang perlu Anda ketahui tentang pemesanan standing flower, garansi bunga segar, dan pengiriman kilat di Bandung.
          </p>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
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
                      className={`font-serif text-base sm:text-lg font-bold transition-colors ${
                        isOpen ? 'text-[#B83253]' : 'text-[#2D2527]'
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#B83253] text-white rotate-180'
                        : 'bg-[#FAF3F5] text-[#7A6D72]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-1 text-sm text-[#5C4D52] leading-relaxed border-t border-[#F8E8EC] mt-1">
                      <p className="whitespace-pre-line">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Help CTA */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white via-[#FFF8FA] to-white border border-[#F5D5DE] shadow-sm text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="font-serif font-bold text-base text-[#2D2527] block">
              Punya pertanyaan khusus yang belum terjawab?
            </span>
            <span className="text-xs text-[#7A6D72] mt-0.5 block">
              Konsultasikan langsung dengan florist kami via WhatsApp (Layanan 24/7).
            </span>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=Halo%20Aurvella%20Florist,%20saya%20ingin%20bertanya%20tentang%20pemesanan%20standing%20flower`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-md shadow-[#25D366]/25 transition-all hover:scale-105 shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Tanya via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
