import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone')
      .eq('role', 'client')
      .order('full_name');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Clients GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
