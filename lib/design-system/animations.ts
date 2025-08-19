/**
 * Animation Utilities and Presets
 * Centralized animation system for consistent motion design
 */

import { gsap } from "@/lib/gsap/gsapClient";

// Animation Configuration
export const animationConfig = {
  durations: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
    slowest: 1.2,
  },
  easing: {
    smooth: "power2.out",
    electric: "back.out(1.7)",
    bounce: "bounce.out",
    elastic: "elastic.out(1, 0.3)",
    circ: "circ.out",
    expo: "expo.out",
  },
} as const;

// Preset Animations
export const animationPresets = {
  // Entrance Animations
  fadeIn: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: animationConfig.durations.normal,
        ease: animationConfig.easing.smooth,
        ...options,
      }
    );
  },

  slideUp: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: animationConfig.durations.slow,
        ease: animationConfig.easing.smooth,
        ...options,
      }
    );
  },

  slideLeft: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        x: 40,
      },
      {
        opacity: 1,
        x: 0,
        duration: animationConfig.durations.slow,
        ease: animationConfig.easing.smooth,
        ...options,
      }
    );
  },

  slideRight: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        x: -40,
      },
      {
        opacity: 1,
        x: 0,
        duration: animationConfig.durations.slow,
        ease: animationConfig.easing.smooth,
        ...options,
      }
    );
  },

  scaleIn: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        scale: 0.9,
      },
      {
        opacity: 1,
        scale: 1,
        duration: animationConfig.durations.normal,
        ease: animationConfig.easing.smooth,
        ...options,
      }
    );
  },

  // Hover Animations
  hoverLift: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.to(element, {
      y: -8,
      scale: 1.02,
      duration: animationConfig.durations.normal,
      ease: animationConfig.easing.smooth,
      ...options,
    });
  },

  hoverGlow: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.to(element, {
      boxShadow: "0 0 40px rgba(15, 240, 252, 0.6)",
      duration: animationConfig.durations.normal,
      ease: animationConfig.easing.smooth,
      ...options,
    });
  },

  // Holographic Effects
  holoPulse: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.to(element, {
      opacity: 0.8,
      scale: 1.02,
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      ...options,
    });
  },

  holoScan: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.to(element, {
      backgroundPosition: "200% 0",
      duration: 3,
      ease: "none",
      repeat: -1,
      ...options,
    });
  },

  // Loading Animations
  loadingPulse: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.to(element, {
      opacity: 0.5,
      duration: 1,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      ...options,
    });
  },

  loadingSpin: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: "none",
      repeat: -1,
      ...options,
    });
  },

  // Exit Animations
  fadeOut: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.to(element, {
      opacity: 0,
      y: -20,
      duration: animationConfig.durations.normal,
      ease: animationConfig.easing.smooth,
      ...options,
    });
  },

  slideDown: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.to(element, {
      opacity: 0,
      y: 40,
      duration: animationConfig.durations.normal,
      ease: animationConfig.easing.smooth,
      ...options,
    });
  },

  scaleOut: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.to(element, {
      opacity: 0,
      scale: 0.9,
      duration: animationConfig.durations.normal,
      ease: animationConfig.easing.smooth,
      ...options,
    });
  },
} as const;

// Animation Sequencer
export class AnimationSequencer {
  private timeline: gsap.core.Timeline;

  constructor(options?: gsap.TimelineVars) {
    this.timeline = gsap.timeline(options);
  }

  add(animation: gsap.core.Tween | (() => gsap.core.Tween), position?: string | number) {
    if (typeof animation === 'function') {
      this.timeline.add(animation(), position);
    } else {
      this.timeline.add(animation, position);
    }
    return this;
  }

  fadeInSequence(elements: gsap.TweenTarget[], stagger: number = 0.1) {
    elements.forEach((element, index) => {
      this.timeline.add(
        animationPresets.fadeIn(element),
        index * stagger
      );
    });
    return this;
  }

  slideUpSequence(elements: gsap.TweenTarget[], stagger: number = 0.15) {
    elements.forEach((element, index) => {
      this.timeline.add(
        animationPresets.slideUp(element),
        index * stagger
      );
    });
    return this;
  }

  play() {
    return this.timeline.play();
  }

  pause() {
    return this.timeline.pause();
  }

  reverse() {
    return this.timeline.reverse();
  }

  kill() {
    return this.timeline.kill();
  }

  getTimeline() {
    return this.timeline;
  }
}

// Scroll-triggered Animations
export const scrollAnimations = {
  parallax: (element: gsap.TweenTarget, options?: { speed?: number; direction?: "up" | "down" }) => {
    const { speed = 0.5, direction = "up" } = options || {};
    const yDirection = direction === "up" ? -1 : 1;

    return gsap.to(element, {
      yPercent: yDirection * 50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element as gsap.DOMTarget,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  },

  reveal: (element: gsap.TweenTarget, options?: { trigger?: string; start?: string; end?: string }) => {
    const { trigger, start = "top 80%", end } = options || {};

    return gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: animationConfig.durations.slow,
        ease: animationConfig.easing.smooth,
        scrollTrigger: {
          trigger: (trigger || element) as gsap.DOMTarget,
          start,
          end,
          toggleActions: "play none none reverse",
        },
      }
    );
  },

  pinSection: (element: gsap.TweenTarget, options?: { start?: string; end?: string }) => {
    const { start = "top top", end = "+=100%" } = options || {};

    return gsap.timeline({
      scrollTrigger: {
        trigger: element as gsap.DOMTarget,
        start,
        end,
        pin: true,
        scrub: 1,
      },
    });
  },
};

// Utility Functions
export const animationUtils = {
  // Create staggered animation
  stagger: (elements: gsap.TweenTarget[], animation: keyof typeof animationPresets, delay: number = 0.1) => {
    const tl = gsap.timeline();
    elements.forEach((element, index) => {
      tl.add(animationPresets[animation](element), index * delay);
    });
    return tl;
  },

  // Batch animations with different properties
  batch: (elements: gsap.TweenTarget[], from: gsap.TweenVars, to: gsap.TweenVars) => {
    return gsap.fromTo(elements, from, to);
  },

  // Create hover interactions
  addHoverEffect: (
    element: Element,
    hoverAnimation: () => gsap.core.Tween,
    leaveAnimation: () => gsap.core.Tween
  ) => {
    element.addEventListener("mouseenter", hoverAnimation);
    element.addEventListener("mouseleave", leaveAnimation);

    return () => {
      element.removeEventListener("mouseenter", hoverAnimation);
      element.removeEventListener("mouseleave", leaveAnimation);
    };
  },

  // Performance optimization
  optimizeForPerformance: (element: gsap.TweenTarget) => {
    gsap.set(element, {
      willChange: "transform",
      backfaceVisibility: "hidden",
      perspective: 1000,
    });
  },

  // Clean up animations
  killAll: (elements: gsap.TweenTarget[]) => {
    elements.forEach(element => {
      gsap.killTweensOf(element);
    });
  },
};

// Component-specific animations
export const componentAnimations = {
  modal: {
    enter: (element: gsap.TweenTarget) => {
      return gsap.fromTo(
        element,
        {
          opacity: 0,
          scale: 0.9,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: animationConfig.durations.normal,
          ease: animationConfig.easing.electric,
        }
      );
    },
    exit: (element: gsap.TweenTarget) => {
      return gsap.to(element, {
        opacity: 0,
        scale: 0.9,
        y: 50,
        duration: animationConfig.durations.fast,
        ease: animationConfig.easing.smooth,
      });
    },
  },

  tooltip: {
    enter: (element: gsap.TweenTarget) => {
      return gsap.fromTo(
        element,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: animationConfig.durations.fast,
          ease: animationConfig.easing.smooth,
        }
      );
    },
    exit: (element: gsap.TweenTarget) => {
      return gsap.to(element, {
        opacity: 0,
        scale: 0.8,
        duration: animationConfig.durations.fast,
        ease: animationConfig.easing.smooth,
      });
    },
  },

  card: {
    hover: (element: gsap.TweenTarget) => {
      return gsap.to(element, {
        y: -8,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(15, 240, 252, 0.2)",
        duration: animationConfig.durations.normal,
        ease: animationConfig.easing.smooth,
      });
    },
    leave: (element: gsap.TweenTarget) => {
      return gsap.to(element, {
        y: 0,
        scale: 1,
        boxShadow: "0 8px 32px rgba(15, 240, 252, 0.1)",
        duration: animationConfig.durations.normal,
        ease: animationConfig.easing.smooth,
      });
    },
  },

  button: {
    press: (element: gsap.TweenTarget) => {
      return gsap.to(element, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    },
    glow: (element: gsap.TweenTarget) => {
      return gsap.to(element, {
        boxShadow: "0 0 30px rgba(15, 240, 252, 0.6)",
        duration: animationConfig.durations.normal,
        ease: animationConfig.easing.smooth,
      });
    },
  },
};

export default {
  animationConfig,
  animationPresets,
  AnimationSequencer,
  scrollAnimations,
  animationUtils,
  componentAnimations,
};