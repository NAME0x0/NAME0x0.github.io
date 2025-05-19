/**
 * Custom Cursor
 * Creates an interactive custom cursor with context-aware states
 * Optimized for performance and enhanced visibility
 */

if (typeof window.CustomCursor === 'undefined') {
  class CustomCursor {
    constructor() {
      this.cursor = document.getElementById('cursor');
      this.cursorDot = document.getElementById('cursor-dot');
      this.cursorRing = document.getElementById('cursor-ring');
      this.cursorPos = { x: 0, y: 0 };
      this.targetPos = { x: 0, y: 0 };
      this.isVisible = false;
      this.isHovering = false;
      this.currentElement = null;
      this.animationFrame = null;
      this.trail = [];
      this.trailLength = 5; // Reduced trail length for subtler effect
      this.trailElements = [];
      this.maxTrailElements = 8; // Limit trail elements for performance
      this.lastClickTime = 0;
      this.lastClickPosition = { x: 0, y: 0 };
      this.isMobile = false;
      
      // Check if device is mobile
      this.checkMobile();
    }
    
    init() {
      // Skip initialization on mobile devices
      if (this.isMobile) {
        console.log('Mobile device detected, using default cursor');
        if (document.body) document.body.style.cursor = 'auto';
        return;
      }
      
      // Create cursor elements if they don't exist
      if (!this.cursor || !this.cursorDot) {
        this.createCursorElements();
      }
      
      // Hide cursor initially
      if (this.cursor) this.cursor.style.opacity = '0';
      if (this.cursorDot) this.cursorDot.style.opacity = '0';
      if (this.cursorRing) this.cursorRing.style.opacity = '0';
      
      // Add event listeners
      document.addEventListener('mousemove', (e) => this.onMouseMove(e));
      document.addEventListener('mouseenter', () => this.onMouseEnter());
      document.addEventListener('mouseleave', () => this.onMouseLeave());
      document.addEventListener('mousedown', (e) => this.onMouseDown(e));
      document.addEventListener('mouseup', (e) => this.onMouseUp(e));
      
      // Track interactive elements for hover states
      this.trackInteractiveElements();
      
      // Listen for preloader completion
      document.addEventListener('preloaderComplete', () => {
        // Show cursor after preloader
        setTimeout(() => {
          this.isVisible = true;
          if (this.cursor) {
            this.cursor.classList.add('active');
            this.cursor.style.opacity = '1';
          }
          if (this.cursorDot) {
            this.cursorDot.classList.add('active');
            this.cursorDot.style.opacity = '1';
          }
          if (this.cursorRing) {
            this.cursorRing.classList.add('active');
            this.cursorRing.style.opacity = '0.3';
          }
        }, 500);
        
        // Start animation loop
        this.animate();
      });
      
      // Listen for page visibility changes
      document.addEventListener('pagePaused', () => {
        this.pauseAnimation();
      });
      
      document.addEventListener('pageResumed', () => {
        this.resumeAnimation();
      });
      
      // Start animation immediately for testing
      this.isVisible = true;
      if (this.cursor) {
        this.cursor.classList.add('active');
        this.cursor.style.opacity = '1';
      }
      if (this.cursorDot) {
        this.cursorDot.classList.add('active');
        this.cursorDot.style.opacity = '1';
      }
      if (this.cursorRing) {
        this.cursorRing.classList.add('active');
        this.cursorRing.style.opacity = '0.3';
      }
      this.animate();
      
      // Create cursor trail container
      this.createTrailContainer();
      
      // Hide default cursor
      if (document.body) document.body.style.cursor = 'none';
      
      // Fallback to standard cursor after timeout if custom cursor fails
      setTimeout(() => {
        if (!this.isVisible && document.body) {
          console.warn('Custom cursor may have failed to initialize, falling back to standard cursor');
          document.body.style.cursor = 'auto';
        }
      }, 3000);
    }
    
    checkMobile() {
      // Check if device is mobile
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                      (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    }
    
    createCursorElements() {
      // Create cursor container if it doesn't exist
      let cursorContainer = document.querySelector('.cursor-container');
      if (!cursorContainer && document.body) {
        cursorContainer = document.createElement('div');
        cursorContainer.className = 'cursor-container';
        document.body.appendChild(cursorContainer);
      }
      
      // Create main cursor element
      if (cursorContainer) {
        this.cursor = document.createElement('div');
        this.cursor.id = 'cursor';
        this.cursor.style.position = 'fixed';
        this.cursor.style.width = '30px';
        this.cursor.style.height = '30px';
        this.cursor.style.borderRadius = '50%';
        this.cursor.style.border = '2px solid var(--color-primary)';
        this.cursor.style.transform = 'translate(-50%, -50%)';
        this.cursor.style.pointerEvents = 'none';
        this.cursor.style.zIndex = '9999';
        this.cursor.style.transition = 'transform 0.1s ease, border-color 0.3s ease';
        this.cursor.style.mixBlendMode = 'difference';
        cursorContainer.appendChild(this.cursor);
        
        // Create cursor dot element
        this.cursorDot = document.createElement('div');
        this.cursorDot.id = 'cursor-dot';
        this.cursorDot.style.position = 'fixed';
        this.cursorDot.style.width = '6px';
        this.cursorDot.style.height = '6px';
        this.cursorDot.style.borderRadius = '50%';
        this.cursorDot.style.backgroundColor = 'var(--color-primary)';
        this.cursorDot.style.transform = 'translate(-50%, -50%)';
        this.cursorDot.style.pointerEvents = 'none';
        this.cursorDot.style.zIndex = '10000';
        this.cursorDot.style.transition = 'transform 0.1s ease, background-color 0.3s ease';
        this.cursorDot.style.boxShadow = '0 0 10px rgba(255, 95, 31, 0.7)';
        cursorContainer.appendChild(this.cursorDot);
        
        // Create cursor ring element
        this.cursorRing = document.createElement('div');
        this.cursorRing.id = 'cursor-ring';
        this.cursorRing.style.position = 'fixed';
        this.cursorRing.style.width = '50px';
        this.cursorRing.style.height = '50px';
        this.cursorRing.style.borderRadius = '50%';
        this.cursorRing.style.border = '1px solid var(--color-primary)';
        this.cursorRing.style.transform = 'translate(-50%, -50%)';
        this.cursorRing.style.pointerEvents = 'none';
        this.cursorRing.style.zIndex = '9998';
        this.cursorRing.style.opacity = '0.3';
        this.cursorRing.style.transition = 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease';
        cursorContainer.appendChild(this.cursorRing);
      }
    }
    
    createTrailContainer() {
      // Create container for trail elements
      this.trailContainer = document.createElement('div');
      this.trailContainer.className = 'cursor-trail-container';
      this.trailContainer.style.position = 'fixed';
      this.trailContainer.style.top = '0';
      this.trailContainer.style.left = '0';
      this.trailContainer.style.width = '100%';
      this.trailContainer.style.height = '100%';
      this.trailContainer.style.pointerEvents = 'none';
      this.trailContainer.style.zIndex = '9998';
      this.trailContainer.style.overflow = 'hidden';
      
      if (document.body) {
        document.body.appendChild(this.trailContainer);
      }
    }
    
    trackInteractiveElements() {
      // Track all interactive elements for hover effects
      const interactiveElements = document.querySelectorAll('a, button, .neural-pathways li, .project-card, .quantum-button, .network-node, input, textarea, .skill-item, .tech-tag, .terminal-control, .close-modal');
      
      interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => this.onElementEnter(element));
        element.addEventListener('mouseleave', () => this.onElementLeave(element));
        element.addEventListener('mousedown', () => this.onElementDown(element));
        element.addEventListener('mouseup', () => this.onElementUp(element));
      });
    }
    
    onMouseMove(e) {
      // Update target position
      this.targetPos.x = e.clientX;
      this.targetPos.y = e.clientY;
      
      // Add position to trail
      this.trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
      
      // Limit trail length
      if (this.trail.length > this.trailLength) {
        this.trail.shift();
      }
    }
    
    onMouseEnter() {
      // Show cursor when mouse enters document
      this.isVisible = true;
      if (this.cursor) this.cursor.classList.add('active');
      if (this.cursorDot) this.cursorDot.classList.add('active');
      if (this.cursorRing) this.cursorRing.classList.add('active');
    }
    
    onMouseLeave() {
      // Hide cursor when mouse leaves document
      this.isVisible = false;
      if (this.cursor) this.cursor.classList.remove('active');
      if (this.cursorDot) this.cursorDot.classList.remove('active');
      if (this.cursorRing) this.cursorRing.classList.remove('active');
    }
    
    onMouseDown(e) {
      // Store click information
      this.lastClickTime = Date.now();
      this.lastClickPosition = { x: e.clientX, y: e.clientY };
      
      // Create ripple effect at click position
      this.createClickRipple(e.clientX, e.clientY);
      
      // Apply click state to cursor
      if (this.cursor) {
        this.cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
      }
      if (this.cursorDot) {
        this.cursorDot.style.transform = 'translate(-50%, -50%) scale(0.7)';
      }
      if (this.cursorRing) {
        this.cursorRing.style.transform = 'translate(-50%, -50%) scale(0.9)';
        this.cursorRing.style.opacity = '0.5';
      }
    }
    
    onMouseUp(e) {
      // Remove click state
      if (this.cursor) {
        const scale = this.isHovering ? 1.3 : 1;
        const rotation = (this.currentElement && this.currentElement.matches('input, textarea') && this.isHovering) ? ' rotate(45deg)' : '';
        this.cursor.style.transform = `translate(-50%, -50%) scale(${scale})${rotation}`;
      }
      if (this.cursorDot) {
        this.cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      }
      if (this.cursorRing) {
        this.cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        this.cursorRing.style.opacity = '0.3';
      }
    }
    
    onElementEnter(element) {
      if (!this.cursor || !this.cursorDot || !this.cursorRing) return;
      // Apply hover state
      this.isHovering = true;
      this.currentElement = element;
      this.cursor.classList.add('hover');
      
      // Add specific states based on element type
      if (element.matches('button, .quantum-button, input[type="submit"]')) {
        this.cursor.style.borderColor = 'var(--color-primary)'; // Neon Orange
        this.cursor.style.transform = 'translate(-50%, -50%) scale(1.3)';
        this.cursorDot.style.backgroundColor = 'var(--color-primary)';
        this.cursorDot.style.boxShadow = '0 0 15px rgba(255, 95, 31, 0.9)';
        this.cursorRing.style.width = '60px';
        this.cursorRing.style.height = '60px';
        this.cursorRing.style.opacity = '0.4';
      } else if (element.matches('a, .neural-pathways li, .network-node')) {
        this.cursor.style.borderColor = 'var(--color-primary)'; // Neon Orange
        this.cursorDot.style.backgroundColor = 'var(--color-primary)';
        this.cursorDot.style.boxShadow = '0 0 12px rgba(255, 95, 31, 0.8)';
        this.cursorRing.style.width = '55px';
        this.cursorRing.style.height = '55px';
        this.cursorRing.style.opacity = '0.35';
      } else if (element.matches('input, textarea')) {
         this.cursor.style.borderColor = 'var(--color-silver)'; // Silver
         this.cursor.style.transform = 'translate(-50%, -50%) scale(1.1) rotate(45deg)';
         this.cursorDot.style.backgroundColor = 'var(--color-silver)';
         this.cursorDot.style.boxShadow = '0 0 10px rgba(192, 192, 192, 0.7)';
         this.cursorRing.style.width = '45px';
         this.cursorRing.style.height = '45px';
         this.cursorRing.style.opacity = '0.25';
      }
      
      // Create hover ripple effect
      this.createHoverRipple(element);
    }
    
    onElementLeave(element) {
      if (!this.cursor || !this.cursorDot || !this.cursorRing) return;
      // Remove hover state
      this.isHovering = false;
      this.currentElement = null;
      this.cursor.classList.remove('hover');
      this.cursor.style.borderColor = 'var(--color-primary)'; // Default Neon Orange
      this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      this.cursorDot.style.backgroundColor = 'var(--color-primary)'; // Default Neon Orange
      this.cursorDot.style.boxShadow = '0 0 10px rgba(255, 95, 31, 0.7)';
      this.cursorRing.style.width = '50px';
      this.cursorRing.style.height = '50px';
      this.cursorRing.style.opacity = '0.3';
    }
    
    onElementDown(element) {
      if (!this.cursor || !this.cursorDot || !this.cursorRing) return;
      // Apply click state
      this.cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
      this.cursorDot.style.transform = 'translate(-50%, -50%) scale(0.7)';
      this.cursorRing.style.transform = 'translate(-50%, -50%) scale(0.9)';
      this.cursorRing.style.opacity = '0.5';
    }
    
    onElementUp(element) {
      if (!this.cursor || !this.cursorDot || !this.cursorRing) return;
      // Remove click state
      const scale = this.isHovering ? 1.3 : 1; // Adjusted hover scale
      const rotation = (element.matches('input, textarea') && this.isHovering) ? ' rotate(45deg)' : '';
      this.cursor.style.transform = `translate(-50%, -50%) scale(${scale})${rotation}`;
      this.cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      this.cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
      this.cursorRing.style.opacity = '0.3';
    }
    
    createHoverRipple(element) {
      // Create subtle ripple effect on element hover
      const ripple = document.createElement('div');
      ripple.className = 'hover-ripple-effect';
      ripple.style.position = 'absolute';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(255, 95, 31, 0.2)';
      ripple.style.transform = 'scale(0)';
      ripple.style.opacity = '0.8';
      ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
      ripple.style.pointerEvents = 'none';
      
      // Position ripple at cursor position relative to element
      const rect = element.getBoundingClientRect();
      const x = this.targetPos.x - rect.left;
      const y = this.targetPos.y - rect.top;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      // Add ripple to element if it has position
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.position === 'static') {
        element.style.position = 'relative';
      }
      
      element.style.overflow = 'hidden'; // Clip ripple
      element.appendChild(ripple);
      
      // Animate ripple
      setTimeout(() => {
        ripple.style.transform = 'scale(5)';
        ripple.style.opacity = '0';
        
        // Remove ripple after animation
        setTimeout(() => {
          if (ripple.parentNode === element) {
            element.removeChild(ripple);
          }
        }, 600);
      }, 10);
    }
    
    createClickRipple(x, y) {
      // Create ripple effect at click position
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple-effect';
      ripple.style.position = 'fixed';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = '10px';
      ripple.style.height = '10px';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(255, 95, 31, 0.5)';
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';
      ripple.style.opacity = '1';
      ripple.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '9997';
      
      // Add ripple to document body or trail container
      if (this.trailContainer) {
        this.trailContainer.appendChild(ripple);
      } else if (document.body) {
        document.body.appendChild(ripple);
      }
      
      // Animate ripple
      setTimeout(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(20)';
        ripple.style.opacity = '0';
        
        // Remove ripple after animation
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 600);
      }, 10);
    }
    
    updateCursorPosition() {
      // Skip if not visible or elements don't exist
      if (!this.isVisible || !this.cursor || !this.cursorDot || !this.cursorRing) return;
      
      // Smooth cursor movement with lerp (linear interpolation)
      this.cursorPos.x += (this.targetPos.x - this.cursorPos.x) * 0.15; // Reduced smoothing factor for less lag
      this.cursorPos.y += (this.targetPos.y - this.cursorPos.y) * 0.15;
      
      // Apply position to cursor elements
      this.cursor.style.left = `${this.cursorPos.x}px`;
      this.cursor.style.top = `${this.cursorPos.y}px`;
      
      // Dot follows more closely (less lag)
      this.cursorDot.style.left = `${this.targetPos.x}px`;
      this.cursorDot.style.top = `${this.targetPos.y}px`;
      
      // Ring follows with slight delay
      this.cursorRing.style.left = `${this.cursorPos.x}px`;
      this.cursorRing.style.top = `${this.cursorPos.y}px`;
      
      // Draw trail effect
      this.drawTrail();
    }
    
    drawTrail() {
      // Only draw trail if we have enough points and the container exists
      if (this.trail.length < 2 || !this.trailContainer) return;
      
      // Remove old trail elements
      while (this.trailElements.length > this.maxTrailElements) {
        const oldTrail = this.trailElements.shift();
        if (oldTrail.parentNode) {
          oldTrail.parentNode.removeChild(oldTrail);
        }
      }
      
      // Only add new trail element every few frames for performance
      if (Math.random() < 0.3) {
        // Create new trail element
        const trailElement = document.createElement('div');
        trailElement.className = 'cursor-trail';
        trailElement.style.position = 'fixed';
        trailElement.style.width = '4px'; // Smaller trail dots
        trailElement.style.height = '4px'; // Smaller trail dots
        trailElement.style.borderRadius = '50%';
        trailElement.style.backgroundColor = 'var(--color-primary)';
        trailElement.style.opacity = '0.5'; // Lower opacity for subtler effect
        trailElement.style.transition = 'opacity 0.5s ease';
        trailElement.style.pointerEvents = 'none';
        trailElement.style.zIndex = '9998';
        
        // Position at a random point from the trail
        const trailIndex = Math.floor(Math.random() * (this.trail.length - 1));
        const trailPoint = this.trail[trailIndex];
        
        trailElement.style.left = `${trailPoint.x}px`;
        trailElement.style.top = `${trailPoint.y}px`;
        
        // Add to container
        this.trailContainer.appendChild(trailElement);
        this.trailElements.push(trailElement);
        
        // Fade out and remove
        setTimeout(() => {
          trailElement.style.opacity = '0';
          setTimeout(() => {
            if (trailElement.parentNode) {
              trailElement.parentNode.removeChild(trailElement);
              const index = this.trailElements.indexOf(trailElement);
              if (index > -1) {
                this.trailElements.splice(index, 1);
              }
            }
          }, 500);
        }, 300);
      }
    }
    
    animate() {
      // Update cursor position
      this.updateCursorPosition();
      
      // Continue animation loop
      this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    pauseAnimation() {
      // Cancel animation frame
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    }
    
    resumeAnimation() {
      // Resume animation if not already running
      if (!this.animationFrame) {
        this.animate();
      }
    }
  }
  
  // Initialize cursor on DOM content loaded
  document.addEventListener('DOMContentLoaded', () => {
    window.customCursor = new CustomCursor();
    window.customCursor.init();
  });
}
