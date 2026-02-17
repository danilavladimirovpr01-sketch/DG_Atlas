'use client';

import { useState } from 'react';
import { useTma } from '@/lib/tma-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function OnboardingScreen() {
  const { telegramUser, setProfile, setProject } = useTma();
  const [phone, setPhone] = useState('+7');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function formatPhone(value: string) {
    // Keep only digits and +
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-black">
      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          DG Atlas
        </h1>
        <p className="text-zinc-500 text-sm text-center mt-1">строительная платформа</p>
      </div>

      {/* Form */}
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-medium text-white">
            Войдите в личный кабинет
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Введите номер телефона, указанный в договоре
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="+7 (___) ___-__-__"
            className="h-14 text-lg bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 text-center"
            maxLength={18}
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-14 text-lg bg-white text-black hover:bg-zinc-200 font-medium"
          >
            {loading ? 'Проверяем...' : 'Войти'}
          </Button>
        </div>
      </div>
    </div>
  );
}
