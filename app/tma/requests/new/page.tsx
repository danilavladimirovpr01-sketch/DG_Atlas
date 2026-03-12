'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Send, Paperclip, X, Check,
  MessageSquare, FileText, HelpCircle, HardHat, Camera,
} from 'lucide-react';

/* ── Типы заявок ── */
type RequestType =
  | 'question_to_management'
  | 'document_request'
  | 'general_question'
  | 'technical_supervision'
  | 'second_camera_request';

const REQUEST_TYPES: {
  key: RequestType;
  label: string;
  description: string;
  icon: typeof MessageSquare;
  color: string;
}[] = [
  {
    key: 'question_to_management',
    label: 'Вопрос руководству',
    description: 'Связаться с руководством компании',
    icon: MessageSquare,
    color: '#5AC8FA',
  },
  {
    key: 'document_request',
    label: 'Запрос документа',
    description: 'Получить акт, договор или чертёж',
    icon: FileText,
    color: '#AF52DE',
  },
  {
    key: 'general_question',
    label: 'Общий вопрос',
    description: 'Любой вопрос по проекту',
    icon: HelpCircle,
    color: '#FF9800',
  },
  {
    key: 'technical_supervision',
    label: 'Заявка технадзору',
    description: 'Запросить выезд технадзора',
    icon: HardHat,
    color: '#4cd964',
  },
  {
    key: 'second_camera_request',
    label: 'Запрос второй камеры',
    description: 'Установить дополнительную камеру',
    icon: Camera,
    color: '#FF3B30',
  },
];

export default function NewRequestPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<RequestType | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const selectedConfig = REQUEST_TYPES.find((t) => t.key === selectedType);
  const canSubmit = selectedType && subject.trim().length > 0 && message.trim().length > 0;

  function handleAddFile() {
    const mockFiles = ['photo_стройка.jpg', 'документ.pdf', 'скриншот.png'];
    const next = mockFiles[files.length % mockFiles.length];
    if (files.length < 5) {
      setFiles([...files, next]);
    }
  }

  function handleRemoveFile(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => router.push('/tma/requests'), 1500);
    }, 1200);
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8">
        <div
          className="w-20 h-20 rounded-full bg-[#4cd964]/10 border border-[#4cd964]/20 flex items-center justify-center mb-6"
          style={{ boxShadow: '0 0 40px rgba(76,217,100,0.15)' }}
        >
          <Check className="w-10 h-10 text-[#4cd964]" />
        </div>
        <h2 className="text-white text-2xl font-bold tracking-tight mb-2">Заявка отправлена</h2>
        <p className="text-[#666] text-sm font-light text-center">
          Мы рассмотрим вашу заявку в ближайшее время и свяжемся с вами
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button
          onClick={() => (step === 2 ? setStep(1) : router.back())}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08] active:bg-[#222] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Новая заявка</h1>
          <p className="text-[#666] text-xs font-light">
            {step === 1 ? 'Шаг 1 — выберите тип' : 'Шаг 2 — опишите проблему'}
          </p>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex gap-2">
          <div className="flex-1 h-[3px] rounded-full bg-white" />
          <div className={`flex-1 h-[3px] rounded-full transition-colors duration-300 ${step === 2 ? 'bg-white' : 'bg-white/[0.12]'}`} />
        </div>
      </div>

      {step === 1 && (
        <div className="px-4 space-y-2.5">
          <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">Тип обращения</p>
          {REQUEST_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.key;
            return (
              <button
                key={type.key}
                onClick={() => {
                  setSelectedType(type.key);
                  setTimeout(() => setStep(2), 200);
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-[20px] border transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#1a1a1a] border-white/[0.15]'
                    : 'bg-[#1a1a1a] border-white/[0.06]'
                }`}
                style={{ boxShadow: isSelected ? '0 4px 20px rgba(0,0,0,0.3)' : undefined }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${type.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: type.color }} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white text-[15px] font-semibold tracking-tight">{type.label}</p>
                  <p className="text-[#666] text-xs font-light mt-0.5">{type.description}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'border-white bg-white' : 'border-[#444]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {step === 2 && selectedConfig && (
        <div className="px-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#1a1a1a] border border-white/[0.06] mb-5 w-fit">
            {(() => { const Icon = selectedConfig.icon; return <Icon className="w-3.5 h-3.5" style={{ color: selectedConfig.color }} />; })()}
            <span className="text-[12px] font-medium" style={{ color: selectedConfig.color }}>
              {selectedConfig.label}
            </span>
            <button
              onClick={() => setStep(1)}
              className="ml-1 w-4 h-4 rounded-full bg-white/[0.06] flex items-center justify-center"
            >
              <X className="w-2.5 h-2.5 text-[#666]" />
            </button>
          </div>

          <div className="mb-4">
            <label className="text-[#666] text-[10px] uppercase tracking-wider font-bold mb-2 block px-1">Тема</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Кратко опишите суть"
              maxLength={100}
              className="w-full px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.08] text-white text-sm placeholder:text-[#444] focus:border-white/[0.2] focus:outline-none transition-colors"
            />
            <p className="text-[#555] text-[10px] mt-1 px-1 text-right">{subject.length}/100</p>
          </div>

          <div className="mb-4">
            <label className="text-[#666] text-[10px] uppercase tracking-wider font-bold mb-2 block px-1">Описание</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Подробно опишите вашу заявку..."
              rows={5}
              className="w-full px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.08] text-white text-sm placeholder:text-[#444] focus:border-white/[0.2] focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          <div className="mb-6">
            <label className="text-[#666] text-[10px] uppercase tracking-wider font-bold mb-2 block px-1">
              Вложения <span className="text-[#555] font-normal">(до 5 файлов, макс. 10 МБ)</span>
            </label>
            {files.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0d0d0d] border border-white/[0.04]">
                    <Paperclip className="w-3.5 h-3.5 text-[#666] shrink-0" />
                    <span className="text-[#999] text-xs flex-1 truncate">{file}</span>
                    <button onClick={() => handleRemoveFile(index)} className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                      <X className="w-3 h-3 text-[#666]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {files.length < 5 && (
              <button
                onClick={handleAddFile}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-white/[0.1] w-full active:bg-white/[0.02] transition-colors"
              >
                <Paperclip className="w-4 h-4 text-[#555]" />
                <span className="text-[#555] text-xs font-medium">Прикрепить файл</span>
              </button>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || sending}
            className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-[15px] transition-all ${
              canSubmit && !sending
                ? 'bg-white text-black active:bg-white/90'
                : 'bg-white/[0.06] text-[#555] cursor-not-allowed'
            }`}
            style={canSubmit && !sending ? { boxShadow: '0 4px 20px rgba(255,255,255,0.1)' } : undefined}
          >
            {sending ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <span>Отправка...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Отправить заявку</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
