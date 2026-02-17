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

    const supabase = createServiceRoleClient();

    // Find project by client's phone number
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', normalizedPhone)
      .single();

    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    let profileId: string;

    if (existingProfile) {
      // Existing client — update with telegram_id
      profileId = existingProfile.id;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          telegram_id: telegramId,
          full_name: fullName || undefined,
        })
        .eq('id', profileId);

      if (updateError) {
        console.error('Profile update error:', updateError);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
      }
    } else {
      // New client — create auth user + profile + default project
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
        telegram_id: telegramId,
      });

      if (profileError) {
        console.error('Profile create error:', profileError);
        return NextResponse.json({ error: 'Ошибка создания профиля' }, { status: 500 });
      }

      // Create default project
      await supabase.from('projects').insert({
        client_id: profileId,
        title: 'Мой проект',
        current_stage: 1,
        status: 'active',
      });
    }

    // Fetch project
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', profileId)
      .single();

    return NextResponse.json({
      status: 'authenticated',
      profile: { id: profileId, full_name: fullName || 'Новый клиент' },
      project,
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
