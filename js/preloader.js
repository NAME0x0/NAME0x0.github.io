/**
 * Preloader Script
 * Handles the AI startup sequence and asset preloading with interactive neural network animation
 */

// Track loading progress
let loadingProgress = 0;
let assetsLoaded = 0;
let preloaderActive = true;
let statusLinesComplete = false;

// DOM elements
const preloader = document.querySelector('.preloader');
const mainContainer = document.querySelector('.main-container');
const loadingBar = document.querySelector('.loading-bar');
const statusLines = document.querySelectorAll('.status-line');

// Neural network animation variables
let canvas, ctx;
let neurons = [];
let connections = [];
let activeConnections = [];
let mousePosition = { x: 0, y: 0 };
let animationFrame;

// Initialize preloader
document.addEventListener('DOMContentLoaded', () => {
  console.log('Preloader script initialized');
  initPreloader();
  setupNeuralAnimation();
  preloadAssets();
  
  // Add event listener for mouse movement
  if (preloader) {
    preloader.addEventListener('mousemove', (e) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
      
      // Activate neurons near mouse
      activateNeuronsNearMouse();
    });
    
    // Add event listener for clicks to create ripple effects
    preloader.addEventListener('click', (e) => {
      createRippleEffect(e.clientX, e.clientY);
    });
  }
  
  // Force complete loading after a maximum time to prevent getting stuck
  setTimeout(() => {
    if (preloaderActive) {
      console.log('Force completing preloader after maximum wait time of 10 seconds');
      completeLoading();
    }
  }, 10000); // Maximum wait time of 10 seconds as requested by user
});

// Initialize the preloader animation
function initPreloader() {
  console.log('Initializing preloader animation');
  
  // Show first status line immediately (or with minimal delay)
  setTimeout(() => {
    if (statusLines[0]) {
      statusLines[0].classList.add('active');
      statusLines[0].classList.add('typing');
      updateLoadingBar(10); // Show initial progress
    }
  }, 100); 

  const numStatusLines = statusLines.length;
  const baseDelayBetweenLines = 150; 
  const initialDelayForLoop = 200; 
  const lastLineTypingDuration = 300; 

  if (numStatusLines === 0) {
      statusLinesComplete = true;
      console.log('No status lines to display.');
      // No need to call updateLoadingBar here, checkCompletionConditions will handle it
      checkCompletionConditions();
      return; // Exit if no status lines
  }

  // Show subsequent status lines with delays
  for (let i = 1; i < numStatusLines; i++) {
    setTimeout(() => {
      if (statusLines[i-1]) {
        statusLines[i-1].classList.remove('typing');
        statusLines[i-1].classList.add('completed');
      }
      
      if (statusLines[i]) {
        statusLines[i].classList.add('active');
        statusLines[i].classList.add('typing');
      }
      // Don't call updateLoadingBar directly, let checkCompletionConditions handle it
      // checkCompletionConditions(); // Not ideal to call in a loop, call when all are done
      
      if (i === numStatusLines - 1) {
        setTimeout(() => {
          if (statusLines[i]) {
            statusLines[i].classList.remove('typing');
            statusLines[i].classList.add('completed');
          }
          statusLinesComplete = true;
          console.log('All status lines complete');
          checkCompletionConditions();
        }, lastLineTypingDuration); 
      }
    }, initialDelayForLoop + (i * baseDelayBetweenLines));
  }
  
  if (numStatusLines === 1) {
    setTimeout(() => {
      if (statusLines[0]) {
        statusLines[0].classList.remove('typing');
        statusLines[0].classList.add('completed');
      }
      statusLinesComplete = true;
      console.log('All status lines complete (single line case)');
      checkCompletionConditions();
    }, 100 + lastLineTypingDuration); 
  }
}

// Setup neural network animation for preloader
function setupNeuralAnimation() {
  // Create canvas for neural animation
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '1'; // Ensure it's above the background but below content
  
  // Add canvas to preloader
  if (preloader) {
    preloader.appendChild(canvas);
  } else {
    console.error('Preloader element not found');
    return;
  }
  
  // Create neurons
  const neuronCount = Math.min(100, Math.floor(window.innerWidth * window.innerHeight / 8000)); // More neurons for better visual
  for (let i = 0; i < neuronCount; i++) {
    neurons.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1.5, // Larger neurons for better visibility
      color: getRandomColor(),
      vx: Math.random() * 0.2 - 0.1,
      vy: Math.random() * 0.2 - 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
      activity: Math.random() * 0.5 + 0.2 // Higher initial activity
    });
  }
  
  // Create connections between neurons
  for (let i = 0; i < neurons.length; i++) {
    for (let j = i + 1; j < neurons.length; j++) {
      const dx = neurons[i].x - neurons[j].x;
      const dy = neurons[i].y - neurons[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Adaptive connection distance based on neuron count
      const connectionDistance = Math.min(250, 700 / Math.sqrt(neuronCount));
      
      if (distance < connectionDistance) { // Only connect neurons within a certain distance
        connections.push({
          from: i,
          to: j,
          activity: 0.3, // Higher initial activity
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
          dataPackets: [] // For data packet animation
        });
      }
    }
  }
  
  // Start animation
  animateNeuralNetwork();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Get random color from NASA-inspired palette
function getRandomColor() {
  const colors = [
    'rgba(255, 95, 31, 0.9)',   // Orange (brighter)
    'rgba(217, 78, 51, 0.9)',   // Rust Orange (brighter)
    'rgba(255, 140, 66, 0.9)',  // Light Orange (brighter)
    'rgba(192, 192, 192, 0.9)'  // Silver (brighter)
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

// Animate neural network
function animateNeuralNetwork() {
  if (!preloaderActive) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw connections
  drawConnections();
  
  // Update and draw neurons
  updateAndDrawNeurons();
  
  // Draw ripple effects
  drawRippleEffects();
  
  // Randomly activate neurons for dynamic effect
  if (Math.random() < 0.1) { // Increased probability for more activity
    const randomIndex = Math.floor(Math.random() * neurons.length);
    activateNeuron(randomIndex, 0.8);
    
    // Generate data packets along random connections
    if (Math.random() < 0.5) { // Increased probability for more data packets
      generateDataPackets(randomIndex);
    }
  }
  
  animationFrame = requestAnimationFrame(animateNeuralNetwork);
}

// Draw connections between neurons
function drawConnections() {
  connections.forEach(connection => {
    const fromNeuron = neurons[connection.from];
    const toNeuron = neurons[connection.to];
    
    // Calculate pulse effect
    const time = performance.now() * 0.001;
    const pulse = Math.sin(time * connection.pulseSpeed + connection.pulseOffset) * 0.5 + 0.5;
    
    // Draw connection line with pulse effect
    ctx.beginPath();
    ctx.moveTo(fromNeuron.x, fromNeuron.y);
    ctx.lineTo(toNeuron.x, toNeuron.y);
    
    // Color based on activity
    const opacity = (connection.activity * 0.7 + pulse * 0.3).toFixed(2); // Brighter connections
    ctx.strokeStyle = `rgba(255, 95, 31, ${opacity})`;
    ctx.lineWidth = 0.8; // Slightly thicker lines
    ctx.stroke();
    
    // Update and draw data packets
    updateAndDrawDataPackets(connection, fromNeuron, toNeuron);
  });
}

// Update and draw data packets along connections
function updateAndDrawDataPackets(connection, fromNeuron, toNeuron) {
  // Update existing packets
  connection.dataPackets = connection.dataPackets.filter(packet => {
    // Update packet position
    packet.progress += packet.speed;
    
    // Remove if completed
    if (packet.progress >= 1) {
      // Activate target neuron when packet arrives
      activateNeuron(connection.to, 0.8);
      return false;
    }
    
    // Calculate position along connection
    const x = fromNeuron.x + (toNeuron.x - fromNeuron.x) * packet.progress;
    const y = fromNeuron.y + (toNeuron.y - fromNeuron.y) * packet.progress;
    
    // Draw packet
    ctx.beginPath();
    ctx.arc(x, y, packet.size, 0, Math.PI * 2);
    ctx.fillStyle = packet.color;
    ctx.fill();
    
    // Draw trail
    ctx.beginPath();
    ctx.moveTo(x, y);
    const trailLength = 0.08; // Longer trail (8% of the connection length)
    const trailX = x - (toNeuron.x - fromNeuron.x) * trailLength * packet.progress;
    const trailY = y - (toNeuron.y - fromNeuron.y) * trailLength * packet.progress;
    ctx.lineTo(trailX, trailY);
    ctx.strokeStyle = packet.color.replace(/[\d.]+\)$/, '0.6)'); // More visible trail
    ctx.lineWidth = packet.size / 1.5;
    ctx.stroke();
    
    return true;
  });
}

// Generate data packets from a neuron
function generateDataPackets(neuronIndex) {
  // Find connections from this neuron
  connections.forEach(connection => {
    if (connection.from === neuronIndex || connection.to === neuronIndex) {
      // Determine direction
      const fromIndex = connection.from === neuronIndex ? connection.from : connection.to;
      const toIndex = connection.from === neuronIndex ? connection.to : connection.from;
      
      // Create data packet
      const packet = {
        progress: 0,
        speed: 0.01 + Math.random() * 0.015, // Slightly faster packets
        size: 2.5 + Math.random() * 2.5, // Larger packets for better visibility
        color: neurons[fromIndex].color.replace(/[\d.]+\)$/, '1.0)') // Full opacity for packets
      };
      
      // Update connection direction if needed
      if (connection.to === neuronIndex) {
        connection.from = toIndex;
        connection.to = fromIndex;
      }
      
      // Add packet to connection
      connection.dataPackets.push(packet);
    }
  });
}

// Update and draw neurons
function updateAndDrawNeurons() {
  neurons.forEach((neuron, index) => {
    // Update position with very slight movement
    neuron.x += neuron.vx;
    neuron.y += neuron.vy;
    
    // Boundary check with wrapping
    if (neuron.x < 0) neuron.x = canvas.width;
    if (neuron.x > canvas.width) neuron.x = 0;
    if (neuron.y < 0) neuron.y = canvas.height;
    if (neuron.y > canvas.height) neuron.y = 0;
    
    // Calculate pulse effect
    const time = performance.now() * 0.001;
    const pulse = Math.sin(time * neuron.pulseSpeed + neuron.pulseOffset) * 0.5 + 0.5;
    
    // Gradually reduce activity
    if (neuron.activity > 0.2) {
      neuron.activity = Math.max(0.2, neuron.activity - 0.003); // Slower decay for more persistent activity
    }
    
    // Calculate radius with pulse and activity
    const radius = neuron.radius * (1 + pulse * 0.4) * (1 + neuron.activity);
    
    // Draw the neuron
    ctx.beginPath();
    ctx.arc(neuron.x, neuron.y, radius, 0, Math.PI * 2);
    
    // Color based on activity
    const baseColor = neuron.color.replace(/[\d.]+\)$/, `${(neuron.activity + 0.1).toFixed(2)})`); // Brighter neurons
    ctx.fillStyle = baseColor;
    ctx.fill();
    
    // Draw glow effect for active neurons
    if (neuron.activity > 0.3) {
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, radius * 2.5, 0, Math.PI * 2);
      const glowColor = neuron.color.replace(/[\d.]+\)$/, `${(neuron.activity * 0.4).toFixed(2)})`);
      ctx.fillStyle = glowColor;
      ctx.fill();
    }
  });
}

// Ripple effect variables
let ripples = [];

// Create ripple effect at specified position
function createRippleEffect(x, y) {
  ripples.push({
    x: x,
    y: y,
    radius: 0,
    maxRadius: 120, // Larger ripples
    opacity: 0.8, // More visible ripples
    color: 'rgba(255, 95, 31, 0.8)',
    speed: 2.5 // Faster ripples
  });
  
  // Activate nearby neurons
  activateNeuronsNearPoint(x, y, 180, 0.9); // Larger activation radius
}

// Draw ripple effects
function drawRippleEffects() {
  ripples = ripples.filter(ripple => {
    // Update radius
    ripple.radius += ripple.speed;
    ripple.opacity -= 0.008; // Slower fade for longer-lasting ripples
    
    // Remove if too large or transparent
    if (ripple.radius > ripple.maxRadius || ripple.opacity <= 0) {
      return false;
    }
    
    // Draw ripple
    ctx.beginPath();
    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
    ctx.strokeStyle = ripple.color.replace(/[\d.]+\)$/, `${ripple.opacity})`);
    ctx.lineWidth = 2.5; // Thicker ripple lines
    ctx.stroke();
    
    return true;
  });
}

// Activate neurons near mouse position
function activateNeuronsNearMouse() {
  activateNeuronsNearPoint(mousePosition.x, mousePosition.y, 120, 0.9);
}

// Activate neurons near a specific point
function activateNeuronsNearPoint(x, y, radius, intensity) {
  neurons.forEach((neuron, index) => {
    const dx = neuron.x - x;
    const dy = neuron.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < radius) {
      // Scale intensity based on distance
      const scaledIntensity = intensity * (1 - distance / radius);
      activateNeuron(index, scaledIntensity);
    }
  });
}

// Activate a specific neuron and its connections
function activateNeuron(index, intensity) {
  const neuron = neurons[index];
  if (!neuron) return;
  
  neuron.activity = Math.max(neuron.activity, intensity);
  
  // Activate connected neurons
  connections.forEach(connection => {
    if (connection.from === index || connection.to === index) {
      connection.activity = intensity;
      
      // Activate the connected neuron with slightly less intensity
      const connectedIndex = connection.from === index ? connection.to : connection.from;
      setTimeout(() => {
        if (neurons[connectedIndex]) {
          neurons[connectedIndex].activity = Math.max(neurons[connectedIndex].activity, intensity * 0.8);
        }
      }, 80); // Faster propagation
    }
  });
}

// Update loading bar progress
function updateLoadingBar(progressValue) {
  // This function now directly sets the progress if a value is given,
  // but it will mostly be controlled by checkCompletionConditions.
  if (loadingBar && typeof progressValue === 'number') {
    loadingBar.style.width = `${Math.min(progressValue, 100)}%`;
    // loadingProgress = Math.min(progressValue, 100); // Global loadingProgress is set in checkCompletionConditions upon success
  }
}

// Check if all conditions are met to complete loading
function checkCompletionConditions() {
  console.log('Checking completion conditions:');
  console.log('- Status lines complete:', statusLinesComplete);
  console.log('- Assets loaded:', assetsLoaded, '/', totalAssets);

  let currentVisualProgress = 0;
  if (statusLinesComplete) {
    currentVisualProgress += 80; // Status lines contribute 80%
  }
  if (window.totalAssets > 0) {
    currentVisualProgress += (assetsLoaded / window.totalAssets) * 20; // Assets contribute 20%
  } else {
    currentVisualProgress += 20; // If no assets, this part is considered done
  }
  currentVisualProgress = Math.min(currentVisualProgress, 100);

  if (loadingBar) {
    loadingBar.style.width = `${currentVisualProgress}%`;
  }
  
  if (statusLinesComplete && assetsLoaded >= window.totalAssets) {
    console.log('All conditions met, ensuring loading bar is 100% and completing loading');
    if (loadingBar) {
        loadingBar.style.width = '100%';
    }
    loadingProgress = 100; // Set global progress to 100 for any final checks if needed by other logic
    completeLoading();
  } else {
    console.log('Not all conditions met yet, waiting...');
  }
}

// Simulate and track asset preloading
function preloadAssets() {
  console.log('Starting asset preloading');
  
  const assets = [
    { type: 'image', src: 'https://avatars.githubusercontent.com/u/119836361?v=4' }
  ];

  window.totalAssets = assets.length;
  assetsLoaded = 0; 
  console.log('Total assets to actively preload via script:', window.totalAssets);

  if (window.totalAssets === 0) {
    console.log('No assets to actively preload via script. Checking conditions.');
    // assetsLoaded is 0, totalAssets is 0, so assetsLoaded >= totalAssets is true.
    checkCompletionConditions();
    return;
  }

  assets.forEach(asset => {
    preloadAsset(asset);
  });
}

// Preload individual asset
function preloadAsset(asset) {
  let element;
  
  switch(asset.type) {
    case 'script': 
      element = document.createElement('script');
      element.src = asset.src;
      console.warn('Attempting to preload script via JS, ensure not a duplicate:', asset.src);
      break;
    case 'image':
      element = new Image();
      element.src = asset.src;
      break;
    case 'font': 
      element = document.createElement('link');
      element.rel = 'stylesheet'; 
      element.href = asset.src;
      console.warn('Attempting to preload font via JS, ensure not a duplicate:', asset.src);
      break;
    case 'style': 
      element = document.createElement('link');
      element.rel = 'stylesheet';
      element.href = asset.src;
      console.warn('Attempting to preload style via JS, ensure not a duplicate:', asset.src);
      break;
    case 'library': 
      element = document.createElement('script');
      element.src = asset.src;
      console.warn('Attempting to preload library via JS, ensure not a duplicate:', asset.src);
      break;
    default:
      console.error('Unknown asset type:', asset.type);
      return;
  }
  
  if (element) {
    element.onload = () => {
      assetsLoaded++;
      console.log(`Asset loaded (${assetsLoaded}/${window.totalAssets}):`, asset.src);
      checkCompletionConditions(); // Call central check
    };
    
    element.onerror = () => {
      console.warn(`Failed to load asset: ${asset.src}`);
      assetsLoaded++; 
      checkCompletionConditions(); // Call central check
    };
    
    if (asset.type === 'image') {
      // Image loading starts with `element.src = asset.src;`
    } else if (asset.type === 'font' || asset.type === 'style' || asset.type === 'script' || asset.type === 'library') {
      // console.log('Asset type', asset.type, 'was not appended to head...');
    }
  }
}

// Complete loading and transition to main content
function completeLoading() {
  if (!preloaderActive) return; 
  
  console.log('Completing loading sequence');
  preloaderActive = false;
  
  if (loadingBar) {
    loadingBar.style.width = '100%';
  }
  
  statusLines.forEach(line => {
    line.classList.remove('typing');
    line.classList.add('completed');
  });
  
  const lastLine = statusLines[statusLines.length - 1];
  if (lastLine) {
    lastLine.textContent = 'System initialization complete. Welcome, user.';
  }
  
  document.dispatchEvent(new Event('preloaderComplete'));
  
  setTimeout(() => {
    if (preloader) {
      preloader.style.opacity = '0';
      
      if (mainContainer) {
        mainContainer.classList.add('loaded');
      }
      
      setTimeout(() => {
        if (preloader && preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
        
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        // Explicitly clear animation arrays and canvas context
        neurons = [];
        connections = [];
        activeConnections = [];
        ripples = [];
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas = null;
            ctx = null;
        }
        animationFrame = null;
        
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
        
        document.body.focus();
        window.scrollTo(0, 0);
        
        console.log('Preloader removed, main content visible, animation cleaned up');
      }, 1000);
    }
  }, 1000);
}
