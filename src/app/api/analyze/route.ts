import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithDeepSeek } from '@/lib/deepseek';
import { fetchRealExamples } from '@/lib/serp';
import { getFromServerCache, saveToServerCache, generateCacheKey } from '@/lib/cache';
import { AnalysisResult } from '@/types/analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, forceRefresh = false } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'الرجاء إدخال نص للتحليل' },
        { status: 400 }
      );
    }

    const cacheKey = generateCacheKey(text);
    
    // 1. التحقق من الكاش إذا لم يكن forceRefresh
    if (!forceRefresh) {
      const cached = getFromServerCache(cacheKey);
      if (cached) {
        return NextResponse.json({
          ...cached,
          fromCache: true,
        });
      }
    }

    // 2. الاتصال بـ DeepSeek للتحليل الأساسي
    let analysis: AnalysisResult;
    try {
      analysis = await analyzeWithDeepSeek(text);
    } catch (error) {
      console.error('DeepSeek error:', error);
      return NextResponse.json(
        { error: 'فشل الاتصال بخدمة التحليل. حاول مرة أخرى.' },
        { status: 500 }
      );
    }

    // 3. جلب أمثلة واقعية إضافية من Serp (إذا كانت الكلمة إنجليزية أو عربية مترجمة)
    let realExamplesFromSerp = [];
    if (analysis.detected_language === 'en' && !analysis.is_sentence) {
      try {
        const serpExamples = await fetchRealExamples(text);
        realExamplesFromSerp = serpExamples.map(se => ({
          example: se.sentence,
          translation: '', // سنطلب من DeepSeek ترجمتها لاحقاً بشكل منفصل
          source: se.source,
          is_formal: se.is_formal,
        }));
        // دمج الأمثلة الجديدة مع الأمثلة الموجودة (حد أقصى 5)
        if (realExamplesFromSerp.length > 0) {
          analysis.real_examples = [...realExamplesFromSerp, ...analysis.real_examples].slice(0, 5);
        }
      } catch (e) {
        console.warn('Serp fetch failed:', e);
      }
    }

    // 4. حفظ النتيجة في الكاش
    saveToServerCache(cacheKey, analysis);

    // 5. إرجاع النتيجة
    return NextResponse.json({
      ...analysis,
      fromCache: false,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ داخلي في الخادم' },
      { status: 500 }
    );
  }
}