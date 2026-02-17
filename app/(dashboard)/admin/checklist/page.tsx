'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { ChecklistItem } from '@/types';

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [newCriterion, setNewCriterion] = useState('');
  const [adding, setAdding] = useState(false);

  async function loadChecklist() {
    try {
      const res = await fetch('/api/checklist');
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch {
      // Failed
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChecklist();
  }, []);

  async function addItem() {
    if (!newCategory.trim() || !newCriterion.trim()) return;
    setAdding(true);

    try {
      const res = await fetch('/api/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newCategory,
          criterion: newCriterion,
          weight: 1,
          order_index: items.length + 1,
        }),
      });

      if (res.ok) {
        const item = await res.json();
        setItems((prev) => [...prev, item]);
        setNewCriterion('');
      }
    } catch {
      // Failed
    } finally {
      setAdding(false);
    }
  }

  async function toggleActive(item: ChecklistItem) {
    try {
      await fetch('/api/checklist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_active: !item.is_active }),
      });

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_active: !i.is_active } : i))
      );
    } catch {
      // Failed
    }
  }

  async function deleteItem(id: string) {
    try {
      await fetch('/api/checklist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      // Failed
    }
  }

  // Group by category
  const grouped: Record<string, ChecklistItem[]> = {};
  items.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  const categories = Object.keys(grouped);

  if (loading) {
    return <div className="py-20 text-center text-zinc-500">Загрузка...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Чеклист оценки звонков</h1>

      {/* Existing items */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category}
            className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                {category}
              </h3>
            </div>
            <div className="divide-y divide-zinc-800">
              {grouped[category].map((item) => (
                <div
                  key={item.id}
                  className="px-5 py-3 flex items-center justify-between hover:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-zinc-700" />
                    <span
                      className={`text-sm ${
                        item.is_active ? 'text-white' : 'text-zinc-600 line-through'
                      }`}
                    >
                      {item.criterion}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(item)}
                      className="text-xs"
                    >
                      <Badge
                        variant="secondary"
                        className={
                          item.is_active
                            ? 'bg-green-900 text-green-300'
                            : 'bg-zinc-700 text-zinc-400'
                        }
                      >
                        {item.is_active ? 'Активен' : 'Выключен'}
                      </Badge>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="text-zinc-500 hover:text-red-400 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add new item */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 space-y-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Добавить критерий
        </h3>
        <div className="flex gap-3">
          <Input
            placeholder="Категория"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600"
            list="categories"
          />
          <datalist id="categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <Input
            placeholder="Критерий"
            value={newCriterion}
            onChange={(e) => setNewCriterion(e.target.value)}
            className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600"
          />
          <Button
            onClick={addItem}
            disabled={adding || !newCategory.trim() || !newCriterion.trim()}
            className="bg-white text-black hover:bg-zinc-200"
          >
            {adding ? '...' : 'Добавить'}
          </Button>
        </div>
      </div>
    </div>
  );
}
