'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, FileCheck, FileText, FilePen, Download,
  Filter, FolderOpen,
} from 'lucide-react';

/* ── Типы ── */
type DocStatus = 'signed' | 'pending' | 'draft';
type DocCategory = 'contract' | 'act' | 'project_docs' | 'permit';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  status: DocStatus;
  category: DocCategory;
  created_at: string;
  month: string;
  download_url: string;
}

/* ── Конфиг категорий ── */
const CATEGORY_CONFIG: Record<DocCategory, { label: string; shortLabel: string }> = {
  contract:     { label: 'Договоры', shortLabel: 'Договоры' },
  act:          { label: 'Акты', shortLabel: 'Акты' },
  project_docs: { label: 'Проектная документация', shortLabel: 'Проект.' },
  permit:       { label: 'Разрешения', shortLabel: 'Разрешения' },
};

/* ── Конфиг статусов ── */
const STATUS_CONFIG: Record<DocStatus, {
  label: string;
  color: string;
  bg: string;
  icon: typeof FileCheck;
}> = {
  signed:  { label: 'Подписан',      color: '#4cd964', bg: 'bg-[#4cd964]/10', icon: FileCheck },
  pending: { label: 'На подписании', color: '#FF9800', bg: 'bg-[#FF9800]/10', icon: FilePen },
  draft:   { label: 'Черновик',      color: '#666',    bg: 'bg-[#666]/10',    icon: FileText },
};

/* ── Мок-данные ── */
const MOCK_DOCUMENTS: Document[] = [
  {
    id: 1,
    name: 'Акт приёмки: фундамент',
    type: 'PDF',
    size: '1.1 МБ',
    status: 'pending',
    category: 'act',
    created_at: '2026-03-10T14:00:00',
    month: 'Март 2026',
    download_url: '#',
  },
  {
    id: 2,
    name: 'Доп. соглашение №2',
    type: 'PDF',
    size: '890 КБ',
    status: 'pending',
    category: 'contract',
    created_at: '2026-03-08T10:00:00',
    month: 'Март 2026',
    download_url: '#',
  },
  {
    id: 3,
    name: 'Договор подряда №ДГ-2026-0142',
    type: 'PDF',
    size: '2.4 МБ',
    status: 'signed',
    category: 'contract',
    created_at: '2026-03-01T09:00:00',
    month: 'Март 2026',
    download_url: '#',
  },
  {
    id: 4,
    name: 'Проект дома (план этажей)',
    type: 'DWG',
    size: '18 МБ',
    status: 'signed',
    category: 'project_docs',
    created_at: '2026-02-20T12:00:00',
    month: 'Февраль 2026',
    download_url: '#',
  },
  {
    id: 5,
    name: 'Смета v3 (финальная)',
    type: 'XLSX',
    size: '540 КБ',
    status: 'signed',
    category: 'project_docs',
    created_at: '2026-02-15T11:30:00',
    month: 'Февраль 2026',
    download_url: '#',
  },
  {
    id: 6,
    name: 'Разрешение на строительство',
    type: 'PDF',
    size: '3.2 МБ',
    status: 'signed',
    category: 'permit',
    created_at: '2026-02-10T09:00:00',
    month: 'Февраль 2026',
    download_url: '#',
  },
  {
    id: 7,
    name: 'Акт скрытых работ: гидроизоляция',
    type: 'PDF',
    size: '1.8 МБ',
    status: 'signed',
    category: 'act',
    created_at: '2026-01-25T16:00:00',
    month: 'Январь 2026',
    download_url: '#',
  },
  {
    id: 8,
    name: 'Техусловия на подключение газа',
    type: 'PDF',
    size: '420 КБ',
    status: 'draft',
    category: 'permit',
    created_at: '2026-01-18T10:00:00',
    month: 'Январь 2026',
    download_url: '#',
  },
  {
    id: 9,
    name: 'Архитектурный проект (фасады)',
    type: 'PDF',
    size: '12 МБ',
    status: 'signed',
    category: 'project_docs',
    created_at: '2026-01-10T14:00:00',
    month: 'Январь 2026',
    download_url: '#',
  },
];

/* ── Хелперы ── */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function DocumentsPage() {
  const [activeCategory, setActiveCategory] = useState<DocCategory | 'all'>('all');

  /* Фильтрация по категории */
  const filtered = activeCategory === 'all'
    ? MOCK_DOCUMENTS
    : MOCK_DOCUMENTS.filter((d) => d.category === activeCategory);

  /* Разделение: pending сверху, остальные по месяцам */
  const pendingDocs = filtered.filter((d) => d.status === 'pending');
  const otherDocs = filtered.filter((d) => d.status !== 'pending');

  /* Группировка по месяцам */
  const monthGroups: { month: string; docs: Document[] }[] = [];
  const monthMap = new Map<string, Document[]>();
  for (const doc of otherDocs) {
    const group = monthMap.get(doc.month);
    if (group) {
      group.push(doc);
    } else {
      monthMap.set(doc.month, [doc]);
    }
  }
  for (const [month, docs] of monthMap) {
    monthGroups.push({ month, docs });
  }

  /* Счётчики категорий */
  const categoryCounts = {
    all: MOCK_DOCUMENTS.length,
    contract: MOCK_DOCUMENTS.filter((d) => d.category === 'contract').length,
    act: MOCK_DOCUMENTS.filter((d) => d.category === 'act').length,
    project_docs: MOCK_DOCUMENTS.filter((d) => d.category === 'project_docs').length,
    permit: MOCK_DOCUMENTS.filter((d) => d.category === 'permit').length,
  };

  return (
    <div className="min-h-screen bg-black pb-8">

      {/* ═══════ HEADER ═══════ */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <Link
          href="/tma"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08] active:bg-[#222] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Документы</h1>
          <p className="text-[#666] text-xs font-light">{filtered.length} документов</p>
        </div>
      </div>

      {/* ═══════ CATEGORY FILTER (horizontal scroll) ═══════ */}
      <div className="px-4 mb-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {/* «Все» */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border whitespace-nowrap transition-all active:scale-[0.97] ${
              activeCategory === 'all'
                ? 'bg-white/[0.1] border-white/[0.15] text-white'
                : 'bg-[#1a1a1a] border-white/[0.06] text-[#666]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Все</span>
            <span className="text-[10px] opacity-60">{categoryCounts.all}</span>
          </button>

          {(Object.entries(CATEGORY_CONFIG) as [DocCategory, typeof CATEGORY_CONFIG[DocCategory]][]).map(
            ([key, cfg]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(activeCategory === key ? 'all' : key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border whitespace-nowrap transition-all active:scale-[0.97] ${
                  activeCategory === key
                    ? 'bg-white/[0.1] border-white/[0.15] text-white'
                    : 'bg-[#1a1a1a] border-white/[0.06] text-[#666]'
                }`}
              >
                <span className="text-xs font-medium">{cfg.shortLabel}</span>
                <span className="text-[10px] opacity-60">{categoryCounts[key]}</span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* ═══════ PENDING SECTION ═══════ */}
      {pendingDocs.length > 0 && (
        <div className="px-4 mb-6">
          <p className="text-[#FF9800] text-xs font-bold uppercase tracking-wider mb-3 px-1">
            На подписании ({pendingDocs.length})
          </p>
          <div className="space-y-2">
            {pendingDocs.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        </div>
      )}

      {/* ═══════ MONTHLY GROUPS ═══════ */}
      {monthGroups.length > 0 ? (
        <div className="px-4 space-y-6">
          {monthGroups.map((group) => (
            <div key={group.month}>
              <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">
                {group.month}
              </p>
              <div className="space-y-2">
                {group.docs.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : pendingDocs.length === 0 ? (
        /* ═══════ EMPTY STATE ═══════ */
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div
            className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-white/[0.06] flex items-center justify-center mb-4"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
          >
            <FolderOpen className="w-8 h-8 text-[#444]" />
          </div>
          <p className="text-[#999] text-sm text-center">Документы станут доступны</p>
          <p className="text-[#555] text-xs mt-1 font-light text-center">после подписания договора</p>
        </div>
      ) : null}
    </div>
  );
}

/* ══════════════════════════════════════════════
   DOCUMENT CARD
   ══════════════════════════════════════════════ */
function DocumentCard({ doc }: { doc: Document }) {
  const status = STATUS_CONFIG[doc.status];
  const category = CATEGORY_CONFIG[doc.category];
  const Icon = status.icon;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]"
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${status.bg}`}>
        <Icon className="w-5 h-5" style={{ color: status.color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{doc.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[#666] text-xs">{doc.type} · {doc.size}</span>
          <span className="text-[#444] text-xs">·</span>
          <span className="text-[#555] text-xs">{category.label}</span>
        </div>
      </div>

      {/* Status + Download */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="text-[10px] font-medium" style={{ color: status.color }}>
          {status.label}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: подключить реальное скачивание через api.get()
          }}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] active:bg-white/[0.08] transition-colors"
        >
          <Download className="w-4 h-4 text-[#555]" />
        </button>
      </div>
    </div>
  );
}
