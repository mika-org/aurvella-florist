'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';

interface PromoCountdownProps {
  targetDate: string | Date | null | undefined;
  variant?: 'banner' | 'card' | 'badge';
  onExpire?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeRemaining(targetDate: string | Date): TimeRemaining {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const total = target - now;

  if (isNaN(total) || total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, total };
}

export default function PromoCountdown({
  targetDate,
  variant = 'card',
  onExpire,
}: PromoCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    if (!targetDate) return;

    const initial = calculateTimeRemaining(targetDate);
    setTimeLeft(initial);

    if (initial.total <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(targetDate);
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  // If no target date, or time has expired: auto-hide completely!
  if (!targetDate || !timeLeft || timeLeft.total <= 0) {
    return null;
  }

  const padZero = (n: number) => String(n).padStart(2, '0');

  // Variant: Banner (Compact & Aesthetic Ribbon/Capsule for Hero Banner - Doesn't waste space)
  if (variant === 'banner') {
    return (
      <div className="inline-flex items-center gap-2.5 sm:gap-3 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/45 backdrop-blur-md border border-[#DFB758]/60 shadow-lg shadow-black/25 text-white">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#DFB758] tracking-wide shrink-0">
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB758] animate-pulse" />
          <span className="uppercase text-[10px] sm:text-[11px] font-extrabold tracking-wider">
            Promo Terbatas
          </span>
        </div>

        <span className="h-3 w-[1px] bg-white/20" />

        <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-extrabold">
          {timeLeft.days > 0 && (
            <>
              <span className="bg-white/15 px-1.5 py-0.5 rounded text-white min-w-[20px] text-center">
                {padZero(timeLeft.days)}
              </span>
              <span className="text-[10px] text-white/60 font-sans">h</span>
              <span className="text-white/40">:</span>
            </>
          )}
          <span className="bg-white/15 px-1.5 py-0.5 rounded text-white min-w-[20px] text-center">
            {padZero(timeLeft.hours)}
          </span>
          <span className="text-[10px] text-white/60 font-sans">j</span>
          <span className="text-white/40">:</span>
          <span className="bg-white/15 px-1.5 py-0.5 rounded text-white min-w-[20px] text-center">
            {padZero(timeLeft.minutes)}
          </span>
          <span className="text-[10px] text-white/60 font-sans">m</span>
          <span className="text-white/40">:</span>
          <span className="bg-[#B83253] text-[#FDE2E8] px-1.5 py-0.5 rounded min-w-[20px] text-center shadow-xs">
            {padZero(timeLeft.seconds)}
          </span>
          <span className="text-[10px] text-[#DFB758] font-sans">d</span>
        </div>
      </div>
    );
  }

  // Variant: Badge (Sleek Compact pill for Product Detail Page)
  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F4] border border-[#F8B4C4] text-[#B83253] text-xs font-mono font-bold shadow-xs">
        <Flame className="w-3.5 h-3.5 text-[#B83253] animate-pulse" />
        <span className="tracking-tight">
          Berakhir:{' '}
          {timeLeft.days > 0 && `${timeLeft.days}h `}
          {padZero(timeLeft.hours)}:{padZero(timeLeft.minutes)}:{padZero(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  // Variant: Card (Ultra-compact floating pill for ProductCard - doesn't block photo)
  return (
    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold shadow-md border border-white/20">
      <Flame className="w-3 h-3 text-[#DFB758] animate-pulse" />
      <span className="tracking-tight">
        {timeLeft.days > 0 && `${timeLeft.days}h `}
        {padZero(timeLeft.hours)}:{padZero(timeLeft.minutes)}:{padZero(timeLeft.seconds)}
      </span>
    </div>
  );
}
