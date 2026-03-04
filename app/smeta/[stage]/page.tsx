import { notFound } from 'next/navigation';
import SmetaWarmFrame from '@/components/tma/SmetaWarmFrame';
import { SMETA_STAGES } from '@/lib/data/smeta-stages';

export default function PublicStagePage({ params }: { params: { stage: string } }) {
  const stage = SMETA_STAGES.find((s) => s.id === params.stage);
  if (!stage) notFound();

  if (params.stage === 'warm-frame') {
    return <SmetaWarmFrame backHref="/smeta" />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4" style={{ background: `${stage.color}18` }}>
          <span className="text-3xl">📋</span>
        </div>
        <p className="text-white text-lg font-bold">{stage.label}</p>
        <p className="text-[#555] text-sm mt-1">{stage.sub}</p>
        <p className="text-[#444] text-xs mt-4 leading-relaxed">Смета по этому этапу появится позже.</p>
      </div>
    </div>
  );
}
