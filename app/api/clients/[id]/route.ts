import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    // 1. Client profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, phone, telegram_id, created_at')
      .eq('id', id)
      .eq('role', 'client')
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // 2. Projects
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, current_stage, status, created_at')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    // 3. NPS responses with employee info
    const { data: npsResponses } = await supabase
      .from('nps_responses')
      .select(`
        id, stage, score, answers, comment, created_at,
        employees(full_name, position)
      `)
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    // 4. Calls linked to this client
    const { data: calls, error: callsError } = await supabase
      .from('calls')
      .select('id, score, analysis_status, ai_summary, created_at, manager_id, client_id')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    if (callsError) {
      console.error('Calls query error:', callsError);
    }

    return NextResponse.json({
      profile,
      projects: projects || [],
      npsResponses: (npsResponses || []).map((r: Record<string, unknown>) => ({
        ...r,
        employees: r.employees && typeof r.employees === 'object' && !('message' in (r.employees as Record<string, unknown>))
          ? r.employees
          : null,
      })),
      calls: calls || [],
    });
  } catch (error) {
    console.error('Client detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
