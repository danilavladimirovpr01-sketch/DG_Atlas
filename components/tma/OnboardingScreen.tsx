'use client';

import { useState, useEffect } from 'react';
import { useTma } from '@/lib/tma-context';
import { Input } from '@/components/ui/input';
import { ArrowRight, Loader2 } from 'lucide-react';

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
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
      const res = await fetch(`${base}/api/tma/onboarding`, {
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

      // Save JWT token for Laravel API calls
      if (data.token) {
        localStorage.setItem('jwt_token', data.token);
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

            <button
              onClick={handleSubmit}
              disabled={!isPhoneValid || loading}
              className="w-full h-14 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: isPhoneValid && !loading ? '#fff' : '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.08)',
                opacity: !isPhoneValid && !loading ? 0.4 : 1,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      color: isPhoneValid ? '#000' : '#666',
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    Войти
                  </span>
                  <ArrowRight
                    style={{
                      width: 18,
                      height: 18,
                      color: isPhoneValid ? '#000' : '#666',
                    }}
                  />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
