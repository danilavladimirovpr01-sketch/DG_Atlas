import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'https://lk.shaleika.fvds.ru';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { phone, telegramId, firstName, lastName } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Введите номер телефона' }, { status: 400 });
    }

    const normalizedPhone = phone.replace(/[\s\-()]/g, '');

    // Call Laravel auth/login
    const loginRes = await fetch(`${LARAVEL_API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        phone: normalizedPhone,
        telegram_id: telegramId != null ? String(telegramId) : undefined,
        first_name: firstName,
        last_name: lastName,
      }),
    });

    const loginData = await loginRes.json();

    if (!loginRes.ok || !loginData.success) {
      const msg = loginData.message || loginData.error || 'Номер не найден в системе';
      return NextResponse.json({ error: msg }, { status: loginRes.status });
    }

    const token = loginData.token || loginData.access_token || loginData.data?.token;

    // Fetch profile using the JWT
    const profileRes = await fetch(`${LARAVEL_API}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    let profile = null;
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      profile = profileData.data || profileData;
    }

    return NextResponse.json({
      status: 'authenticated',
      token,
      profile: profile || {
        full_name: [firstName, lastName].filter(Boolean).join(' ') || 'Клиент',
      },
      project: null,
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
