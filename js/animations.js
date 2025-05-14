// Animations using anime.js

// Spring configuration for natural movement
const springPhysics = {
  duration: 800,
  easing: 'spring(1, 80, 10, 0)',  // spring(mass, stiffness, damping, velocity)
  elasticity: 600
};

// Breathing animation parameters
const breathingConfig = {
  scale: {
    min: 0.995,
    max: 1.005
  },
  glow: {
    min: 0.8,
    max: 1.2
  },
  duration: {
    min: 3000,
    max: 5000
  }
};

// Utility to simulate typing effect for a single line with enhanced effects
function typeLine(element, text, onComplete, delay = 50) {
  let i = 0;
  element.innerHTML = ""; // Clear existing content
  element.style.opacity = "1"; // Make sure it's visible before typing

  // Add cursor element
  const cursor = document.createElement('span');
  cursor.classList.add('typing-cursor');
  cursor.innerHTML = '_';
  element.appendChild(cursor);

  // Random typing speed variations for more natural feel
  function getRandomDelay() {
    // Occasionally pause longer (simulates thinking)
    if (Math.random() < 0.1) {
      return delay * 5;
    }
    // Normal variation
    return delay * (0.7 + Math.random() * 0.6);
  }

  function type() {
    if (i < text.length) {
      // Create a new span for each character for potential effects
      const charSpan = document.createElement('span');
      charSpan.textContent = text.charAt(i);
      charSpan.style.opacity = '0';
      charSpan.style.transform = 'translateY(8px)';
      element.insertBefore(charSpan, cursor);
      
      // Animate character appearance
      anime({
        targets: charSpan,
        opacity: 1,
        translateY: 0,
        duration: 120,
        easing: 'easeOutQuad'
      });
      
      i++;
      setTimeout(type, getRandomDelay());
    } else {
      // Typing finished
      // Remove typing cursor
      if (cursor.parentNode === element) {
        element.removeChild(cursor);
      }
      if (onComplete) {
        onComplete();
      }
    }
  }
  type();
}

// Animates the header and widgets
function animateHeaderAndWidgets() {
  console.log("animateHeaderAndWidgets called - check if targets are still relevant or handled by panel animations.");
  // Previously targeted #header and .widget (fixed position)
  // #header is now in #panel-header-intro
  // .widget elements (fixed) are replaced by #panel-system-info and #panel-user-info
  // These panels are animated by animateDashboardPanels.
  // If specific elements *inside* these panels need animation beyond the panel's entry,
  // those would be targeted here or in a more specific function.
}

// Renamed and updated to animate the main dashboard container
function animateDashboardIn(onCompleteCallback) {
  // First create a subtle flash of light at the center of the screen
  const flash = document.createElement('div');
  flash.style.position = 'fixed';
  flash.style.top = '50%';
  flash.style.left = '50%';
  flash.style.transform = 'translate(-50%, -50%)';
  flash.style.width = '10px';
  flash.style.height = '10px';
  flash.style.borderRadius = '50%';
  flash.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  flash.style.boxShadow = '0 0 50px 30px rgba(100, 220, 255, 0.8)';
  flash.style.zIndex = '9999';
  flash.style.pointerEvents = 'none';
  document.body.appendChild(flash);
  
  // Animate the flash
  anime({
    targets: flash,
    opacity: [1, 0],
    scale: [0, 15],
    duration: 1000,
    easing: 'easeOutExpo',
    complete: function() {
      document.body.removeChild(flash);
      
      // Then bring in the dashboard with enhanced spring physics
      anime({
        targets: "#dashboard-main",
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.94, 1],
        rotateX: [10, 0],
        duration: springPhysics.duration,
        easing: springPhysics.easing,
        complete: function() {
          console.log("Dashboard container animation complete.");
          if (onCompleteCallback) {
            onCompleteCallback();
          }
          // Start subtle breathing animation for the dashboard
          animateDashboardBreathing();
        }
      });
    }
  });
}

// Subtle continuous "breathing" animation for the dashboard
function animateDashboardBreathing() {
  const dashboard = document.getElementById('dashboard-main');
  
  // Create subtle movement to make the interface feel alive
  anime({
    targets: dashboard,
    scale: [breathingConfig.scale.min, breathingConfig.scale.max],
    boxShadow: [
      '0 0 20px rgba(100, 180, 220, ' + breathingConfig.glow.min + ')',
      '0 0 30px rgba(100, 180, 220, ' + breathingConfig.glow.max + ')'
    ],
    duration: anime.random(breathingConfig.duration.min, breathingConfig.duration.max),
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine'
  });
}

// New function to animate dashboard panels with complex choreography
function animateDashboardPanels() {
  console.log("animateDashboardPanels started.");
  const timeline = anime.timeline({
    easing: 'easeOutExpo',
    duration: 800,
    complete: function() {
      console.log("PANEL CHOREOGRAPHY FULLY COMPLETE. Forcing link/input visibility.");
      
      const panelNavLinks = document.getElementById('panel-navigation-links');
      const panelWebgl = document.getElementById('panel-webgl');

      // Force links to be visible
      const links = document.querySelectorAll('#panel-navigation-links ul li');
      links.forEach(link => {
        link.style.opacity = '1';
        link.style.transform = 'none';
      });
      if (panelNavLinks) {
        panelNavLinks.style.opacity = '1'; // Force parent panel opacity
        console.log("[ANIMATIONS] Force-set #panel-navigation-links AND its children (li) opacity and transform.");
        console.log(`[ANIMATIONS] Final computed opacity #panel-navigation-links: ${window.getComputedStyle(panelNavLinks).opacity}`);
      }
      
      if (panelWebgl) {
        panelWebgl.style.opacity = '1'; // Force panel opacity
        console.log("[ANIMATIONS] Force-set #panel-webgl opacity.");
        console.log(`[ANIMATIONS] Final computed opacity #panel-webgl: ${window.getComputedStyle(panelWebgl).opacity}`);
      }
      
      animateTerminalPowerOn();
      
      // Start panel interaction effects
      initPanelInteractionEffects();

      // Re-ensure terminal input is active as a fallback/override
      const userInput = document.getElementById("user-input");
      if (userInput) {
        console.log("animateDashboardPanels complete callback: Re-setting contentEditable=true and focusing userInput.");
        userInput.contentEditable = "true";
        userInput.focus();
        console.log("animateDashboardPanels complete callback: userInput contentEditable is now", userInput.contentEditable);
      } else {
        console.error("animateDashboardPanels complete callback: userInput element not found for final activation!");
      }
    }
  });
  
  // Calculate staggered delays for interconnected animation
  const baseDelay = 100;
  const systemInfoDelay = 0;
  const userInfoDelay = 50;
  const webglDelay = 150;
  const headerDelay = 250;
  const linksDelay = 400;
  const terminalDelay = 600;
  
  // System info panel - slides in with spring effect
  timeline.add({
    targets: '#panel-system-info',
    opacity: [0, 1],
    translateY: [-60, 0],
    translateZ: [-40, 20],
    rotateX: [20, 0],
    rotateZ: [-5, 0],
    scale: [0.9, 1],
    duration: 1000,
    easing: 'spring(1, 80, 10, 0)'
  }, systemInfoDelay);
  
  // User info panel - slightly delayed mirror animation of system panel
  timeline.add({
    targets: '#panel-user-info',
    opacity: [0, 1],
    translateY: [-60, 0],
    translateZ: [-40, 20],
    rotateX: [20, 0],
    rotateZ: [5, 0],
    scale: [0.9, 1],
    duration: 1000,
    easing: 'spring(1, 80, 14, 0)'
  }, userInfoDelay);
  
  // AI Face WebGL panel - dramatic reveal
  timeline.add({
    targets: '#panel-webgl',
    opacity: [0, 1],
    scale: [0.2, 1],
    rotateZ: [45, 0],
    duration: 1200,
    filter: ['blur(20px) brightness(3)', 'blur(0px) brightness(1)'],
    easing: 'spring(1, 90, 10, 0)',
    begin: function() {
      const panel = document.getElementById('panel-webgl');
      const rect = panel.getBoundingClientRect();
      createLightRays(rect.left + rect.width/2, rect.top + rect.height/2);
    },
    complete: function(anim) {
      console.log("[ANIMATIONS] #panel-webgl animation complete.");
      const panelWebgl = document.getElementById('panel-webgl');
      if(panelWebgl) console.log(`[ANIMATIONS] Opacity of #panel-webgl after its own animation: ${window.getComputedStyle(panelWebgl).opacity}`);
    }
  }, webglDelay);
  
  // Header intro - fade in with slight bounce up
  timeline.add({
    targets: '#panel-header-intro',
    opacity: [0, 1],
    translateY: [20, 0],
    scale: [0.9, 1],
    easing: 'spring(1, 80, 10, 0)'
  }, headerDelay);
  
  // Header title - special treatment with character-by-character animation
  timeline.add({
    targets: '#header',
    opacity: [0, 1],
    duration: 600,
    begin: function() {
      // Separate each character into its own span for individual animation
      const header = document.getElementById('header');
      const text = header.textContent;
      header.innerHTML = '';
      
      for (let i = 0; i < text.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.textContent = text.charAt(i);
        charSpan.style.display = 'inline-block';
        charSpan.style.opacity = '0';
        charSpan.style.transform = 'translateY(20px) rotateX(90deg)';
        header.appendChild(charSpan);
        
        // Animate each character with staggered delay
        anime({
          targets: charSpan,
          opacity: 1,
          translateY: 0,
          rotateX: 0,
          delay: 300 + (i * 60),
          duration: 600,
          easing: 'easeOutExpo'
        });
      }
    }
  }, headerDelay + 100);
  
  // Header subtitle paragraph animation - fades in with upward drift
  timeline.add({
    targets: '#panel-header-intro p',
    opacity: [0, 1],
    translateY: [15, 0], // Drifts up slightly
    duration: 700,
    easing: 'easeOutCubic'
  }, headerDelay + 400); // Starts after the main header title characters animation is underway
  
  // Navigation links - staggered fade in with floating effect
  timeline.add({
    targets: '#panel-navigation-links ul li',
    opacity: [0, 1],
    translateY: [25, 0],
    scale: [0.8, 1],
    delay: anime.stagger(80, {from: 'center'}),
    duration: 600,
    easing: 'easeOutCubic',
    complete: function(anim) {
      console.log("[ANIMATIONS] #panel-navigation-links ul li animation complete.");
      // Log opacity of parent #panel-navigation-links
      const panelNavLinks = document.getElementById('panel-navigation-links');
      if(panelNavLinks) console.log(`[ANIMATIONS] Opacity of #panel-navigation-links after its children (li) animated: ${window.getComputedStyle(panelNavLinks).opacity}`);
    }
  }, linksDelay);
  
  // Terminal - dramatic reveal with advanced filter effects
  timeline.add({
    targets: '#panel-terminal',
    opacity: [0, 1],
    translateY: [20, 0],
    scale: [0.94, 1],
    filter: [
      'blur(8px) brightness(1.5) saturate(0)', 
      'blur(0px) brightness(1) saturate(1)'
    ],
    duration: 900,
    easing: 'spring(1, 70, 10, 0)'
  }, terminalDelay);
}

// Create light rays effect for dramatic moments
function createLightRays(x, y) {
  const rayCount = 8;
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = `${x}px`;
  container.style.top = `${y}px`;
  container.style.width = '0';
  container.style.height = '0';
  container.style.zIndex = '99';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);
  
  // Create rays
  for (let i = 0; i < rayCount; i++) {
    const ray = document.createElement('div');
    const angle = (i / rayCount) * Math.PI * 2;
    const length = 100 + Math.random() * 100;
    
    ray.style.position = 'absolute';
    ray.style.width = `${length}px`;
    ray.style.height = '2px';
    ray.style.transformOrigin = '0 0';
    ray.style.transform = `rotate(${angle}rad)`;
    ray.style.background = 'linear-gradient(90deg, rgba(100, 220, 255, 0.8), rgba(100, 220, 255, 0))';
    ray.style.opacity = '0';
    
    container.appendChild(ray);
    
    // Animate ray
    anime({
      targets: ray,
      opacity: [0, 0.7, 0],
      scaleX: [0.3, 1],
      duration: 1000,
      easing: 'easeOutExpo',
      delay: i * 50
    });
  }
  
  // Remove container after animation
  setTimeout(() => {
    document.body.removeChild(container);
  }, 1500);
}

// Initialize interactive effects for panels
function initPanelInteractionEffects() {
  const panels = document.querySelectorAll('.dashboard-panel');
  
  panels.forEach(panel => {
    let animationFrameId = null;

    // Mouse move effect - 3D tilt based on cursor position
    panel.addEventListener('mousemove', function(e) {
      if (panel.classList.contains('animated-tilt')) return;
      
      // Cancel any pending animation frame to avoid queuing up updates
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const maxRotation = 4; // Slightly reduced max rotation for subtlety
        
        const rotateY = maxRotation * ((x - centerX) / centerX);
        const rotateX = -maxRotation * ((y - centerY) / centerY);
        
        this.style.transform = ` 
          perspective(1200px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
          translateZ(20px) /* Keep the base Z offset */
        `;

        // Removed dynamic background update on mousemove for performance.
        // Rely on base panel styles and hover effects for background changes.
        // this.style.background = `...`; 
      });
    });
    
    // Reset on mouse leave
    panel.addEventListener('mouseleave', function() {
      // Cancel pending animation frame if mouse leaves before it executes
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      // Smooth reset to original position with spring physics
      anime({
        targets: this,
        rotateX: 0,
        rotateY: 0,
        translateZ: '20px', // Ensure it returns to its base Z offset defined in CSS
        duration: springPhysics.duration, // Use existing springPhysics config
        easing: springPhysics.easing
        // The background will revert via CSS hover/base states, no JS needed here for that.
      });
    });
    
    // Click effect - energetic pulse
    panel.addEventListener('click', function(e) {
      // Don't apply to panels containing interactive elements
      if (e.target.tagName === 'A' || 
          e.target.tagName === 'BUTTON' || 
          e.target.tagName === 'INPUT' ||
          e.target === document.getElementById('user-input') ||
          panel.id === 'panel-terminal') {
        return;
      }
      
      // Mark as being animated to prevent interference with tilt
      this.classList.add('animated-tilt');
      
      // Create ripple effect
      const ripple = document.createElement('div');
      ripple.className = 'panel-ripple';
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - (size/2)}px`;
      ripple.style.top = `${e.clientY - rect.top - (size/2)}px`;
      ripple.style.backgroundColor = 'rgba(100, 220, 255, 0.3)';
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'scale(0)';
      ripple.style.pointerEvents = 'none';
      
      this.appendChild(ripple);
      
      // Animate panel bounce
      anime({
        targets: this,
        scale: [1, 1.03, 1],
        duration: 600,
        easing: 'spring(1, 80, 6, 0)',
        complete: () => {
          this.classList.remove('animated-tilt');
        }
      });
      
      // Animate ripple
      anime({
        targets: ripple,
        scale: 1,
        opacity: [0.5, 0],
        duration: 800,
        easing: 'easeOutExpo',
        complete: function() {
          if (ripple.parentNode === panel) {
            panel.removeChild(ripple);
          }
        }
      });
    });
  });
}

// Enhanced terminal power-on effect
function animateTerminalPowerOn() {
  console.log("animateTerminalPowerOn started.");
  const terminalElement = document.getElementById("terminal");
  if (!terminalElement) {
    console.error("Terminal element not found in animateTerminalPowerOn.");
    return;
  }

  // Ensure terminal is ready for effects
  terminalElement.style.position = "relative"; 
  terminalElement.style.overflow = "hidden"; 

  // Simpler power-on: Initial fade, a quick brightness/contrast flash, then animate lines.
  anime.timeline({
    easing: "easeOutExpo",
    complete: function() {
      terminalElement.style.filter = ''; // Clear any temporary filters
      console.log("animateTerminalPowerOn: calling animateTerminalLines.");
      animateTerminalLines();
    }
  })
  .add({
    targets: terminalElement,
    opacity: [0, 0.6], 
    duration: 200,
    easing: "easeInQuad"
  })
  .add({
    targets: terminalElement,
    filter: [
      'brightness(1.5) contrast(1.2) saturate(0.5)', 
      'brightness(0.8) contrast(1.0) saturate(0.8)',
      'brightness(1.2) contrast(1.1) saturate(0.9)',
      'brightness(1.0) contrast(1.0) saturate(1.0)'
    ],
    opacity: 1, 
    duration: 400, 
    easing: 'steps(4)' 
  }, '-=100') 
  .add({
    duration: 100 // Brief pause
  });

  console.log("animateTerminalPowerOn timeline setup complete.");
}

// Enhanced terminal lines animation
function animateTerminalLines() {
  console.log("animateTerminalLines started.");
  // Exclude the .user-prompt-line from this general animation
  const terminalLines = document.querySelectorAll("#terminal > .terminal-line:not(.user-prompt-line)");
  if (!terminalLines.length) {
    console.warn("No terminal lines (excluding prompt) found for animation.");
    console.log("animateTerminalLines: calling animateUserPrompt due to no specific lines to animate.");
    // Call animateUserPrompt directly if no other lines to animate, removing the 200ms delay for this specific path
    animateUserPrompt(); 
    return;
  }

  // Ensure lines are initially hidden
  terminalLines.forEach(line => line.style.opacity = "0");

  let lineIndex = 0;
  const initialDelay = 100; // Keep initial delay for the first line of text

  function animateNextLine() {
    if (lineIndex < terminalLines.length) {
      const line = terminalLines[lineIndex];
      const text = line.textContent.trim();
      
      // All lines processed here should be sys-message or similar, not the prompt line
      // So, using typeLine for all of them should be fine, or a simple fade-in
      typeLine(line, text, () => {
        lineIndex++;
        setTimeout(animateNextLine, 100); // Delay between lines
      }, 20); // Typing speed

    } else {
      // All initial terminal lines animated, show and focus user input
      console.log("animateTerminalLines: all initial lines animated, calling animateUserPrompt.");
      // Keep the 200ms delay here before showing prompt to ensure visual separation
      setTimeout(animateUserPrompt, 200);
    }
  }

  setTimeout(animateNextLine, initialDelay);
  console.log("animateTerminalLines: animateNextLine scheduled for initial lines.");
}

// Animate user prompt line appearance
function animateUserPrompt() {
  console.log("animateUserPrompt started.");
  const promptLine = document.querySelector(".user-prompt-line");
  const userInput = document.getElementById("user-input"); // Get userInput at the start

  if (!promptLine) {
    console.warn("User prompt line not found.");
    if (userInput) { // If promptLine is missing but userInput was found, try to activate it
        console.log("animateUserPrompt: Prompt line missing, but userInput found. Attempting to activate.");
        userInput.contentEditable = "true";
        userInput.focus();
        console.log("animateUserPrompt: (Fallback) userInput contentEditable is now", userInput.contentEditable);
    }
    return;
  }
  
  if (!userInput) { // If userInput is not found at the start, log error and exit.
    console.error("animateUserPrompt: userInput element NOT FOUND at the beginning of the function!");
    return;
  }
  
  // Prepare the prompt elements
  const promptElements = promptLine.querySelectorAll('span:not(.blinking-cursor):not(#user-input)'); // Exclude user-input from this animation if it causes issues
  promptElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
  });
  
  // Make prompt visible, including user-input field
  promptLine.style.opacity = "1";
  promptLine.style.display = "flex";
  userInput.style.opacity = "1"; // Ensure user-input span is also visible

  // Animate each part of the prompt (excluding user-input if it's problematic to animate its container)
  anime({
    targets: promptElements,
    opacity: [0, 1],
    translateY: [10, 0],
    delay: anime.stagger(80),
    duration: 400,
    easing: 'easeOutQuad',
    complete: function() {
      // Enable user input using the pre-fetched reference
      console.log("animateUserPrompt complete callback: Setting contentEditable=true and focusing pre-fetched userInput.");
      userInput.contentEditable = "true";
      userInput.focus();
      console.log("animateUserPrompt complete callback: Pre-fetched userInput contentEditable is now", userInput.contentEditable);
      
      // Add a subtle highlight/pulse to indicate interactivity
      anime({
        targets: '.blinking-cursor',
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });
    }
  });
  console.log("animateUserPrompt: prompt animation setup complete with pre-fetched userInput.");
}

// Main function to orchestrate initial page animations
function initAnimations() {
  console.log("Initializing advanced UI animations for ultra-modern futuristic interface...");

  // Add CSS for custom animation elements
  addCustomAnimationStyles();
  
  // Start with the dashboard container
  animateDashboardIn(function() {
    // Once the container is in, animate all panels with choreography
    animateDashboardPanels();
  });
}

// Add custom styles for animation elements
function addCustomAnimationStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .typing-cursor {
      display: inline-block;
      color: #4A90E2;
      animation: blink-animation 0.8s steps(2) infinite;
    }
    
    @keyframes panel-ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .panel-ripple {
      animation: panel-ripple 0.8s ease-out;
    }
    
    .terminal-scanline {
      background: linear-gradient(to bottom,
        rgba(100, 220, 255, 0.2),
        rgba(100, 220, 255, 0.5) 10%,
        rgba(100, 220, 255, 0.2) 100%
      );
    }
  `;
  document.head.appendChild(styleElement);
}

// Handles the animation for AI typing a response into the terminal.
function animateAiTyping(responseText, onComplete) {
  const aiResponseContainer = document.getElementById("ai-response-content");
  const promptToMove = document.getElementById("prompt-line"); // Get the prompt line

  if (aiResponseContainer && promptToMove) {
    const newAiLine = document.createElement("p");
    newAiLine.classList.add("ai-message");
    newAiLine.style.opacity = "0"; // Start invisible for fade-in/typing
    aiResponseContainer.appendChild(newAiLine);

    // Scroll to bottom as new content is added
    const terminal = document.getElementById("terminal");
    terminal.scrollTop = terminal.scrollHeight;

    typeLine(newAiLine, responseText, () => {
      // After typing, move the prompt line below the new AI message
      aiResponseContainer.appendChild(promptToMove);
      promptToMove.style.visibility = "visible";
      promptToMove.style.opacity = "1";
      focusOnUserInput(); 
      if (onComplete) onComplete();
    }, 50); // Typing speed for AI responses
  } else {
    console.warn('AI response container or prompt line not found for typing animation.');
  }
}

// Utility function to focus on the user input field.
function focusOnUserInput() {
  const userInput = document.getElementById("userInput");
  const promptLine = document.getElementById("prompt-line");

  if (promptLine) {
    promptLine.style.visibility = "visible";
    anime({
      targets: promptLine,
      opacity: [0, 1],
      duration: 500,
      easing: "easeOutExpo",
    });
  }

  if (userInput) {
    userInput.style.visibility = "visible";
    anime({
      targets: userInput,
      opacity: [0, 1],
      duration: 500,
      easing: "easeOutExpo",
      complete: () => {
        userInput.focus();
      }
    });
  }
} 