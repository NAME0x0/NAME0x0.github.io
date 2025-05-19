/**
 * Performance Optimizer
 * Monitors and optimizes website performance based on device capabilities
 */

// Check if class already exists to prevent duplicate declaration
if (typeof window.PerformanceOptimizer === 'undefined') {

class PerformanceOptimizer {
  constructor() {
    this.initialized = false;
    this.deviceTier = 'medium'; // Default to medium tier
    this.optimizationLevel = 1; // Default optimization level (0-3)
    this.fpsHistory = [];
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.monitoringInterval = null;
    this.isPageVisible = true;
    this.isReducedMotion = false;
    
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  init() {
    if (this.initialized) return;
    this.initialized = true;
    
    console.log('Initializing performance optimizer');
    
    // Detect device capabilities
    this.detectDeviceCapabilities();
    
    // Check for reduced motion preference
    this.checkReducedMotion();
    
    // Setup visibility change detection
    this.setupVisibilityDetection();
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring();
    
    // Apply initial optimizations
    this.applyOptimizations();
    
    // Listen for preloader completion
    document.addEventListener('preloaderComplete', () => {
      // Start monitoring after preloader completes
      this.startPerformanceMonitoring();
    });
  }
  
  detectDeviceCapabilities() {
    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Detect CPU cores (with fallback)
    const cpuCores = navigator.hardwareConcurrency || 2;
    
    // Detect WebGL capabilities
    let webglTier = 0;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          
          // Determine WebGL tier based on renderer string
          if (/nvidia|rtx|gtx/i.test(renderer)) {
            webglTier = 3; // High-end GPU
          } else if (/amd|radeon|intel/i.test(renderer)) {
            webglTier = 2; // Mid-range GPU
          } else {
            webglTier = 1; // Basic GPU
          }
        }
      }
    } catch (e) {
      console.warn('WebGL detection failed:', e);
    }
    
    // Determine device tier
    if (isMobile || cpuCores <= 2 || webglTier === 0) {
      this.deviceTier = 'low';
      this.optimizationLevel = 3; // Highest optimization (lowest quality)
    } else if (cpuCores <= 4 || webglTier === 1) {
      this.deviceTier = 'medium';
      this.optimizationLevel = 2; // Medium optimization
    } else {
      this.deviceTier = 'high';
      this.optimizationLevel = 1; // Light optimization (highest quality)
    }
    
    console.log(`Device Capabilities - Mobile: ${isMobile}, CPU Cores: ${cpuCores}, WebGL Tier: ${webglTier}, Device Tier: ${this.deviceTier}`);
  }
  
  checkReducedMotion() {
    // Check if user prefers reduced motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.isReducedMotion = reducedMotionQuery.matches;
    
    // Apply highest optimization level for reduced motion
    if (this.isReducedMotion) {
      this.optimizationLevel = 3;
    }
    
    // Listen for changes
    reducedMotionQuery.addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      
      if (this.isReducedMotion) {
        this.optimizationLevel = 3;
      } else {
        // Redetect device capabilities
        this.detectDeviceCapabilities();
      }
      
      this.applyOptimizations();
    });
  }
  
  setupVisibilityDetection() {
    // Listen for visibility change events
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = document.visibilityState === 'visible';
      
      if (this.isPageVisible) {
        // Resume animations when page becomes visible
        this.resumeAnimations();
      } else {
        // Pause animations when page is hidden
        this.pauseAnimations();
      }
    });
    
    // Listen for window focus/blur events as backup
    window.addEventListener('focus', () => {
      this.isPageVisible = true;
      this.resumeAnimations();
    });
    
    window.addEventListener('blur', () => {
      this.isPageVisible = false;
      this.pauseAnimations();
    });
  }
  
  pauseAnimations() {
    // Add class to body to pause CSS animations
    document.body.classList.add('animations-paused');
    
    // Dispatch event for JavaScript animations
    document.dispatchEvent(new CustomEvent('pauseAnimations'));
    
    // Stop performance monitoring
    this.stopPerformanceMonitoring();
  }
  
  resumeAnimations() {
    // Remove class from body to resume CSS animations
    document.body.classList.remove('animations-paused');
    
    // Dispatch event for JavaScript animations
    document.dispatchEvent(new CustomEvent('resumeAnimations'));
    
    // Restart performance monitoring
    this.startPerformanceMonitoring();
  }
  
  setupPerformanceMonitoring() {
    // Setup FPS monitoring
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    
    // Create FPS counter function
    const countFrame = () => {
      this.frameCount++;
      requestAnimationFrame(countFrame);
    };
    
    // Start counting frames
    requestAnimationFrame(countFrame);
  }
  
  startPerformanceMonitoring() {
    // Clear existing interval if any
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    // Start monitoring interval
    this.monitoringInterval = setInterval(() => {
      this.measurePerformance();
    }, 2000); // Check every 2 seconds
    
    console.log('Performance monitoring started');
  }
  
  stopPerformanceMonitoring() {
    // Clear monitoring interval
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
  
  measurePerformance() {
    // Calculate FPS
    const now = performance.now();
    const elapsed = now - this.lastFrameTime;
    const fps = Math.round((this.frameCount * 1000) / elapsed);
    
    // Reset counters
    this.lastFrameTime = now;
    this.frameCount = 0;
    
    // Add to history (keep last 5 measurements)
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > 5) {
      this.fpsHistory.shift();
    }
    
    // Calculate average FPS
    const avgFps = this.fpsHistory.reduce((sum, value) => sum + value, 0) / this.fpsHistory.length;
    
    // Adjust optimization level based on FPS
    this.adjustOptimizationLevel(avgFps);
  }
  
  adjustOptimizationLevel(fps) {
    // Skip adjustment if reduced motion is enabled
    if (this.isReducedMotion) return;
    
    // Adjust optimization level based on FPS
    if (fps < 30) {
      // Low FPS, increase optimization level
      this.optimizationLevel = Math.min(3, this.optimizationLevel + 1);
      this.applyOptimizations();
    } else if (fps > 55 && this.optimizationLevel > 1) {
      // High FPS, decrease optimization level if not already at minimum
      this.optimizationLevel = Math.max(1, this.optimizationLevel - 1);
      this.applyOptimizations();
    }
  }
  
  applyOptimizations() {
    // Apply optimization level to body
    document.body.setAttribute('data-optimization-level', this.optimizationLevel);
    document.body.setAttribute('data-device-tier', this.deviceTier);
    
    // Dispatch event for components to respond to
    document.dispatchEvent(new CustomEvent('optimizationChanged', { 
      detail: { 
        level: this.optimizationLevel,
        deviceTier: this.deviceTier,
        isReducedMotion: this.isReducedMotion
      }
    }));
    
    console.log(`Performance Optimizer initialized - Device Tier: ${this.deviceTier}, Initial Optimization Level: ${this.optimizationLevel}`);
  }
}

// Initialize performance optimizer
window.performanceOptimizer = new PerformanceOptimizer();

// Add to window object to make it globally accessible if needed
// and to help prevent re-declaration.
window.PerformanceOptimizer = PerformanceOptimizer;

} // End of if (typeof window.PerformanceOptimizer === 'undefined')
