'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchPhotos, computeStats, buildMonthGroups } from '@/lib/services/photos-service';
import type { PhotosApiResponse, PhotoFile } from '@/types/photos';
import PhotoPageHeader from './PhotoPageHeader';
import PhotoFilterTabs from './PhotoFilterTabs';
import PhotoGrid from './PhotoGrid';
import PhotoLightbox from './PhotoLightbox';

interface PhotoGalleryProps {
  projectId: string;
}

export default function PhotoGallery({ projectId }: PhotoGalleryProps) {
  const [response, setResponse] = useState<PhotosApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState<string>('all');
  const [activeTheme, setActiveTheme] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchPhotos(projectId)
      .then(setResponse)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [projectId]);

  const stats = useMemo(() => {
    if (!response) return { total: 0, thisWeek: 0 };
    return computeStats(response);
  }, [response]);

  const monthGroups = useMemo(() => {
    if (!response) return [];
    return buildMonthGroups(response, activeMonth, activeTheme, response.default_year);
  }, [response, activeMonth, activeTheme]);

  const allFilteredPhotos = useMemo(
    () => monthGroups.flatMap((g) => g.photos),
    [monthGroups]
  );

  // Reset lightbox when filters change
  useEffect(() => {
    setLightboxIndex(null);
  }, [activeMonth, activeTheme]);

  function handlePhotoClick(photo: PhotoFile) {
    const idx = allFilteredPhotos.findIndex((p) => p.id === photo.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
  }

  if (isLoading || !response) {
    return (
      <div className="min-h-screen bg-black px-4 py-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-pulse text-[#666] text-lg">Загрузка фото...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-10">
      <PhotoPageHeader stats={stats} />

      <div className="px-4 space-y-5">
        <PhotoFilterTabs
          response={response}
          activeMonth={activeMonth}
          activeTheme={activeTheme}
          onMonthChange={setActiveMonth}
          onThemeChange={setActiveTheme}
        />
        <PhotoGrid monthGroups={monthGroups} onPhotoClick={handlePhotoClick} />
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={allFilteredPhotos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
