'use client';

import { useTma } from '@/lib/tma-context';
import PhotoGallery from '@/components/tma/photos/PhotoGallery';

export default function PhotosPage() {
  const { isLoading, profile, project } = useTma();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-pulse text-[#666] text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!profile || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-[#666]">Сначала войдите в систему</p>
      </div>
    );
  }

  return <PhotoGallery projectId={project.id} />;
}
