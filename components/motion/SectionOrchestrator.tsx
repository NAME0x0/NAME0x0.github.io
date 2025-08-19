"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap/gsapClient";

export function SectionOrchestrator() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const ctx = gsap.context(() => {
      // Enhanced scroll progress indicator
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });

      // Main narrative timeline
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      // Section orchestration
      const sections = [
        { id: "#prologue", name: "prologue" },
        { id: "#skills", name: "skills" },
        { id: "#projects", name: "projects" },
        { id: "#global", name: "global" },
        { id: "#terminal", name: "terminal" },
        { id: "#ops", name: "ops" },
        { id: "#contact", name: "contact" },
      ];

      sections.forEach((section, index) => {
        const element = document.querySelector(section.id);
        if (!element) return;

        // Section entrance animation
        gsap.fromTo(element, 
          { 
            opacity: 0.7,
            filter: "blur(2px)",
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "top 50%",
              scrub: 1,
            },
          }
        );

        // Section focus effect
        gsap.to(element, {
          scale: 1.02,
          duration: 2,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top center",
            end: "bottom center",
            scrub: 1,
            onEnter: () => {
              // Trigger section-specific animations
              document.dispatchEvent(new CustomEvent(`section-enter-${section.name}`));
            },
            onLeave: () => {
              document.dispatchEvent(new CustomEvent(`section-leave-${section.name}`));
            },
          },
        });

        // Parallax background effects
        const background = element.querySelector('.section-background');
        if (background) {
          gsap.to(background, {
            yPercent: -30,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      });

      // Cinematic transitions between major sections
      const majorTransitions = [
        { from: "#prologue", to: "#skills" },
        { from: "#projects", to: "#global" },
        { from: "#terminal", to: "#ops" },
        { from: "#ops", to: "#contact" },
      ];

      majorTransitions.forEach(transition => {
        const fromEl = document.querySelector(transition.from);
        const toEl = document.querySelector(transition.to);
        
        if (fromEl && toEl) {
          ScrollTrigger.create({
            trigger: toEl,
            start: "top 60%",
            onEnter: () => {
              // Create cinematic wipe effect
              const wipe = document.createElement('div');
              wipe.className = 'fixed inset-0 z-40 pointer-events-none';
              wipe.style.background = 'linear-gradient(90deg, transparent 0%, rgba(15,240,252,0.1) 50%, transparent 100%)';
              wipe.style.transform = 'translateX(-100%)';
              document.body.appendChild(wipe);

              gsap.to(wipe, {
                x: "100vw",
                duration: 1.5,
                ease: "power2.inOut",
                onComplete: () => {
                  document.body.removeChild(wipe);
                }
              });
            }
          });
        }
      });

      // Floating navigation dots
      const navigationDots = document.querySelector('.navigation-dots');
      if (navigationDots) {
        sections.forEach((section, index) => {
          const element = document.querySelector(section.id);
          if (!element) return;

          ScrollTrigger.create({
            trigger: element,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
              navigationDots.setAttribute('data-active', index.toString());
            },
            onEnterBack: () => {
              navigationDots.setAttribute('data-active', index.toString());
            },
          });
        });
      }

      // Performance optimization
      ScrollTrigger.config({
        limitCallbacks: true,
        syncInterval: 100,
      });

    });

    return () => ctx.revert();
  }, [isClient]);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Enhanced scroll progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gunmetal/30 backdrop-blur-sm">
        <div 
          ref={progressRef}
          className="h-full bg-gradient-to-r from-electric via-neonCyan to-electric origin-left scale-x-0 shadow-glow"
        />
      </div>

      {/* Floating navigation dots */}
      <nav className="navigation-dots fixed right-8 top-1/2 -translate-y-1/2 z-40 space-y-4" data-active="0">
        {[
          { name: "Prologue", id: "prologue" },
          { name: "Skills", id: "skills" },
          { name: "Projects", id: "projects" },
          { name: "Global", id: "global" },
          { name: "Terminal", id: "terminal" },
          { name: "Daily Ops", id: "ops" },
          { name: "Contact", id: "contact" },
        ].map((section, index) => (
          <div key={section.id} className="group relative">
            <button
              onClick={() => {
                document.getElementById(section.id)?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
              className={`w-3 h-3 rounded-full border-2 border-electric/40 transition-all duration-300 hover:border-electric hover:scale-125 ${
                index === 0 ? 'bg-electric border-electric' : 'bg-transparent'
              }`}
              aria-label={`Navigate to ${section.name}`}
            />
            
            {/* Tooltip */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="glass-subtle px-3 py-2 rounded-lg text-sm text-silver whitespace-nowrap">
                {section.name}
              </div>
            </div>
          </div>
        ))}
      </nav>

      {/* Section transition overlay */}
      <div id="section-transition-overlay" className="fixed inset-0 pointer-events-none z-30" />

      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-electric/20 rounded-full animate-float"
            style={{
              left: `${(i * 7.33) % 100}%`,
              top: `${(i * 11.67) % 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + (i % 4) * 2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .navigation-dots[data-active="0"] > :nth-child(1) button {
          background-color: #0ff0fc;
          border-color: #0ff0fc;
          box-shadow: 0 0 10px rgba(15, 240, 252, 0.5);
        }
        .navigation-dots[data-active="1"] > :nth-child(2) button {
          background-color: #0ff0fc;
          border-color: #0ff0fc;
          box-shadow: 0 0 10px rgba(15, 240, 252, 0.5);
        }
        .navigation-dots[data-active="2"] > :nth-child(3) button {
          background-color: #0ff0fc;
          border-color: #0ff0fc;
          box-shadow: 0 0 10px rgba(15, 240, 252, 0.5);
        }
        .navigation-dots[data-active="3"] > :nth-child(4) button {
          background-color: #0ff0fc;
          border-color: #0ff0fc;
          box-shadow: 0 0 10px rgba(15, 240, 252, 0.5);
        }
        .navigation-dots[data-active="4"] > :nth-child(5) button {
          background-color: #0ff0fc;
          border-color: #0ff0fc;
          box-shadow: 0 0 10px rgba(15, 240, 252, 0.5);
        }
        .navigation-dots[data-active="5"] > :nth-child(6) button {
          background-color: #0ff0fc;
          border-color: #0ff0fc;
          box-shadow: 0 0 10px rgba(15, 240, 252, 0.5);
        }
        .navigation-dots[data-active="6"] > :nth-child(7) button {
          background-color: #0ff0fc;
          border-color: #0ff0fc;
          box-shadow: 0 0 10px rgba(15, 240, 252, 0.5);
        }
      `}</style>
    </>
  );
}