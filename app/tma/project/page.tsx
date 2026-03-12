'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/laravel-client';
import { ArrowLeft, FolderOpen, MapPin, Calendar } from 'lucide-react';

export default function ProjectPage() {
  const [project, setProject] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/user/projects')
      .then((res) => {
        const data = res?.data ?? res;
        const projects = Array.isArray(data) ? data : data?.projects || [];
        if (projects.length > 0) setProject(projects[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tma" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-white text-xl font-bold tracking-tight">Мой проект</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : !project ? (
        <div className="rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] p-6 text-center">
          <FolderOpen className="w-12 h-12 text-[#444] mx-auto mb-3" />
          <p className="text-[#666] text-sm">Информация о проекте пока недоступна</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] p-5">
            <p className="text-white text-lg font-bold mb-1">{String(project.name || 'Строительство дома')}</p>
            {project.address && (
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4 text-[#666]" />
                <p className="text-[#666] text-sm">{String(project.address)}</p>
              </div>
            )}
            {project.created_at && (
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-4 h-4 text-[#666]" />
                <p className="text-[#666] text-sm">{String(project.created_at).slice(0, 10)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
