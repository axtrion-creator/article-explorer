import { useState } from 'react';
import { useStore } from '../store/store';
import { Button } from './ui/Button';

interface AddArticleModalProps {
  onClose: () => void;
}

const AddArticleModal = ({ onClose }: AddArticleModalProps) => {
  const { addNewArticle } = useStore();
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [abstract, setAbstract] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !authors.trim()) {
      alert('Please enter article title and authors');
      return;
    }

    addNewArticle(
      title.trim(), 
      authors.trim(), 
      year,
      abstract.trim() || undefined
    );

    // Reset form
    setTitle('');
    setAuthors('');
    setYear(new Date().getFullYear());
    setAbstract('');
    
    onClose();
  };

  const handleCancel = () => {
    setTitle('');
    setAuthors('');
    setYear(new Date().getFullYear());
    setAbstract('');
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
          Add New Article
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Authors *
            </label>
            <input
              type="text"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              placeholder="Author names..."
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Year *
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              placeholder="Publication year"
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
              min="1900"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Abstract (optional)
            </label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Article abstract..."
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical'
              }}
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
              style={{ backgroundColor: '#10b981', color: 'white' }}
            >
              Add Article
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArticleModal;
