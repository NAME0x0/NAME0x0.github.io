"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap/gsapClient";

type Skill = {
  title: string;
  items: string[];
  icon: string;
  level: number; // 1-100
  color: string;
};

export function Skills() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const skills: Skill[] = [
    { 
      title: "AI/ML", 
      items: ["LLMs", "RAG", "Agents", "Vector DBs", "PyTorch", "TensorFlow"],
      icon: "🧠",
      level: 92,
      color: "from-electric to-neonCyan"
    },
    { 
      title: "Frontend", 
      items: ["Next.js", "TypeScript", "GSAP", "Three.js", "WebGL", "TailwindCSS"],
      icon: "⚡",
      level: 95,
      color: "from-neonCyan to-electric"
    },
    { 
      title: "Backend", 
      items: ["Node.js", "Edge Functions", "REST", "GraphQL", "Auth", "Postgres"],
      icon: "🚀",
      level: 88,
      color: "from-electric to-neonMagenta"
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const cards = container.querySelectorAll('.skill-card');
      
      cards.forEach((card, index) => {
        const progressBar = card.querySelector('.progress-bar');
        const skillLevel = skills[index].level;
        
        // Animate progress bar on hover
        card.addEventListener('mouseenter', () => {
          gsap.to(progressBar, {
            width: `${skillLevel}%`,
            duration: 1.2,
            ease: "power2.out"
          });
          
          gsap.to(card, {
            scale: 1.05,
            rotationY: 5,
            z: 50,
            duration: 0.4,
            ease: "power2.out"
          });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(progressBar, {
            width: "0%",
            duration: 0.6,
            ease: "power2.inOut"
          });
          
          gsap.to(card, {
            scale: 1,
            rotationY: 0,
            z: 0,
            duration: 0.4,
            ease: "power2.out"
          });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-5xl text-silver mb-4 animate-slide-up">
          Superpowers
        </h2>
        <p className="text-silver/70 text-lg animate-fade-in">
          Mastering the art of digital innovation
        </p>
      </div>
      
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ perspective: "1000px" }}>
        {skills.map((skill, index) => (
          <div 
            key={skill.title} 
            className="skill-card group relative frame p-8 animate-fade-in cursor-pointer transition-all duration-300 hover:shadow-glow"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
            
            {/* Icon and title */}
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-3 group-hover:animate-bounce">
                {skill.icon}
              </span>
              <h3 className="font-heading text-xl text-electric group-hover:text-white transition-colors">
                {skill.title}
              </h3>
            </div>
            
            {/* Progress bar container */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-silver/60">Mastery Level</span>
                <span className="text-sm text-electric font-mono">{skill.level}%</span>
              </div>
              <div className="h-2 bg-gunmetal rounded-full overflow-hidden">
                <div 
                  className={`progress-bar h-full bg-gradient-to-r ${skill.color} w-0 transition-all duration-1200 ease-out rounded-full relative`}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </div>
            
            {/* Skills list */}
            <ul className="space-y-2">
              {skill.items.map((item, itemIndex) => (
                <li 
                  key={item}
                  className="text-silver/80 group-hover:text-silver transition-colors flex items-center"
                  style={{
                    animationDelay: `${itemIndex * 50}ms`
                  }}
                >
                  <span className="w-1 h-1 bg-electric rounded-full mr-3 group-hover:shadow-glow transition-shadow" />
                  {item}
                </li>
              ))}
            </ul>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-electric rounded-full animate-ping"
                  style={{
                    left: `${(i * 12.5) % 100}%`,
                    top: `${(i * 20.83) % 100}%`,
                    animationDelay: `${i * 200}ms`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

