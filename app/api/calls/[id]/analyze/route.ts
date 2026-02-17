import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { transcribeAudio } from '@/lib/openai/whisper';
import { analyzeCall } from '@/lib/openai/analyze';

export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    // Get call record
    const { data: call, error: fetchError } = await supabase
      .from('calls')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    // Update status to transcribing
    await supabase
      .from('calls')
      .update({ analysis_status: 'transcribing' })
      .eq('id', id);

    // Download audio file
    const audioResponse = await fetch(call.audio_url);
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

    // Transcribe
    const transcript = await transcribeAudio(audioBuffer, 'call.mp3');

    // Update with transcript, set status to analyzing
    await supabase
      .from('calls')
      .update({ transcript, analysis_status: 'analyzing' })
      .eq('id', id);

    // Get active checklist
    const { data: checklist } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('is_active', true)
      .order('order_index');

    if (!checklist || checklist.length === 0) {
      await supabase
        .from('calls')
        .update({ analysis_status: 'error', ai_summary: 'Чеклист пуст' })
        .eq('id', id);
      return NextResponse.json({ error: 'No checklist items' }, { status: 400 });
    }

    // Analyze with GPT-4o
    const analysis = await analyzeCall(transcript, checklist);

    // Save criterion scores
    const scores = analysis.criteria.map((c) => ({
      call_id: id,
      criterion_id: c.criterion_id,
      passed: c.passed,
      ai_comment: c.comment,
    }));

    // Delete old scores if re-analyzing
    await supabase
      .from('call_criterion_scores')
      .delete()
      .eq('call_id', id);

    await supabase
      .from('call_criterion_scores')
      .insert(scores);

    // Update call with final results
    await supabase
      .from('calls')
      .update({
        score: analysis.score,
        ai_summary: analysis.summary,
        analysis_status: 'done',
      })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      score: analysis.score,
      summary: analysis.summary,
    });
  } catch (error) {
    console.error('Analysis error:', error);

    // Mark as error
    const { id } = await params;
    const supabase = createServiceRoleClient();
    await supabase
      .from('calls')
      .update({
        analysis_status: 'error',
        ai_summary: 'Ошибка при анализе',
      })
      .eq('id', id);

    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
