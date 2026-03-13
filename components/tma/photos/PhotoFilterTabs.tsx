'use client';

import type { PhotosApiResponse } from '@/types/photos';

interface PhotoFilterTabsProps {
  response: PhotosApiResponse;
  activeMonth: string;
  activeTheme: string;
  onMonthChange: (month: string) => void;
  onThemeChange: (theme: string) => void;
}

export default function PhotoFilterTabs({
  response,
  activeMonth,
  activeTheme,
  onMonthChange,
  onThemeChange,
}: PhotoFilterTabsProps) {
  const year = response.default_year;
  const months = response.months_by_year[year] ?? {};

  return (
    <div className="space-y-2">
      {/* Month tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => onMonthChange('all')}
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
            activeMonth === 'all'
              ? 'bg-white text-black'
              : 'bg-[#1a1a1a] text-[#999] border border-white/[0.06]'
          }`}
        >
          Все месяцы
        </button>
        {Object.entries(months)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([key, label]) => (
            <button
              key={key}
              onClick={() => onMonthChange(key)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                activeMonth === key
                  ? 'bg-white text-black'
                  : 'bg-[#1a1a1a] text-[#999] border border-white/[0.06]'
              }`}
            >
              {label}
            </button>
          ))}
      </div>

      {/* Theme tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => onThemeChange('all')}
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
            activeTheme === 'all'
              ? 'bg-[#FF9800] text-black'
              : 'bg-[#1a1a1a] text-[#999] border border-white/[0.06]'
          }`}
        >
          Все темы
        </button>
        {response.themes.map((theme) => (
          <button
            key={theme}
            onClick={() => onThemeChange(theme)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeTheme === theme
                ? 'bg-[#FF9800] text-black'
                : 'bg-[#1a1a1a] text-[#999] border border-white/[0.06]'
            }`}
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
}
