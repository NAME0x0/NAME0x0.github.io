"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Globe = dynamic(() => import("@/components/three/Globe").then(m => m.Globe), { ssr: false });

const countries = [
  { name: "Pakistan", flag: "🇵🇰", description: "Born and raised, where it all began" },
  { name: "Qatar", flag: "🇶🇦", description: "First international experience" },
  { name: "Saudi Arabia", flag: "🇸🇦", description: "Cultural immersion and growth" },
  { name: "Oman", flag: "🇴🇲", description: "Desert landscapes and new perspectives" },
  { name: "UAE", flag: "🇦🇪", description: "Innovation hub and opportunities" },
  { name: "Hungary", flag: "🇭🇺", description: "European adventure and learning" },
];

export function GlobalPerspective() {
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const quote = quoteRef.current;
    const timeline = timelineRef.current;
    
    if (!container || !quote || !timeline) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([quote, timeline], { opacity: 0, y: 30 });

      // Section enter animation
      const handleSectionEnter = () => {
        const tl = gsap.timeline();

        tl.to(quote, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        })
        .to(timeline, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        }, "-=0.5")
        .from(".country-item", {
          opacity: 0,
          x: -50,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        }, "-=0.3");
      };

      document.addEventListener('section-enter-global', handleSectionEnter);

      return () => {
        document.removeEventListener('section-enter-global', handleSectionEnter);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Globe background */}
      <div className="absolute inset-0">
        <Globe />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-obsidian/80 via-transparent to-obsidian/80" />

      {/* Content */}
      <div className="container-cinematic relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Main statement */}
          <div className="text-center lg:text-left">
            <h2 className="heading-secondary mb-8">
              <span className="holo-text">Global Perspective</span>
            </h2>
            
            <blockquote 
              ref={quoteRef}
              className="text-3xl md:text-4xl lg:text-5xl text-silver/90 leading-tight font-heading font-light mb-8"
            >
              "I have lived in{" "}
              <span className="text-electric font-semibold">6 countries</span>{" "}
              across{" "}
              <span className="text-electric font-semibold">2 continents</span>{" "}
              thus far."
            </blockquote>

            <p className="body-large text-silver/70 max-w-2xl">
              Each country has shaped my perspective, teaching me to navigate 
              diverse cultures, adapt to different environments, and build 
              bridges across global communities through technology.
            </p>
          </div>

          {/* Global experiences */}
          <div ref={timelineRef} className="relative">
            <div className="glass-strong p-8 rounded-2xl">
              <h3 className="heading-tertiary mb-6">Global Journey</h3>
              
              <div className="space-y-4">
                {countries.map((country, index) => (
                  <div 
                    key={`${country.name}-${index}`}
                    className="country-item flex items-center gap-4 p-4 glass-subtle rounded-lg hover:border-electric/30 transition-colors cursor-pointer group"
                  >
                    <div className="text-2xl group-hover:scale-110 transition-transform">
                      {country.flag}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-silver font-semibold group-hover:text-electric transition-colors mb-1">
                        {country.name}
                      </h4>
                      <p className="text-sm text-silver/60">
                        {country.description}
                      </p>
                    </div>

                    {/* Connection dot */}
                    <div className="w-2 h-2 bg-electric/60 rounded-full group-hover:bg-electric group-hover:scale-125 transition-all" />
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-electric/20">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-heading font-bold text-electric">6</div>
                    <div className="text-xs text-silver/60 uppercase tracking-wider">Countries</div>
                  </div>
                  <div>
                    <div className="text-2xl font-heading font-bold text-electric">2</div>
                    <div className="text-xs text-silver/60 uppercase tracking-wider">Continents</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-electric/40 rounded-full animate-float"
            style={{
              left: `${(i * 7.5) % 100}%`,
              top: `${(i * 13.7) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${5 + (i % 3) * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
