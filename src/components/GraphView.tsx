import { useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useStore } from '../store/store';

const GraphView = () => {
  const graphRef = useRef<any>(null);
  const { concepts, observations, articles, setSelectedConcept } = useStore();

  // Prepare graph data
  const nodes = concepts.map(concept => ({
    id: concept.id,
    label: concept.label,
    dimension: concept.dimension,
    isRoot: !concept.parentId,
    group: concept.dimension
  }));

  const links = concepts
    .filter(concept => concept.parentId)
    .map(concept => ({
      source: concept.parentId,
      target: concept.id
    }));

  // Add co-occurrence edges based on observations
  const cooccurrenceMap = new Map<string, number>();
  articles.forEach(article => {
    const articleObservations = observations.filter(obs => obs.articleId === article.id);
    const conceptIds = articleObservations.map(obs => obs.conceptId);
    
    // Create pairs of concepts that co-occur in the same article
    for (let i = 0; i < conceptIds.length; i++) {
      for (let j = i + 1; j < conceptIds.length; j++) {
        const pair = [conceptIds[i], conceptIds[j]].sort().join('-');
        cooccurrenceMap.set(pair, (cooccurrenceMap.get(pair) || 0) + 1);
      }
    }
  });

  // Add co-occurrence links
  cooccurrenceMap.forEach((weight, pair) => {
    const [source, target] = pair.split('-');
    links.push({ source, target, weight } as any);
  });

  const nodeColor = (node: any) => {
    const colors = {
      purpose: '#3B82F6',
      sector: '#10B981', 
      decision: '#F59E0B',
      knowledge: '#EF4444'
    };
    return colors[node.dimension as keyof typeof colors] || '#6B7280';
  };

  const nodeSize = (node: any) => {
    const observationCount = observations.filter(obs => obs.conceptId === node.id).length;
    return Math.max(5, Math.min(20, 5 + observationCount * 2));
  };

  if (nodes.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No concepts available</h3>
          <p>Import articles to see the concept graph</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={{ nodes, links }}
        nodeLabel={(node: any) => `${node.label}\nObservations: ${observations.filter(obs => obs.conceptId === node.id).length}`}
        nodeColor={nodeColor}
        nodeVal={nodeSize}
        linkWidth={(link: any) => link.weight ? Math.max(1, link.weight * 2) : 1}
        linkColor="#94A3B8"
        onNodeClick={(node: any) => setSelectedConcept(node.id)}
        width={800}
        height={600}
        cooldownTicks={100}
        d3AlphaDecay={0.01}
        d3VelocityDecay={0.3}
      />
    </div>
  );
};

export default GraphView;