'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, Trash2, CheckCircle2, Clock, Search, MessageSquare, Bell, RefreshCw, Loader2 } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  subject: string;
  message: string;
  status: string; // NEW, READ, FOLLOWED_UP, COMPLETED
  createdAt: Date | string;
}

interface Props {
  initialMessages: ContactMessage[];
}

export default function MessageManagementClient({ initialMessages }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notifPermission, setNotifPermission] = useState<string>('default');
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/messages?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch immediately on client mount to ensure fresh data
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Sync if initialMessages changes from Server Component
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Listen to BroadcastChannel and window events for immediate update
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('aurvella_notifications');
        bc.onmessage = (event) => {
          if (event.data?.type === 'NEW_MESSAGE') {
            fetchMessages();
          }
        };
      } catch {}
    }

    const handleRefresh = () => {
      fetchMessages();
    };

    window.addEventListener('aurvella:refresh-messages', handleRefresh);
    window.addEventListener('aurvella:new-message', handleRefresh);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('aurvella:refresh-messages', handleRefresh);
      window.removeEventListener('aurvella:new-message', handleRefresh);
    };
  }, [fetchMessages]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const handleTestNotification = async () => {
    if (typeof window === 'undefined') return;

    // Play chime sound
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch {}

    if ('Notification' in window) {
      let perm = Notification.permission;
      if (perm === 'default') {
        perm = await Notification.requestPermission();
        setNotifPermission(perm);
      }
      if (perm === 'granted') {
        new Notification('🔔 Tes Notifikasi Berhasil!', {
          body: 'Notifikasi browser Aurvella Florist aktif & siap menerima pesan baru.',
          icon: '/logo.png',
        });
      } else if (perm === 'denied') {
        alert('Izin notifikasi diblokir di browser. Silakan aktifkan izin notifikasi di setelan browser Anda (ikon gembok di sebelah kiri address bar).');
      }
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Gagal update status');
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      router.refresh();
    } catch {
      alert('Gagal memperbarui status pesan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesan ini dari daftar?')) return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      setMessages((prev) => prev.filter((m) => m.id !== id));
      router.refresh();
    } catch {
      alert('Gagal menghapus pesan');
    }
  };

  const filtered = messages.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.whatsapp.includes(search) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D2527]">
            Pesan Masuk Pelanggan
          </h1>
          <p className="text-xs text-[#7A6D72] mt-1">
            Kelola pertanyaan, permintaan custom, dan tindak lanjuti langsung via WhatsApp
          </p>
        </div>

        <button
          type="button"
          onClick={handleTestNotification}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
            notifPermission === 'granted'
              ? 'bg-[#E8F8EE] border-[#25D366]/50 text-[#1F5133] hover:bg-[#D5F2DF]'
              : notifPermission === 'denied'
              ? 'bg-[#FEE2E2] border-[#EF4444]/50 text-[#991B1B]'
              : 'bg-white border-[#DFB758] text-[#8E6D14] hover:bg-[#FFFDF5]'
          }`}
          title="Klik untuk tes notifikasi browser & audio chime"
        >
          <Bell
            className={`w-4 h-4 ${
              notifPermission === 'granted'
                ? 'text-[#25D366] fill-[#25D366]'
                : notifPermission === 'denied'
                ? 'text-[#EF4444]'
                : 'text-[#DFB758] animate-bounce'
            }`}
          />
          <span>
            {notifPermission === 'granted'
              ? 'Notifikasi Browser Aktif (Tes)'
              : notifPermission === 'denied'
              ? 'Notifikasi Diblokir Browser'
              : 'Aktifkan Notifikasi Desktop'}
          </span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#F0E4E7] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8A7E82] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari nama, WhatsApp, atau isi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
            />
          </div>
          <button
            type="button"
            onClick={fetchMessages}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-[#E8D9DC] text-[#7A6D72] hover:text-[#B83253] hover:border-[#B83253] bg-[#FAF8F8] hover:bg-white transition-all cursor-pointer shrink-0 shadow-2xs"
            title="Muat Ulang Pesan Masuk"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#B83253]' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {['ALL', 'NEW', 'READ', 'FOLLOWED_UP', 'COMPLETED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#B83253] text-white'
                  : 'bg-[#FAF3F5] text-[#4A3E42] hover:bg-[#F5E6EB]'
              }`}
            >
              {st === 'ALL'
                ? 'Semua'
                : st === 'NEW'
                ? 'Baru'
                : st === 'READ'
                ? 'Dibaca'
                : st === 'FOLLOWED_UP'
                ? 'Diproses'
                : 'Selesai'}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Cards */}
      <div className="space-y-4">
        {filtered.map((msg) => {
          const cleanWa = msg.whatsapp.replace(/[^0-9]/g, '');
          const waUrl = `https://wa.me/${cleanWa}?text=Halo%20${encodeURIComponent(
            msg.name
          )},%20kami%20dari%20Aurvella%20Florist%20Bandung%20menindaklanjuti%20pesan%20Anda:%20"${encodeURIComponent(
            msg.subject
          )}"`;

          return (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${
                msg.status === 'NEW'
                  ? 'border-[#B83253] ring-1 ring-[#B83253]/20 bg-[#FFFDFE]'
                  : 'border-[#F0E4E7]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F5E6EA]">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-[#2D2527]">
                    {msg.name}
                  </span>
                  <span className="text-xs font-mono text-[#8E6D14] bg-[#FFF9ED] px-2 py-0.5 rounded border border-[#DFB758]/30">
                    {msg.whatsapp}
                  </span>
                  {msg.email && (
                    <span className="text-xs text-[#6B5E63] hidden md:inline">
                      ({msg.email})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#8A7E82]">
                    {new Date(msg.createdAt).toLocaleString('id-ID')}
                  </span>
                  <select
                    value={msg.status}
                    onChange={(e) => updateStatus(msg.id, e.target.value)}
                    className="text-xs font-semibold px-2 py-1 rounded-lg border border-[#E8D9DC] bg-[#FAF8F8] focus:outline-none"
                  >
                    <option value="NEW">🔴 Baru</option>
                    <option value="READ">🟡 Dibaca</option>
                    <option value="FOLLOWED_UP">🔵 Diproses</option>
                    <option value="COMPLETED">🟢 Selesai</option>
                  </select>
                </div>
              </div>

              {/* Subject & Body */}
              <div className="py-3">
                <h4 className="font-bold text-xs uppercase tracking-wide text-[#B83253] mb-1">
                  Subjek: {msg.subject}
                </h4>
                <p className="text-xs text-[#3D3135] leading-relaxed whitespace-pre-line bg-[#FAF8F8] p-3 rounded-xl border border-[#F5E6EA]">
                  {msg.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 fill-white" />
                  <span>Balas via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(msg.id)}
                  className="p-1.5 text-xs text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#E8D9DC]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#B83253]" />
                <p className="text-xs text-[#8A7E82]">Memuat pesan masuk...</p>
              </div>
            ) : (
              <p className="text-xs text-[#8A7E82]">Tidak ada pesan yang cocok.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
