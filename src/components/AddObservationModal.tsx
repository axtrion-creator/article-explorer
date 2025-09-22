import { useState } from 'react';
import { useStore } from '../store/store';
import { Button } from './ui/Button';

interface AddObservationModalProps {
  onClose: () => void;
}

const AddObservationModal = ({ onClose }: AddObservationModalProps) => {
  const { concepts, articles, addObservation, addNewConcept } = useStore();
  const [selectedConceptId, setSelectedConceptId] = useState('');
  const [newConceptLabel, setNewConceptLabel] = useState('');
  const [newConceptDimension, setNewConceptDimension] = useState<'purpose' | 'sector' | 'decision' | 'knowledge'>('knowledge');
  const [observationText, setObservationText] = useState('');
  const [page, setPage] = useState<number | undefined>();
  const [selectedArticleId, setSelectedArticleId] = useState(articles.length > 0 ? articles[0].id : '');
  const [isAddingNewConcept, setIsAddingNewConcept] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let conceptId = selectedConceptId;
    
    // If adding a new concept, create it first
    if (isAddingNewConcept) {
      if (!newConceptLabel.trim()) {
        alert('Please enter a concept label');
        return;
      }
      conceptId = addNewConcept(newConceptLabel.trim(), newConceptDimension);
    }
    
    if (!conceptId || !observationText.trim()) {
      alert('Please select a concept and enter observation text');
      return;
    }

    addObservation({
      articleId: selectedArticleId,
      conceptId,
      text: observationText.trim(),
      page
    });

    // Reset form
    setSelectedConceptId('');
    setNewConceptLabel('');
    setNewConceptDimension('knowledge');
    setObservationText('');
    setPage(undefined);
    setSelectedArticleId(articles.length > 0 ? articles[0].id : '');
    setIsAddingNewConcept(false);
    
    onClose();
  };

  const handleCancel = () => {
    setSelectedConceptId('');
    setNewConceptLabel('');
    setNewConceptDimension('knowledge');
    setObservationText('');
    setPage(undefined);
    setSelectedArticleId(articles.length > 0 ? articles[0].id : '');
    setIsAddingNewConcept(false);
    onClose();
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 50 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '24px', 
        width: '100%', 
        maxWidth: '512px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Add Observation
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Article *
            </label>
            <select
              value={selectedArticleId}
              onChange={(e) => setSelectedArticleId(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            >
              {articles
                .sort((a, b) => a.title.localeCompare(b.title))
                .map(article => (
                  <option key={article.id} value={article.id}>
                    {article.title} ({article.year})
                  </option>
                ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>
                Concept *
              </label>
              <Button
                type="button"
                onClick={() => setIsAddingNewConcept(!isAddingNewConcept)}
                style={{ 
                  fontSize: '12px', 
                  padding: '4px 8px',
                  backgroundColor: isAddingNewConcept ? '#dc2626' : '#2563eb',
                  color: 'white'
                }}
              >
                {isAddingNewConcept ? 'Select Existing' : 'Add New'}
              </Button>
            </div>
            
            {isAddingNewConcept ? (
              <div>
                <input
                  type="text"
                  value={newConceptLabel}
                  onChange={(e) => setNewConceptLabel(e.target.value)}
                  placeholder="Enter new concept name..."
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}
                  required
                />
                <select
                  value={newConceptDimension}
                  onChange={(e) => setNewConceptDimension(e.target.value as 'purpose' | 'sector' | 'decision' | 'knowledge')}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="decision">Decision-making</option>
                  <option value="knowledge">Knowledge management</option>
                  <option value="purpose">Theme</option>
                  <option value="sector">Sector</option>
                </select>
              </div>
            ) : (
              <select
                value={selectedConceptId}
                onChange={(e) => setSelectedConceptId(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                required
              >
                <option value="">Select a concept...</option>
                {concepts
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map(concept => (
                    <option key={concept.id} value={concept.id}>
                      {concept.label} ({concept.dimension})
                    </option>
                  ))}
              </select>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Observation Text *
            </label>
            <textarea
              value={observationText}
              onChange={(e) => setObservationText(e.target.value)}
              placeholder="Enter your observation about this concept in the article..."
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Page (optional)
            </label>
            <input
              type="number"
              value={page || ''}
              onChange={(e) => setPage(e.target.value ? parseInt(e.target.value) : undefined)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
              min="1"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button 
              type="button"
              onClick={handleCancel}
              style={{ backgroundColor: '#6b7280', color: 'white' }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              style={{ backgroundColor: '#2563eb', color: 'white' }}
            >
              Add Observation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddObservationModal;
