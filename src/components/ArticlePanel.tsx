import { useStore } from '../store/store';

const ArticlePanel = () => {
  const { 
    articles, 
    selectedArticleId, 
    setSelectedArticle,
    removeArticle,
    getObservationsForArticle,
    getObservationsForConcept,
    removeObservation,
    concepts,
    selectedConceptId,
    setSelectedConcept
  } = useStore();

  const selectedArticle = articles.find(a => a.id === selectedArticleId);
  const selectedConcept = concepts.find(c => c.id === selectedConceptId);
  const articleObservations = selectedArticle ? getObservationsForArticle(selectedArticle.id) : [];
  const conceptObservations = selectedConcept ? getObservationsForConcept(selectedConcept.id) : [];

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
        paddingBottom: (selectedArticle || selectedConcept) ? '400px' : '0' // Reserve space for observations
      }}>
        {articles.length === 0 ? (
          <div style={{ 
            padding: '32px', 
            textAlign: 'center', 
            color: '#6b7280',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#374151' }}>Welcome to Article Explorer!</h3>
            <p style={{ marginBottom: '16px', lineHeight: '1.5' }}>
              Get started by loading sample data or importing your own articles.
            </p>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>
              Click "Load Sample Data" in the header to see the app in action!
            </p>
          </div>
        ) : (
          articles
            .sort((a, b) => a.title.localeCompare(b.title))
            .map(article => (
          <div
            key={article.id}
            style={{
              padding: '12px',
              borderBottom: '1px solid #e5e7eb',
              cursor: 'pointer',
              backgroundColor: selectedArticleId === article.id ? '#eff6ff' : 'transparent',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <div 
              style={{ flex: 1 }}
              onClick={() => setSelectedArticle(article.id)}
            >
              <h3 style={{ fontWeight: '500', fontSize: '14px', marginBottom: '4px', lineHeight: '1.4' }}>
                {article.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
                {article.year} • {article.authors}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
                  removeArticle(article.id);
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                fontSize: '14px',
                marginLeft: '8px',
                flex: '0 0 auto'
              }}
              title="Delete article"
            >
              ✕
            </button>
          </div>
        ))
        )}
      </div>

      {/* Observations Section - Bottom aligned with canvas */}
      {(selectedArticle || selectedConcept) && (
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flex: '0 0 auto' }}>
            <h3 style={{ fontWeight: '500', margin: 0 }}>
              {selectedConcept ? `Observations for "${selectedConcept.label}"` : 'Article Observations'} ({selectedConcept ? conceptObservations.length : articleObservations.length})
            </h3>
            {selectedConcept && (
              <button
                onClick={() => setSelectedConcept(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                title="Clear concept selection"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Display existing observations */}
          {(selectedConcept ? conceptObservations : articleObservations).length > 0 && (
            <div style={{ 
              flex: '1',
              overflowY: 'auto'
            }}>
              {(selectedConcept ? conceptObservations : articleObservations).map(obs => {
                const concept = concepts.find(c => c.id === obs.conceptId);
                const article = articles.find(a => a.id === obs.articleId);
                return (
                  <div key={obs.id} style={{ 
                    padding: '8px', 
                    marginBottom: '8px', 
                    backgroundColor: 'white', 
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                        {selectedConcept ? (
                          <span>
                            {article?.title} {obs.page && `(p. ${obs.page})`}
                          </span>
                        ) : (
                          <span>
                            {concept?.label} {obs.page && `(p. ${obs.page})`}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '14px', lineHeight: '1.4' }}>{obs.text}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this observation?')) {
                          removeObservation(obs.id);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        marginLeft: '8px',
                        flex: '0 0 auto'
                      }}
                      title="Delete observation"
                    >
                      ✕
                    </button>
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