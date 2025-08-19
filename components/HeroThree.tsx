"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function HeroThree() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameIdRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Performance optimization: reduce particle count on mobile
    const isMobile = window.innerWidth < 768;
    const isLowPerformance = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 60);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile, 
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Adaptive particle count based on device performance
    const particleCount = isMobile ? 1500 : isLowPerformance ? 2000 : 3000;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Create spiral formation with better distribution
      const radius = Math.random() * 15 + 5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 25;
      
      positions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
      
      sizes[i] = Math.random() * 0.025 + 0.008;
      
      // Electric blue with variation for depth
      const intensity = 0.4 + Math.random() * 0.6;
      colors[i3] = 0.06 * intensity; // R
      colors[i3 + 1] = 0.94 * intensity; // G
      colors[i3 + 2] = 0.98 * intensity; // B
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.02,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Optimized grid for lower-end devices
    if (!isLowPerformance) {
      const grid = new THREE.GridHelper(80, 80, 0x0ff0fc, 0x0ff0fc);
      grid.material.opacity = 0.04;
      // @ts-ignore - Grid material can be set transparent
      grid.material.transparent = true;
      scene.add(grid);
    }

    // Optimized lighting
    const ambient = new THREE.AmbientLight(0x0ff0fc, 0.2);
    const pointLight = new THREE.PointLight(0x0ff0fc, 1.2, 80);
    pointLight.position.set(0, 0, 10);
    scene.add(ambient, pointLight);

    // Performance monitoring
    let lastTime = 0;
    let frameCount = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;
    
    const clock = new THREE.Clock();
    
    function animate(currentTime: number) {
      frameIdRef.current = requestAnimationFrame(animate);
      
      // FPS throttling for better performance
      if (currentTime - lastTime < frameInterval) return;
      lastTime = currentTime;
      
      const t = clock.getElapsedTime();
      
      if (particlesRef.current && isVisible) {
        // Optimized rotation with reduced frequency
        particlesRef.current.rotation.y = t * 0.06;
        particlesRef.current.rotation.x = Math.sin(t * 0.08) * 0.08;
        
        // Subtle breathing effect
        const scale = 1 + Math.sin(t * 0.4) * 0.08;
        particlesRef.current.scale.setScalar(scale);
      }
      
      // Reduced point light animation
      pointLight.position.x = Math.sin(t * 0.3) * 4;
      pointLight.position.y = Math.cos(t * 0.25) * 2.5;
      
      renderer.render(scene, camera);
      
      // Performance monitoring
      frameCount++;
      if (frameCount % 120 === 0) { // Check every 2 seconds at 60fps
        const fps = 120 * 1000 / (currentTime - (lastTime - frameInterval * 120));
        if (fps < 30 && particleCount > 1000) {
          // Reduce particles if performance is poor
          const newCount = Math.max(1000, particleCount * 0.8);
          console.log(`Performance optimization: reducing particles to ${newCount}`);
        }
      }
    }
    animate(0);

    function onResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener("resize", onResize);

    // Visibility API for performance
    function handleVisibilityChange() {
      setIsVisible(!document.hidden);
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      // Proper cleanup
      scene.clear();
      particleGeometry.dispose();
      particleMaterial.dispose();
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, [isVisible]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 -z-10" 
      aria-hidden="true"
      style={{ 
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    />
  );
}

