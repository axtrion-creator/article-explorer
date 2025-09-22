import { useStore } from './store/store';
import ArticlePanel from './components/ArticlePanel';
import GraphView from './components/GraphView';
import ImportModal from './components/ImportModal';
import AddArticleModal from './components/AddArticleModal';
import AddObservationModal from './components/AddObservationModal';
import { Button } from './components/ui/Button';
import './App.css';

function App() {
  const { 
    showImportModal, 
    setShowImportModal, 
    showAddArticleModal, 
    setShowAddArticleModal,
    showAddObservationModal,
    setShowAddObservationModal
  } = useStore();

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Main Graph View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ 
          padding: '16px 24px', 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#1f2937',
            margin: 0
          }}>
            Article Explorer
          </h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              onClick={() => setShowAddObservationModal(true)}
              style={{ 
                backgroundColor: '#f59e0b', 
                color: 'white',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Add Observation
            </Button>
            <Button 
              onClick={() => setShowAddArticleModal(true)}
              style={{ 
                backgroundColor: '#10b981', 
                color: 'white',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Add Article
            </Button>
            <Button 
              onClick={() => setShowImportModal(true)}
              style={{ 
                backgroundColor: '#2563eb', 
                color: 'white',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Import Articles
            </Button>
          </div>
        </div>

        {/* Graph Container */}
        <div style={{ flex: 1, padding: '16px' }}>
          <GraphView />
        </div>
      </div>

      {/* Article Panel */}
      <ArticlePanel />

      {/* Import Modal */}
      {showImportModal && <ImportModal />}
      
      {/* Add Article Modal */}
      {showAddArticleModal && <AddArticleModal onClose={() => setShowAddArticleModal(false)} />}
      
      {/* Add Observation Modal */}
      {showAddObservationModal && <AddObservationModal onClose={() => setShowAddObservationModal(false)} />}
    </div>
  );
}

export default App;
