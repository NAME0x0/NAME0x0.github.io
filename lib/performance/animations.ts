/**
 * Performance-optimized animation utilities
 * Ensures smooth 60fps animations with proper optimization
 */

import { gsap } from "@/lib/gsap/gsapClient";

// Performance configuration
export const PERFORMANCE_CONFIG = {
  // Target 60fps
  TARGET_FPS: 60,
  // Frame budget in milliseconds (16.67ms for 60fps)
  FRAME_BUDGET: 1000 / 60,
  // Maximum elements to animate simultaneously
  MAX_CONCURRENT_ANIMATIONS: 50,
  // Throttle scroll events
  SCROLL_THROTTLE: 16,
} as const;

/**
 * GPU-accelerated animation setup
 */
export function enableGPUAcceleration(element: Element) {
  gsap.set(element, {
    willChange: "transform",
    backfaceVisibility: "hidden",
    perspective: 1000,
    transformStyle: "preserve-3d",
  });
}

/**
 * Clean up GPU acceleration properties
 */
export function cleanupGPUAcceleration(element: Element) {
  gsap.set(element, {
    willChange: "auto",
    backfaceVisibility: "visible",
    perspective: "none",
    transformStyle: "flat",
  });
}

/**
 * Performance-optimized scroll animations
 */
export class PerformanceAnimator {
  private animationQueue: Set<() => void> = new Set();
  private rafId: number | null = null;
  private lastFrameTime = 0;

  /**
   * Add animation to the performance queue
   */
  addAnimation(animation: () => void) {
    this.animationQueue.add(animation);
    this.scheduleFrame();
  }

  /**
   * Remove animation from queue
   */
  removeAnimation(animation: () => void) {
    this.animationQueue.delete(animation);
  }

  /**
   * Schedule next animation frame with performance monitoring
   */
  private scheduleFrame() {
    if (this.rafId) return;

    this.rafId = requestAnimationFrame((currentTime) => {
      const deltaTime = currentTime - this.lastFrameTime;
      
      // Only proceed if we have sufficient frame budget
      if (deltaTime >= PERFORMANCE_CONFIG.FRAME_BUDGET) {
        this.executeAnimations();
        this.lastFrameTime = currentTime;
      }
      
      this.rafId = null;
      
      if (this.animationQueue.size > 0) {
        this.scheduleFrame();
      }
    });
  }

  /**
   * Execute animations within frame budget
   */
  private executeAnimations() {
    const startTime = performance.now();
    let animationsExecuted = 0;

    for (const animation of this.animationQueue) {
      // Check if we're approaching frame budget limit
      const elapsed = performance.now() - startTime;
      if (elapsed > PERFORMANCE_CONFIG.FRAME_BUDGET * 0.8) {
        break;
      }

      // Limit concurrent animations
      if (animationsExecuted >= PERFORMANCE_CONFIG.MAX_CONCURRENT_ANIMATIONS) {
        break;
      }

      try {
        animation();
        animationsExecuted++;
      } catch (error) {
        console.warn("Animation execution error:", error);
        this.animationQueue.delete(animation);
      }
    }
  }

  /**
   * Clear all animations
   */
  clear() {
    this.animationQueue.clear();
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

// Global performance animator instance
export const performanceAnimator = new PerformanceAnimator();

/**
 * Optimized scroll trigger creation
 */
export function createOptimizedScrollTrigger(options: {
  trigger: Element;
  animation: () => void;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  onEnter?: () => void;
  onLeave?: () => void;
}) {
  const { trigger, animation, start = "top 80%", end, scrub, onEnter, onLeave } = options;

  // Enable GPU acceleration for trigger element
  enableGPUAcceleration(trigger);

  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub: scrub ?? false,
      fastScrollEnd: true, // Optimize for fast scrolling
      anticipatePin: 1, // Improve pin performance
      refreshPriority: scrub ? -1 : 0, // Lower priority for scrub animations
      onEnter: () => {
        performanceAnimator.addAnimation(animation);
        onEnter?.();
      },
      onLeave: () => {
        performanceAnimator.removeAnimation(animation);
        onLeave?.();
      },
      onToggle: (self) => {
        if (self.isActive) {
          enableGPUAcceleration(trigger);
        } else {
          cleanupGPUAcceleration(trigger);
        }
      },
    },
  });
}

/**
 * Debounced resize handler for performance
 */
export function createOptimizedResizeHandler(callback: () => void, delay = 150) {
  let timeoutId: NodeJS.Timeout;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback();
    }, delay);
  };
}

/**
 * Intersection Observer for lazy animations
 */
export class LazyAnimationObserver {
  private observer: IntersectionObserver;
  private animationMap = new WeakMap<Element, () => void>();

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animation = this.animationMap.get(entry.target);
            if (animation) {
              enableGPUAcceleration(entry.target);
              animation();
              this.observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );
  }

  /**
   * Observe element for lazy animation
   */
  observe(element: Element, animation: () => void) {
    this.animationMap.set(element, animation);
    this.observer.observe(element);
  }

  /**
   * Stop observing element
   */
  unobserve(element: Element) {
    this.animationMap.delete(element);
    this.observer.unobserve(element);
  }

  /**
   * Cleanup observer
   */
  disconnect() {
    this.observer.disconnect();
    this.animationMap = new WeakMap();
  }
}

// Global lazy animation observer
export const lazyAnimationObserver = new LazyAnimationObserver();

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private metrics = {
    frameCount: 0,
    totalFrameTime: 0,
    slowFrames: 0,
    averageFPS: 0,
  };

  private lastFrameTime = performance.now();
  private monitoring = false;

  start() {
    if (this.monitoring) return;
    
    this.monitoring = true;
    this.measureFrame();
  }

  stop() {
    this.monitoring = false;
  }

  private measureFrame() {
    if (!this.monitoring) return;

    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;
    
    this.metrics.frameCount++;
    this.metrics.totalFrameTime += frameTime;
    
    if (frameTime > PERFORMANCE_CONFIG.FRAME_BUDGET * 1.5) {
      this.metrics.slowFrames++;
    }
    
    this.metrics.averageFPS = 1000 / (this.metrics.totalFrameTime / this.metrics.frameCount);
    
    this.lastFrameTime = currentTime;
    
    requestAnimationFrame(() => this.measureFrame());
  }

  getMetrics() {
    return {
      ...this.metrics,
      slowFramePercentage: (this.metrics.slowFrames / this.metrics.frameCount) * 100,
    };
  }

  reset() {
    this.metrics = {
      frameCount: 0,
      totalFrameTime: 0,
      slowFrames: 0,
      averageFPS: 0,
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Initialize performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.start();
  
  // Log performance metrics every 5 seconds
  setInterval(() => {
    const metrics = performanceMonitor.getMetrics();
    console.log('Animation Performance:', metrics);
  }, 5000);
}