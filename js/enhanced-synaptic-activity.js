/**
 * Enhanced Synaptic Activity
 * Creates a dynamic, silicon-based neural network visualization
 * Simulates AI neural pathways with synaptic connections and data flow
 */

class EnhancedSynapticActivity {
  constructor() {
    // Core properties
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.isInitialized = false;
    this.isActive = true;
    
    // Neural components
    this.neurons = [];
    this.synapses = [];
    this.dataPackets = [];
    this.processingCenters = [];
    
    // Visual properties
    this.colorPalette = {
      neuronCore: '#FF5F1F',       // Neon orange
      neuronGlow: '#D94E33',       // Rust orange
      synapseActive: '#FF7F50',    // Light orange
      synapseDormant: '#C0C0C0',   // Silver
      dataPacket: '#FFD700',       // Gold
      processingCenter: '#FF5F1F', // Neon orange
      background: 'rgba(10, 10, 10, 0)'  // Transparent
    };
    
    // Animation properties
    this.lastFrameTime = 0;
    this.animationFrame = null;
    
    // Interaction properties
    this.mousePosition = { x: 0, y: 0 };
    this.userInteracting = false;
    this.lastInteractionTime = 0;
    
    // Configuration
    this.neuronCount = 120;
    this.synapseCount = 180;
    this.eventCount = 50;
    this.activityMultiplier = 1.0;
    this.flowSpeed = 0.8;
    
    // Initialize
    this.init();
  }
  
  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas size
    this.resize();
    
    // Append to container
    const container = document.getElementById('neural-network-bg');
    if (container) {
      container.appendChild(this.canvas);
    } else {
      console.error('Neural network background container not found');
      return;
    }
    
    // Create neural components
    this.createNeuralArchitecture();
    
    // Add event listeners
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    // Listen for section changes
    document.addEventListener('sectionChanged', (e) => {
      this.handleSectionChange(e.detail.section);
    });
    
    // Listen for optimization changes
    document.addEventListener('optimizationChanged', (e) => {
      this.handleOptimizationChange(e.detail.level);
    });
    
    // Start animation
    this.animate();
    
    this.isInitialized = true;
    console.log('Enhanced Synaptic Activity initialized');
  }
  
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    // Recreate neural architecture when resized
    if (this.isInitialized) {
      this.createNeuralArchitecture();
    }
  }
  
  createNeuralArchitecture() {
    // Clear existing components
    this.neurons = [];
    this.synapses = [];
    this.dataPackets = [];
    this.processingCenters = [];
    
    // Create neurons
    this.createNeurons();
    
    // Create synapses
    this.createSynapses();
    
    // Create processing centers
    this.createProcessingCenters();
  }
  
  createNeurons() {
    // Create different types of neurons
    const neuronTypes = [
      { type: 'core', size: [6, 10], count: 0.15, dendrites: [4, 6] },
      { type: 'processor', size: [4, 8], count: 0.25, dendrites: [3, 5] },
      { type: 'connector', size: [3, 6], count: 0.3, dendrites: [2, 4] },
      { type: 'sensor', size: [2, 5], count: 0.3, dendrites: [1, 3] }
    ];
    
    // Create neurons for each type
    neuronTypes.forEach(neuronType => {
      const typeCount = Math.floor(this.neuronCount * neuronType.count);
      
      for (let i = 0; i < typeCount; i++) {
        // Create neuron with silicon-based appearance
        const neuron = {
          id: this.neurons.length,
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: neuronType.size[0] + Math.random() * (neuronType.size[1] - neuronType.size[0]),
          type: neuronType.type,
          connections: [],
          activity: Math.random() * 0.3 + 0.1,
          pulseRate: Math.random() * 0.01 + 0.005,
          pulsePhase: Math.random() * Math.PI * 2,
          lastFired: 0,
          firingThreshold: Math.random() * 0.3 + 0.6,
          refractoryPeriod: Math.random() * 1000 + 500,
          dendrites: []
        };
        
        // Create dendrites (branching structures)
        const dendriteCount = Math.floor(Math.random() * 
          (neuronType.dendrites[1] - neuronType.dendrites[0] + 1)) + 
          neuronType.dendrites[0];
        
        for (let d = 0; d < dendriteCount; d++) {
          const length = neuron.size * (Math.random() * 2 + 2);
          const angle = Math.random() * Math.PI * 2;
          
          neuron.dendrites.push({
            length: length,
            angle: angle,
            segments: this.generateDendriteSegments(length, angle)
          });
        }
        
        this.neurons.push(neuron);
      }
    });
  }
  
  generateDendriteSegments(length, initialAngle) {
    const segments = [];
    let currentLength = 0;
    let currentAngle = initialAngle;
    let segmentLength = length / (Math.floor(Math.random() * 2) + 2);
    
    while (currentLength < length) {
      // Add some variation to the angle
      currentAngle += (Math.random() - 0.5) * 0.5;
      
      // Create segment
      segments.push({
        length: Math.min(segmentLength, length - currentLength),
        angle: currentAngle
      });
      
      currentLength += segmentLength;
    }
    
    return segments;
  }
  
  createSynapses() {
    // Connect neurons with synapses
    for (let i = 0; i < this.neurons.length; i++) {
      const neuron = this.neurons[i];
      const candidates = [];
      
      // Find potential connections
      for (let j = 0; j < this.neurons.length; j++) {
        if (i !== j) {
          const otherNeuron = this.neurons[j];
          const dx = neuron.x - otherNeuron.x;
          const dy = neuron.y - otherNeuron.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Maximum connection distance depends on neuron type
          let maxDistance = 150;
          
          if (neuron.type === 'connector' || otherNeuron.type === 'connector') {
            maxDistance = 250;
          } else if (neuron.type === 'core' || otherNeuron.type === 'core') {
            maxDistance = 300;
          }
          
          if (distance < maxDistance) {
            candidates.push({ index: j, distance });
          }
        }
      }
      
      // Sort by distance
      candidates.sort((a, b) => a.distance - b.distance);
      
      // Connect to closest neurons
      const connectionsToMake = Math.min(
        neuron.type === 'core' ? 5 :
        neuron.type === 'processor' ? 4 :
        neuron.type === 'connector' ? 3 : 2,
        candidates.length
      );
      
      for (let k = 0; k < connectionsToMake; k++) {
        const targetIndex = candidates[k].index;
        const targetNeuron = this.neurons[targetIndex];
        
        // Avoid duplicate connections
        if (!neuron.connections.includes(targetIndex)) {
          neuron.connections.push(targetIndex);
          
          // Create synapse with silicon-based appearance
          this.synapses.push({
            sourceId: i,
            targetId: targetIndex,
            activity: Math.random() * 0.2,
            width: 1 + (neuron.type === 'core' ? 1 : 
                      neuron.type === 'processor' ? 0.7 : 
                      neuron.type === 'connector' ? 0.5 : 0.3),
            pulseRate: Math.random() * 0.01 + 0.005,
            pulsePhase: Math.random() * Math.PI * 2,
            lastActivated: 0,
            dataFlow: Math.random() < 0.4,
            dataPackets: [],
            packetGenerationRate: Math.random() * 0.005 + 0.001,
            lastPacketTime: 0,
            // Synapse path with slight curve for organic feel
            controlPoint: {
              x: (neuron.x + targetNeuron.x) / 2 + (Math.random() - 0.5) * 50,
              y: (neuron.y + targetNeuron.y) / 2 + (Math.random() - 0.5) * 50
            }
          });
        }
      }
    }
  }
  
  createProcessingCenters() {
    // Create processing centers (clusters of high activity)
    const centerCount = 5;
    
    for (let i = 0; i < centerCount; i++) {
      const x = this.width * (0.2 + Math.random() * 0.6);
      const y = this.height * (0.2 + Math.random() * 0.6);
      const radius = 100 + Math.random() * 100;
      
      this.processingCenters.push({
        x: x,
        y: y,
        radius: radius,
        activity: 0.5 + Math.random() * 0.5,
        pulseRate: 0.001 + Math.random() * 0.002,
        pulsePhase: Math.random() * Math.PI * 2,
        neurons: []
      });
      
      // Find neurons within this center
      for (let j = 0; j < this.neurons.length; j++) {
        const neuron = this.neurons[j];
        const dx = neuron.x - x;
        const dy = neuron.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < radius) {
          this.processingCenters[i].neurons.push(j);
          neuron.activity += 0.2; // Increase activity of neurons in processing centers
        }
      }
    }
  }
  
  handleMouseMove(e) {
    this.mousePosition.x = e.clientX;
    this.mousePosition.y = e.clientY;
    this.userInteracting = true;
    this.lastInteractionTime = performance.now();
    
    // Activate neurons near mouse
    this.activateNeuronsNearMouse();
  }
  
  activateNeuronsNearMouse() {
    const activationRadius = 150;
    
    for (let i = 0; i < this.neurons.length; i++) {
      const neuron = this.neurons[i];
      const dx = neuron.x - this.mousePosition.x;
      const dy = neuron.y - this.mousePosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < activationRadius) {
        // Trigger neuron firing based on proximity
        const activationStrength = 1 - (distance / activationRadius);
        
        if (activationStrength > neuron.firingThreshold && 
            performance.now() - neuron.lastFired > neuron.refractoryPeriod) {
          neuron.lastFired = performance.now();
          
          // Propagate activation to connected neurons
          this.propagateActivation(i);
        }
      }
    }
  }
  
  propagateActivation(neuronIndex) {
    const neuron = this.neurons[neuronIndex];
    
    // Activate connected synapses
    for (let i = 0; i < this.synapses.length; i++) {
      const synapse = this.synapses[i];
      
      if (synapse.sourceId === neuronIndex || synapse.targetId === neuronIndex) {
        synapse.lastActivated = performance.now();
        
        // Create data packet if synapse has data flow
        if (synapse.dataFlow && 
            performance.now() - synapse.lastPacketTime > 1000 / synapse.packetGenerationRate) {
          synapse.lastPacketTime = performance.now();
          
          const source = this.neurons[synapse.sourceId];
          const target = this.neurons[synapse.targetId];
          
          this.dataPackets.push({
            synapseId: i,
            position: 0, // 0 to 1, representing position along the synapse
            speed: 0.005 + Math.random() * 0.01,
            size: 2 + Math.random() * 2,
            sourceX: source.x,
            sourceY: source.y,
            targetX: target.x,
            targetY: target.y,
            controlX: synapse.controlPoint.x,
            controlY: synapse.controlPoint.y
          });
        }
        
        // Activate target neuron with delay
        if (synapse.sourceId === neuronIndex) {
          const targetNeuron = this.neurons[synapse.targetId];
          
          // Schedule activation of target neuron
          setTimeout(() => {
            if (Math.random() < targetNeuron.firingThreshold && 
                performance.now() - targetNeuron.lastFired > targetNeuron.refractoryPeriod) {
              targetNeuron.lastFired = performance.now();
              this.propagateActivation(synapse.targetId);
            }
          }, Math.random() * 200 + 50);
        }
      }
    }
  }
  
  handleSectionChange(section) {
    // Increase activity in the corresponding processing center
    for (let i = 0; i < this.processingCenters.length; i++) {
      const center = this.processingCenters[i];
      
      // Activate neurons in this center
      center.neurons.forEach(neuronIndex => {
        const neuron = this.neurons[neuronIndex];
        neuron.lastFired = performance.now();
        this.propagateActivation(neuronIndex);
      });
    }
  }
  
  handleOptimizationChange(level) {
    // Adjust visualization based on optimization level
    switch (level) {
      case 3: // Heavy optimization
        this.eventCount = Math.floor(this.eventCount * 0.3);
        this.activityMultiplier = 0.3;
        this.flowSpeed = 1.5;
        break;
      case 2: // Medium optimization
        this.eventCount = Math.floor(this.eventCount * 0.5);
        this.activityMultiplier = 0.5;
        this.flowSpeed = 1.2;
        break;
      case 1: // Light optimization
        this.eventCount = Math.floor(this.eventCount * 0.7);
        this.activityMultiplier = 0.7;
        this.flowSpeed = 1.0;
        break;
      case 0: // No optimization
      default:
        this.activityMultiplier = 1.0;
        this.flowSpeed = 0.8;
        break;
    }
  }
  
  animate(timestamp) {
    if (!this.isActive) return;
    
    // Calculate delta time
    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    
    // Clear canvas with transparent background
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update and draw neural components
    this.updateAndDrawComponents(deltaTime);
    
    // Generate random neural events
    this.generateRandomEvents();
    
    // Request next frame
    this.animationFrame = requestAnimationFrame((t) => this.animate(t));
  }
  
  updateAndDrawComponents(deltaTime) {
    // Draw processing centers (background)
    this.drawProcessingCenters();
    
    // Draw synapses
    this.drawSynapses();
    
    // Update and draw data packets
    this.updateAndDrawDataPackets(deltaTime);
    
    // Draw neurons
    this.drawNeurons();
  }
  
  drawProcessingCenters() {
    for (let i = 0; i < this.processingCenters.length; i++) {
      const center = this.processingCenters[i];
      
      // Calculate pulse effect
      const time = performance.now() * 0.001;
      const pulse = Math.sin(time * center.pulseRate + center.pulsePhase) * 0.2 + 0.8;
      
      // Draw center glow
      const gradient = this.ctx.createRadialGradient(
        center.x, center.y, 0,
        center.x, center.y, center.radius
      );
      
      gradient.addColorStop(0, `rgba(255, 95, 31, ${0.1 * center.activity * pulse})`);
      gradient.addColorStop(0.5, `rgba(217, 78, 51, ${0.05 * center.activity * pulse})`);
      gradient.addColorStop(1, 'rgba(10, 10, 10, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  drawNeurons() {
    const time = performance.now();
    
    for (let i = 0; i < this.neurons.length; i++) {
      const neuron = this.neurons[i];
      
      // Calculate pulse effect
      const timeFactor = time * 0.001;
      const pulse = Math.sin(timeFactor * neuron.pulseRate + neuron.pulsePhase) * 0.2 + 0.8;
      
      // Calculate activity effect
      const timeSinceLastFired = time - neuron.lastFired;
      const firingEffect = Math.max(0, 1 - timeSinceLastFired / 1000);
      
      // Draw neuron body with silicon-based appearance
      const glowSize = neuron.size * (1 + firingEffect * 0.5);
      const coreSize = neuron.size * (0.6 + firingEffect * 0.2);
      
      // Draw outer glow
      const glowGradient = this.ctx.createRadialGradient(
        neuron.x, neuron.y, 0,
        neuron.x, neuron.y, glowSize
      );
      
      glowGradient.addColorStop(0, `rgba(217, 78, 51, ${0.7 * pulse * (neuron.activity + firingEffect)})`);
      glowGradient.addColorStop(0.6, `rgba(217, 78, 51, ${0.3 * pulse * (neuron.activity + firingEffect)})`);
      glowGradient.addColorStop(1, 'rgba(217, 78, 51, 0)');
      
      this.ctx.fillStyle = glowGradient;
      this.ctx.beginPath();
      this.ctx.arc(neuron.x, neuron.y, glowSize, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw core
      const coreGradient = this.ctx.createRadialGradient(
        neuron.x, neuron.y, 0,
        neuron.x, neuron.y, coreSize
      );
      
      coreGradient.addColorStop(0, `rgba(255, 95, 31, ${0.9 * (neuron.activity + firingEffect)})`);
      coreGradient.addColorStop(0.7, `rgba(255, 95, 31, ${0.7 * (neuron.activity + firingEffect)})`);
      coreGradient.addColorStop(1, `rgba(217, 78, 51, ${0.5 * (neuron.activity + firingEffect)})`);
      
      this.ctx.fillStyle = coreGradient;
      this.ctx.beginPath();
      this.ctx.arc(neuron.x, neuron.y, coreSize, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw dendrites
      this.drawDendrites(neuron, firingEffect);
    }
  }
  
  drawDendrites(neuron, firingEffect) {
    const time = performance.now() * 0.001;
    
    for (let i = 0; i < neuron.dendrites.length; i++) {
      const dendrite = neuron.dendrites[i];
      let x = neuron.x;
      let y = neuron.y;
      
      // Draw each segment
      for (let j = 0; j < dendrite.segments.length; j++) {
        const segment = dendrite.segments[j];
        const segmentLength = segment.length * (0.8 + Math.sin(time + i + j) * 0.1);
        
        // Calculate end point
        const endX = x + Math.cos(segment.angle) * segmentLength;
        const endY = y + Math.sin(segment.angle) * segmentLength;
        
        // Draw segment with gradient
        const gradient = this.ctx.createLinearGradient(x, y, endX, endY);
        
        gradient.addColorStop(0, `rgba(255, 95, 31, ${0.7 * (neuron.activity + firingEffect) * (1 - j / dendrite.segments.length)})`);
        gradient.addColorStop(1, `rgba(217, 78, 51, ${0.3 * (neuron.activity + firingEffect) * (1 - j / dendrite.segments.length)})`);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 1 + (neuron.size / 10) * (1 - j / dendrite.segments.length);
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        // Update start point for next segment
        x = endX;
        y = endY;
      }
    }
  }
  
  drawSynapses() {
    const time = performance.now();
    
    for (let i = 0; i < this.synapses.length; i++) {
      const synapse = this.synapses[i];
      const source = this.neurons[synapse.sourceId];
      const target = this.neurons[synapse.targetId];
      
      // Calculate activity effect
      const timeSinceLastActivated = time - synapse.lastActivated;
      const activationEffect = Math.max(0, 1 - timeSinceLastActivated / 1000);
      
      // Calculate pulse effect
      const timeFactor = time * 0.001;
      const pulse = Math.sin(timeFactor * synapse.pulseRate + synapse.pulsePhase) * 0.2 + 0.8;
      
      // Determine color based on activity
      const alpha = 0.2 + activationEffect * 0.6 + synapse.activity * 0.2;
      
      // Draw curved synapse path
      this.ctx.beginPath();
      this.ctx.moveTo(source.x, source.y);
      this.ctx.quadraticCurveTo(
        synapse.controlPoint.x,
        synapse.controlPoint.y,
        target.x,
        target.y
      );
      
      // Create gradient along path
      const gradient = this.ctx.createLinearGradient(source.x, source.y, target.x, target.y);
      
      if (activationEffect > 0.5) {
        // Active synapse (orange)
        gradient.addColorStop(0, `rgba(255, 95, 31, ${alpha * pulse})`);
        gradient.addColorStop(0.5, `rgba(255, 127, 80, ${alpha * pulse})`);
        gradient.addColorStop(1, `rgba(217, 78, 51, ${alpha * pulse})`);
      } else {
        // Dormant synapse (silver)
        gradient.addColorStop(0, `rgba(192, 192, 192, ${alpha * pulse})`);
        gradient.addColorStop(0.5, `rgba(169, 169, 169, ${alpha * pulse})`);
        gradient.addColorStop(1, `rgba(192, 192, 192, ${alpha * pulse})`);
      }
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = synapse.width * (0.5 + activationEffect * 0.5);
      this.ctx.stroke();
    }
  }
  
  updateAndDrawDataPackets(deltaTime) {
    const packetsToRemove = [];
    
    for (let i = 0; i < this.dataPackets.length; i++) {
      const packet = this.dataPackets[i];
      
      // Update position
      packet.position += packet.speed * this.flowSpeed * (deltaTime / 16);
      
      // Remove if reached end
      if (packet.position >= 1) {
        packetsToRemove.push(i);
        continue;
      }
      
      // Calculate position along curve
      const t = packet.position;
      const mt = 1 - t;
      
      // Quadratic Bezier curve formula
      const x = mt * mt * packet.sourceX + 2 * mt * t * packet.controlX + t * t * packet.targetX;
      const y = mt * mt * packet.sourceY + 2 * mt * t * packet.controlY + t * t * packet.targetY;
      
      // Draw data packet
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, packet.size);
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
      gradient.addColorStop(0.7, 'rgba(255, 165, 0, 0.7)');
      gradient.addColorStop(1, 'rgba(255, 95, 31, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, packet.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Remove packets that reached their destination
    for (let i = packetsToRemove.length - 1; i >= 0; i--) {
      this.dataPackets.splice(packetsToRemove[i], 1);
    }
  }
  
  generateRandomEvents() {
    // Generate random neural events to keep the network active
    if (performance.now() - this.lastInteractionTime > 2000) {
      // Only generate random events if user hasn't interacted recently
      for (let i = 0; i < this.eventCount * this.activityMultiplier; i++) {
        if (Math.random() < 0.01) {
          const randomNeuronIndex = Math.floor(Math.random() * this.neurons.length);
          const neuron = this.neurons[randomNeuronIndex];
          
          if (performance.now() - neuron.lastFired > neuron.refractoryPeriod) {
            neuron.lastFired = performance.now();
            this.propagateActivation(randomNeuronIndex);
          }
        }
      }
    }
  }
  
  pauseAnimation() {
    this.isActive = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
  
  resumeAnimation() {
    if (!this.isActive) {
      this.isActive = true;
      this.lastFrameTime = performance.now();
      this.animate(this.lastFrameTime);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.enhancedSynapticActivity = new EnhancedSynapticActivity();
});
