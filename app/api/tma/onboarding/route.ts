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

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Номер не найден. Обратитесь к вашему менеджеру.' },
        { status: 404 }
      );
    }

    // Update profile with telegram_id and name
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        telegram_id: telegramId,
        full_name: fullName || undefined,
      })
      .eq('id', existingProfile.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    // Fetch project
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', existingProfile.id)
      .single();

    return NextResponse.json({
      status: 'authenticated',
      profile: { id: existingProfile.id, full_name: fullName },
      project,
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
