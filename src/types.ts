export interface Article {
  id: string;
  title: string;
  authors: string;
  year: number;
  status: 'not-started' | 'processing' | 'finished';
  abstract?: string;
  doi?: string;
  url?: string;
}

export interface Concept {
  id: string;
  label: string;
  dimension: 'purpose' | 'sector' | 'decision' | 'knowledge';
  parentId?: string;
  description?: string;
}

export interface Observation {
  id: string;
  articleId: string;
  conceptId: string;
  text: string;
  page?: number;
  confidence?: number;
  createdAt: Date;
}

export interface ImportedData {
  title: string;
  authors: string;
  year: number;
  abstract?: string;
  doi?: string;
  url?: string;
}
