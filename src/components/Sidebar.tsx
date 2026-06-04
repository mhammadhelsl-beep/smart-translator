'use client';

import { History, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SidebarProps {
  historyKeys: string[];
  onLoadHistory: (key: string) => void;
  currentResult: any;
}

export default function Sidebar({ historyKeys, onLoadHistory, currentResult }: SidebarProps) {
  const [items, setItems] = useState<{ key: string; title: string }[]>([]);

  useEffect(() => {
    const loaded: { key: string; title: string }[] = [];
    for (const key of historyKeys) {
      const raw = localStorage.getItem(`analysis_${key}`);
      if (raw) {
        try {
          const { data } = JSON.parse(raw);
          const title = data.translation_to_other_language || data.original_text;
          loaded.push({ key, title: title.slice(0, 40) });
        } catch (e) {}
      }
    }
    setItems(loaded);
  }, [historyKeys]);

  const clearHistory = () => {
    if (confirm('هل تريد مسح كل التحليلات السابقة؟')) {
      for (const key of historyKeys) {
        localStorage.removeItem(`analysis_${key}`);
      }
      localStorage.removeItem('analysis_history_keys');
      window.location.reload();
    }
  };

  return (
    <div className="glass-card sticky top-6 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700">
          <History className="w-5 h-5" /> التاريخ
        </h2>
        <button onClick={clearHistory} className="text-red-500 hover:text-red-700 transition" title="مسح الكل">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">لا توجد تحليلات سابقة</p>
      ) : (
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
          {items.map(item => (
            <li key={item.key}>
              <button
                onClick={() => onLoadHistory(item.key)}
                className="w-full text-right text-sm p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all truncate"
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}