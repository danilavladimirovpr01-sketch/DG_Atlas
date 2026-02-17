import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { clientId, projectId, stage, score, comment } = await request.json();

    if (!clientId || !projectId || !stage || score === undefined) {
      return NextResponse.json(
        { error: 'clientId, projectId, stage, and score are required' },
        { status: 400 }
      );
    }

    if (score < 0 || score > 10) {
      return NextResponse.json(
        { error: 'Score must be between 0 and 10' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('nps_responses')
      .upsert(
        {
          client_id: clientId,
          project_id: projectId,
          stage,
          score,
          comment: comment || null,
        },
        {
          onConflict: 'client_id,project_id,stage',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('NPS insert error:', error);
      return NextResponse.json({ error: 'Failed to save NPS response' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('NPS error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
