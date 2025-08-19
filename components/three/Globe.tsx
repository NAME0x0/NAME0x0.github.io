"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface Country {
  name: string;
  lat: number;
  lng: number;
  color: string;
  year: string;
  description: string;
}

const countries: Country[] = [
  { name: "Pakistan", lat: 30.3753, lng: 69.3451, color: "#0ff0fc", year: "1995-2010", description: "Born and raised" },
  { name: "Saudi Arabia", lat: 24.7136, lng: 46.6753, color: "#00ffff", year: "2010-2012", description: "Early education" },
  { name: "United Kingdom", lat: 51.5074, lng: -0.1278, color: "#0ff0fc", year: "2012-2016", description: "University years" },
  { name: "United States", lat: 40.7128, lng: -74.0060, color: "#00ffff", year: "2016-2019", description: "Career development" },
  { name: "Canada", lat: 45.4215, lng: -75.6972, color: "#0ff0fc", year: "2019-2022", description: "Tech innovation" },
  { name: "Australia", lat: -33.8688, lng: 151.2093, color: "#00ffff", year: "2022-2024", description: "Current base" },
];

export function Globe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const globeRef = useRef<THREE.Mesh>();
  const particlesRef = useRef<THREE.Points[]>([]);
  const linesRef = useRef<THREE.Line[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create globe
    const globeGeometry = new THREE.SphereGeometry(1.5, 64, 64);
    
    // Globe material with holographic effect
    const globeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x0ff0fc) },
        color2: { value: new THREE.Color(0x00ffff) },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          float fresnel = dot(vNormal, vec3(0.0, 0.0, 1.0));
          fresnel = pow(1.0 - fresnel, 2.0);
          
          float pattern = sin(vUv.x * 20.0 + time) * sin(vUv.y * 20.0 + time) * 0.1;
          
          vec3 color = mix(color1, color2, fresnel + pattern);
          float alpha = fresnel * 0.6 + 0.1;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globeRef.current = globe;
    scene.add(globe);

    // Add wireframe overlay
    const wireframeGeometry = new THREE.SphereGeometry(1.51, 32, 32);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0ff0fc,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    // Convert lat/lng to 3D coordinates
    const latLngToVector3 = (lat: number, lng: number, radius: number = 1.5) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      
      return new THREE.Vector3(x, y, z);
    };

    // Create country markers
    countries.forEach((country, index) => {
      const position = latLngToVector3(country.lat, country.lng);
      
      // Particle system for country
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 20;
      const positions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const radius = 0.1 + Math.random() * 0.1;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        positions[i * 3] = position.x + radius * Math.sin(theta) * Math.cos(phi);
        positions[i * 3 + 1] = position.y + radius * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = position.z + radius * Math.cos(theta);
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(country.color),
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      particlesRef.current.push(particles);
      scene.add(particles);

      // Create connection lines to next country
      if (index < countries.length - 1) {
        const nextPosition = latLngToVector3(countries[index + 1].lat, countries[index + 1].lng);
        
        const curve = new THREE.QuadraticBezierCurve3(
          position,
          new THREE.Vector3(
            (position.x + nextPosition.x) / 2 + 0.5,
            (position.y + nextPosition.y) / 2 + 0.5,
            (position.z + nextPosition.z) / 2 + 0.5
          ),
          nextPosition
        );
        
        const points = curve.getPoints(50);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x0ff0fc,
          transparent: true,
          opacity: 0.6,
          linewidth: 2,
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        linesRef.current.push(line);
        scene.add(line);
      }
    });

    // Animation variables
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Animation loop
    const animate = () => {
      time += 0.01;
      
      if (globe) {
        globe.rotation.y += 0.005;
        globe.rotation.x = mouseY * 0.1;
        globe.rotation.y += mouseX * 0.05;
        
        // Update shader uniforms
        if (globe.material instanceof THREE.ShaderMaterial) {
          globe.material.uniforms.time.value = time;
        }
      }

      // Animate particles
      particlesRef.current.forEach((particles, index) => {
        particles.rotation.y = time * 0.5 + index;
        
        if (particles.material instanceof THREE.PointsMaterial) {
          particles.material.opacity = 0.5 + Math.sin(time * 2 + index) * 0.3;
        }
      });

      // Animate connection lines
      linesRef.current.forEach((line, index) => {
        if (line.material instanceof THREE.LineBasicMaterial) {
          line.material.opacity = 0.3 + Math.sin(time * 3 + index) * 0.2;
        }
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // GSAP animations
    const ctx = gsap.context(() => {
      // Entry animation
      gsap.from(globe.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: "power2.out",
        delay: 0.5,
      });

      // Particles entrance
      particlesRef.current.forEach((particles, index) => {
        gsap.from(particles.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          delay: 1 + index * 0.2,
          ease: "back.out(1.7)",
        });
      });

      // Lines entrance
      linesRef.current.forEach((line, index) => {
        gsap.from(line.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.5,
          delay: 1.5 + index * 0.3,
          ease: "power2.out",
        });
      });

      // Section enter animation
      const handleSectionEnter = () => {
        gsap.to(globe.rotation, {
          x: 0.2,
          duration: 2,
          ease: "power2.out",
        });
      };

      document.addEventListener('section-enter-global', handleSectionEnter);

      return () => {
        document.removeEventListener('section-enter-global', handleSectionEnter);
      };
    });

    // Start animation
    animate();

    // Cleanup
    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}