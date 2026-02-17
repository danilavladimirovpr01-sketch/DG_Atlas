import { NextRequest, NextResponse } from 'next/server';
import { validateTelegramInitData, parseTelegramUser } from '@/lib/telegram/validate';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json();

    if (!initData) {
      return NextResponse.json({ error: 'initData is required' }, { status: 400 });
    }

    // Validate Telegram signature
    const { valid, data } = validateTelegramInitData(initData);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid initData signature' }, { status: 401 });
    }

    // Parse Telegram user
    const telegramUser = parseTelegramUser(data);
    if (!telegramUser) {
      return NextResponse.json({ error: 'Cannot parse user data' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Check if user already exists by telegram_id
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, phone, full_name')
      .eq('telegram_id', telegramUser.id)
      .single();

    if (existingProfile && existingProfile.phone) {
      // Sync name from Telegram
      const tgName = [telegramUser.firstName, telegramUser.lastName].filter(Boolean).join(' ');
      if (tgName && existingProfile.full_name !== tgName) {
        await supabase
          .from('profiles')
          .update({ full_name: tgName })
          .eq('id', existingProfile.id);
        existingProfile.full_name = tgName;
      }

      // Check if they have a project
      const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', existingProfile.id)
        .single();

      return NextResponse.json({
        status: 'authenticated',
        profile: existingProfile,
        project,
        telegramUser,
      });
    }

    if (existingProfile && !existingProfile.phone) {
      // Profile exists but not onboarded — need phone
      return NextResponse.json({
        status: 'needs_onboarding',
        profileId: existingProfile.id,
        telegramUser,
      });
    }

    // New user — needs onboarding
    return NextResponse.json({
      status: 'needs_onboarding',
      telegramUser,
    });
  } catch (error) {
    console.error('TMA auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
