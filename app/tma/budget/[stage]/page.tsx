import { notFound } from 'next/navigation';
import SmetaWarmFrame from '@/components/tma/SmetaWarmFrame';
import { SMETA_STAGES } from '@/lib/data/smeta-stages';
import {
  CATEGORIES, UPGRADES, MARKET_COMPARISON, SMETA_META, TOTAL, HIDDEN_TOTAL,
} from '@/lib/data/smeta-mock';
import { SMETA_EXTERIOR } from '@/lib/data/smeta-exterior';
import { SMETA_ENGINEERING_FULL } from '@/lib/data/smeta-engineering-full';
import { SMETA_INTERIOR } from '@/lib/data/smeta-interior';

const DATA_MAP = {
  'warm-frame': {
    meta: SMETA_META,
    categories: CATEGORIES,
    upgrades: UPGRADES,
    marketComparison: MARKET_COMPARISON,
    total: TOTAL,
    hiddenTotal: HIDDEN_TOTAL,
  },
  'exterior': SMETA_EXTERIOR,
  'engineering': SMETA_ENGINEERING_FULL,
  'interior': SMETA_INTERIOR,
};

export default function StagePage({ params }: { params: { stage: string } }) {
  const stage = SMETA_STAGES.find((s) => s.id === params.stage);
  if (!stage) notFound();

  const data = DATA_MAP[params.stage as keyof typeof DATA_MAP];
  if (!data) notFound();

  return <SmetaWarmFrame backHref="/tma/budget" data={data} />;
}
