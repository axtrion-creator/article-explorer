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
    setShowAddObservationModal,
    exportData,
    importData,
    clearAllData
  } = useStore();

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `article-explorer-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result as string;
          importData(data);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Main Graph View */}
      <div style={{ width: '800px', display: 'flex', flexDirection: 'column' }}>
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
            <Button 
              onClick={handleExport}
              style={{ 
                backgroundColor: '#8b5cf6', 
                color: 'white',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Export Data
            </Button>
            <Button 
              onClick={handleImport}
              style={{ 
                backgroundColor: '#f97316', 
                color: 'white',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Import Data
            </Button>
            <Button 
              onClick={clearAllData}
              style={{ 
                backgroundColor: '#ef4444', 
                color: 'white',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Graph Container */}
        <div style={{ flex: 1, padding: '8px' }}>
          <GraphView />
        </div>
      </div>

      {/* Article Panel */}
      <div style={{ width: '1600px' }}>
        <ArticlePanel />
      </div>

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
