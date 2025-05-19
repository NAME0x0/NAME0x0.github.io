/**
 * Silicon Neural Pathways
 * Creates an advanced neural network visualization that represents AVA's silicon-based neural architecture
 * Optimized for performance with adaptive complexity and deep interactivity
 */

// Check if class already exists to prevent duplicate declaration
if (typeof window.SiliconNeuralPathways === 'undefined') {
  
class SiliconNeuralPathways {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.neurons = [];
    this.pathways = [];
    this.activePathways = [];
    this.devicePerformance = 'high'; // Will be set based on device capability
    this.neuronCount = 0; // Will be set based on performance
    this.animationFrame = null;
    this.isVisible = false;
    this.activeSection = 'core-system';
    this.mousePosition = { x: 0, y: 0 };
    this.lastInteractionTime = Date.now();
    this.activityCenters = [];
    this.neuralClusters = [];
    this.dataFlows = [];
    this.processingNodes = [];
    this.neuralState = 'idle'; // idle, processing, learning, analyzing
    this.stateTransitionTime = Date.now();
    this.interactionHistory = [];
    this.neuralActivity = 0.2; // Base activity level
    this.neuralFocus = null; // Current focus point
    this.neuralLayers = []; // Neural network layers
    this.dataPackets = []; // Data packets for visualization
    this.maxDataPackets = 50; // Maximum number of data packets
    this.lastDataPacketTime = Date.now();
    this.dataPacketInterval = 200; // Time between data packet generation (ms)
    this.pulseEffects = []; // Visual pulse effects
    this.maxPulseEffects = 20; // Maximum number of pulse effects
    this.userInteractionStrength = 0; // Strength of user interaction effect
    this.userInteractionDecay = 0.95; // Decay rate for user interaction effect
    
    // Initialize the system
    this.init();
  }
  
  init() {
    // Append canvas to the neural network background container
    const container = document.getElementById('neural-network-bg');
    if (!container) {
      console.error('Neural network background container not found');
      return;
    }
    
    container.appendChild(this.canvas);
    
    // Set canvas size
    this.resizeCanvas();
    
    // Detect device performance
    this.detectPerformance();
    
    // DEFERRED: Create neural architecture - will be called on preloaderComplete
    // this.createNeuralArchitecture(); 
    
    // Add event listeners
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('click', (e) => this.handleClick(e));
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Listen for section changes to adapt visualization
    document.addEventListener('sectionChanged', (e) => {
      if (e && e.detail && e.detail.section) {
        this.activeSection = e.detail.section;
        this.adaptToSection();
      }
    });
    
    // Listen for preloader completion
    document.addEventListener('preloaderComplete', () => {
      // Add a small delay to ensure other UI elements are responsive first
      setTimeout(() => {
        console.log('SiliconNeuralPathways: Delayed start after preloader. Initializing architecture and starting animation.');
        this.isVisible = true;
        // Create neural architecture now that preloader is done and a small delay has passed
        this.createNeuralArchitecture(); 
        // Start animation loop
        this.animate();
      }, 500); // 500ms delay after preloader complete
    });
    
    // Listen for page visibility changes
    document.addEventListener('pagePaused', () => {
      this.pauseAnimation();
    });

    document.addEventListener('pageResumed', () => {
      this.resumeAnimation();
    });
  }
  
  detectPerformance() {
    // Simple performance detection based on device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    
    if (isMobile || isLowEndDevice) {
      this.devicePerformance = 'low';
      this.neuronCount = 60;
      this.maxDataPackets = 15;
      this.maxPulseEffects = 5;
      this.dataPacketInterval = 500;
    } else {
      // Check if device has good GPU
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        this.devicePerformance = 'medium';
        this.neuronCount = 100;
        this.maxDataPackets = 30;
        this.maxPulseEffects = 10;
        this.dataPacketInterval = 300;
      } else {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        if (renderer.indexOf('Intel') >= 0) {
          this.devicePerformance = 'medium';
          this.neuronCount = 100;
          this.maxDataPackets = 30;
          this.maxPulseEffects = 10;
          this.dataPacketInterval = 300;
        } else {
          this.devicePerformance = 'high';
          this.neuronCount = 150;
          this.maxDataPackets = 50;
          this.maxPulseEffects = 20;
          this.dataPacketInterval = 200;
        }
      }
    }
    
    console.log(`Silicon Neural Pathways - Device performance: ${this.devicePerformance}, Neuron count: ${this.neuronCount}`);
  }
  
  createNeuralArchitecture() {
    // Create neural layers
    this.createNeuralLayers();
    
    // Create neurons
    this.createNeurons();
    
    // Create neural pathways
    this.createPathways();
    
    // Create neural clusters
    this.createNeuralClusters();
    
    // Create activity centers
    this.createActivityCenters();
    
    // Create data flows
    this.createDataFlows();
    
    // Create processing nodes
    this.createProcessingNodes();
  }
  
  createNeuralLayers() {
    // Create 3 main neural layers
    this.neuralLayers = [
      { depth: 0.2, neuronDensity: 0.3, color: this.getNeuronColor(0.7) }, // Background layer
      { depth: 0.5, neuronDensity: 0.5, color: this.getNeuronColor(0.8) }, // Middle layer
      { depth: 0.8, neuronDensity: 0.2, color: this.getNeuronColor(0.9) }  // Foreground layer
    ];
  }
  
  createNeurons() {
    this.neurons = [];
    
    // Distribute neurons across layers
    let neuronIndex = 0;
    
    this.neuralLayers.forEach((layer, layerIndex) => {
      const layerNeuronCount = Math.floor(this.neuronCount * layer.neuronDensity);
      
      for (let i = 0; i < layerNeuronCount; i++) {
        // Create neuron with layer-specific properties
        this.neurons.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 1.5 + 1 + (layer.depth * 1.5), // Larger neurons in foreground
          color: layer.color,
          vx: (Math.random() - 0.5) * 0.2 * (1 - layer.depth * 0.5), // Slower movement in foreground
          vy: (Math.random() - 0.5) * 0.2 * (1 - layer.depth * 0.5),
          layer: layerIndex,
          depth: layer.depth,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
          connections: [],
          activity: Math.random() * 0.3 + 0.1,
          lastActivated: Date.now(),
          type: this.getNeuronType(),
          state: 'idle',
          processingPower: Math.random() * 0.5 + 0.5,
          dataCapacity: Math.random() * 0.5 + 0.5,
          interactionInfluence: 0 // Influence from user interaction
        });
        
        neuronIndex++;
      }
    });
  }
  
  getNeuronType() {
    // Different neuron types for varied behavior
    const types = ['standard', 'processor', 'memory', 'connector', 'input', 'output'];
    const weights = [0.5, 0.2, 0.1, 0.1, 0.05, 0.05]; // Probability weights
    
    // Weighted random selection
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < types.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return types[i];
      }
    }
    
    return 'standard';
  }
  
  getNeuronColor(intensity) {
    // NASA-inspired color palette (orange, rust, silver)
    const colors = [
      `rgba(255, 95, 31, ${intensity})`,  // Neon orange
      `rgba(217, 78, 51, ${intensity})`,  // Rust orange
      `rgba(255, 165, 0, ${intensity})`,  // Orange
      `rgba(192, 192, 192, ${intensity})` // Silver
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  createPathways() {
    this.pathways = [];
    
    // Create connections between neurons
    // More connections for higher performance devices
    const connectionDensity = this.devicePerformance === 'high' ? 3 : (this.devicePerformance === 'medium' ? 2 : 1);
    
    // Connect neurons within the same layer and between adjacent layers
    for (let i = 0; i < this.neurons.length; i++) {
      const neuron = this.neurons[i];
      neuron.connections = [];
      
      // Find closest neurons to connect
      const candidates = [];
      
      for (let j = 0; j < this.neurons.length; j++) {
        if (i !== j) {
          const otherNeuron = this.neurons[j];
          
          // Only connect to neurons in the same layer or adjacent layers
          const layerDiff = Math.abs(neuron.layer - otherNeuron.layer);
          if (layerDiff <= 1) {
            const dx = neuron.x - otherNeuron.x;
            const dy = neuron.y - otherNeuron.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Connection distance depends on layer - longer connections in deeper layers
            const maxDistance = 150 + (neuron.layer * 50);
            
            if (distance < maxDistance) {
              candidates.push({ index: j, distance, layerDiff });
            }
          }
        }
      }
      
      // Sort by distance and layer difference (prefer same layer)
      candidates.sort((a, b) => {
        if (a.layerDiff === b.layerDiff) {
          return a.distance - b.distance;
        }
        return a.layerDiff - b.layerDiff;
      });
      
      // Connect to closest neurons
      const connectionsToMake = Math.min(connectionDensity + (neuron.type === 'connector' ? 2 : 0), candidates.length);
      
      for (let k = 0; k < connectionsToMake; k++) {
        if (k < candidates.length) {
          const connectionIndex = candidates[k].index;
          
          // Avoid duplicate connections
          if (!neuron.connections.includes(connectionIndex)) {
            neuron.connections.push(connectionIndex);
            
            // Create pathway with properties based on neuron types
            const targetNeuron = this.neurons[connectionIndex];
            
            this.pathways.push({
              from: i,
              to: connectionIndex,
              activity: 0,
              pulseSpeed: Math.random() * 0.02 + 0.01,
              pulseOffset: Math.random() * Math.PI * 2,
              lastActivated: Date.now(),
              activationDuration: 0,
              width: 1 + (neuron.type === 'connector' || targetNeuron.type === 'connector' ? 0.5 : 0),
              type: this.getPathwayType(neuron, targetNeuron),
              dataFlow: Math.random() < 0.3, // Some pathways actively flow data
              dataFlowDirection: Math.random() < 0.5 ? 'forward' : 'backward',
              dataFlowSpeed: Math.random() * 0.5 + 0.5,
              dataPackets: [] // Data packets traveling along this pathway
            });
          }
        }
      }
    }
  }
  
  getPathwayType(neuron1, neuron2) {
    // Determine pathway type based on connected neurons
    if (neuron1.type === 'input' || neuron2.type === 'input') {
      return 'input';
    } else if (neuron1.type === 'output' || neuron2.type === 'output') {
      return 'output';
    } else if (neuron1.type === 'processor' || neuron2.type === 'processor') {
      return 'processing';
    } else if (neuron1.type === 'memory' || neuron2.type === 'memory') {
      return 'memory';
    } else if (neuron1.type === 'connector' || neuron2.type === 'connector') {
      return 'connector';
    }
    return 'standard';
  }
  
  createNeuralClusters() {
    this.neuralClusters = [];
    
    // Create neural clusters based on neuron proximity and type
    const clusterCount = this.devicePerformance === 'high' ? 5 : (this.devicePerformance === 'medium' ? 3 : 2);
    
    for (let i = 0; i < clusterCount; i++) {
      // Select a random neuron as cluster center
      const centerIndex = Math.floor(Math.random() * this.neurons.length);
      const centerNeuron = this.neurons[centerIndex];
      
      // Find neurons close to the center
      const clusterNeurons = [];
      const clusterRadius = 100 + (Math.random() * 100);
      
      for (let j = 0; j < this.neurons.length; j++) {
        if (j !== centerIndex) {
          const neuron = this.neurons[j];
          const dx = neuron.x - centerNeuron.x;
          const dy = neuron.y - centerNeuron.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < clusterRadius) {
            clusterNeurons.push(j);
          }
        }
      }
      
      // Only create cluster if it has enough neurons
      if (clusterNeurons.length >= 5) {
        this.neuralClusters.push({
          center: centerIndex,
          neurons: clusterNeurons,
          radius: clusterRadius,
          type: this.getClusterType(centerNeuron, clusterNeurons),
          activity: Math.random() * 0.3 + 0.1,
          processingPower: Math.random() * 0.5 + 0.5,
          specialization: this.getClusterSpecialization()
        });
      }
    }
  }
  
  getClusterType(centerNeuron, clusterNeurons) {
    // Determine cluster type based on contained neurons
    const typeCounts = {
      processor: 0,
      memory: 0,
      connector: 0,
      input: 0,
      output: 0,
      standard: 0
    };
    
    // Count center neuron
    typeCounts[centerNeuron.type]++;
    
    // Count cluster neurons
    clusterNeurons.forEach(index => {
      const neuron = this.neurons[index];
      typeCounts[neuron.type]++;
    });
    
    // Find most common type
    let maxCount = 0;
    let dominantType = 'standard';
    
    for (const type in typeCounts) {
      if (typeCounts[type] > maxCount) {
        maxCount = typeCounts[type];
        dominantType = type;
      }
    }
    
    return dominantType;
  }
  
  getClusterSpecialization() {
    // Different specializations for neural clusters
    const specializations = [
      'pattern-recognition',
      'data-processing',
      'memory-storage',
      'decision-making',
      'sensory-processing',
      'language-processing',
      'spatial-reasoning',
      'quantum-computing'
    ];
    
    return specializations[Math.floor(Math.random() * specializations.length)];
  }
  
  createActivityCenters() {
    // Create activity centers based on sections
    this.activityCenters = [
      { x: this.canvas.width * 0.2, y: this.canvas.height * 0.2, section: 'core-system', radius: 150, activity: 0.8 },
      { x: this.canvas.width * 0.8, y: this.canvas.height * 0.3, section: 'knowledge-repository', radius: 150, activity: 0.7 },
      { x: this.canvas.width * 0.3, y: this.canvas.height * 0.7, section: 'project-execution', radius: 150, activity: 0.7 },
      { x: this.canvas.width * 0.7, y: this.canvas.height * 0.8, section: 'capability-matrix', radius: 150, activity: 0.6 },
      { x: this.canvas.width * 0.5, y: this.canvas.height * 0.5, section: 'communication-array', radius: 150, activity: 0.7 }
    ];
  }
  
  createDataFlows() {
    this.dataFlows = [];
    
    // Create data flows between neural clusters
    if (this.neuralClusters.length > 1) {
      for (let i = 0; i < this.neuralClusters.length; i++) {
        for (let j = i + 1; j < this.neuralClusters.length; j++) {
          // Only create flows between some clusters
          if (Math.random() < 0.7) {
            const cluster1 = this.neuralClusters[i];
            const cluster2 = this.neuralClusters[j];
            
            // Get center neurons
            const neuron1 = this.neurons[cluster1.center];
            const neuron2 = this.neurons[cluster2.center];
            
            this.dataFlows.push({
              from: cluster1.center,
              to: cluster2.center,
              fromCluster: i,
              toCluster: j,
              points: this.generateFlowPoints(neuron1, neuron2),
              activity: Math.random() * 0.5 + 0.2,
              dataPackets: [],
              packetGenerationRate: Math.random() * 0.01 + 0.005,
              lastPacketTime: Date.now(),
              width: Math.random() * 2 + 1,
              type: this.getDataFlowType(cluster1, cluster2)
            });
          }
        }
      }
    }
  }
  
  generateFlowPoints(neuron1, neuron2) {
    // Generate curved path between two neurons
    const points = [];
    const pointCount = 10;
    
    // Start and end points
    const startX = neuron1.x;
    const startY = neuron1.y;
    const endX = neuron2.x;
    const endY = neuron2.y;
    
    // Control points for curve
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Perpendicular vector for control point offset
    const perpX = -dy / distance;
    const perpY = dx / distance;
    
    // Control point offset distance
    const offset = distance * (Math.random() * 0.3 + 0.2);
    
    // Control points
    const controlX = (startX + endX) / 2 + perpX * offset;
    const controlY = (startY + endY) / 2 + perpY * offset;
    
    // Generate points along the curve
    for (let i = 0; i <= pointCount; i++) {
      const t = i / pointCount;
      
      // Quadratic Bezier curve formula
      const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
      const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
      
      points.push({ x, y });
    }
    
    return points;
  }
  
  getDataFlowType(cluster1, cluster2) {
    // Determine data flow type based on connected clusters
    const types = ['data', 'command', 'query', 'response', 'sync'];
    
    // Weighted selection based on cluster types
    if (cluster1.type === 'processor' || cluster2.type === 'processor') {
      return Math.random() < 0.6 ? 'command' : 'data';
    } else if (cluster1.type === 'memory' || cluster2.type === 'memory') {
      return Math.random() < 0.7 ? 'data' : 'query';
    } else if (cluster1.type === 'connector' || cluster2.type === 'connector') {
      return Math.random() < 0.5 ? 'sync' : 'data';
    }
    
    return types[Math.floor(Math.random() * types.length)];
  }
  
  createProcessingNodes() {
    this.processingNodes = [];
    
    // Create processing nodes at key locations
    const nodeCount = this.devicePerformance === 'high' ? 5 : (this.devicePerformance === 'medium' ? 3 : 2);
    
    for (let i = 0; i < nodeCount; i++) {
      // Position nodes at strategic locations
      const x = this.canvas.width * (0.2 + Math.random() * 0.6);
      const y = this.canvas.height * (0.2 + Math.random() * 0.6);
      
      this.processingNodes.push({
        x,
        y,
        radius: 20 + Math.random() * 10,
        type: this.getProcessingNodeType(),
        activity: Math.random() * 0.3 + 0.1,
        processingPower: Math.random() * 0.5 + 0.5,
        connections: [],
        state: 'idle',
        lastStateChange: Date.now(),
        stateChangeProbability: Math.random() * 0.01 + 0.005
      });
    }
    
    // Connect processing nodes to nearby neurons
    this.processingNodes.forEach((node, nodeIndex) => {
      // Find nearby neurons
      for (let i = 0; i < this.neurons.length; i++) {
        const neuron = this.neurons[i];
        const dx = neuron.x - node.x;
        const dy = neuron.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          node.connections.push(i);
        }
      }
    });
  }
  
  getProcessingNodeType() {
    // Different types of processing nodes
    const types = ['core', 'memory', 'io', 'analytics', 'quantum'];
    return types[Math.floor(Math.random() * types.length)];
  }
  
  resizeCanvas() {
    // Get container dimensions
    const container = document.getElementById('neural-network-bg');
    if (!container) return;
    
    // Set canvas dimensions to match container
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    
    // Reposition elements after resize
    this.repositionElements();
  }
  
  repositionElements() {
    // Reposition neurons within canvas bounds
    this.neurons.forEach(neuron => {
      // Keep neurons within canvas bounds
      if (neuron.x < 0) neuron.x = 0;
      if (neuron.x > this.canvas.width) neuron.x = this.canvas.width;
      if (neuron.y < 0) neuron.y = 0;
      if (neuron.y > this.canvas.height) neuron.y = this.canvas.height;
    });
    
    // Reposition activity centers
    this.activityCenters = [
      { x: this.canvas.width * 0.2, y: this.canvas.height * 0.2, section: 'core-system', radius: 150, activity: 0.8 },
      { x: this.canvas.width * 0.8, y: this.canvas.height * 0.3, section: 'knowledge-repository', radius: 150, activity: 0.7 },
      { x: this.canvas.width * 0.3, y: this.canvas.height * 0.7, section: 'project-execution', radius: 150, activity: 0.7 },
      { x: this.canvas.width * 0.7, y: this.canvas.height * 0.8, section: 'capability-matrix', radius: 150, activity: 0.6 },
      { x: this.canvas.width * 0.5, y: this.canvas.height * 0.5, section: 'communication-array', radius: 150, activity: 0.7 }
    ];
    
    // Reposition processing nodes
    this.processingNodes.forEach((node, i) => {
      node.x = this.canvas.width * (0.2 + (i / this.processingNodes.length) * 0.6);
      node.y = this.canvas.height * (0.2 + Math.random() * 0.6);
    });
    
    // Update data flows
    this.dataFlows.forEach(flow => {
      if (flow.from < this.neurons.length && flow.to < this.neurons.length) {
        const neuron1 = this.neurons[flow.from];
        const neuron2 = this.neurons[flow.to];
        flow.points = this.generateFlowPoints(neuron1, neuron2);
      }
    });
  }
  
  handleMouseMove(e) {
    // Get mouse position relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    this.mousePosition.x = e.clientX - rect.left;
    this.mousePosition.y = e.clientY - rect.top;
    
    // Record interaction time
    this.lastInteractionTime = Date.now();
    
    // Increase user interaction strength
    this.userInteractionStrength = Math.min(this.userInteractionStrength + 0.2, 1.0);
    
    // Activate neurons near mouse
    this.activateNeuronsNearMouse();
    
    // Add to interaction history
    this.interactionHistory.push({
      x: this.mousePosition.x,
      y: this.mousePosition.y,
      time: Date.now()
    });
    
    // Limit history length
    if (this.interactionHistory.length > 20) {
      this.interactionHistory.shift();
    }
  }
  
  handleClick(e) {
    // Get click position relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Create pulse effect at click position
    this.createPulseEffect(clickX, clickY, 'click');
    
    // Strongly activate neurons near click
    this.activateNeuronsNearPoint(clickX, clickY, 150, 0.9);
    
    // Set neural focus to click position
    this.neuralFocus = { x: clickX, y: clickY, time: Date.now(), strength: 1.0 };
    
    // Generate data packets from click position
    this.generateDataPacketsFromPoint(clickX, clickY, 5);
    
    // Set user interaction strength to maximum
    this.userInteractionStrength = 1.0;
  }
  
  handleScroll() {
    // Increase neural activity on scroll
    this.neuralActivity = Math.min(this.neuralActivity + 0.1, 0.8);
    
    // Decay back to normal over time
    setTimeout(() => {
      this.neuralActivity = Math.max(this.neuralActivity - 0.05, 0.2);
    }, 500);
  }
  
  createPulseEffect(x, y, type = 'standard') {
    // Create visual pulse effect
    if (this.pulseEffects.length >= this.maxPulseEffects) {
      // Remove oldest pulse if at max capacity
      this.pulseEffects.shift();
    }
    
    // Determine pulse properties based on type
    let color, maxRadius, duration;
    
    switch (type) {
      case 'click':
        color = 'rgba(255, 95, 31, 0.5)'; // Neon orange
        maxRadius = 150;
        duration = 1000;
        break;
      case 'data':
        color = 'rgba(255, 165, 0, 0.4)'; // Orange
        maxRadius = 80;
        duration = 800;
        break;
      case 'processing':
        color = 'rgba(217, 78, 51, 0.4)'; // Rust orange
        maxRadius = 100;
        duration = 1200;
        break;
      default:
        color = 'rgba(192, 192, 192, 0.3)'; // Silver
        maxRadius = 60;
        duration = 600;
    }
    
    // Add new pulse effect
    this.pulseEffects.push({
      x,
      y,
      radius: 5,
      maxRadius,
      color,
      startTime: Date.now(),
      duration,
      type
    });
  }
  
  activateNeuronsNearMouse() {
    // Activate neurons near mouse position
    this.activateNeuronsNearPoint(this.mousePosition.x, this.mousePosition.y, 100, 0.7);
  }
  
  activateNeuronsNearPoint(x, y, radius, intensity) {
    // Activate neurons within radius of point
    this.neurons.forEach((neuron, index) => {
      const dx = neuron.x - x;
      const dy = neuron.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < radius) {
        // Calculate activation based on distance (stronger closer to point)
        const activation = intensity * (1 - distance / radius);
        
        // Activate neuron
        this.activateNeuron(index, activation);
        
        // Add interaction influence
        neuron.interactionInfluence = Math.max(neuron.interactionInfluence, activation);
      }
    });
  }
  
  activateNeuron(index, intensity) {
    if (index >= this.neurons.length) return;
    
    const neuron = this.neurons[index];
    
    // Set neuron activity
    neuron.activity = Math.max(neuron.activity, intensity);
    neuron.lastActivated = Date.now();
    
    // Activate connected pathways
    this.pathways.forEach((pathway, pathwayIndex) => {
      if (pathway.from === index || pathway.to === index) {
        // Activate pathway
        pathway.activity = Math.max(pathway.activity, intensity * 0.8);
        pathway.lastActivated = Date.now();
        pathway.activationDuration = 500 + Math.random() * 500;
        
        // Add to active pathways if not already present
        if (!this.activePathways.includes(pathwayIndex)) {
          this.activePathways.push(pathwayIndex);
        }
        
        // Generate data packet along pathway
        if (Math.random() < 0.3) {
          this.generateDataPacket(pathwayIndex);
        }
        
        // Activate connected neuron with slightly less intensity
        const connectedIndex = pathway.from === index ? pathway.to : pathway.from;
        setTimeout(() => {
          this.activateNeuron(connectedIndex, intensity * 0.7);
        }, 100 + Math.random() * 100);
      }
    });
    
    // Create pulse effect at neuron position for high intensity activations
    if (intensity > 0.7 && Math.random() < 0.3) {
      this.createPulseEffect(neuron.x, neuron.y, 'data');
    }
  }
  
  generateDataPacket(pathwayIndex) {
    if (pathwayIndex >= this.pathways.length) return;
    
    const pathway = this.pathways[pathwayIndex];
    
    // Check if we're at max data packets
    if (this.dataPackets.length >= this.maxDataPackets) return;
    
    // Create data packet
    const fromNeuron = this.neurons[pathway.from];
    const toNeuron = this.neurons[pathway.to];
    
    // Determine direction
    const direction = Math.random() < 0.5 ? 'forward' : 'backward';
    const startPoint = direction === 'forward' ? pathway.from : pathway.to;
    const endPoint = direction === 'forward' ? pathway.to : pathway.from;
    
    // Create data packet
    this.dataPackets.push({
      pathwayIndex,
      startPoint,
      endPoint,
      progress: 0,
      speed: 0.01 + Math.random() * 0.02,
      size: 2 + Math.random() * 3,
      color: this.getDataPacketColor(pathway.type),
      type: this.getDataPacketType(pathway.type),
      creationTime: Date.now(),
      lifetime: 2000 + Math.random() * 1000
    });
  }
  
  generateDataPacketsFromPoint(x, y, count) {
    // Find nearest neurons
    const nearestNeurons = [];
    
    this.neurons.forEach((neuron, index) => {
      const dx = neuron.x - x;
      const dy = neuron.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        nearestNeurons.push({ index, distance });
      }
    });
    
    // Sort by distance
    nearestNeurons.sort((a, b) => a.distance - b.distance);
    
    // Generate data packets from nearest neurons
    const packetsToGenerate = Math.min(count, nearestNeurons.length);
    
    for (let i = 0; i < packetsToGenerate; i++) {
      const neuronIndex = nearestNeurons[i].index;
      
      // Find pathways connected to this neuron
      const connectedPathways = [];
      
      this.pathways.forEach((pathway, pathwayIndex) => {
        if (pathway.from === neuronIndex || pathway.to === neuronIndex) {
          connectedPathways.push(pathwayIndex);
        }
      });
      
      // Generate data packet on a random connected pathway
      if (connectedPathways.length > 0) {
        const randomPathway = connectedPathways[Math.floor(Math.random() * connectedPathways.length)];
        this.generateDataPacket(randomPathway);
      }
    }
  }
  
  getDataPacketColor(pathwayType) {
    // Color based on pathway type
    switch (pathwayType) {
      case 'input':
        return 'rgba(255, 95, 31, 0.9)'; // Neon orange
      case 'output':
        return 'rgba(255, 165, 0, 0.9)'; // Orange
      case 'processing':
        return 'rgba(217, 78, 51, 0.9)'; // Rust orange
      case 'memory':
        return 'rgba(192, 192, 192, 0.9)'; // Silver
      case 'connector':
        return 'rgba(255, 255, 255, 0.9)'; // White
      default:
        return 'rgba(255, 95, 31, 0.7)'; // Default neon orange
    }
  }
  
  getDataPacketType(pathwayType) {
    // Different types of data packets
    const types = ['data', 'command', 'query', 'response', 'sync'];
    
    // Weighted selection based on pathway type
    if (pathwayType === 'input') {
      return 'data';
    } else if (pathwayType === 'output') {
      return 'response';
    } else if (pathwayType === 'processing') {
      return 'command';
    } else if (pathwayType === 'memory') {
      return Math.random() < 0.5 ? 'query' : 'response';
    } else if (pathwayType === 'connector') {
      return 'sync';
    }
    
    return types[Math.floor(Math.random() * types.length)];
  }
  
  adaptToSection() {
    // Adapt visualization to current section
    // Find activity center for current section
    const activeCenter = this.activityCenters.find(center => center.section === this.activeSection);
    
    if (activeCenter) {
      // Increase activity in this center
      activeCenter.activity = 0.9;
      
      // Activate neurons near this center
      this.activateNeuronsNearPoint(activeCenter.x, activeCenter.y, activeCenter.radius, 0.8);
      
      // Create pulse effect at center
      this.createPulseEffect(activeCenter.x, activeCenter.y, 'processing');
      
      // Generate data packets from center
      this.generateDataPacketsFromPoint(activeCenter.x, activeCenter.y, 3);
    }
    
    // Change neural state based on section
    switch (this.activeSection) {
      case 'core-system':
        this.neuralState = 'idle';
        break;
      case 'knowledge-repository':
        this.neuralState = 'learning';
        break;
      case 'project-execution':
        this.neuralState = 'processing';
        break;
      case 'capability-matrix':
        this.neuralState = 'analyzing';
        break;
      case 'communication-array':
        this.neuralState = 'communicating';
        break;
      default:
        this.neuralState = 'idle';
    }
    
    this.stateTransitionTime = Date.now();
  }
  
  animate() {
    // Skip if not visible
    if (!this.isVisible) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
      return;
    }
    
    // Request next frame
    this.animationFrame = requestAnimationFrame(() => this.animate());
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw elements
    this.updateElements();
    this.drawElements();
    
    // Generate data packets periodically
    const now = Date.now();
    if (now - this.lastDataPacketTime > this.dataPacketInterval) {
      this.lastDataPacketTime = now;
      
      // Generate random data packets
      if (Math.random() < 0.3 && this.dataPackets.length < this.maxDataPackets) {
        const randomPathwayIndex = Math.floor(Math.random() * this.pathways.length);
        this.generateDataPacket(randomPathwayIndex);
      }
    }
    
    // Decay user interaction strength
    this.userInteractionStrength *= this.userInteractionDecay;
  }
  
  updateElements() {
    // Update neurons
    this.updateNeurons();
    
    // Update pathways
    this.updatePathways();
    
    // Update data packets
    this.updateDataPackets();
    
    // Update pulse effects
    this.updatePulseEffects();
    
    // Update neural focus
    this.updateNeuralFocus();
    
    // Update processing nodes
    this.updateProcessingNodes();
    
    // Update neural clusters
    this.updateNeuralClusters();
    
    // Update data flows
    this.updateDataFlows();
  }
  
  updateNeurons() {
    // Update each neuron
    this.neurons.forEach(neuron => {
      // Move neuron
      neuron.x += neuron.vx;
      neuron.y += neuron.vy;
      
      // Bounce off edges
      if (neuron.x < 0 || neuron.x > this.canvas.width) neuron.vx *= -1;
      if (neuron.y < 0 || neuron.y > this.canvas.height) neuron.vy *= -1;
      
      // Keep within bounds
      if (neuron.x < 0) neuron.x = 0;
      if (neuron.x > this.canvas.width) neuron.x = this.canvas.width;
      if (neuron.y < 0) neuron.y = 0;
      if (neuron.y > this.canvas.height) neuron.y = this.canvas.height;
      
      // Decay activity over time
      const timeSinceActivation = Date.now() - neuron.lastActivated;
      if (timeSinceActivation > 500 && neuron.activity > 0.1) {
        neuron.activity = Math.max(0.1, neuron.activity - 0.01);
      }
      
      // Decay interaction influence
      neuron.interactionInfluence *= 0.95;
    });
  }
  
  updatePathways() {
    // Update active pathways
    this.activePathways = this.activePathways.filter(pathwayIndex => {
      const pathway = this.pathways[pathwayIndex];
      
      // Check if pathway should still be active
      const timeSinceActivation = Date.now() - pathway.lastActivated;
      
      if (timeSinceActivation > pathway.activationDuration) {
        // Decay activity
        pathway.activity = Math.max(0, pathway.activity - 0.05);
        
        // Remove from active list if activity is low
        return pathway.activity > 0.1;
      }
      
      return true;
    });
  }
  
  updateDataPackets() {
    // Update data packets
    this.dataPackets = this.dataPackets.filter(packet => {
      // Update progress
      packet.progress += packet.speed;
      
      // Check if packet has reached destination
      if (packet.progress >= 1) {
        // Activate destination neuron
        this.activateNeuron(packet.endPoint, 0.7);
        return false;
      }
      
      // Check if packet has expired
      const age = Date.now() - packet.creationTime;
      return age < packet.lifetime;
    });
  }
  
  updatePulseEffects() {
    // Update pulse effects
    this.pulseEffects = this.pulseEffects.filter(pulse => {
      // Calculate progress
      const elapsed = Date.now() - pulse.startTime;
      const progress = Math.min(1, elapsed / pulse.duration);
      
      // Update radius based on progress
      pulse.radius = pulse.maxRadius * progress;
      
      // Keep pulse if not complete
      return progress < 1;
    });
  }
  
  updateNeuralFocus() {
    // Update neural focus
    if (this.neuralFocus) {
      // Decay focus strength over time
      const elapsed = Date.now() - this.neuralFocus.time;
      
      if (elapsed > 2000) {
        this.neuralFocus.strength *= 0.95;
        
        // Remove focus if strength is too low
        if (this.neuralFocus.strength < 0.1) {
          this.neuralFocus = null;
        }
      }
    }
  }
  
  updateProcessingNodes() {
    // Update processing nodes
    this.processingNodes.forEach(node => {
      // Randomly change state
      if (Math.random() < node.stateChangeProbability) {
        const states = ['idle', 'processing', 'active', 'standby'];
        node.state = states[Math.floor(Math.random() * states.length)];
        node.lastStateChange = Date.now();
      }
      
      // Update activity based on state
      switch (node.state) {
        case 'processing':
          node.activity = 0.7 + Math.sin(Date.now() * 0.005) * 0.2;
          break;
        case 'active':
          node.activity = 0.8;
          break;
        case 'standby':
          node.activity = 0.3;
          break;
        default:
          node.activity = 0.2 + Math.sin(Date.now() * 0.002) * 0.1;
      }
    });
  }
  
  updateNeuralClusters() {
    // Update neural clusters
    this.neuralClusters.forEach(cluster => {
      // Update activity based on contained neurons
      let totalActivity = 0;
      
      cluster.neurons.forEach(neuronIndex => {
        if (neuronIndex < this.neurons.length) {
          totalActivity += this.neurons[neuronIndex].activity;
        }
      });
      
      // Average activity
      if (cluster.neurons.length > 0) {
        cluster.activity = totalActivity / cluster.neurons.length;
      }
    });
  }
  
  updateDataFlows() {
    // Update data flows
    this.dataFlows.forEach(flow => {
      // Generate data packets along flow
      if (Math.random() < flow.packetGenerationRate && Date.now() - flow.lastPacketTime > 2000) {
        flow.lastPacketTime = Date.now();
        
        // Add data packet
        if (flow.dataPackets.length < 5) {
          flow.dataPackets.push({
            position: 0,
            speed: 0.01 + Math.random() * 0.02,
            size: 2 + Math.random() * 2,
            color: this.getDataPacketColor(flow.type)
          });
        }
      }
      
      // Update existing packets
      flow.dataPackets = flow.dataPackets.filter(packet => {
        // Move packet along flow
        packet.position += packet.speed;
        
        // Remove if reached end
        return packet.position < 1;
      });
    });
  }
  
  drawElements() {
    // Draw in order of visual layers (background to foreground)
    
    // Draw neural layers from back to front
    this.neuralLayers.forEach((layer, layerIndex) => {
      // Draw pathways for this layer
      this.drawPathways(layerIndex);
      
      // Draw neurons for this layer
      this.drawNeurons(layerIndex);
    });
    
    // Draw data flows
    this.drawDataFlows();
    
    // Draw processing nodes
    this.drawProcessingNodes();
    
    // Draw data packets
    this.drawDataPackets();
    
    // Draw pulse effects
    this.drawPulseEffects();
    
    // Draw neural focus
    this.drawNeuralFocus();
    
    // Draw activity centers for current section
    this.drawActivityCenters();
  }
  
  drawNeurons(layerIndex) {
    // Draw neurons for specific layer
    this.neurons.forEach(neuron => {
      if (neuron.layer === layerIndex) {
        // Calculate pulse effect
        const time = performance.now() * 0.001;
        const pulse = Math.sin(time * neuron.pulseSpeed + neuron.pulseOffset) * 0.5 + 0.5;
        
        // Calculate radius with pulse and activity
        const baseRadius = neuron.radius * (1 + pulse * 0.3);
        const activityBoost = neuron.activity * 0.5;
        const interactionBoost = neuron.interactionInfluence * 0.5;
        const radius = baseRadius * (1 + activityBoost + interactionBoost);
        
        // Draw neuron glow (for active neurons)
        if (neuron.activity > 0.3 || neuron.interactionInfluence > 0.3) {
          const glowRadius = radius * 2;
          const gradient = this.ctx.createRadialGradient(
            neuron.x, neuron.y, radius * 0.5,
            neuron.x, neuron.y, glowRadius
          );
          
          // Get base color without alpha
          const baseColor = neuron.color.replace(/[\d.]+\)$/, '');
          
          // Create gradient with transparency
          gradient.addColorStop(0, baseColor + (neuron.activity * 0.5).toFixed(2) + ')');
          gradient.addColorStop(1, baseColor + '0)');
          
          this.ctx.fillStyle = gradient;
          this.ctx.beginPath();
          this.ctx.arc(neuron.x, neuron.y, glowRadius, 0, Math.PI * 2);
          this.ctx.fill();
        }
        
        // Draw neuron
        this.ctx.fillStyle = neuron.color;
        this.ctx.beginPath();
        this.ctx.arc(neuron.x, neuron.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw neuron highlight (for active neurons)
        if (neuron.activity > 0.5 || neuron.interactionInfluence > 0.5) {
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          this.ctx.beginPath();
          this.ctx.arc(
            neuron.x - radius * 0.3,
            neuron.y - radius * 0.3,
            radius * 0.2,
            0, Math.PI * 2
          );
          this.ctx.fill();
        }
      }
    });
  }
  
  drawPathways(layerIndex) {
    // Draw pathways for specific layer
    this.pathways.forEach(pathway => {
      const fromNeuron = this.neurons[pathway.from];
      const toNeuron = this.neurons[pathway.to];
      
      // Only draw if both neurons exist and at least one is in current layer
      if (fromNeuron && toNeuron && (fromNeuron.layer === layerIndex || toNeuron.layer === layerIndex)) {
        // Calculate pathway activity
        const activity = pathway.activity;
        
        // Skip inactive pathways
        if (activity < 0.1) return;
        
        // Calculate pathway width based on activity
        const width = pathway.width * (1 + activity);
        
        // Get pathway color based on type and activity
        let color;
        switch (pathway.type) {
          case 'input':
            color = `rgba(255, 95, 31, ${activity.toFixed(2)})`; // Neon orange
            break;
          case 'output':
            color = `rgba(255, 165, 0, ${activity.toFixed(2)})`; // Orange
            break;
          case 'processing':
            color = `rgba(217, 78, 51, ${activity.toFixed(2)})`; // Rust orange
            break;
          case 'memory':
            color = `rgba(192, 192, 192, ${activity.toFixed(2)})`; // Silver
            break;
          case 'connector':
            color = `rgba(255, 255, 255, ${activity.toFixed(2)})`; // White
            break;
          default:
            color = `rgba(255, 95, 31, ${(activity * 0.7).toFixed(2)})`; // Default neon orange
        }
        
        // Draw pathway
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(fromNeuron.x, fromNeuron.y);
        this.ctx.lineTo(toNeuron.x, toNeuron.y);
        this.ctx.stroke();
        
        // Draw animated pulse along pathway for active pathways
        if (activity > 0.3) {
          const time = performance.now() * 0.001;
          const pulsePosition = (Math.sin(time * pathway.pulseSpeed + pathway.pulseOffset) + 1) / 2;
          
          // Calculate position along pathway
          const x = fromNeuron.x + (toNeuron.x - fromNeuron.x) * pulsePosition;
          const y = fromNeuron.y + (toNeuron.y - fromNeuron.y) * pulsePosition;
          
          // Draw pulse
          this.ctx.fillStyle = color.replace(/[\d.]+\)$/, '1)'); // Full opacity
          this.ctx.beginPath();
          this.ctx.arc(x, y, width * 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    });
  }
  
  drawDataPackets() {
    // Draw data packets
    this.dataPackets.forEach(packet => {
      if (packet.pathwayIndex >= this.pathways.length) return;
      
      const pathway = this.pathways[packet.pathwayIndex];
      const fromNeuron = this.neurons[packet.startPoint];
      const toNeuron = this.neurons[packet.endPoint];
      
      if (!fromNeuron || !toNeuron) return;
      
      // Calculate position along pathway
      const x = fromNeuron.x + (toNeuron.x - fromNeuron.x) * packet.progress;
      const y = fromNeuron.y + (toNeuron.y - fromNeuron.y) * packet.progress;
      
      // Draw packet
      this.ctx.fillStyle = packet.color;
      this.ctx.beginPath();
      this.ctx.arc(x, y, packet.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw packet trail
      this.ctx.strokeStyle = packet.color.replace(/[\d.]+\)$/, '0.3)');
      this.ctx.lineWidth = packet.size * 0.5;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      
      // Calculate trail end point (going back along the path)
      const trailLength = 0.1; // 10% of the path
      const trailProgress = Math.max(0, packet.progress - trailLength);
      const trailX = fromNeuron.x + (toNeuron.x - fromNeuron.x) * trailProgress;
      const trailY = fromNeuron.y + (toNeuron.y - fromNeuron.y) * trailProgress;
      
      this.ctx.lineTo(trailX, trailY);
      this.ctx.stroke();
    });
  }
  
  drawPulseEffects() {
    // Draw pulse effects
    this.pulseEffects.forEach(pulse => {
      // Calculate opacity based on progress
      const elapsed = Date.now() - pulse.startTime;
      const progress = elapsed / pulse.duration;
      const opacity = 1 - progress;
      
      // Draw pulse
      const color = pulse.color.replace(/[\d.]+\)$/, `${opacity.toFixed(2)})`);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
      this.ctx.stroke();
    });
  }
  
  drawNeuralFocus() {
    // Draw neural focus
    if (this.neuralFocus && this.neuralFocus.strength > 0.1) {
      // Draw focus area
      const gradient = this.ctx.createRadialGradient(
        this.neuralFocus.x, this.neuralFocus.y, 10,
        this.neuralFocus.x, this.neuralFocus.y, 150
      );
      
      gradient.addColorStop(0, `rgba(255, 95, 31, ${(this.neuralFocus.strength * 0.3).toFixed(2)})`);
      gradient.addColorStop(1, 'rgba(255, 95, 31, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(this.neuralFocus.x, this.neuralFocus.y, 150, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw focus center
      this.ctx.fillStyle = `rgba(255, 95, 31, ${this.neuralFocus.strength.toFixed(2)})`;
      this.ctx.beginPath();
      this.ctx.arc(this.neuralFocus.x, this.neuralFocus.y, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  drawActivityCenters() {
    // Draw activity center for current section
    const activeCenter = this.activityCenters.find(center => center.section === this.activeSection);
    
    if (activeCenter) {
      // Draw activity center
      const gradient = this.ctx.createRadialGradient(
        activeCenter.x, activeCenter.y, 10,
        activeCenter.x, activeCenter.y, activeCenter.radius
      );
      
      gradient.addColorStop(0, `rgba(255, 95, 31, ${(activeCenter.activity * 0.2).toFixed(2)})`);
      gradient.addColorStop(1, 'rgba(255, 95, 31, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(activeCenter.x, activeCenter.y, activeCenter.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  drawProcessingNodes() {
    // Draw processing nodes
    this.processingNodes.forEach(node => {
      // Draw node glow
      const gradient = this.ctx.createRadialGradient(
        node.x, node.y, node.radius * 0.5,
        node.x, node.y, node.radius * 2
      );
      
      gradient.addColorStop(0, `rgba(255, 95, 31, ${(node.activity * 0.5).toFixed(2)})`);
      gradient.addColorStop(1, 'rgba(255, 95, 31, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw node
      this.ctx.fillStyle = `rgba(255, 95, 31, ${node.activity.toFixed(2)})`;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw node connections
      node.connections.forEach(neuronIndex => {
        if (neuronIndex < this.neurons.length) {
          const neuron = this.neurons[neuronIndex];
          
          this.ctx.strokeStyle = `rgba(255, 95, 31, ${(node.activity * 0.3).toFixed(2)})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(node.x, node.y);
          this.ctx.lineTo(neuron.x, neuron.y);
          this.ctx.stroke();
        }
      });
    });
  }
  
  drawDataFlows() {
    // Draw data flows
    this.dataFlows.forEach(flow => {
      // Skip if no points
      if (!flow.points || flow.points.length < 2) return;
      
      // Draw flow path
      this.ctx.strokeStyle = `rgba(255, 95, 31, ${(flow.activity * 0.3).toFixed(2)})`;
      this.ctx.lineWidth = flow.width;
      this.ctx.beginPath();
      
      // Draw curved path
      this.ctx.moveTo(flow.points[0].x, flow.points[0].y);
      
      for (let i = 1; i < flow.points.length; i++) {
        this.ctx.lineTo(flow.points[i].x, flow.points[i].y);
      }
      
      this.ctx.stroke();
      
      // Draw data packets along flow
      flow.dataPackets.forEach(packet => {
        // Calculate position along flow
        const pointIndex = Math.floor(packet.position * (flow.points.length - 1));
        const nextPointIndex = Math.min(pointIndex + 1, flow.points.length - 1);
        
        const point = flow.points[pointIndex];
        const nextPoint = flow.points[nextPointIndex];
        
        // Interpolate between points
        const t = packet.position * (flow.points.length - 1) - pointIndex;
        const x = point.x + (nextPoint.x - point.x) * t;
        const y = point.y + (nextPoint.y - point.y) * t;
        
        // Draw packet
        this.ctx.fillStyle = packet.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, packet.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
    });
  }
  
  pauseAnimation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
  
  resumeAnimation() {
    if (!this.animationFrame) {
      this.animate();
    }
  }
}

// Assign the class to the window object to make it globally accessible if needed
// and to help prevent re-declaration.
window.SiliconNeuralPathways = SiliconNeuralPathways;

// Initialize neural pathways when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (!window.neuralPathwaysInstance) { // Check if instance already exists
    window.neuralPathwaysInstance = new SiliconNeuralPathways();
  }
});

} // End of if (typeof window.SiliconNeuralPathways === 'undefined')
