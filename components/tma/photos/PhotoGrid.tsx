import { Image as ImageIcon } from 'lucide-react';
import type { PhotoFile, PhotoMonthGroup as PhotoMonthGroupType } from '@/types/photos';
import PhotoMonthGroup from './PhotoMonthGroup';

interface PhotoGridProps {
  monthGroups: PhotoMonthGroupType[];
  onPhotoClick: (photo: PhotoFile) => void;
}

export default function PhotoGrid({ monthGroups, onPhotoClick }: PhotoGridProps) {
  if (monthGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6">
        <div
          className="w-16 h-16 rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center mb-4"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
        >
          <ImageIcon className="w-8 h-8 text-[#444]" />
        </div>
        <p className="text-[#999] text-sm">Нет фото за выбранный период</p>
        <p className="text-[#555] text-xs mt-1 font-light">Попробуйте изменить фильтры</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {monthGroups.map((group) => (
        <PhotoMonthGroup
          key={group.monthKey}
          group={group}
          onPhotoClick={onPhotoClick}
        />
      ))}
    </div>
  );
}
