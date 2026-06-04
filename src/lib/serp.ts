import axios from 'axios';

const SERP_API_KEY = process.env.SERP_API_KEY;

export interface SerpExample {
  sentence: string;
  source: string;
  is_formal: boolean;
}

export async function fetchRealExamples(word: string): Promise<SerpExample[]> {
  if (!SERP_API_KEY) {
    console.warn('SERP_API_KEY not set, returning empty examples');
    return [];
  }

  try {
    // البحث عن أمثلة للكلمة
    const query = `"${word}" example sentence`;
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google',
        q: query,
        api_key: SERP_API_KEY,
        num: 5,
      },
      timeout: 10000,
    });

    const organicResults = response.data.organic_results || [];
    const examples: SerpExample[] = [];

    for (const result of organicResults) {
      const snippet = result.snippet || '';
      // استخراج جمل تحتوي على الكلمة (بسيط)
      const sentences = snippet.split(/[.!?]/);
      for (const sentence of sentences) {
        if (sentence.toLowerCase().includes(word.toLowerCase())) {
          examples.push({
            sentence: sentence.trim() + '.',
            source: result.source || result.link || 'web',
            is_formal: result.source?.includes('bbc') || result.source?.includes('gov') || false,
          });
          break; // نأخذ جملة واحدة لكل نتيجة
        }
      }
      if (examples.length >= 3) break;
    }

    return examples;
  } catch (error) {
    console.error('SerpAPI error:', error);
    return [];
  }
}