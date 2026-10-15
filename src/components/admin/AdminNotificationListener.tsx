'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, MessageSquare, X, ArrowRight, Phone } from 'lucide-react';

interface LatestMessage {
  id: string;
  name: string;
  whatsapp: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminNotificationListener() {
  const router = useRouter();
  const [activeNotification, setActiveNotification] = useState<LatestMessage | null>(null);
  const lastKnownIdRef = useRef<string | null>(null);
  const audioUnlockedRef = useRef<boolean>(false);
  const initialLoadRef = useRef<boolean>(true);

  // Play a pleasant chime using Web Audio API
  const playNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Note 1: E5 (659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.3, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.45);

      // Note 2: B5 (987.77 Hz) - chime sparkle
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0, now + 0.12);
      gain2.gain.linearRampToValueAtTime(0.4, now + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.9);
    } catch (e) {
      console.warn('AudioContext playback error (waiting for interaction):', e);
    }
  };

  // Unlock AudioContext on first user click anywhere
  useEffect(() => {
    const unlockAudio = () => {
      audioUnlockedRef.current = true;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const dummy = new AudioCtx();
          dummy.resume();
        }
      } catch (e) {}
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const checkMessages = async () => {
      try {
        const res = await fetch('/api/admin/messages/poll', { cache: 'no-store' });
        if (!res.ok) return;

        const data = await res.json();
        if (data.success && data.latestMessage) {
          const msg = data.latestMessage as LatestMessage;

          if (initialLoadRef.current) {
            // First load: just memorize the latest ID without dinging
            lastKnownIdRef.current = msg.id;
            initialLoadRef.current = false;
          } else if (msg.id !== lastKnownIdRef.current) {
            // New message arrived!
            lastKnownIdRef.current = msg.id;
            setActiveNotification(msg);
            playNotificationSound();
          }
        }
      } catch (err) {
        // silent fail on network hiccups
      }
    };

    // Initial check
    checkMessages();

    // Poll every 5 seconds
    timer = setInterval(checkMessages, 5000);

    return () => clearInterval(timer);
  }, []);

  if (!activeNotification) return null;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#B83253] p-4 text-[#2D2527] ring-4 ring-[#B83253]/15 transition-all">
        {/* Header Notification */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F0E4E7]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FFF0F4] text-[#B83253] flex items-center justify-center animate-bounce">
              <Bell className="w-4 h-4 fill-[#B83253]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B83253]">
              Pesan Baru Masuk!
            </span>
          </div>

          <button
            onClick={() => setActiveNotification(null)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sender details */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#2D2527] truncate">
              {activeNotification.name}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">
              {new Date(activeNotification.createdAt).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#8E6D14] font-medium">
            <Phone className="w-3 h-3 text-[#25D366]" />
            <span>{activeNotification.whatsapp}</span>
          </div>

          <div className="text-xs font-semibold text-[#4A3E42] mt-1 line-clamp-1">
            {activeNotification.subject}
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 bg-[#FAF8F8] p-2 rounded-lg border border-[#F0E4E7] mt-1 italic">
            &ldquo;{activeNotification.message}&rdquo;
          </p>
        </div>

        {/* Action Button: Directly go to Pesan Masuk */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              setActiveNotification(null);
              router.push('/admin/pesan');
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#B83253] to-[#DF4D73] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#B83253]/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Buka Halaman Pesan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={`https://wa.me/${activeNotification.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(
              activeNotification.name
            )},%20terima%20kasih%20telah%20menghubungi%20Aurvella%20Florist.`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm hover:bg-[#20bd5a] transition-all"
            title="Balas via WhatsApp"
          >
            <Phone className="w-3.5 h-3.5 fill-white" />
            <span>Balas WA</span>
          </a>
        </div>
      </div>
    </div>
  );
}
