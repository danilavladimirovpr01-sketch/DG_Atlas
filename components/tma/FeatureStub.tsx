'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Circle,
  CircleDollarSign, CalendarDays,
  Play, FileText, MessageCircle,
  BookOpen, Camera, Lock,
  FileCheck, Download, Send, Search, ChevronRight, Star,
  Zap, TrendingUp,
} from 'lucide-react';
import { getFeatureById } from '@/lib/constants/tma-features';

interface FeatureStubProps {
  featureId: string;
}

/* ══════════════════════════════════════════════
   TASKS — Чек-листы задач
   ══════════════════════════════════════════════ */
function TasksMockup() {
  const urgent = [
    { text: 'Выбрать цвет фасада', days: '2 дня' },
    { text: 'Утвердить схему электрики', days: '5 дней' },
    { text: 'Подписать доп. соглашение', days: '3 дня' },
  ];
  const done = [
    'Согласовать планировку',
    'Выбрать проект дома',
    'Подписать договор',
  ];

  return (
    <div className="space-y-5">
      {/* Urgent */}
      <div>
        <p className="text-[#FF9800] text-xs font-bold uppercase tracking-wider mb-3 px-1">Срочно</p>
        <div className="space-y-2">
          {urgent.map((t, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Circle className="w-5 h-5 text-[#FF9800]/60" />
                <span className="text-white text-sm font-medium">{t.text}</span>
              </div>
              <span className="text-[#FF9800] text-xs font-medium shrink-0 ml-3">{t.days}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Done */}
      <div>
        <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">Выполнено</p>
        <div className="space-y-2">
          {done.map((t, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-[#0d0d0d] border border-white/[0.04]">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#4cd964]" />
                <span className="text-[#666] text-sm line-through">{t}</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[#4cd964]/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   BUDGET — Интерактивная смета
   ══════════════════════════════════════════════ */
function BudgetMockup() {
  const items = [
    { label: 'Фундамент', amount: '820 000', pct: 16, color: '#FF9800' },
    { label: 'Стены и перекрытия', amount: '1 450 000', pct: 28, color: '#4cd964' },
    { label: 'Кровля', amount: '680 000', pct: 13, color: '#5AC8FA' },
    { label: 'Инженерные сети', amount: '540 000', pct: 10, color: '#AF52DE' },
    { label: 'Отделка', amount: '960 000', pct: 18, color: '#FF3B30' },
    { label: 'Прочее', amount: '750 000', pct: 15, color: '#666' },
  ];

  return (
    <div className="space-y-5">
      {/* Pie chart mockup */}
      <div className="flex justify-center">
        <div className="relative w-44 h-44">
          <div className="w-full h-full rounded-full" style={{
            background: `conic-gradient(#FF9800 0deg 58deg, #4cd964 58deg 159deg, #5AC8FA 159deg 206deg, #AF52DE 206deg 242deg, #FF3B30 242deg 307deg, #666 307deg 360deg)`,
          }} />
          <div className="absolute inset-[22px] rounded-full bg-black flex flex-col items-center justify-center">
            <p className="text-white text-lg font-bold">5.2M ₽</p>
            <p className="text-[#666] text-[10px]">общий бюджет</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/[0.04]">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
              <span className="text-white text-sm">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#999] text-xs">{item.pct}%</span>
              <span className="text-white text-sm font-medium">{item.amount} ₽</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PAYMENTS — График платежей
   ══════════════════════════════════════════════ */
function PaymentsMockup() {
  const upcoming = [
    { date: '10 мар', label: 'Оплата за фундамент', amount: '820 000 ₽', status: 'soon' },
    { date: '25 мар', label: 'Материалы: газоблок', amount: '460 000 ₽', status: 'upcoming' },
    { date: '15 апр', label: 'Оплата за стены', amount: '650 000 ₽', status: 'upcoming' },
  ];
  const paid = [
    { date: '20 фев', label: 'Первый транш', amount: '500 000 ₽' },
    { date: '1 фев', label: 'Предоплата за проект', amount: '150 000 ₽' },
  ];

  return (
    <div className="space-y-5">
      {/* Summary card */}
      <div className="px-5 py-4 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <p className="text-[#666] text-xs mb-1">Оплачено / Всего</p>
        <p className="text-white text-2xl font-bold">650K <span className="text-[#666] text-lg font-normal">/ 5.2M ₽</span></p>
        <div className="h-1.5 bg-white/[0.08] rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-[#4cd964] rounded-full" style={{ width: '12.5%' }} />
        </div>
      </div>

      {/* Upcoming */}
      <div>
        <p className="text-[#FF9800] text-xs font-bold uppercase tracking-wider mb-3 px-1">Предстоящие</p>
        <div className="space-y-2">
          {upcoming.map((p, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-xl bg-[#FF9800]/10 flex flex-col items-center justify-center shrink-0">
                <CalendarDays className="w-4 h-4 text-[#FF9800]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{p.label}</p>
                <p className="text-[#666] text-xs">{p.date}</p>
              </div>
              <span className="text-white text-sm font-semibold shrink-0">{p.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Paid */}
      <div>
        <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">Оплачено</p>
        <div className="space-y-2">
          {paid.map((p, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0d0d0d] border border-white/[0.04]">
              <div className="w-10 h-10 rounded-xl bg-[#4cd964]/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#4cd964]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#666] text-sm truncate">{p.label}</p>
                <p className="text-[#555] text-xs">{p.date}</p>
              </div>
              <span className="text-[#666] text-sm shrink-0">{p.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CALCULATOR — AI-калькулятор бюджета
   ══════════════════════════════════════════════ */
function CalculatorMockup() {
  return (
    <div className="space-y-5">
      {/* Input fields */}
      <div className="space-y-3">
        {[
          { label: 'Площадь дома', value: '160 м²' },
          { label: 'Этажность', value: '2 этажа' },
          { label: 'Материал стен', value: 'Газобетон' },
          { label: 'Тип фундамента', value: 'Монолитная плита' },
          { label: 'Регион', value: 'Московская область' },
        ].map((field, i) => (
          <div key={i} className="px-4 py-3 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
            <p className="text-[#666] text-[10px] uppercase tracking-wider mb-0.5">{field.label}</p>
            <p className="text-white text-sm font-medium">{field.value}</p>
          </div>
        ))}
      </div>

      {/* Result */}
      <div className="px-5 py-5 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-[#FF9800]/20" style={{ boxShadow: '0 4px 30px rgba(255,152,0,0.08)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-[#FF9800]" />
          <p className="text-[#FF9800] text-xs font-medium">AI-расчёт</p>
        </div>
        <p className="text-white text-3xl font-bold">4.8 — 5.6M ₽</p>
        <p className="text-[#666] text-xs mt-1">Примерная стоимость строительства под ключ</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   COMPARE — Сравнение смет
   ══════════════════════════════════════════════ */
function CompareMockup() {
  const rows = [
    { name: 'Фундамент', ours: '820K', theirs: '680K', better: 'theirs' },
    { name: 'Стены', ours: '1.45M', theirs: '1.6M', better: 'ours' },
    { name: 'Кровля', ours: '680K', theirs: '720K', better: 'ours' },
    { name: 'Инженерка', ours: '540K', theirs: '—', better: 'ours' },
    { name: 'Отделка', ours: '960K', theirs: '850K', better: 'theirs' },
  ];

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex gap-2">
        <div className="flex-1 px-4 py-3 rounded-2xl bg-[#FF9800]/10 border border-[#FF9800]/20 text-center">
          <p className="text-[#FF9800] text-xs font-bold">DG Atlas</p>
          <p className="text-white text-lg font-bold mt-1">5.2M ₽</p>
        </div>
        <div className="flex-1 px-4 py-3 rounded-2xl bg-[#1a1a1a] border border-white/[0.06] text-center">
          <p className="text-[#666] text-xs font-bold">Конкурент</p>
          <p className="text-white text-lg font-bold mt-1">4.9M ₽</p>
        </div>
      </div>

      {/* AI alert */}
      <div className="px-4 py-3 rounded-2xl bg-[#FF3B30]/10 border border-[#FF3B30]/20">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#FF3B30] mt-0.5 shrink-0" />
          <div>
            <p className="text-[#FF3B30] text-xs font-semibold">AI нашёл скрытые расходы</p>
            <p className="text-[#999] text-xs mt-0.5">У конкурента не указаны инженерные сети (+540K) и утепление (+180K)</p>
          </div>
        </div>
      </div>

      {/* Comparison rows */}
      <div className="space-y-1.5">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#0d0d0d] border border-white/[0.04]">
            <span className="flex-1 text-[#999] text-xs">{row.name}</span>
            <span className={`w-16 text-right text-xs font-medium ${row.better === 'ours' ? 'text-[#4cd964]' : 'text-white'}`}>{row.ours}</span>
            <span className={`w-16 text-right text-xs font-medium ${row.better === 'theirs' ? 'text-[#4cd964]' : row.theirs === '—' ? 'text-[#FF3B30]' : 'text-white'}`}>{row.theirs}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PHOTOS — Фото каждый день
   ══════════════════════════════════════════════ */
function PhotosMockup() {
  const todayPhotos = [
    '/stages/05-fundament-steny.jpg',
    '/stages/06-krysha.jpg',
    '/stages/07-teplyj-kontur.jpg',
    '/stages/08-fasad.jpg',
    '/stages/10-otdelka.jpg',
    '/stages/11-kommunikacii.jpg',
  ];
  const yesterdayPhotos = [
    '/stages/03-proektirovanie.jpg',
    '/stages/04-smeta.jpg',
    '/stages/12-landshaft.jpg',
  ];
  const olderPhotos = [
    '/stages/00-mechta.jpg',
    '/stages/01-uchastok.jpg',
    '/stages/02-kompaniya.jpg',
    '/stages/13-zaezd.jpg',
  ];

  return (
    <div className="space-y-5">
      {/* Today */}
      <div>
        <p className="text-white text-xs font-bold uppercase tracking-wider mb-3 px-1">Сегодня · 25 февраля</p>
        <div className="grid grid-cols-3 gap-1.5">
          {todayPhotos.map((src, i) => (
            <div key={i} className="aspect-square rounded-xl border border-white/[0.06] overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Yesterday */}
      <div>
        <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">Вчера · 24 февраля</p>
        <div className="grid grid-cols-3 gap-1.5">
          {yesterdayPhotos.map((src, i) => (
            <div key={i} className="aspect-square rounded-xl border border-white/[0.04] overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Older */}
      <div>
        <p className="text-[#555] text-xs font-bold uppercase tracking-wider mb-3 px-1">22 февраля</p>
        <div className="grid grid-cols-3 gap-1.5">
          {olderPhotos.map((src, i) => (
            <div key={i} className="aspect-square rounded-xl border border-white/[0.04] overflow-hidden opacity-80">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-2">
        <div className="flex-1 px-4 py-3 rounded-2xl bg-[#1a1a1a] border border-white/[0.06] text-center">
          <p className="text-white text-xl font-bold">247</p>
          <p className="text-[#666] text-[10px]">всего фото</p>
        </div>
        <div className="flex-1 px-4 py-3 rounded-2xl bg-[#1a1a1a] border border-white/[0.06] text-center">
          <p className="text-white text-xl font-bold">34</p>
          <p className="text-[#666] text-[10px]">за неделю</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TIMELAPSE — Таймлапс стройки
   ══════════════════════════════════════════════ */
function TimelapseMockup() {
  const stages = [
    { label: 'Фундамент', src: '/stages/05-fundament-steny.jpg' },
    { label: 'Стены', src: '/stages/07-teplyj-kontur.jpg' },
    { label: 'Крыша', src: '/stages/06-krysha.jpg' },
    { label: 'Фасад', src: '/stages/08-fasad.jpg' },
    { label: 'Отделка', src: '/stages/10-otdelka.jpg' },
    { label: 'Ландшафт', src: '/stages/12-landshaft.jpg' },
  ];

  return (
    <div className="space-y-5">
      {/* Video player with real photo as poster */}
      <div className="relative aspect-video rounded-2xl border border-white/[0.08] overflow-hidden" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
        <img src="/stages/09-dizajn-proekt.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Play className="w-7 h-7 text-white ml-1" />
          </div>
        </div>
        {/* Timeline */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 bg-gradient-to-t from-black/80">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: '65%' }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-white/60 text-[10px]">0:18</span>
            <span className="text-white/60 text-[10px]">0:30</span>
          </div>
        </div>
      </div>

      <p className="text-[#666] text-sm text-center font-light">247 фото → 30 секунд видео</p>

      {/* Stages preview with real photos */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {stages.map((stage, i) => (
          <div key={i} className="flex-shrink-0 w-20 rounded-xl bg-[#1a1a1a] border border-white/[0.06] p-2.5 text-center">
            <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5">
              <img src={stage.src} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="text-[#999] text-[10px] truncate">{stage.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DOCUMENTS — Документы и акты
   ══════════════════════════════════════════════ */
function DocumentsMockup() {
  const docs = [
    { name: 'Договор подряда', type: 'PDF', size: '2.4 МБ', status: 'signed' },
    { name: 'Проект дома', type: 'DWG', size: '18 МБ', status: 'signed' },
    { name: 'Смета v3', type: 'XLSX', size: '540 КБ', status: 'signed' },
    { name: 'Акт: фундамент', type: 'PDF', size: '1.1 МБ', status: 'pending' },
    { name: 'Доп. соглашение №2', type: 'PDF', size: '890 КБ', status: 'pending' },
  ];

  return (
    <div className="space-y-2">
      {docs.map((doc, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${doc.status === 'signed' ? 'bg-[#4cd964]/10' : 'bg-[#FF9800]/10'}`}>
            {doc.status === 'signed' ? <FileCheck className="w-5 h-5 text-[#4cd964]" /> : <FileText className="w-5 h-5 text-[#FF9800]" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{doc.name}</p>
            <p className="text-[#666] text-xs">{doc.type} · {doc.size}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {doc.status === 'signed' ? (
              <span className="text-[#4cd964] text-[10px] font-medium">Подписан</span>
            ) : (
              <span className="text-[#FF9800] text-[10px] font-medium">На подпись</span>
            )}
            <Download className="w-4 h-4 text-[#444]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   QUALITY — Контроль качества
   ══════════════════════════════════════════════ */
function QualityMockup() {
  const checks = [
    { name: 'Армирование фундамента', status: 'passed', photos: 4 },
    { name: 'Гидроизоляция', status: 'passed', photos: 3 },
    { name: 'Кладка 1 этажа', status: 'issue', photos: 6 },
    { name: 'Перемычки и армопояс', status: 'pending', photos: 0 },
    { name: 'Монтаж перекрытий', status: 'pending', photos: 0 },
  ];

  return (
    <div className="space-y-2">
      {checks.map((check, i) => (
        <div key={i} className="px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {check.status === 'passed' && <CheckCircle2 className="w-5 h-5 text-[#4cd964]" />}
              {check.status === 'issue' && <AlertCircle className="w-5 h-5 text-[#FF3B30]" />}
              {check.status === 'pending' && <Circle className="w-5 h-5 text-[#444]" />}
              <span className={`text-sm font-medium ${check.status === 'pending' ? 'text-[#666]' : 'text-white'}`}>{check.name}</span>
            </div>
          </div>
          {check.photos > 0 && (
            <div className="flex gap-1.5 mt-2.5 ml-8">
              {[...Array(Math.min(check.photos, 4))].map((_, j) => (
                <div key={j} className="w-10 h-10 rounded-lg bg-[#0d0d0d] border border-white/[0.04] flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-white/15" />
                </div>
              ))}
              {check.photos > 4 && (
                <div className="w-10 h-10 rounded-lg bg-[#0d0d0d] border border-white/[0.04] flex items-center justify-center">
                  <span className="text-[#666] text-[10px]">+{check.photos - 4}</span>
                </div>
              )}
            </div>
          )}
          {check.status === 'issue' && (
            <p className="text-[#FF3B30] text-xs mt-2 ml-8">Замечание: трещина в кладке, требует исправления</p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   CHAT — AI помощник 24/7
   ══════════════════════════════════════════════ */
function ChatMockup() {
  return (
    <div className="flex flex-col h-[420px]">
      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-hidden">
        {/* Bot message */}
        <div className="flex gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FF9800]/15 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-[#FF9800]" />
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-[#1a1a1a] border border-white/[0.06] max-w-[80%]">
            <p className="text-white text-sm">Здравствуйте! Я AI-помощник вашего проекта. Чем могу помочь?</p>
          </div>
        </div>

        {/* User message */}
        <div className="flex justify-end">
          <div className="px-4 py-3 rounded-2xl rounded-tr-md bg-white max-w-[80%]">
            <p className="text-black text-sm">Когда будет готов фундамент?</p>
          </div>
        </div>

        {/* Bot message */}
        <div className="flex gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FF9800]/15 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-[#FF9800]" />
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-[#1a1a1a] border border-white/[0.06] max-w-[80%]">
            <p className="text-white text-sm">По плану фундамент будет залит <span className="text-[#FF9800] font-medium">12 марта</span>. Сейчас идёт подготовка опалубки. Прогресс: 70%.</p>
          </div>
        </div>

        {/* User message */}
        <div className="flex justify-end">
          <div className="px-4 py-3 rounded-2xl rounded-tr-md bg-white max-w-[80%]">
            <p className="text-black text-sm">А можно ускорить?</p>
          </div>
        </div>

        {/* Bot message */}
        <div className="flex gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FF9800]/15 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-[#FF9800]" />
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-[#1a1a1a] border border-white/[0.06] max-w-[80%]">
            <p className="text-white text-sm">Я передал ваш запрос менеджеру Алексею. Он свяжется с вами сегодня до 18:00.</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1a1a1a] border border-white/[0.08]">
          <Search className="w-4 h-4 text-[#444]" />
          <span className="text-[#444] text-sm">Задайте вопрос...</span>
        </div>
        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
          <Send className="w-4.5 h-4.5 text-black" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NOTIFICATIONS — Push-уведомления
   ══════════════════════════════════════════════ */
function NotificationsMockup() {
  const notifs = [
    { icon: Camera, text: 'Загружено 6 новых фото со стройки', time: '2 мин', color: '#5AC8FA', unread: true },
    { icon: CheckCircle2, text: 'Фундамент залит! Этап завершён', time: '1 час', color: '#4cd964', unread: true },
    { icon: CircleDollarSign, text: 'Напоминание: оплата 820 000 ₽ до 10 марта', time: '3 часа', color: '#FF9800', unread: true },
    { icon: MessageCircle, text: 'Менеджер Алексей ответил на ваш вопрос', time: '5 часов', color: '#AF52DE', unread: false },
    { icon: FileText, text: 'Акт приёмки фундамента готов к подписи', time: 'Вчера', color: '#FF9800', unread: false },
    { icon: Star, text: 'Оцените работу на этапе "Фундамент"', time: 'Вчера', color: '#FF9800', unread: false },
  ];

  return (
    <div className="space-y-2">
      {notifs.map((n, i) => {
        const Icon = n.icon;
        return (
          <div key={i} className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border ${n.unread ? 'bg-[#1a1a1a] border-white/[0.08]' : 'bg-[#0d0d0d] border-white/[0.04]'}`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${n.color}15` }}>
              <Icon className="w-5 h-5" style={{ color: n.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${n.unread ? 'text-white font-medium' : 'text-[#999]'}`}>{n.text}</p>
              <p className="text-[#555] text-xs mt-0.5">{n.time}</p>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full bg-[#FF9800] mt-2 shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ACHIEVEMENTS — Достижения
   ══════════════════════════════════════════════ */
function AchievementsMockup() {
  const badges = [
    { name: 'Первый шаг', desc: 'Подписан договор', earned: true, emoji: '🏠' },
    { name: 'Старт стройки', desc: 'Начат фундамент', earned: true, emoji: '🔨' },
    { name: 'Фотограф', desc: '50 фото загружено', earned: true, emoji: '📸' },
    { name: 'Контролёр', desc: 'Оценил 3 этапа', earned: true, emoji: '⭐' },
    { name: 'Крыша!', desc: 'Кровля завершена', earned: false, emoji: '🏗️' },
    { name: 'Уют', desc: 'Начата отделка', earned: false, emoji: '🎨' },
    { name: 'Новосёл', desc: 'Получены ключи', earned: false, emoji: '🔑' },
    { name: 'Легенда', desc: 'Все этапы пройдены', earned: false, emoji: '🏆' },
  ];

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="px-5 py-4 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#666] text-xs">Получено достижений</span>
          <span className="text-[#FF9800] text-sm font-bold">4 / 8</span>
        </div>
        <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div className="h-full bg-[#FF9800] rounded-full" style={{ width: '50%' }} />
        </div>
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {badges.map((badge, i) => (
          <div key={i} className={`px-4 py-4 rounded-2xl border text-center ${badge.earned ? 'bg-[#1a1a1a] border-white/[0.08]' : 'bg-[#0d0d0d] border-white/[0.04] opacity-40'}`}>
            <div className="text-3xl mb-2">{badge.emoji}</div>
            <p className={`text-sm font-semibold ${badge.earned ? 'text-white' : 'text-[#666]'}`}>{badge.name}</p>
            <p className="text-[#666] text-[10px] mt-0.5">{badge.desc}</p>
            {!badge.earned && <Lock className="w-3.5 h-3.5 text-[#444] mx-auto mt-1.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STATS — Статистика проекта
   ══════════════════════════════════════════════ */
function StatsMockup() {
  const kpis = [
    { label: 'Дней в стройке', value: '47', icon: CalendarDays, color: '#5AC8FA' },
    { label: 'Фото загружено', value: '247', icon: Camera, color: '#AF52DE' },
    { label: 'Потрачено', value: '2.1M ₽', icon: CircleDollarSign, color: '#FF9800' },
    { label: 'Прогресс', value: '35%', icon: TrendingUp, color: '#4cd964' },
  ];

  return (
    <div className="space-y-5">
      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="px-4 py-4 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
              <Icon className="w-5 h-5 mb-2" style={{ color: kpi.color }} />
              <p className="text-white text-xl font-bold">{kpi.value}</p>
              <p className="text-[#666] text-[10px] mt-0.5">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart mockup */}
      <div className="px-4 py-4 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
        <p className="text-[#666] text-xs mb-3">Активность по неделям</p>
        <div className="flex items-end gap-2 h-24">
          {[35, 52, 40, 68, 45, 78, 60, 85, 55, 72, 90, 65].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-white/10" style={{ height: `${h}%` }}>
              <div className="w-full rounded-sm bg-white/20" style={{ height: `${Math.min(100, h + 20)}%` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 py-4 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
        <p className="text-[#666] text-xs mb-3">Последние события</p>
        <div className="space-y-3">
          {[
            { text: 'Залит фундамент', time: 'Сегодня' },
            { text: 'Загружено 12 фото', time: 'Вчера' },
            { text: 'Оплата 820K ₽', time: '3 дня назад' },
          ].map((ev, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF9800]" />
              <span className="text-white text-sm flex-1">{ev.text}</span>
              <span className="text-[#555] text-xs">{ev.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DASHBOARD — Главный экран
   ══════════════════════════════════════════════ */
function DashboardMockup() {
  return (
    <div className="space-y-4">
      {/* Project card */}
      <div className="px-5 py-5 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08]" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#4cd964]" />
          <span className="text-[#4cd964] text-xs font-medium">Активный проект</span>
        </div>
        <p className="text-white text-xl font-bold tracking-tight">Дом 160 м²</p>
        <p className="text-[#666] text-xs mt-0.5">Этап: Фундамент и стены</p>
        <div className="h-1.5 bg-white/[0.08] rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: '35%' }} />
        </div>
        <p className="text-[#666] text-[10px] mt-1.5 text-right">35% завершено</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Бюджет', value: '5.2M', sub: '2.1M потрачено' },
          { label: 'Дней', value: '47', sub: '~120 осталось' },
          { label: 'NPS', value: '9.2', sub: 'отличная оценка' },
        ].map((s, i) => (
          <div key={i} className="px-3 py-3 rounded-2xl bg-[#1a1a1a] border border-white/[0.06] text-center">
            <p className="text-white text-lg font-bold">{s.value}</p>
            <p className="text-[#666] text-[9px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="space-y-1.5">
        <p className="text-[#666] text-xs font-bold uppercase tracking-wider px-1">Последнее</p>
        {[
          { icon: Camera, text: '6 новых фото', time: '2 мин' },
          { icon: CheckCircle2, text: 'Этап завершён', time: '1 час' },
          { icon: CircleDollarSign, text: 'Оплата 820K ₽', time: '3 часа' },
        ].map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0d0d0d] border border-white/[0.04]">
              <Icon className="w-4 h-4 text-[#666]" />
              <span className="text-[#999] text-sm flex-1">{a.text}</span>
              <span className="text-[#555] text-xs">{a.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   EDUCATION — База знаний
   ══════════════════════════════════════════════ */
function EducationMockup() {
  const articles = [
    { title: 'Как проверить качество фундамента', type: 'video', duration: '8 мин' },
    { title: '5 ошибок при выборе подрядчика', type: 'article', duration: '4 мин' },
    { title: 'Что такое армопояс и зачем он нужен', type: 'video', duration: '12 мин' },
    { title: 'Глоссарий: 50 строительных терминов', type: 'article', duration: '10 мин' },
    { title: 'Как принимать скрытые работы', type: 'video', duration: '6 мин' },
  ];

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1a1a1a] border border-white/[0.08]">
        <Search className="w-4 h-4 text-[#444]" />
        <span className="text-[#444] text-sm">Поиск по базе знаний...</span>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {['Все', 'Видео', 'Статьи', 'Глоссарий'].map((cat, i) => (
          <div key={i} className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium ${i === 0 ? 'bg-white text-black' : 'bg-[#1a1a1a] text-[#999] border border-white/[0.06]'}`}>
            {cat}
          </div>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-2">
        {articles.map((a, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.type === 'video' ? 'bg-[#FF3B30]/10' : 'bg-[#5AC8FA]/10'}`}>
              {a.type === 'video' ? <Play className="w-5 h-5 text-[#FF3B30]" /> : <BookOpen className="w-5 h-5 text-[#5AC8FA]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{a.title}</p>
              <p className="text-[#666] text-xs">{a.type === 'video' ? 'Видео' : 'Статья'} · {a.duration}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#444] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MOCKUP MAP
   ══════════════════════════════════════════════ */
const MOCKUPS: Record<string, () => JSX.Element> = {
  tasks: TasksMockup,
  budget: BudgetMockup,
  payments: PaymentsMockup,
  calculator: CalculatorMockup,
  compare: CompareMockup,
  photos: PhotosMockup,
  timelapse: TimelapseMockup,
  documents: DocumentsMockup,
  quality: QualityMockup,
  chat: ChatMockup,
  notifications: NotificationsMockup,
  achievements: AchievementsMockup,
  stats: StatsMockup,
  dashboard: DashboardMockup,
  education: EducationMockup,
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export default function FeatureStub({ featureId }: FeatureStubProps) {
  const feature = getFeatureById(featureId);

  if (!feature) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-[#666]">Функция не найдена</p>
      </div>
    );
  }

  const MockupComponent = MOCKUPS[featureId];

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/tma"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08] hover:bg-[#222] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight">{feature.title}</h1>
      </div>

      {/* Mockup content */}
      {MockupComponent ? (
        <MockupComponent />
      ) : (
        <div className="flex flex-col items-center justify-center text-center px-6 pt-16">
          <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] flex items-center justify-center mb-8"
               style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
            {(() => { const Icon = feature.icon; return <Icon className="w-10 h-10 text-white/60" />; })()}
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-3">{feature.title}</h2>
          <p className="text-[#666] text-sm leading-relaxed max-w-[280px] font-light">{feature.description}</p>
        </div>
      )}

      {/* Coming soon badge */}
      <div className="flex justify-center mt-8 mb-4">
        <div className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#1a1a1a] border border-white/[0.08]"
             style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          <Clock className="w-4 h-4 text-[#FF9800]" />
          <span className="text-[#999] text-sm font-medium">Скоро будет доступно</span>
        </div>
      </div>
    </div>
  );
}
