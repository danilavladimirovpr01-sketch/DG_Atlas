export interface PhotoFile {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  download_url: string;
  created_at: string;
  month: string;
  year: string;
  theme: string;
  chat_id: string;
}

export interface PhotosApiResponse {
  files: PhotoFile[];
  months_by_year: Record<string, Record<string, string>>;
  years: string[];
  themes: string[];
  default_year: string;
}

export interface PhotoStats {
  total: number;
  thisWeek: number;
}

export interface PhotoMonthGroup {
  monthKey: string;
  monthLabel: string;
  photos: PhotoFile[];
}
