import type { PhotoFile, PhotoMonthGroup as PhotoMonthGroupType } from '@/types/photos';
import PhotoThumbnail from './PhotoThumbnail';

interface PhotoMonthGroupProps {
  group: PhotoMonthGroupType;
  onPhotoClick: (photo: PhotoFile) => void;
}

export default function PhotoMonthGroup({ group, onPhotoClick }: PhotoMonthGroupProps) {
  return (
    <div>
      <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">
        {group.monthLabel} · {group.photos.length} фото
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {group.photos.map((photo) => (
          <PhotoThumbnail
            key={photo.id}
            photo={photo}
            onClick={() => onPhotoClick(photo)}
          />
        ))}
      </div>
    </div>
  );
}
