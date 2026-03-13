'use client';

import type { PhotoFile } from '@/types/photos';

interface PhotoThumbnailProps {
  photo: PhotoFile;
  onClick: () => void;
}

export default function PhotoThumbnail({ photo, onClick }: PhotoThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className="aspect-square rounded-xl border border-white/[0.06] overflow-hidden active:scale-[0.97] transition-transform cursor-pointer"
    >
      <img
        src={photo.download_url}
        alt={photo.name}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </button>
  );
}
