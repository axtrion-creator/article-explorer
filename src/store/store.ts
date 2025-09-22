import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  removeArticle: (id: string) => void;
  setSelectedArticle: (id: string | null) => void;
  addConcept: (concept: Concept) => void;
  addNewConcept: (label: string, dimension: 'purpose' | 'sector' | 'decision' | 'knowledge') => string;
  setSelectedConcept: (id: string | null) => void;
  addObservation: (observation: Omit<Observation, 'id' | 'createdAt'>) => void;
  removeObservation: (id: string) => void;
  setShowImportModal: (show: boolean) => void;
  setShowAddArticleModal: (show: boolean) => void;
  setShowAddObservationModal: (show: boolean) => void;
  getObservationsForArticle: (articleId: string) => Observation[];
  getObservationsForConcept: (conceptId: string) => Observation[];
  exportData: () => string;
  importData: (data: string) => void;
  clearAllData: () => void;
  loadSampleData: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state - will be loaded from localStorage or use defaults
      articles: [],
      selectedArticleId: null,
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
      observations: [],
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
      abstract
    };
    set((state) => ({
      articles: [...state.articles, newArticle]
    }));
    return newArticle.id;
  },
  
  removeArticle: (id) => set((state) => ({
    articles: state.articles.filter(article => article.id !== id),
    selectedArticleId: state.selectedArticleId === id ? null : state.selectedArticleId,
    observations: state.observations.filter(obs => obs.articleId !== id)
  })),
  
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
  
  removeObservation: (id) => set((state) => ({
    observations: state.observations.filter(obs => obs.id !== id)
  })),
  
  setShowImportModal: (show) => set({ showImportModal: show }),
  
  setShowAddArticleModal: (show) => set({ showAddArticleModal: show }),
  
  setShowAddObservationModal: (show) => set({ showAddObservationModal: show }),
  
  getObservationsForArticle: (articleId) => {
    return get().observations.filter(obs => obs.articleId === articleId);
  },
  
  getObservationsForConcept: (conceptId) => {
    return get().observations.filter(obs => obs.conceptId === conceptId);
  },
  
  exportData: () => {
    const state = get();
    const exportData = {
      articles: state.articles,
      concepts: state.concepts,
      observations: state.observations,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  },
  
  importData: (data) => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.articles && parsedData.concepts && parsedData.observations) {
        set({
          articles: parsedData.articles,
          concepts: parsedData.concepts,
          observations: parsedData.observations,
          selectedArticleId: null,
          selectedConceptId: null
        });
        alert('Data imported successfully!');
      } else {
        alert('Invalid data format');
      }
    } catch (error) {
      alert('Error importing data: ' + error);
    }
  },
  
  clearAllData: () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      set({
        articles: [],
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
        observations: [],
        selectedArticleId: null,
        selectedConceptId: null
      });
    }
  },
  
  loadSampleData: () => {
    const sampleArticles = [
      {
        id: 'sample-1',
        title: 'The Future of Artificial Intelligence in Healthcare',
        authors: 'Dr. Sarah Johnson, Prof. Michael Chen',
        year: 2024,
        abstract: 'This paper explores the potential applications of AI in healthcare, including diagnostic tools, treatment optimization, and patient monitoring systems.',
        doi: '10.1000/example1'
      },
      {
        id: 'sample-2', 
        title: 'Machine Learning Approaches to Climate Change Prediction',
        authors: 'Dr. Emily Rodriguez, Dr. James Wilson',
        year: 2023,
        abstract: 'We present novel ML techniques for climate modeling that improve accuracy and reduce computational requirements.',
        doi: '10.1000/example2'
      },
      {
        id: 'sample-3',
        title: 'Quantum Computing Applications in Cryptography',
        authors: 'Prof. David Kim, Dr. Lisa Zhang',
        year: 2024,
        abstract: 'This research investigates quantum algorithms for encryption and their implications for cybersecurity.',
        doi: '10.1000/example3'
      }
    ];
    
    const sampleObservations = [
      { id: 'obs-1', articleId: 'sample-1', conceptId: 'c1', text: 'AI shows promise in medical diagnosis with 95% accuracy', page: 1, confidence: 0.9, createdAt: new Date() },
      { id: 'obs-2', articleId: 'sample-1', conceptId: 'c2', text: 'Deep learning models outperform traditional methods by 20%', page: 3, confidence: 0.85, createdAt: new Date() },
      { id: 'obs-3', articleId: 'sample-1', conceptId: 'c3', text: 'Healthcare industry adoption is increasing rapidly', page: 5, confidence: 0.8, createdAt: new Date() },
      { id: 'obs-4', articleId: 'sample-2', conceptId: 'c2', text: 'Neural networks improve climate predictions significantly', page: 2, confidence: 0.88, createdAt: new Date() },
      { id: 'obs-5', articleId: 'sample-2', conceptId: 'c4', text: 'Climate models need better accuracy for policy decisions', page: 4, confidence: 0.75, createdAt: new Date() },
      { id: 'obs-6', articleId: 'sample-3', conceptId: 'c5', text: 'Quantum computers threaten current encryption methods', page: 1, confidence: 0.95, createdAt: new Date() },
      { id: 'obs-7', articleId: 'sample-3', conceptId: 'c6', text: 'New quantum-resistant algorithms are urgently needed', page: 3, confidence: 0.9, createdAt: new Date() }
    ];
    
    set({
      articles: sampleArticles,
      observations: sampleObservations,
      selectedArticleId: 'sample-1'
    });
  }
    }),
    {
      name: 'article-explorer-storage', // unique name for localStorage key
      partialize: (state) => ({
        // Only persist the data we want to save, not UI state
        articles: state.articles,
        concepts: state.concepts,
        observations: state.observations,
        selectedArticleId: state.selectedArticleId,
        selectedConceptId: state.selectedConceptId
      })
    }
  )
);
