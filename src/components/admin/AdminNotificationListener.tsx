'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, BellRing, MessageSquare, X, ArrowRight, Phone, Volume2 } from 'lucide-react';

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
  const [permissionState, setPermissionState] = useState<NotificationPermission | 'unsupported'>('default');
  const [showPermissionBanner, setShowPermissionBanner] = useState<boolean>(false);
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

  // Check notification permission state
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionState(Notification.permission);
      if (Notification.permission === 'default') {
        setShowPermissionBanner(true);
      }
    } else {
      setPermissionState('unsupported');
    }
  }, []);

  const requestDesktopPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPermissionState(res);
        setShowPermissionBanner(false);
        if (res === 'granted') {
          playNotificationSound();
          new Notification('Notifikasi Diaktifkan! ✨', {
            body: 'Anda akan menerima notifikasi desktop saat ada pesan baru masuk.',
            icon: '/logo.png',
          });
        }
      } catch (e) {
        console.error('Error requesting notification permission:', e);
      }
    }
  };

  // Unlock AudioContext on first user interaction anywhere
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
        if (data.success) {
          // Broadcast unread count to AdminSidebar
          if (typeof window !== 'undefined' && typeof data.unreadCount === 'number') {
            window.dispatchEvent(
              new CustomEvent('aurvella:unread-messages', {
                detail: { unreadCount: data.unreadCount },
              })
            );
          }

          if (data.latestMessage) {
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

              // Trigger Desktop notification if permission granted
              if (
                typeof window !== 'undefined' &&
                'Notification' in window &&
                Notification.permission === 'granted'
              ) {
                try {
                  const notification = new Notification(`Pesan Baru: ${msg.name}`, {
                    body: `${msg.subject} - "${msg.message.slice(0, 80)}..."`,
                    icon: '/logo.png',
                  });
                  notification.onclick = () => {
                    window.focus();
                    router.push('/admin/pesan');
                  };
                } catch (notifErr) {
                  console.error('Desktop notification error:', notifErr);
                }
              }
            }
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
  }, [router]);

  return (
    <div className="fixed top-4 right-4 sm:top-5 sm:right-5 z-50 flex flex-col gap-3 max-w-[calc(100vw-2rem)] sm:max-w-sm w-full pointer-events-none">
      {/* Permission prompt banner in Top Right Corner */}
      {showPermissionBanner && permissionState === 'default' && (
        <div className="pointer-events-auto bg-[#1A1416]/95 backdrop-blur-md text-white border-2 border-[#DFB758] p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-3 duration-300 ring-4 ring-[#DFB758]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#DFB758]/20 flex items-center justify-center shrink-0">
              <BellRing className="w-4 h-4 text-[#DFB758]" />
            </div>
            <div>
              <p className="font-semibold text-white">Aktifkan Notifikasi Desktop?</p>
              <p className="text-[11px] text-white/70">Dapatkan bunyi & pemberitahuan instan saat ada pesan baru.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={requestDesktopPermission}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#DFB758] to-[#F5DE9C] hover:opacity-95 text-[#1A1416] font-extrabold text-xs transition-all shadow-sm"
            >
              Izinkan
            </button>
            <button
              type="button"
              onClick={() => setShowPermissionBanner(false)}
              className="p-1 rounded-lg text-white/50 hover:text-white transition-colors"
              aria-label="Tutup Banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Pop-up Toast for Incoming Messages */}
      {activeNotification && (
        <div className="pointer-events-auto w-full animate-in slide-in-from-top-4 fade-in duration-300">
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

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={playNotificationSound}
                  className="text-gray-400 hover:text-[#B83253] p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Tes Bunyi Chime"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNotification(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Tutup Notifikasi"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
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

            {/* Action Buttons: Direct Link & WhatsApp */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setActiveNotification(null);
                  router.push('/admin/pesan');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#B83253] to-[#DF4D73] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#B83253]/20 hover:opacity-95 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Buka Pesan</span>
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
      )}
    </div>
  );
}
