export type Role = 'client' | 'manager' | 'admin';

export type ProjectStatus = 'active' | 'completed' | 'paused';

export type AnalysisStatus = 'pending' | 'transcribing' | 'analyzing' | 'done' | 'error';

export type EmployeePosition = 'manager' | 'architect' | 'foreman' | 'project_manager';

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  telegram_id: string | null;
  phone: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  manager_id: string | null;
  current_stage: number; // 0-14
  status: ProjectStatus;
  cover_photo_url: string | null;
  title: string;
  created_at: string;
}

export interface StagePhoto {
  id: string;
  project_id: string;
  stage: number;
  photo_url: string;
  uploaded_by: string;
  created_at: string;
}

export interface Employee {
  id: string;
  full_name: string;
  position: EmployeePosition;
  is_active: boolean;
  created_at: string;
}

export interface NpsResponse {
  id: string;
  client_id: string;
  project_id: string;
  employee_id: string | null;
  stage: number; // 0-14
  score: number; // 0-10
  answers: Record<string, number | string>;
  comment: string | null;
  created_at: string;
}

export interface Call {
  id: string;
  manager_id: string;
  client_id: string | null;
  audio_url: string;
  transcript: string | null;
  score: number | null;
  analysis_status: AnalysisStatus;
  ai_summary: string | null;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  criterion: string;
  weight: number;
  is_active: boolean;
  order_index: number;
}

export interface CallCriterionScore {
  id: string;
  call_id: string;
  criterion_id: string;
  passed: boolean;
  ai_comment: string | null;
}

export interface Stage {
  number: number;
  slug: string;
  title: string;
  description: string;
  defaultPhoto: string;
}

// ============================================================================
// NPS Surveys (Laravel backend models)
// ============================================================================

export interface NpsSurvey {
  id: number;
  name: string;
  process_type: string | null;
  stage_id: string | null;
  stage_name: string | null;
  category_id: number | null;
  is_active: boolean;
  is_manual: boolean;
  questions: NpsSurveyQuestion[];
  sessions_count?: number;
  created_at: string;
  updated_at: string;
}

export interface NpsSurveyQuestion {
  id: number;
  survey_id: number;
  question_text: string;
  order: number;
  free_text_answer: boolean;
  is_yandex_review: boolean;
  options: NpsSurveyQuestionOption[];
}

export interface NpsSurveyQuestionOption {
  id: number;
  question_id: number;
  option_text: string;
  order: number;
}

export interface NpsSurveySession {
  id: number;
  survey_id: number;
  user_id: number;
  entity_type: string;
  entity_id: string | null;
  stage_id: string | null;
  category_id: number | null;
  started_at: string;
  sent_at: string | null;
  completed_at: string | null;
  status: 'created' | 'sent' | 'completed' | 'ignored';
  user: {
    full_name: string | null;
    phone: string | null;
    email: string | null;
  };
  responses: NpsSurveySessionResponse[];
}

export interface NpsSurveySessionResponse {
  id: number;
  session_id: number;
  question_id: number;
  option_id: number | null;
  text_answer: string | null;
  answered_at: string;
  question: NpsSurveyQuestion;
  option: NpsSurveyQuestionOption | null;
}

export interface NpsSurveyQuestionStat {
  question: NpsSurveyQuestion;
  total_answers: number;
  options_stats: {
    option: NpsSurveyQuestionOption;
    count: number;
    percentage: number;
  }[];
  text_answers?: {
    text: string;
    user_name: string;
    answered_at: string;
  }[];
}

export interface B24Stage {
  STATUS_ID?: string;
  statusId?: string;
  id?: string;
  NAME?: string;
  name?: string;
}

export interface B24Category {
  id?: string;
  ID?: string;
  name?: string;
  NAME?: string;
}

export interface B24SmartProcess {
  entityTypeId?: string;
  id?: string;
  title?: string;
  name?: string;
}
