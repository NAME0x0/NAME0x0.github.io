"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap/gsapClient";

type Project = {
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  tags: string[];
  status: "Featured" | "In Progress" | "Completed";
  link?: string;
  year: string;
};

const projects: Project[] = [
  {
    title: "AVA",
    subtitle: "AI Guided Portfolio Experience",
    description: "A conversational AI companion that guides visitors through an immersive, animated portfolio journey. Built with streaming responses and contextual awareness.",
    cover: "/icon.svg",
    tags: ["AI", "Next.js", "GSAP", "Three.js"],
    status: "Featured",
    year: "2024",
  },
  {
    title: "Holographic UI",
    subtitle: "WebGL Interface Experiments",
    description: "Experimental holographic overlays and interfaces using Three.js, WebGL shaders, and advanced particle systems for next-generation user experiences.",
    cover: "/icon.svg", 
    tags: ["WebGL", "Three.js", "Shaders", "UI/UX"],
    status: "In Progress",
    year: "2024",
  },
  {
    title: "Neural Canvas",
    subtitle: "AI-Powered Creative Platform",
    description: "A creative platform that combines machine learning with interactive design tools, enabling artists to collaborate with AI in real-time creation processes.",
    cover: "/icon.svg",
    tags: ["ML", "Canvas API", "Real-time", "Creative Tools"],
    status: "Completed",
    year: "2023",
  },
];

export function Projects() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const cards = container.querySelectorAll('.project-card');
      
      cards.forEach((card) => {
        const overlay = card.querySelector('.project-overlay');
        const content = card.querySelector('.project-content');
        const image = card.querySelector('.project-image');
        
        // Parallax effect on scroll
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.to(image, {
              y: progress * 50,
              duration: 0.3,
              ease: "none"
            });
          }
        });

        // Hover interactions
        card.addEventListener('mouseenter', () => {
          gsap.to(overlay, {
            opacity: 1,
            scale: 1.05,
            duration: 0.6,
            ease: "power2.out"
          });
          
          gsap.to(content, {
            y: -10,
            duration: 0.4,
            ease: "power2.out"
          });

          gsap.to(image, {
            scale: 1.1,
            duration: 0.8,
            ease: "power2.out"
          });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(overlay, {
            opacity: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.inOut"
          });
          
          gsap.to(content, {
            y: 0,
            duration: 0.4,
            ease: "power2.out"
          });

          gsap.to(image, {
            scale: 1,
            duration: 0.6,
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
          Featured Projects
        </h2>
        <p className="text-silver/70 text-lg animate-fade-in">
          Cinematic experiences at the intersection of AI and creativity
        </p>
      </div>
      
      <div ref={containerRef} className="space-y-12">
        {projects.map((project, index) => (
          <div 
            key={project.title}
            className={`project-card group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gunmetal/40 to-obsidian/60 border border-silver/10 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } flex flex-col md:flex`}
            style={{ minHeight: "400px" }}
          >
            {/* Image Section */}
            <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden">
              <div className="project-image absolute inset-0">
                <Image 
                  src={project.cover} 
                  alt={project.title}
                  fill 
                  sizes="(min-width:768px) 50vw, 100vw" 
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
              
              {/* Holographic overlay */}
              <div className="project-overlay absolute inset-0 bg-gradient-to-br from-electric/20 via-transparent to-neonCyan/10 opacity-0 mix-blend-overlay" />
              
              {/* Status badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-mono ${
                  project.status === 'Featured' ? 'bg-electric/20 text-electric border border-electric/40' :
                  project.status === 'In Progress' ? 'bg-neonCyan/20 text-neonCyan border border-neonCyan/40' :
                  'bg-silver/20 text-silver border border-silver/40'
                }`}>
                  {project.status}
                </span>
              </div>

              {/* Year badge */}
              <div className="absolute bottom-4 right-4 z-10">
                <span className="px-2 py-1 rounded bg-obsidian/80 text-silver/80 text-sm font-mono">
                  {project.year}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="project-content md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading text-2xl md:text-3xl text-electric mb-2 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <h4 className="text-silver/80 text-lg font-medium">
                    {project.subtitle}
                  </h4>
                </div>
                
                <p className="text-silver/70 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gunmetal/60 text-silver/80 rounded-full text-sm border border-silver/10 group-hover:border-electric/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <button className="inline-flex items-center text-electric hover:text-white transition-colors group-hover:underline">
                    <span>Explore Project</span>
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Cinematic frame overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-electric/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-electric/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-electric/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-electric/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

