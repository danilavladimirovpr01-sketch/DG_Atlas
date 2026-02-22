'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, ChevronRight } from 'lucide-react';
import { NPS_QUESTIONS, POSITION_LABELS } from '@/lib/constants/nps-questions';
import type { Employee } from '@/types';

interface NpsWidgetProps {
  stage: number;
  clientId: string;
  projectId: string;
  onClose: () => void;
  onSubmitted: (stage: number) => void;
}

export default function NpsWidget({
  stage,
  clientId,
  projectId,
  onClose,
  onSubmitted,
}: NpsWidgetProps) {
  const [step, setStep] = useState(0); // 0 = employee selection, 1+ = questions
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const config = NPS_QUESTIONS[stage];
  const questions = config?.questions || [];
  const totalSteps = questions.length + 1; // +1 for employee selection

  useEffect(() => {
    async function loadEmployees() {
      try {
        const res = await fetch(`/api/employees?position=${config?.employeePosition || 'manager'}`);
        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : []);
      } catch {
        // fallback
      } finally {
        setLoadingEmployees(false);
      }
    }
    loadEmployees();
  }, [config?.employeePosition]);

  const currentQuestion = step > 0 ? questions[step - 1] : null;

  async function handleSubmit() {
    setLoading(true);

    // Find the last rating question's answer as the main score
    const ratingQuestions = questions.filter((q) => q.type === 'rating');
    const lastRatingKey = ratingQuestions[ratingQuestions.length - 1]?.key;
    const mainScore = typeof answers[lastRatingKey] === 'number' ? (answers[lastRatingKey] as number) : 0;

    // Extract comment
    const textQuestion = questions.find((q) => q.type === 'text');
    const comment = textQuestion ? (answers[textQuestion.key] as string) || null : null;

    try {
      await fetch('/api/nps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          projectId,
          stage,
          score: mainScore,
          employeeId: selectedEmployee,
          answers,
          comment,
        }),
      });

      setSubmitted(true);
      onSubmitted(stage);
      setTimeout(() => onClose(), 2000);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  function handleRating(value: number) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.key]: value }));
  }

  function handleNext() {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  }

  function canProceed(): boolean {
    if (step === 0) return selectedEmployee !== null;
    if (!currentQuestion) return false;
    if (currentQuestion.type === 'text') return true; // text is optional
    return answers[currentQuestion.key] !== undefined;
  }

  // ===== SUBMITTED SCREEN =====
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">
        <div className="bg-zinc-900 rounded-2xl p-8 w-full max-w-sm text-center space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="text-5xl">&#10003;</div>
          <h3 className="text-xl font-medium text-white">Спасибо!</h3>
          <p className="text-zinc-400">Ваша оценка принята</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 px-4 pb-6">
      <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-sm space-y-5 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-zinc-500 text-xs mb-1">
              Шаг {step + 1} из {totalSteps}
            </p>
            {/* Progress bar */}
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
          <button onClick={onClose} className="ml-4 text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== STEP 0: Employee Selection ===== */}
        {step === 0 && (
          <>
            <h3 className="text-lg font-medium text-white">
              Выберите сотрудника
            </h3>
            <p className="text-zinc-400 text-sm">
              Кто работал с вами на этом этапе?
            </p>

            {loadingEmployees ? (
              <div className="text-center text-zinc-500 py-4">Загрузка...</div>
            ) : (
              <div className="space-y-2">
                {employees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      selectedEmployee === emp.id
                        ? 'bg-white text-black'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                    }`}
                  >
                    <p className="font-medium">{emp.full_name}</p>
                    <p className={`text-xs mt-0.5 ${selectedEmployee === emp.id ? 'text-zinc-600' : 'text-zinc-500'}`}>
                      {POSITION_LABELS[emp.position]}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== STEPS 1+: Rating Questions ===== */}
        {step > 0 && currentQuestion && currentQuestion.type === 'rating' && (
          <>
            <h3 className="text-lg font-medium text-white leading-snug">
              {currentQuestion.label}
            </h3>

            {/* Score buttons 0-10 */}
            <div className="grid grid-cols-11 gap-1">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleRating(i)}
                  className={`h-10 rounded-lg text-sm font-medium transition-colors ${
                    answers[currentQuestion.key] === i
                      ? 'bg-white text-black'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-xs text-zinc-600">
              <span>Совсем нет</span>
              <span>Отлично</span>
            </div>
          </>
        )}

        {/* ===== Text Question ===== */}
        {step > 0 && currentQuestion && currentQuestion.type === 'text' && (
          <>
            <h3 className="text-lg font-medium text-white leading-snug">
              {currentQuestion.label}
            </h3>

            <Textarea
              value={(answers[currentQuestion.key] as string) || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [currentQuestion.key]: e.target.value }))
              }
              placeholder="Напишите здесь..."
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 resize-none"
              rows={4}
            />
          </>
        )}

        {/* Navigation */}
        <div className="flex gap-2">
          {step > 0 && (
            <Button
              onClick={() => setStep(step - 1)}
              variant="outline"
              className="flex-1 h-12 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Назад
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 font-medium disabled:opacity-30"
          >
            {loading ? (
              'Отправляем...'
            ) : step === questions.length ? (
              'Отправить'
            ) : (
              <span className="flex items-center gap-1">
                Далее <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
