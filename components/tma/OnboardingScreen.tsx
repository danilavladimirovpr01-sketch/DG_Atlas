'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTma } from '@/lib/tma-context';
import { Input } from '@/components/ui/input';
import { ArrowRight, Loader2 } from 'lucide-react';

/* ── Slide-to-confirm component ── */
function SlideToConfirm({
  onConfirm,
  loading,
  disabled,
}: {
  onConfirm: () => void;
  loading: boolean;
  disabled: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const thumbSize = 56;
  const padding = 4;

  const getMaxX = useCallback(() => {
    if (!trackRef.current) return 200;
    return trackRef.current.offsetWidth - thumbSize - padding * 2;
  }, []);

  /* Reset on loading change */
  useEffect(() => {
    if (!loading) {
      setConfirmed(false);
      setDragX(0);
    }
  }, [loading]);

  function handleStart(clientX: number) {
    if (loading || disabled) return;
    setIsDragging(true);
  }

  function handleMove(clientX: number) {
    if (!isDragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left - padding - thumbSize / 2;
    const maxX = getMaxX();
    setDragX(Math.max(0, Math.min(x, maxX)));
  }

  function handleEnd() {
    if (!isDragging) return;
    setIsDragging(false);
    const maxX = getMaxX();
    if (dragX > maxX * 0.85) {
      setDragX(maxX);
      setConfirmed(true);
      onConfirm();
    } else {
      setDragX(0);
    }
  }

  /* Touch handlers */
  function onTouchStart(e: React.TouchEvent) {
    handleStart(e.touches[0].clientX);
  }
  function onTouchMove(e: React.TouchEvent) {
    handleMove(e.touches[0].clientX);
  }
  function onTouchEnd() {
    handleEnd();
  }

  /* Mouse handlers */
  function onMouseDown(e: React.MouseEvent) {
    handleStart(e.clientX);
  }

  useEffect(() => {
    if (!isDragging) return;
    function onMouseMove(e: MouseEvent) {
      handleMove(e.clientX);
    }
    function onMouseUp() {
      handleEnd();
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });

  const progress = getMaxX() > 0 ? dragX / getMaxX() : 0;

  return (
    <div
      ref={trackRef}
      className="relative h-16 rounded-full bg-[#1a1a1a] border border-white/[0.08] overflow-hidden select-none"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)', padding }}
    >
      {/* Animated gradient fill */}
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-200"
        style={{
          opacity: progress * 0.3,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 100%)',
        }}
      />

      {/* Label text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="text-[15px] font-medium tracking-tight transition-opacity duration-200"
          style={{
            color: '#555',
            opacity: confirmed || loading ? 0 : 1 - progress * 1.5,
          }}
        >
          {loading ? '' : 'Свайпните для входа'}
        </span>
        {loading && (
          <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
        )}
      </div>

      {/* Chevron hints */}
      {!loading && !confirmed && (
        <div className="absolute inset-0 flex items-center pointer-events-none" style={{ paddingLeft: thumbSize + padding + 12 }}>
          <div className="flex gap-1 items-center" style={{ opacity: Math.max(0, 0.15 - progress * 0.3) }}>
            <ArrowRight className="w-3.5 h-3.5 text-[#444]" />
            <ArrowRight className="w-3.5 h-3.5 text-[#333]" />
            <ArrowRight className="w-3.5 h-3.5 text-[#222]" />
          </div>
        </div>
      )}

      {/* Draggable thumb */}
      {!loading && (
        <div
          className="absolute top-1 w-[56px] h-[56px] rounded-full bg-white flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
          style={{
            left: padding + dragX,
            transition: isDragging ? 'none' : 'left 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
        >
          <ArrowRight className="w-6 h-6 text-black" strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}

/* ── Main screen ── */
export default function OnboardingScreen() {
  const { telegramUser, setProfile, setProject } = useTma();
  const [phone, setPhone] = useState('+7');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  function formatPhone(value: string) {
    const digits = value.replace(/[^\d+]/g, '');
    if (!digits.startsWith('+7')) return '+7';

    const rest = digits.slice(2);
    let formatted = '+7';
    if (rest.length > 0) formatted += ' (' + rest.slice(0, 3);
    if (rest.length >= 3) formatted += ') ' + rest.slice(3, 6);
    if (rest.length >= 6) formatted += '-' + rest.slice(6, 8);
    if (rest.length >= 8) formatted += '-' + rest.slice(8, 10);
    return formatted;
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setError('');
  }

  async function handleSubmit() {
    const digits = phone.replace(/[^\d]/g, '');
    if (digits.length !== 11) {
      setError('Введите корректный номер телефона');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tma/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '+' + digits,
          telegramId: telegramUser?.id,
          firstName: telegramUser?.firstName,
          lastName: telegramUser?.lastName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Что-то пошло не так');
        return;
      }

      setProfile(data.profile);
      setProject(data.project);
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  }

  const phoneDigits = phone.replace(/[^\d]/g, '');
  const isPhoneValid = phoneDigits.length === 11;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-black relative overflow-hidden">
      {/* Decorative background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] rounded-full border border-white/[0.03] absolute" />
        <div className="w-[300px] h-[300px] rounded-full border border-white/[0.04] absolute" />
        <div className="w-[200px] h-[200px] rounded-full border border-white/[0.05] absolute" />
      </div>

      {/* Logo */}
      <div
        className="relative z-10 flex flex-col items-center transition-all duration-700 ease-out"
        style={{
          transform: showForm ? 'translateY(-40px)' : 'translateY(0)',
        }}
      >
        <div
          className="w-24 h-24 rounded-full overflow-hidden mb-6 transition-all duration-700"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            transform: showForm ? 'scale(0.85)' : 'scale(1)',
          }}
        >
          <img
            src="/logo-dg.svg"
            alt="DomGazobeton"
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
          DG Atlas
        </h1>
        <p className="text-[#666] text-sm font-light">строительная платформа</p>
      </div>

      {/* Form */}
      <div
        className="relative z-10 w-full max-w-sm transition-all duration-700 ease-out"
        style={{
          opacity: showForm ? 1 : 0,
          transform: showForm ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <div className="mt-10 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Войдите в личный кабинет
            </h2>
            <p className="text-[#666] text-sm mt-2 font-light">
              Введите номер телефона, указанный в договоре
            </p>
          </div>

          <div className="space-y-4">
            <Input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+7 (___) ___-__-__"
              className="h-14 text-lg bg-[#1a1a1a] border-white/[0.08] text-white placeholder:text-[#444] text-center rounded-2xl focus:border-white/20 focus:ring-0"
              maxLength={18}
            />

            {error && (
              <p className="text-[#FF3B30] text-sm text-center">{error}</p>
            )}

            {/* Slide to confirm */}
            <SlideToConfirm
              onConfirm={handleSubmit}
              loading={loading}
              disabled={!isPhoneValid}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
