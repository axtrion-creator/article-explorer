import { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useStore } from '../store/store';

const GraphView = () => {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { concepts, observations, articles, setSelectedConcept } = useStore();
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  
  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height) - 32; // 32px for padding
        setDimensions({ width: size, height: size });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

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
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'visible',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ 
        width: '90%', 
        height: '90%', 
        padding: '16px',
        boxSizing: 'border-box'
      }}>
        <ForceGraph2D
          ref={graphRef}
          graphData={{ nodes, links }}
          nodeLabel={(node: any) => `${node.label}\nObservations: ${observations.filter(obs => obs.conceptId === node.id).length}`}
          nodeCanvasObject={(node: any, ctx: any, globalScale: any) => {
            // Draw the node circle first
            const nodeSize = Math.max(5, Math.min(20, 5 + observations.filter(obs => obs.conceptId === node.id).length * 2));
            const nodeColor = (() => {
              const colors = {
                purpose: '#3B82F6',
                sector: '#10B981', 
                decision: '#F59E0B',
                knowledge: '#EF4444'
              };
              return colors[node.dimension as keyof typeof colors] || '#6B7280';
            })();
            
            // Draw node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
            ctx.fillStyle = nodeColor;
            ctx.fill();
            
            // Draw node border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw the text
            const label = node.label;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#374151';
            ctx.fillText(label, node.x, node.y);
          }}
          linkWidth={(link: any) => link.weight ? Math.max(1, link.weight * 2) : 1}
          linkColor="#94A3B8"
          onNodeClick={(node: any) => {
            console.log('Node clicked:', node);
            setSelectedConcept(node.id);
          }}
          onBackgroundClick={() => {
            console.log('Background clicked');
            // Don't clear selection on background click to avoid white screen
          }}
          width={dimensions.width}
          height={dimensions.height}
          cooldownTicks={100}
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.3}
          d3Force="center"
          d3ForceStrength={0.1}
        />
      </div>
    </div>
  );
};

export default GraphView;