import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const position = request.nextUrl.searchParams.get('position');

  const supabase = createServiceRoleClient();

  let query = supabase
    .from('employees')
    .select('id, full_name, position')
    .eq('is_active', true)
    .order('full_name');

  if (position) {
    query = query.eq('position', position);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
