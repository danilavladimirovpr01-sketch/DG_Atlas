'use client';

import { useState, useEffect, useRef } from 'react';
import { useTma } from '@/lib/tma-context';
import { Input } from '@/components/ui/input';
import { ArrowRight, Loader2 } from 'lucide-react';

/* ── Slide-to-confirm ── */
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
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const [confirmed, setConfirmed] = useState(false);
  const [, forceRender] = useState(0);

  const THUMB = 56;
  const PAD = 4;

  function getMax() {
    if (!trackRef.current) return 200;
    return trackRef.current.offsetWidth - THUMB - PAD * 2;
  }

  function updateThumb(x: number) {
    currentX.current = Math.max(0, Math.min(x, getMax()));
    if (thumbRef.current) {
      thumbRef.current.style.left = `${PAD + currentX.current}px`;
      thumbRef.current.style.transition = 'none';
    }
  }

  function snapBack() {
    currentX.current = 0;
    if (thumbRef.current) {
      thumbRef.current.style.transition = 'left 0.4s cubic-bezier(0.32,0.72,0,1)';
      thumbRef.current.style.left = `${PAD}px`;
    }
  }

  function snapEnd() {
    const max = getMax();
    currentX.current = max;
    if (thumbRef.current) {
      thumbRef.current.style.transition = 'left 0.2s ease-out';
      thumbRef.current.style.left = `${PAD + max}px`;
    }
  }

  /* Touch events on thumb */
  function onTouchStart(e: React.TouchEvent) {
    if (loading || disabled || confirmed) return;
    e.stopPropagation();
    dragging.current = true;
    startX.current = e.touches[0].clientX - currentX.current;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return;
    e.stopPropagation();
    const x = e.touches[0].clientX - startX.current;
    updateThumb(x);
    forceRender((n) => n + 1);
  }

  function onTouchEnd() {
    if (!dragging.current) return;
    dragging.current = false;
    if (currentX.current > getMax() * 0.75) {
      snapEnd();
      setConfirmed(true);
      onConfirm();
    } else {
      snapBack();
    }
    forceRender((n) => n + 1);
  }

  /* Mouse events (for desktop testing) */
  function onMouseDown(e: React.MouseEvent) {
    if (loading || disabled || confirmed) return;
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX - currentX.current;

    function onMouseMove(ev: MouseEvent) {
      if (!dragging.current) return;
      updateThumb(ev.clientX - startX.current);
      forceRender((n) => n + 1);
    }

    function onMouseUp() {
      if (!dragging.current) return;
      dragging.current = false;
      if (currentX.current > getMax() * 0.75) {
        snapEnd();
        setConfirmed(true);
        onConfirm();
      } else {
        snapBack();
      }
      forceRender((n) => n + 1);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  /* Reset */
  useEffect(() => {
    if (!loading && !confirmed) {
      snapBack();
    }
  }, [loading]);

  const progress = getMax() > 0 ? currentX.current / getMax() : 0;
  const isDisabledVisual = disabled && !loading;

  return (
    <div
      ref={trackRef}
      className="relative rounded-full overflow-hidden select-none"
      style={{
        height: THUMB + PAD * 2,
        padding: PAD,
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        opacity: isDisabledVisual ? 0.4 : 1,
        transition: 'opacity 0.3s',
      }}
    >
      {/* Label */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: loading || confirmed ? 0 : Math.max(0, 1 - progress * 2) }}
      >
        <span style={{ color: '#666', fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em' }}>
          {isDisabledVisual ? 'Введите номер' : 'Свайпните для входа'}
        </span>
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
        </div>
      )}

      {/* Thumb */}
      {!loading && (
        <div
          ref={thumbRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          style={{
            position: 'absolute',
            top: PAD,
            left: PAD,
            width: THUMB,
            height: THUMB,
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: disabled ? 'not-allowed' : 'grab',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            zIndex: 10,
            touchAction: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
          }}
        >
          <ArrowRight
            style={{ width: 24, height: 24, color: '#000', strokeWidth: 2.5 }}
          />
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
