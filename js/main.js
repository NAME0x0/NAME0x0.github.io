/**
 * Main JavaScript for AVA Interface
 * Initializes and coordinates all interface components
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('AVA Interface - Initializing main systems');
  
  // Initialize components after preloader completes
  document.addEventListener('preloaderComplete', initializeInterface);
  
  // Initialize immediately if no preloader (for testing)
  if (!document.querySelector('.preloader')) {
    initializeInterface();
  }
});

// Initialize the main interface
function initializeInterface() {
  console.log('AVA Interface - Starting initialization sequence');

  // --- Critical for interactivity - Initialize these first ---
  initializeCustomCursor(); // Usually lightweight, good for immediate UX
  initializeSectionNavigation(); // Essential for site navigation
  initializeTerminal(); // Basic terminal toggle, likely lightweight

  // --- Defer non-critical or potentially heavy initializations ---
  setTimeout(() => {
    console.log('AVA Interface - Initializing deferred components');
    initializeNeuralNetwork(); // Potentially heavy background animation
    initializeDataStream();    // Background visual element
    initializeProjectShowcase(); // May involve loading models or complex UI
    initializePerformanceOptimizer(); // Can run after core UI is ready
    initializeSkillBarAnimations(); // Animate skill bars on scroll
  }, 0); // setTimeout with 0ms pushes execution to after current stack

  // Trigger boot sequence complete message slightly later to reflect deferred loading
  setTimeout(() => {
    console.log('AVA Interface - Core boot sequence complete. Deferred items loading.');
  }, 100); // Adjusted timing
}

// Initialize neural network background
function initializeNeuralNetwork() {
  // Silicon Neural Pathways should auto-initialize via its own DOMContentLoaded listener
  // Just ensure the container exists
  const neuralNetworkBg = document.getElementById('neural-network-bg');
  if (!neuralNetworkBg) {
    console.error('Neural network background container not found');
    return;
  }
  
  // Make sure the container is visible
  neuralNetworkBg.style.display = 'block';
  neuralNetworkBg.style.opacity = '1';
}

// Initialize data stream overlay
function initializeDataStream() {
  const dataStreamContainer = document.getElementById('data-stream');
  if (!dataStreamContainer) {
    console.error('Data stream container not found');
    return;
  }
  
  // Data stream will be initialized by its own script
}

// Initialize custom cursor
function initializeCustomCursor() {
  const cursorContainer = document.querySelector('.cursor-container');
  if (!cursorContainer) {
    console.error('Cursor container not found');
    return;
  }
  
  // Custom cursor will be initialized by its own script
}

// Initialize terminal
function initializeTerminal() {
  // Terminal will be initialized by its own script
  // Just ensure keyboard listener is set up
  document.addEventListener('keydown', (e) => {
    // Ctrl + ` to toggle terminal
    if (e.ctrlKey && e.key === '`') {
      const event = new CustomEvent('toggleTerminal');
      document.dispatchEvent(event);
    }
  });
}

// Initialize project showcase
function initializeProjectShowcase() {
  // Project showcase will be initialized by its own script
}

// Initialize section navigation
function initializeSectionNavigation() {
  const navItems = document.querySelectorAll('.neural-pathways li');
  const sections = document.querySelectorAll('.subsystem');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetSection = item.getAttribute('data-section');
      
      // Update active nav item
      navItems.forEach(navItem => {
        navItem.classList.remove('active');
      });
      item.classList.add('active');
      
      // Update active section
      sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === targetSection) {
          section.classList.add('active');
        }
      });
      
      // Dispatch section changed event
      const event = new CustomEvent('sectionChanged', {
        detail: { section: targetSection }
      });
      document.dispatchEvent(event);
    });
  });
  
  // Handle connection clicks in core system
  const connections = document.querySelectorAll('.connection');
  connections.forEach(connection => {
    connection.addEventListener('click', () => {
      const targetSection = connection.getAttribute('data-target');
      
      // Find and click the corresponding nav item
      const targetNavItem = document.querySelector(`.neural-pathways li[data-section="${targetSection}"]`);
      if (targetNavItem) {
        targetNavItem.click();
      }
    });
  });
  
  // Handle quantum button clicks
  const quantumButtons = document.querySelectorAll('.quantum-button[data-target]');
  quantumButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetSection = button.getAttribute('data-target');
      
      // Find and click the corresponding nav item
      const targetNavItem = document.querySelector(`.neural-pathways li[data-section="${targetSection}"]`);
      if (targetNavItem) {
        targetNavItem.click();
      }
    });
  });
}

// Initialize performance optimizer
function initializePerformanceOptimizer() {
  // Performance optimizer will be initialized by its own script
}

// Initialize skill bar animations using IntersectionObserver
function initializeSkillBarAnimations() {
  const skillNodes = document.querySelectorAll('.capability-node');

  if (!skillNodes.length) {
    console.warn('Skill bar animation: No .capability-node elements found.');
    return;
  }

  const observerOptions = {
    root: null, // Use the viewport as the root
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
  };

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const node = entry.target;
        const energyBar = node.querySelector('.node-energy');
        const levelText = node.querySelector('.node-level');

        if (energyBar && levelText) {
          const level = levelText.textContent.trim();
          // Add a slight delay for a more staggered effect if desired
          setTimeout(() => {
            energyBar.style.width = level;
          }, 150);
        } else {
          console.warn('Skill bar animation: .node-energy or .node-level not found in', node);
        }
        observer.unobserve(node); // Stop observing once animated
      }
    });
  }, observerOptions);

  skillNodes.forEach(node => {
    skillObserver.observe(node);
  });
  console.log('AVA Interface - Skill bar animation observer initialized for', skillNodes.length, 'nodes.');
}
