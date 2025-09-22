import { useStore } from '../store/store';

const ArticlePanel = () => {
  const { 
    articles, 
    selectedArticleId, 
    setSelectedArticle,
    getObservationsForArticle,
    concepts
  } = useStore();

  const selectedArticle = articles.find(a => a.id === selectedArticleId);
  const observations = selectedArticle ? getObservationsForArticle(selectedArticle.id) : [];

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      backgroundColor: 'white', 
      borderLeft: '1px solid #e5e7eb', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Articles Section - Top */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #e5e7eb',
        flex: '0 0 auto'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Articles ({articles.length})</h2>
      </div>
      
      <div style={{ 
        flex: '1', 
        overflowY: 'auto',
        paddingBottom: selectedArticle ? '400px' : '0' // Reserve space for observations
      }}>
        {articles.map(article => (
          <div
            key={article.id}
            style={{
              padding: '12px',
              borderBottom: '1px solid #e5e7eb',
              cursor: 'pointer',
              backgroundColor: selectedArticleId === article.id ? '#eff6ff' : 'transparent'
            }}
            onClick={() => setSelectedArticle(article.id)}
          >
            <h3 style={{ fontWeight: '500', fontSize: '14px', marginBottom: '4px', lineHeight: '1.4' }}>
              {article.title}
            </h3>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
              {article.year} • {article.authors}
            </p>
            <span style={{
              display: 'inline-block',
              padding: '2px 8px',
              fontSize: '12px',
              borderRadius: '9999px',
              backgroundColor: article.status === 'finished' ? '#dcfce7' : 
                             article.status === 'processing' ? '#fef3c7' : '#f3f4f6',
              color: article.status === 'finished' ? '#166534' : 
                     article.status === 'processing' ? '#92400e' : '#374151'
            }}>
              {article.status.replace('-', ' ')}
            </span>
          </div>
        ))}
      </div>

      {/* Observations Section - Bottom aligned with canvas */}
      {selectedArticle && (
        <div style={{ 
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          padding: '16px', 
          borderTop: '1px solid #e5e7eb', 
          backgroundColor: '#f9fafb',
          height: '400px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ fontWeight: '500', marginBottom: '8px', flex: '0 0 auto' }}>
            Observations ({observations.length})
          </h3>
          
          {/* Display existing observations */}
          {observations.length > 0 && (
            <div style={{ 
              flex: '1',
              overflowY: 'auto'
            }}>
              {observations.map(obs => {
                const concept = concepts.find(c => c.id === obs.conceptId);
                return (
                  <div key={obs.id} style={{ 
                    padding: '8px', 
                    marginBottom: '8px', 
                    backgroundColor: 'white', 
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      {concept?.label} {obs.page && `(p. ${obs.page})`}
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: '1.4' }}>{obs.text}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticlePanel;