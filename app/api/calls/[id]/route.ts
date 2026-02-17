import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { data: call, error } = await supabase
      .from('calls')
      .select(`
        *,
        call_criterion_scores (
          id, passed, ai_comment,
          checklist_items (category, criterion)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    return NextResponse.json(call);
  } catch (error) {
    console.error('Call GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
