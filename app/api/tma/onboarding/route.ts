import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, telegramId, firstName, lastName } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Введите номер телефона' },
        { status: 400 }
      );
    }

    // Normalize phone: remove spaces, dashes
    const normalizedPhone = phone.replace(/[\s\-()]/g, '');
    const tgId = telegramId ? String(telegramId) : null;

    const supabase = createServiceRoleClient();

    // If we have a telegram_id, check it's not already linked to another profile
    if (tgId) {
      const { data: alreadyLinked } = await supabase
        .from('profiles')
        .select('id, phone')
        .eq('telegram_id', tgId)
        .single();

      if (alreadyLinked && alreadyLinked.phone && alreadyLinked.phone !== normalizedPhone) {
        return NextResponse.json(
          { error: 'Этот Telegram аккаунт уже привязан к другому номеру' },
          { status: 400 }
        );
      }
    }

    // Find profile by phone number
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, telegram_id, full_name')
      .eq('phone', normalizedPhone)
      .single();

    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    let profileId: string;

    if (existingProfile) {
      // Profile exists with this phone

      // Check if this profile is already linked to a DIFFERENT Telegram account
      if (tgId && existingProfile.telegram_id && existingProfile.telegram_id !== tgId) {
        return NextResponse.json(
          { error: 'Этот номер уже привязан к другому Telegram аккаунту' },
          { status: 400 }
        );
      }

      // Update profile: link telegram_id + update name if needed
      profileId = existingProfile.id;
      const updates: Record<string, unknown> = {};
      if (tgId) {
        updates.telegram_id = tgId;
      }
      if (!existingProfile.full_name || existingProfile.full_name === 'Новый клиент') {
        updates.full_name = fullName || 'Новый клиент';
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', profileId);

        if (updateError) {
          console.error('Profile update error:', updateError);
          return NextResponse.json({ error: 'Ошибка обновления профиля' }, { status: 500 });
        }
      }
    } else {
      // No profile with this phone — create new
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: `tg_${normalizedPhone.replace('+', '')}@dgatlas.app`,
        password: `tg_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        email_confirm: true,
      });

      if (authError) {
        console.error('Auth create error:', authError);
        return NextResponse.json({ error: 'Ошибка регистрации' }, { status: 500 });
      }

      profileId = authData.user.id;

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: profileId,
        full_name: fullName || 'Новый клиент',
        role: 'client',
        phone: normalizedPhone,
        ...(tgId ? { telegram_id: tgId } : {}),
      });

      if (profileError) {
        console.error('Profile create error:', profileError);
        return NextResponse.json({ error: 'Ошибка создания профиля' }, { status: 500 });
      }

      // Create default project
      await supabase.from('projects').insert({
        client_id: profileId,
        title: 'Мой проект',
        current_stage: 0,
        status: 'active',
      });
    }

    // Fetch full profile from DB (with actual name)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, phone, full_name')
      .eq('id', profileId)
      .single();

    // Fetch project
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', profileId)
      .single();

    return NextResponse.json({
      status: 'authenticated',
      profile,
      project,
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
