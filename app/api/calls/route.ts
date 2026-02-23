import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check role
    const serviceClient = createServiceRoleClient();
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    let query = serviceClient
      .from('calls')
      .select('*, profiles!calls_manager_id_fkey(full_name)')
      .order('created_at', { ascending: false });

    // Managers only see their own calls
    if (profile?.role === 'manager') {
      query = query.eq('manager_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Calls GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('audio') as File;

    if (!file) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    const clientId = formData.get('client_id') as string | null;
    const serviceClient = createServiceRoleClient();

    // Upload to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await serviceClient.storage
      .from('Calls')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    const { data: urlData } = serviceClient.storage
      .from('Calls')
      .getPublicUrl(fileName);

    // Create call record
    const { data: call, error: insertError } = await serviceClient
      .from('calls')
      .insert({
        manager_id: user.id,
        client_id: clientId || null,
        audio_url: urlData.publicUrl,
        analysis_status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create call record' }, { status: 500 });
    }

    return NextResponse.json(call);
  } catch (error) {
    console.error('Calls POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
