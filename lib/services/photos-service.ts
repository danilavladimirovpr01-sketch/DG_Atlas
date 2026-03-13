// TODO: заменить PHOTOS_MOCK на api.get('/api/user/chat-media') — lib/laravel-client.ts
import type { PhotosApiResponse, PhotoStats, PhotoMonthGroup } from '@/types/photos';
import { PHOTOS_MOCK } from '@/lib/data/photos-mock';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchPhotos(projectId: string): Promise<PhotosApiResponse> {
  // TODO: return api.get('/api/user/chat-media');
  return Promise.resolve(PHOTOS_MOCK);
}

export function computeStats(response: PhotosApiResponse): PhotoStats {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return {
    total: response.files.length,
    thisWeek: response.files.filter(
      (f) => new Date(f.created_at).getTime() > weekAgo
    ).length,
  };
}

export function buildMonthGroups(
  response: PhotosApiResponse,
  activeMonth: string | 'all',
  activeTheme: string | 'all',
  year: string
): PhotoMonthGroup[] {
  let files = response.files.filter((f) => f.year === year);

  if (activeMonth !== 'all') {
    files = files.filter((f) => f.month === activeMonth);
  }
  if (activeTheme !== 'all') {
    files = files.filter((f) => f.theme === activeTheme);
  }

  const monthMap = response.months_by_year[year] ?? {};
  const groupMap = new Map<string, typeof files>();

  for (const f of files) {
    if (!groupMap.has(f.month)) groupMap.set(f.month, []);
    groupMap.get(f.month)!.push(f);
  }

  return Array.from(groupMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([monthKey, photos]) => ({
      monthKey,
      monthLabel: `${monthMap[monthKey] ?? monthKey} ${year}`,
      photos,
    }));
}
