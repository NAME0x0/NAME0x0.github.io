"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap/gsapClient";
import Image from "next/image";

export function PrologueLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    if (!container || !logo) return;

    const ctx = gsap.context(() => {
      // Create particles that form the logo
      const particles: HTMLElement[] = [];
      const numParticles = 150;
      
      // Create particle elements
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-electric rounded-full opacity-0';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        container.appendChild(particle);
        particles.push(particle);
      }

      // Logo formation animation
      const tl = gsap.timeline({ delay: 1 });

      // Phase 1: Particles appear and float
      tl.to(particles, {
        opacity: 1,
        duration: 2,
        stagger: {
          amount: 1,
          from: "random"
        },
        ease: "power2.out"
      });

      // Phase 2: Particles move randomly
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          duration: 3,
          delay: i * 0.01,
          ease: "sine.inOut",
          repeat: 2,
          yoyo: true
        });
      });

      // Phase 3: Particles converge to form logo outline
      tl.to(particles.slice(0, 50), {
        x: -100,
        y: 0,
        duration: 2,
        ease: "power3.inOut",
        stagger: 0.02
      }, "+=1")
      .to(particles.slice(50, 100), {
        x: 0,
        y: -50,
        duration: 2,
        ease: "power3.inOut",
        stagger: 0.02
      }, "-=1.8")
      .to(particles.slice(100, 150), {
        x: 100,
        y: 0,
        duration: 2,
        ease: "power3.inOut",
        stagger: 0.02
      }, "-=1.6");

      // Phase 4: Logo reveals
      tl.fromTo(logo, {
        opacity: 0,
        scale: 0.8,
        filter: "blur(10px)"
      }, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power2.out"
      }, "-=0.5");

      // Phase 5: Particles disperse
      tl.to(particles, {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: {
          amount: 0.5,
          from: "center"
        },
        ease: "power2.in"
      }, "+=0.5");

      // Continuous logo effects
      gsap.to(logo, {
        filter: "drop-shadow(0 0 20px rgba(15, 240, 252, 0.5)) drop-shadow(0 0 40px rgba(15, 240, 252, 0.2))",
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

      // Listen for section enter event
      const handleSectionEnter = () => {
        tl.restart();
      };

      document.addEventListener('section-enter-prologue', handleSectionEnter);

      return () => {
        document.removeEventListener('section-enter-prologue', handleSectionEnter);
        particles.forEach(particle => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        });
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-64 h-64 mx-auto mb-12"
    >
      {/* Logo container */}
      <div 
        ref={logoRef}
        className="absolute inset-0 flex items-center justify-center opacity-0"
      >
        <div className="relative">
          {/* Main logo */}
          <div className="w-32 h-32 rounded-full border-4 border-electric bg-gradient-to-br from-electric/20 to-transparent flex items-center justify-center backdrop-blur-sm overflow-hidden">
            <Image
              src="/logo.png"
              alt="Muhammad Afsah Mumtaz Logo"
              width={96}
              height={96}
              className="object-contain filter brightness-110"
              priority
            />
          </div>
          
          {/* Orbiting rings */}
          <div className="absolute inset-0 border-2 border-electric/30 rounded-full animate-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute -top-1 left-1/2 w-2 h-2 bg-electric rounded-full -translate-x-1/2" />
          </div>
          
          <div className="absolute -inset-4 border border-electric/20 rounded-full animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
            <div className="absolute top-0 right-4 w-1 h-1 bg-neonCyan rounded-full" />
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-neonMagenta rounded-full" />
          </div>
        </div>
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 bg-electric/5 rounded-full blur-3xl animate-pulse" />
    </div>
  );
}