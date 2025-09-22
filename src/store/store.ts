import { create } from 'zustand';
import type { Article, Concept, Observation } from '../types';

interface StoreState {
  // Articles
  articles: Article[];
  selectedArticleId: string | null;
  
  // Concepts
  concepts: Concept[];
  selectedConceptId: string | null;
  
  // Observations
  observations: Observation[];
  
  // UI State
  showImportModal: boolean;
  showAddArticleModal: boolean;
  showAddObservationModal: boolean;
  
  // Actions
  addArticle: (article: Article) => void;
  addNewArticle: (title: string, authors: string, year: number, abstract?: string) => string;
  setSelectedArticle: (id: string | null) => void;
  addConcept: (concept: Concept) => void;
  addNewConcept: (label: string, dimension: 'purpose' | 'sector' | 'decision' | 'knowledge') => string;
  setSelectedConcept: (id: string | null) => void;
  addObservation: (observation: Omit<Observation, 'id' | 'createdAt'>) => void;
  setShowImportModal: (show: boolean) => void;
  setShowAddArticleModal: (show: boolean) => void;
  setShowAddObservationModal: (show: boolean) => void;
  getObservationsForArticle: (articleId: string) => Observation[];
  getObservationsForConcept: (conceptId: string) => Observation[];
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial state with sample data
  articles: [
    {
      id: '1',
      title: 'The Future of Artificial Intelligence in Healthcare',
      authors: 'Dr. Sarah Johnson, Prof. Michael Chen',
      year: 2024,
      status: 'finished',
      abstract: 'This paper explores the potential applications of AI in healthcare...',
      doi: '10.1000/example1'
    },
    {
      id: '2', 
      title: 'Machine Learning Approaches to Climate Change Prediction',
      authors: 'Dr. Emily Rodriguez, Dr. James Wilson',
      year: 2023,
      status: 'processing',
      abstract: 'We present novel ML techniques for climate modeling...',
      doi: '10.1000/example2'
    },
    {
      id: '3',
      title: 'Quantum Computing Applications in Cryptography',
      authors: 'Prof. David Kim, Dr. Lisa Zhang',
      year: 2024,
      status: 'not-started',
      abstract: 'This research investigates quantum algorithms for encryption...',
      doi: '10.1000/example3'
    }
  ],
  selectedArticleId: '1',
  concepts: [
    { id: 'c1', label: 'Artificial Intelligence', dimension: 'knowledge', parentId: undefined },
    { id: 'c2', label: 'Machine Learning', dimension: 'knowledge', parentId: 'c1' },
    { id: 'c3', label: 'Healthcare', dimension: 'sector', parentId: undefined },
    { id: 'c4', label: 'Climate Science', dimension: 'sector', parentId: undefined },
    { id: 'c5', label: 'Quantum Computing', dimension: 'knowledge', parentId: undefined },
    { id: 'c6', label: 'Cryptography', dimension: 'knowledge', parentId: 'c5' },
    { id: 'c7', label: 'Research Purpose', dimension: 'purpose', parentId: undefined },
    { id: 'c8', label: 'Decision Making', dimension: 'decision', parentId: undefined }
  ],
  selectedConceptId: null,
  observations: [
    { id: 'o1', articleId: '1', conceptId: 'c1', text: 'AI shows promise in medical diagnosis', page: 1, confidence: 0.9, createdAt: new Date() },
    { id: 'o2', articleId: '1', conceptId: 'c2', text: 'Deep learning models outperform traditional methods', page: 3, confidence: 0.85, createdAt: new Date() },
    { id: 'o3', articleId: '1', conceptId: 'c3', text: 'Healthcare industry adoption is increasing', page: 5, confidence: 0.8, createdAt: new Date() },
    { id: 'o4', articleId: '2', conceptId: 'c2', text: 'Neural networks improve climate predictions', page: 2, confidence: 0.88, createdAt: new Date() },
    { id: 'o5', articleId: '2', conceptId: 'c4', text: 'Climate models need better accuracy', page: 4, confidence: 0.75, createdAt: new Date() },
    { id: 'o6', articleId: '3', conceptId: 'c5', text: 'Quantum computers threaten current encryption', page: 1, confidence: 0.95, createdAt: new Date() },
    { id: 'o7', articleId: '3', conceptId: 'c6', text: 'New quantum-resistant algorithms needed', page: 3, confidence: 0.9, createdAt: new Date() }
  ],
  showImportModal: false,
  showAddArticleModal: false,
  showAddObservationModal: false,
  
  // Actions
  addArticle: (article) => set((state) => ({
    articles: [...state.articles, article]
  })),
  
  addNewArticle: (title, authors, year, abstract) => {
    const newArticle: Article = {
      id: crypto.randomUUID(),
      title,
      authors,
      year,
      status: 'not-started',
      abstract
    };
    set((state) => ({
      articles: [...state.articles, newArticle]
    }));
    return newArticle.id;
  },
  
  setSelectedArticle: (id) => set({ selectedArticleId: id }),
  
  addConcept: (concept) => set((state) => ({
    concepts: [...state.concepts, concept]
  })),
  
  addNewConcept: (label, dimension) => {
    const newConcept: Concept = {
      id: crypto.randomUUID(),
      label,
      dimension
    };
    set((state) => ({
      concepts: [...state.concepts, newConcept]
    }));
    return newConcept.id;
  },
  
  setSelectedConcept: (id) => set({ selectedConceptId: id }),
  
  addObservation: (observation) => set((state) => ({
    observations: [...state.observations, {
      ...observation,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }]
  })),
  
  setShowImportModal: (show) => set({ showImportModal: show }),
  
  setShowAddArticleModal: (show) => set({ showAddArticleModal: show }),
  
  setShowAddObservationModal: (show) => set({ showAddObservationModal: show }),
  
  getObservationsForArticle: (articleId) => {
    return get().observations.filter(obs => obs.articleId === articleId);
  },
  
  getObservationsForConcept: (conceptId) => {
    return get().observations.filter(obs => obs.conceptId === conceptId);
  }
}));
