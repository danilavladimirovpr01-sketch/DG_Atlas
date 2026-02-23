import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

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
      console.error('Profile not found:', id, profileError);
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // 2. Projects
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, current_stage, status, created_at')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    // 3. NPS responses — simple query first, then enrich with employee data
    const { data: npsRaw, error: npsError } = await supabase
      .from('nps_responses')
      .select('id, stage, score, answers, comment, created_at, employee_id')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    if (npsError) {
      console.error('NPS query error for client', id, ':', npsError);
    }

    // Enrich NPS with employee info separately to avoid join failures
    const npsResponses = [];
    for (const nps of npsRaw || []) {
      let employeeInfo = null;
      if (nps.employee_id) {
        const { data: emp } = await supabase
          .from('employees')
          .select('full_name, position')
          .eq('id', nps.employee_id)
          .single();
        if (emp) employeeInfo = emp;
      }
      npsResponses.push({
        id: nps.id,
        stage: nps.stage,
        score: nps.score,
        answers: nps.answers || {},
        comment: nps.comment,
        created_at: nps.created_at,
        employees: employeeInfo,
      });
    }

    // 4. Calls linked to this client
    const { data: calls, error: callsError } = await supabase
      .from('calls')
      .select('id, score, analysis_status, ai_summary, created_at, manager_id, client_id')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    if (callsError) {
      console.error('Calls query error for client', id, ':', callsError);
    }

    const response = NextResponse.json({
      profile,
      projects: projects || [],
      npsResponses,
      calls: calls || [],
    });

    // Prevent any caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');

    return response;
  } catch (error) {
    console.error('Client detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
