// أنواع البيانات الخاصة بالتحليل اللغوي

export interface TenseInfo {
  tense: string;
  form: string;
  example: string;
  commonality: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
}

export interface ContextMeaning {
  context: string;
  translation: string;
  example: string;
  source: string;
  frequency: string;
}

export interface RealExample {
  example: string;
  translation: string;
  source: string;
  is_formal: boolean;
}

export interface CommonMistake {
  wrong: string;
  correct: string;
  explanation: string;
}

export interface Synonym {
  word: string;
  difference: string;
  example: string;
}

export interface Collocation {
  phrase: string;
  translation: string;
  formality: string;
}

export interface AnalysisResult {
  original_text: string;
  detected_language: 'ar' | 'en';
  is_sentence: boolean;
  translation_to_other_language: string;
  overall_analysis: {
    summary: string;
    pos_tagging: string;
    root_word?: string;
  };
  if_word?: {
    part_of_speech_details: {
      primary_type: string;
      secondary_types: string[];
    };
    morphology: {
      root: string;
      plural?: string | null;
      conjugations?: {
        past: string;
        present: string;
        future: string;
        imperative: string;
      };
    };
    tense_analysis?: {
      most_common_tense: {
        tense_name: string;
        example: string;
        commonality_percent: number;
      };
      all_tenses: TenseInfo[];
    };
  };
  if_sentence?: {
    syntactic_analysis: {
      structure: string;
      clauses: string[];
      dependency_relations: string;
    };
    tense_of_sentence: string;
    translation_of_sentence: string;
  };
  meanings_by_context: ContextMeaning[];
  real_examples: RealExample[];
  common_mistakes: CommonMistake[];
  synonyms_antonyms: {
    synonyms: Synonym[];
    antonyms: { word: string; example: string }[];
  };
  collocations: Collocation[];
  usage_tips: {
    formal: string;
    informal: string;
    register: string;
  };
  cache_key: string;
}