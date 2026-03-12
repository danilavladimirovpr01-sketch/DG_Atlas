'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, toArray } from '@/lib/laravel-client';
import { ArrowLeft, FolderOpen } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category?: string;
  stage?: string;
  status?: string;
  source?: string;
  category_id?: number;
}

const DESIGN_CATEGORY_IDS = [11, 19, 21, 35, 63];

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/user/projects')
      .then((data) => {
        setProjects(toArray(data));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const designProjects = projects.filter(
    (p) => p.source === 'design' || (p.category_id && DESIGN_CATEGORY_IDS.includes(p.category_id))
  );
  const constructionProjects = projects.filter(
    (p) => p.source !== 'design' && (!p.category_id || !DESIGN_CATEGORY_IDS.includes(p.category_id))
  );

  function ProjectCard({ project }: { project: Project }) {
    return (
      <div
        className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] p-5"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF9800]/10 flex items-center justify-center shrink-0">
            <FolderOpen className="w-5 h-5 text-[#FF9800]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[15px] font-semibold tracking-tight">{project.title}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.category && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#5AC8FA]/10 text-[#5AC8FA]">
                  {project.category}
                </span>
              )}
              {project.stage && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FF9800]/10 text-[#FF9800]">
                  {project.stage}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tma" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-white text-xl font-bold tracking-tight">Мой Проект</h1>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] text-sm mb-4">{error}</div>
      )}

      {!loading && projects.length === 0 && !error && (
        <div className="text-center text-[#666] py-12 text-sm">Нет проектов</div>
      )}

      {designProjects.length > 0 && (
        <div className="mb-5">
          <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">Проектирование</p>
          <div className="space-y-3">
            {designProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      )}

      {constructionProjects.length > 0 && (
        <div>
          <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">Строительство</p>
          <div className="space-y-3">
            {constructionProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
