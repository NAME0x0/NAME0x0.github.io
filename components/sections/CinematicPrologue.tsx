"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function CinematicPrologue() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Register ScrollTrigger plugin
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const container = containerRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const grid = gridRef.current;

    if (!container || !title || !subtitle || !cta || !grid) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([title, subtitle, cta], { opacity: 0, y: 30 });
      gsap.set(grid, { opacity: 0 });

      // Main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
      });

      // Cinematic reveal sequence
      tl.to(title, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
      })
        .to(subtitle, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        }, "-=0.8")
        .to(grid, {
          opacity: 1,
          duration: 1.5,
          ease: "power1.out",
        }, "-=0.5")
        .to(cta, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        }, "-=0.3");

      // Parallax effect for background elements
      gsap.to(".prologue-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Floating animation for cards
      gsap.to(".floating-card", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.2,
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="prologue"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-obsidian via-gunmetal to-obsidian"
    >
      {/* Background layers */}
      <div className="prologue-bg absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(15,240,252,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(15,240,252,0.05),transparent_50%)]" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        ref={gridRef}
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(15,240,252,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,240,252,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main content */}
      <div className="container-cinematic relative z-10 text-center">
        <h1
          ref={titleRef}
          className="heading-primary mb-8"
        >
          Welcome to the{" "}
          <span className="holo-text">Digital Frontier</span>
        </h1>

        <p
          ref={subtitleRef}
          className="body-large text-silver/80 max-w-3xl mx-auto mb-12"
        >
          Step into a world where innovation meets artistry, where code transforms into 
          immersive experiences, and where every pixel tells a story of technological mastery.
        </p>

        {/* CTA Section */}
        <div ref={ctaRef} className="space-y-6">
          <button
            onClick={() => {
              document.getElementById("skills")?.scrollIntoView({ 
                behavior: "smooth",
                block: "start"
              });
            }}
            className="glass-button primary-glow group"
          >
            <span className="relative z-10">Begin Journey</span>
            <div className="absolute inset-0 bg-electric/20 rounded-xl blur group-hover:blur-md transition-all duration-300" />
          </button>

          <p className="text-sm text-silver/60 uppercase tracking-wider">
            Scroll to explore the narrative
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          {[
            {
              title: "AI-Driven Solutions",
              description: "Leveraging machine learning to solve complex problems",
              icon: "🤖",
            },
            {
              title: "Immersive Experiences",
              description: "Creating 3D worlds that captivate and inspire",
              icon: "🌐",
            },
            {
              title: "Global Perspective",
              description: "6 countries, infinite possibilities",
              icon: "🌍",
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="floating-card glass-subtle p-6 rounded-xl text-center group hover:border-electric/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="heading-tertiary mb-3 group-hover:text-electric transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-silver/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ambient particles - Using deterministic positioning */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-electric/60 rounded-full animate-float"
            style={{
              left: `${(i * 8.33) % 100}%`,
              top: `${(i * 15.67) % 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + (i % 3) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <div className="w-6 h-10 border-2 border-electric/40 rounded-full relative">
          <div className="w-1 h-3 bg-electric/60 rounded-full absolute top-2 left-1/2 -translate-x-1/2 animate-bounce" />
        </div>
        <p className="text-xs text-silver/60 mt-2 uppercase tracking-wider">
          Scroll Down
        </p>
      </div>
    </section>
  );
}
