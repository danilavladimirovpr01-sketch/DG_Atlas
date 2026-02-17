export type Role = 'client' | 'manager' | 'admin';

export type ProjectStatus = 'active' | 'completed' | 'paused';

export type AnalysisStatus = 'pending' | 'transcribing' | 'analyzing' | 'done' | 'error';

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
  current_stage: number; // 1-14
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

export interface NpsResponse {
  id: string;
  client_id: string;
  project_id: string;
  stage: number;
  score: number; // 0-10
  comment: string | null;
  created_at: string;
}

export interface Call {
  id: string;
  manager_id: string;
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
