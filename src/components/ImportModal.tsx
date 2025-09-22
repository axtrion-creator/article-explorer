import { useState } from 'react';
import { useStore } from '../store/store';
import { parseExcelFile, convertToArticles } from '../utils/import';
import type { Article } from '../types';
import { Button } from './ui/Button';

const ImportModal = () => {
  const { setShowImportModal, addArticle } = useStore();
  const [, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<Article[]>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImporting(true);

    try {
      const imported = await parseExcelFile(selectedFile);
      const articles = convertToArticles(imported);
      setPreview(articles);
    } catch (error) {
      console.error('Import error:', error);
      alert('Error importing file. Please check the format.');
    } finally {
      setImporting(false);
    }
  };

  const handleImport = () => {
    preview.forEach(article => addArticle(article));
    setShowImportModal(false);
    setFile(null);
    setPreview([]);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '512px', maxHeight: '80vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Import Articles</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Select Excel/CSV file
          </label>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            disabled={importing}
          />
        </div>

        {preview.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '500', marginBottom: '8px' }}>Preview ({preview.length} articles)</h3>
            <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid #d1d5db', borderRadius: '4px' }}>
              {preview.slice(0, 10).map((article, index) => (
                <div key={index} style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                  <div style={{ fontWeight: '500' }}>{article.title}</div>
                  <div style={{ color: '#6b7280' }}>
                    {article.year} • {article.authors}
                  </div>
                </div>
              ))}
              {preview.length > 10 && (
                <div style={{ padding: '8px', color: '#6b7280', fontSize: '14px' }}>
                  ... and {preview.length - 10} more articles
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button 
            onClick={() => setShowImportModal(false)}
            style={{ backgroundColor: '#6b7280', color: 'white' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={preview.length === 0}
            style={{ backgroundColor: '#2563eb', color: 'white', opacity: preview.length === 0 ? 0.5 : 1 }}
          >
            Import {preview.length} Articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;