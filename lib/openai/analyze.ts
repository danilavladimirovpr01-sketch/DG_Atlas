import OpenAI from 'openai';
import type { ChecklistItem } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CriterionResult {
  criterion_id: string;
  passed: boolean;
  comment: string;
}

export interface AnalysisResult {
  summary: string;
  score: number;
  criteria: CriterionResult[];
}

export async function analyzeCall(
  transcript: string,
  checklist: ChecklistItem[]
): Promise<AnalysisResult> {
  const criteriaList = checklist
    .map((item, i) => `${i + 1}. [${item.id}] ${item.category} — ${item.criterion}`)
    .join('\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Ты — эксперт по оценке качества телефонных звонков менеджеров по продажам в сфере строительства жилых домов.

Проанализируй транскрипт звонка и оцени менеджера по каждому критерию чеклиста.

Верни JSON в формате:
{
  "summary": "краткое резюме звонка (2-3 предложения)",
  "score": <общий процент выполнения 0-100>,
  "criteria": [
    {
      "criterion_id": "<id критерия>",
      "passed": true/false,
      "comment": "краткий комментарий почему выполнен/не выполнен"
    }
  ]
}`,
      },
      {
        role: 'user',
        content: `Чеклист критериев:\n${criteriaList}\n\nТранскрипт звонка:\n${transcript}`,
      },
    ],
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('Empty response from GPT-4o');
  }

  return JSON.parse(content) as AnalysisResult;
}
