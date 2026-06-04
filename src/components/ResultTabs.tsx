'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/types/analysis';

type TabId = 'linguistic' | 'contexts' | 'examples' | 'synonyms' | 'tips';

export default function ResultTabs({ result }: { result: AnalysisResult }) {
  const [activeTab, setActiveTab] = useState<TabId>('linguistic');
  const tabs = [
    { id: 'linguistic' as TabId, label: '📖 تحليل لغوي' },
    { id: 'contexts' as TabId, label: '🌍 سياقات' },
    { id: 'examples' as TabId, label: '📝 أمثلة وأخطاء' },
    { id: 'synonyms' as TabId, label: '🔗 مرادفات وأضداد' },
    { id: 'tips' as TabId, label: '💡 نصائح' },
  ];

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50/50 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-5">
        {/* تبويب التحليل اللغوي */}
        {activeTab === 'linguistic' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-indigo-700">تحليل لغوي</h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl">
              <p className="text-lg font-semibold">النص الأصلي: <span className="font-normal">{result.original_text}</span></p>
              <p className="text-lg font-semibold mt-2">الترجمة: <span className="font-normal text-indigo-700">{result.translation_to_other_language}</span></p>
            </div>
            <div className="grid gap-3">
              <p><span className="font-bold">النوع:</span> {result.overall_analysis.pos_tagging}</p>
              <p><span className="font-bold">خلاصة:</span> {result.overall_analysis.summary}</p>
              {result.if_word?.morphology.root && <p><span className="font-bold">الجذر:</span> {result.if_word.morphology.root}</p>}
              {result.if_word?.morphology.conjugations && (
                <div><span className="font-bold">التصريفات:</span>
                  <ul className="list-disc mr-6 mt-1"> 
                    <li>الماضي: {result.if_word.morphology.conjugations.past}</li>
                    <li>المضارع: {result.if_word.morphology.conjugations.present}</li>
                    <li>المستقبل: {result.if_word.morphology.conjugations.future}</li>
                  </ul>
                </div>
              )}
              {result.if_word?.tense_analysis?.most_common_tense && (
                <div><span className="font-bold">الزمن الأكثر شيوعاً:</span> {result.if_word.tense_analysis.most_common_tense.tense_name} ({result.if_word.tense_analysis.most_common_tense.commonality_percent}%)
                  <div className="text-gray-600 text-sm mt-1">مثال: {result.if_word.tense_analysis.most_common_tense.example}</div>
                </div>
              )}
              {result.if_sentence && (
                <>
                  <p><span className="font-bold">بنية الجملة:</span> {result.if_sentence.syntactic_analysis?.structure}</p>
                  <p><span className="font-bold">زمن الجملة:</span> {result.if_sentence.tense_of_sentence}</p>
                  <p><span className="font-bold">ترجمة الجملة كاملة:</span> {result.if_sentence.translation_of_sentence || result.translation_to_other_language}</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* تبويب السياقات */}
        {activeTab === 'contexts' && (
          <div className="space-y-5">
            <h3 className="text-xl font-bold">معاني حسب السياق</h3>
            {result.meanings_by_context?.map((ctx, i) => (
              <div key={i} className="border-r-4 border-indigo-400 pr-4 py-3 bg-gray-50 rounded-xl">
                <div className="font-bold text-indigo-600">{ctx.context}</div>
                <div>الترجمة: {ctx.translation}</div>
                <div className="text-gray-700 mt-1">مثال: {ctx.example}</div>
              </div>
            ))}
          </div>
        )}

        {/* تبويب الأمثلة والأخطاء */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold">أمثلة واقعية</h3>
              {result.real_examples?.map((ex, i) => (
                <div key={i} className="mt-3 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-sm">
                  <div className="font-mono text-gray-800">{ex.example}</div>
                  <div className="text-green-700 mt-2">📖 الترجمة: {ex.translation || '—'}</div>
                  <div className="text-xs text-gray-400 mt-1">المصدر: {ex.source}</div>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-bold">أخطاء شائعة</h3>
              {result.common_mistakes?.map((err, i) => (
                <div key={i} className="mt-3 p-4 bg-red-50 rounded-xl border-r-4 border-red-400">
                  <div className="line-through text-red-600">❌ {err.wrong}</div>
                  <div className="text-green-700 font-medium">✓ {err.correct}</div>
                  <div className="text-sm mt-1">{err.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* تبويب المرادفات والأضداد */}
        {activeTab === 'synonyms' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold">مرادفات</h3>
              {result.synonyms_antonyms?.synonyms?.map((syn, i) => (
                <div key={i} className="mb-3 border-b pb-2">
                  <span className="font-bold text-purple-700">{syn.word}</span>: {syn.difference}<br />
                  <span className="text-sm text-gray-500">مثال: {syn.example}</span>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-bold">أضداد</h3>
              {result.synonyms_antonyms?.antonyms?.map((ant, i) => (
                <div key={i}>• <span className="font-medium">{ant.word}</span> — {ant.example}</div>
              ))}
            </div>
          </div>
        )}

        {/* تبويب النصائح */}
        {activeTab === 'tips' && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-xl"><span className="font-bold">رسمي:</span> {result.usage_tips?.formal}</div>
            <div className="p-3 bg-green-50 rounded-xl"><span className="font-bold">عامي:</span> {result.usage_tips?.informal}</div>
            <div className="p-3 bg-yellow-50 rounded-xl"><span className="font-bold">مستوى اللغة:</span> {result.usage_tips?.register}</div>
            {result.collocations?.length > 0 && (
              <div><span className="font-bold">متلازمات لفظية:</span>
                <ul className="list-disc mr-6 mt-2">
                  {result.collocations.map((col, i) => <li key={i}>{col.phrase} ({col.translation})</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}