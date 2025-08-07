// Import core libraries
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import * as THREE from 'three';
import Chart from 'chart.js/auto';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Global App State
const AppState = {
  theme: localStorage.getItem('theme') || 'dark',
  terminalHistory: [],
  historyIndex: -1,
  currentWidgetIndex: 0,
  totalWidgets: 0,
  initialized: {
    prologue: false,
    origins: false,
    superpowers: false,
    projects: false,
    terminal: false,
    widgets: false,
    contact: false
  }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎬 Initializing cinematic portfolio...');
  
  // Core initializations
  initializeTheme();
  initializeNavigation();
  initializeScrollAnimations();
  
    // Initialize all sections immediately (simplified approach)
  console.log('🎭 Initializing all sections...');
  
  // Force initialization of all sections
  setTimeout(() => {
    console.log('🌟 Initializing prologue...');
    initializePrologueAnimation();
  }, 100);
  
  setTimeout(() => {
    console.log('🌍 Initializing origins...');
    initializeOriginsAnimation();
  }, 200);
  
  setTimeout(() => {
    console.log('💪 Initializing superpowers...');
    initializeSuperpowersAnimation();
    initializeRadarChart();
  }, 300);
  
  setTimeout(() => {
    console.log('🧪 Initializing projects...');
    initializeProjects();
  }, 400);
  
  setTimeout(() => {
    console.log('🤖 Initializing terminal...');
    initializeTerminal();
  }, 500);
  
  setTimeout(() => {
    console.log('📱 Initializing widgets...');
    initializeWidgets();
  }, 600);
  
  setTimeout(() => {
    console.log('📧 Initializing contact...');
    initializeContact();
  }, 700);

  // Expose AppState globally for debugging
  window.AppState = AppState;
  window.initializePrologueAnimation = initializePrologueAnimation;
  window.initializeSuperpowersAnimation = initializeSuperpowersAnimation;
  window.initializeWidgets = initializeWidgets;
  
  console.log('✨ Cinematic portfolio ready!');
});

// Theme Management
function initializeTheme() {
  document.documentElement.setAttribute('data-theme', AppState.theme);
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.setAttribute('aria-pressed', AppState.theme === 'dark');
  }
  
  console.log(`🎨 Theme initialized: ${AppState.theme}`);
}

function toggleTheme() {
  AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', AppState.theme);
  localStorage.setItem('theme', AppState.theme);
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', AppState.theme === 'dark');
  }
  
  // Smooth theme transition
  gsap.to('body', { duration: 0.3, ease: 'power2.inOut' });
  
  console.log(`🎨 Theme switched to: ${AppState.theme}`);
}

// Navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // Smooth scroll navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: { y: targetSection, offsetY: 80 },
          ease: 'power3.inOut'
        });
      }
    });
  });
  
  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('nav-menu--open');
    });
  }

  // Update active navigation on scroll
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: updateActiveNavigation
  });
}

function updateActiveNavigation() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
      currentSection = section.id;
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('nav-link--active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('nav-link--active');
    }
  });
}

// Global scroll animations
function initializeScrollAnimations() {
  // Parallax background elements
  gsap.utils.toArray('.parallax-bg').forEach(bg => {
    gsap.to(bg, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: bg.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // Cinematic fade in animations for content
  gsap.utils.toArray('.section').forEach((section, index) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse'
      }
    });

    // Stagger animations for section content
    tl.from(section.querySelectorAll('.section-title'), {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    })
    .from(section.querySelectorAll('.section-subtitle'), {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.8')
    .from(section.querySelectorAll('.container > *:not(.section-title):not(.section-subtitle)'), {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.6');
  });

  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: { y: target, offsetY: 80 },
          ease: 'power3.inOut'
        });
      }
    });
  });

  // Add scroll progress indicator
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #ff5c00, #ff8f00);
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);

  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      progressBar.style.width = (self.progress * 100) + '%';
    }
  });
}

// 🎬 PROLOGUE: Particle Genesis Animation
function initializePrologueAnimation() {
  console.log('🌟 Initializing particle genesis...');
  
  const container = document.getElementById('particlesContainer');
  if (!container) {
    console.error('❌ Particles container not found');
    return;
  }

  // Create Three.js scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Create particle system
  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 20;
    positions[i3 + 1] = (Math.random() - 0.5) * 20;
    positions[i3 + 2] = (Math.random() - 0.5) * 20;
    
    colors[i3] = 1; // R
    colors[i3 + 1] = 0.36; // G (FF5C00 = 1, 0.36, 0)
    colors[i3 + 2] = 0; // B
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  // Create central sphere
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff5c00,
    transparent: true,
    opacity: 0
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  camera.position.z = 5;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    particleSystem.rotation.y += 0.002;
    sphere.rotation.y += 0.01;
    
    renderer.render(scene, camera);
  }
  animate();

  // Scroll-triggered morphing animation
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#prologue',
      start: 'top top',
      end: '+=1000',
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Morph particles into sphere
        if (progress < 0.5) {
          particleMaterial.opacity = 0.8 - progress;
          sphereMaterial.opacity = progress * 2;
        } else {
          particleMaterial.opacity = 0;
          sphereMaterial.opacity = 1;
          sphere.scale.setScalar(1 + (progress - 0.5) * 2);
        }
      }
    }
  });

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  console.log('✨ Particle genesis initialized');
}

// 🌍 ORIGINS: Interactive Globe Animation
function initializeOriginsAnimation() {
  console.log('🌍 Initializing globe journey...');
  
  const container = document.getElementById('globe-container');
  if (!container) {
    console.error('❌ Globe container not found');
    return;
  }
  
  // Create Three.js scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(400, 400);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Create globe
  const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
  const globeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff5c00,
    wireframe: true,
    transparent: true,
    opacity: 0.7
  });
  const globe = new THREE.Mesh(globeGeometry, globeMaterial);
  scene.add(globe);

  // Add country markers
  const countries = [
    { name: 'Pakistan', lat: 30.3753, lon: 69.3451 },
    { name: 'Qatar', lat: 25.276987, lon: 51.520008 },
    { name: 'Oman', lat: 21.4735, lon: 55.9754 },
    { name: 'Saudi Arabia', lat: 23.8859, lon: 45.0792 },
    { name: 'UAE', lat: 25.2048, lon: 55.2708 },
    { name: 'Hungary', lat: 47.4979, lon: 19.0402 }
  ];

  const markers = [];
  countries.forEach((country, index) => {
    const markerGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: index === countries.length - 1 ? 0x00ff00 : 0xffffff
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    
    // Convert lat/lon to 3D position
    const phi = (90 - country.lat) * (Math.PI / 180);
    const theta = (country.lon + 180) * (Math.PI / 180);
    marker.position.setFromSphericalCoords(2.1, phi, theta);
    
    scene.add(marker);
    markers.push(marker);
  });

  camera.position.z = 5;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
  animate();

  // Scroll-triggered timeline animation
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  gsap.timeline({
    scrollTrigger: {
      trigger: '#origins',
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const activeIndex = Math.floor(progress * timelineItems.length);
        
        timelineItems.forEach((item, index) => {
          if (index <= activeIndex) {
            gsap.to(item, { opacity: 1, y: 0, duration: 0.5 });
        } else {
            gsap.to(item, { opacity: 0.3, y: 20, duration: 0.5 });
          }
        });
      }
    }
  });

  console.log('✨ Globe journey initialized');
}

// 💪 SUPERPOWERS: 3D Rings Animation
function initializeSuperpowersAnimation() {
  console.log('💪 Initializing 3D skill rings...');
  
  const container = document.getElementById('skills-canvas-container');
  if (!container) {
    console.error('❌ Skills container not found');
    return;
  }

  // Create Three.js scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(400, 400);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Get skill data
  const skillItems = document.querySelectorAll('.skill-item');
  const skills = [];
  const rings = [];

  skillItems.forEach((item, index) => {
    const title = item.querySelector('h3').textContent;
    const percentage = parseInt(item.querySelector('p').textContent);
    
    // Create ring for each skill
    const ringGeometry = new THREE.TorusGeometry(1.5, 0.1, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff5c00,
      transparent: true,
      opacity: percentage / 100
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    
    // Position rings in a circle
    const angle = (index / skillItems.length) * Math.PI * 2;
    ring.position.x = Math.cos(angle) * 2.5;
    ring.position.y = Math.sin(angle) * 2.5;
    ring.position.z = (Math.random() - 0.5) * 2;
    
    // Random rotation
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.y = Math.random() * Math.PI;
    
    scene.add(ring);
    rings.push(ring);
    skills.push({ title, percentage, ring });
  });

  camera.position.z = 6;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    rings.forEach((ring, index) => {
      ring.rotation.x += 0.01;
      ring.rotation.y += 0.01;
      ring.rotation.z += 0.005;
    });
    
    renderer.render(scene, camera);
  }
  animate();

  // Scroll-triggered animation
  gsap.timeline({
    scrollTrigger: {
      trigger: '#superpowers',
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        rings.forEach((ring, index) => {
          const scale = progress;
          ring.scale.setScalar(scale);
        });
        
        // Show radar chart when rings are fully visible
        if (progress > 0.7) {
          gsap.to('#radarChart', { opacity: 1, duration: 0.5 });
        }
      }
    }
  });

  console.log('✨ 3D skill rings initialized');
}

// 📊 Radar Chart Initialization
function initializeRadarChart() {
  console.log('📊 Initializing radar chart...');
  
  const canvas = document.getElementById('radarChart');
  if (!canvas) {
    console.error('❌ Radar chart canvas not found');
    return;
  }

  const ctx = canvas.getContext('2d');
  const skillItems = document.querySelectorAll('.skill-item');
  
  const labels = [];
  const data = [];
  
  skillItems.forEach(item => {
    const title = item.querySelector('h3').textContent;
    const percentage = parseInt(item.querySelector('p').textContent);
    labels.push(title);
    data.push(percentage);
  });

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Skills',
        data: data,
        backgroundColor: 'rgba(255, 92, 0, 0.2)',
        borderColor: 'rgba(255, 92, 0, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 92, 0, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 92, 0, 1)'
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: {
            color: 'rgba(255, 255, 255, 0.8)',
            font: { size: 10 }
          },
          ticks: { display: false }
        }
      }
    }
  });

  console.log('✨ Radar chart initialized');
}

// 🧪 Projects Masonry
function initializeProjects() {
  console.log('🧪 Initializing projects masonry...');
  
  const masonry = document.getElementById('projectsMasonry');
  if (!masonry) {
    console.error('❌ Projects masonry not found');
    return;
  }

  // Sample project data
  const projects = [
    {
      title: 'AI Chat Assistant',
      description: 'Intelligent conversational AI with natural language processing',
      tech: ['Python', 'TensorFlow', 'FastAPI'],
      github: 'https://github.com/NAME0x0/ai-chat',
      demo: 'https://demo.name0x0.dev/ai-chat',
      stars: 142
    },
    {
      title: 'Blockchain Tracker',
      description: 'Real-time cryptocurrency portfolio management',
      tech: ['React', 'Web3.js', 'Node.js'],
      github: 'https://github.com/NAME0x0/crypto-tracker',
      demo: 'https://demo.name0x0.dev/crypto',
      stars: 89
    },
    {
      title: 'Game Engine',
      description: 'Lightweight 2D game engine with physics simulation',
      tech: ['C++', 'OpenGL', 'GLFW'],
      github: 'https://github.com/NAME0x0/game-engine',
      demo: 'https://demo.name0x0.dev/engine',
      stars: 256
    },
    {
      title: 'Data Visualizer',
      description: 'Interactive data visualization dashboard',
      tech: ['D3.js', 'Python', 'Flask'],
      github: 'https://github.com/NAME0x0/data-viz',
      demo: 'https://demo.name0x0.dev/dataviz',
      stars: 78
    }
  ];

  // Create project cards
  projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-card-inner">
        <div class="project-card-front">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tech">
            ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        </div>
        <div class="project-card-back">
          <div class="project-links">
            <a href="${project.github}" target="_blank" class="btn btn--outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Code
            </a>
            <a href="${project.demo}" target="_blank" class="btn btn--primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
              </svg>
              Demo
            </a>
          </div>
          <div class="project-stats">
            <span class="stars">⭐ ${project.stars}</span>
          </div>
        </div>
      </div>
    `;

    // Add flip interaction
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });

    masonry.appendChild(card);

    // Animate card entrance
    gsap.from(card, {
      y: 100,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.1,
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  console.log('✨ Projects masonry initialized');
}

// 🤖 Terminal Implementation
function initializeTerminal() {
  console.log('🤖 Initializing AI terminal...');
  
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');

  if (!terminalInput || !terminalOutput) {
    console.error('❌ Terminal elements not found');
    return;
  }

  // Add welcome message
  addTerminalLine('🤖 Welcome to NAME0x0\'s AI Command Center.', 'ai');
  addTerminalLine('Type "help" for available commands.', 'info');

  // Terminal input handler
  terminalInput.addEventListener('keydown', handleTerminalInput);

  console.log('✨ AI terminal initialized');
}

function handleTerminalInput(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const command = e.target.value.trim();
    
    if (command) {
      addTerminalLine(`$ ${command}`, 'input');
      executeCommand(command);
      AppState.terminalHistory.push(command);
      AppState.historyIndex = AppState.terminalHistory.length;
    }
    
    e.target.value = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (AppState.terminalHistory.length > 0 && AppState.historyIndex > 0) {
      AppState.historyIndex--;
      e.target.value = AppState.terminalHistory[AppState.historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (AppState.historyIndex < AppState.terminalHistory.length - 1) {
      AppState.historyIndex++;
      e.target.value = AppState.terminalHistory[AppState.historyIndex];
    } else {
      AppState.historyIndex = AppState.terminalHistory.length;
      e.target.value = '';
    }
  }
}

async function executeCommand(command) {
  const cmd = command.toLowerCase().trim();
  const aiPersona = (text) => addTerminalLine(`🤖 ${text}`, 'ai');

  switch (cmd) {
    case 'help':
      addTerminalLine('🤖 AI Command Center - Available Commands:', 'info');
      addTerminalLine('  help          - Show this help', 'output');
      addTerminalLine('  about         - About Muhammad Afsah', 'output');
      addTerminalLine('  skills        - List technical skills', 'output');
      addTerminalLine('  projects      - Show recent projects', 'output');
      addTerminalLine('  contact       - Contact information', 'output');
      addTerminalLine('  portfolio     - Technical details of this site', 'output');
      addTerminalLine('  theme         - Toggle dark/light mode', 'output');
      addTerminalLine('  time          - Current time', 'output');
      addTerminalLine('  quote         - Random inspirational quote', 'output');
      addTerminalLine('  go <section>  - Navigate to section', 'output');
      addTerminalLine('  matrix        - Enter the Matrix 😎', 'output');
      addTerminalLine('  easter        - Find hidden features', 'output');
      addTerminalLine('  clear         - Clear terminal', 'output');
      addTerminalLine('', 'output');
      addTerminalLine('💡 Pro tip: Use arrow keys for command history!', 'info');
      break;
      
    case 'about':
      aiPersona('I am Muhammad Afsah Mumtaz, an AI developer and tech innovator.');
      aiPersona('I specialize in machine learning, web development, and game design.');
      aiPersona('Currently based in Dubai, UAE, building tomorrow\'s technologies today.');
      break;

    case 'skills':
      addTerminalLine('Technical Skills:', 'info');
      addTerminalLine('  🤖 AI & Machine Learning - 90%', 'output');
      addTerminalLine('  🌐 Web Development - 95%', 'output');
      addTerminalLine('  🎮 Game Design - 85%', 'output');
      addTerminalLine('  ⚙️ Automation - 88%', 'output');
      addTerminalLine('  🎨 UI/UX Design - 82%', 'output');
      addTerminalLine('  📊 Data Analysis - 87%', 'output');
      break;
      
    case 'projects':
      addTerminalLine('Recent Projects:', 'info');
      addTerminalLine('  • AI Chat Assistant (⭐ 142)', 'output');
      addTerminalLine('  • Blockchain Tracker (⭐ 89)', 'output');
      addTerminalLine('  • Game Engine (⭐ 256)', 'output');
      addTerminalLine('  • Data Visualizer (⭐ 78)', 'output');
      break;

    case 'contact':
      addTerminalLine('Contact Information:', 'info');
      addTerminalLine('  📧 Email: contact@name0x0.dev', 'output');
      addTerminalLine('  🐙 GitHub: github.com/NAME0x0', 'output');
      addTerminalLine('  💼 LinkedIn: linkedin.com/in/name0x0', 'output');
      addTerminalLine('  🐦 Twitter: @NAME0x0', 'output');
      break;

    case 'theme':
      toggleTheme();
      aiPersona(`Theme switched to ${AppState.theme} mode.`);
      break;

    case 'time':
      const now = new Date();
      addTerminalLine(`Current time: ${now.toLocaleString()}`, 'output');
      break;

    case 'quote':
      try {
        const response = await fetch('https://api.zenquotes.io/api/random');
        const data = await response.json();
        if (data && data[0]) {
          addTerminalLine(`"${data[0].q}" - ${data[0].a}`, 'output');
        } else {
          addTerminalLine('"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt', 'output');
        }
      } catch {
        addTerminalLine('"Innovation distinguishes between a leader and a follower." - Steve Jobs', 'output');
      }
      break;

    case 'clear':
      const terminalOutput = document.getElementById('terminalOutput');
      if (terminalOutput) {
        terminalOutput.innerHTML = '';
        addTerminalLine('Terminal cleared.', 'info');
      }
      break;

    case 'matrix':
      addTerminalLine('Entering the Matrix...', 'info');
      createMatrixEffect();
      break;

    case 'portfolio':
      aiPersona('This portfolio showcases cutting-edge web technologies:');
      addTerminalLine('  🎬 Cinematic ScrollTrigger animations', 'output');
      addTerminalLine('  🌌 Three.js particle systems and 3D graphics', 'output');
      addTerminalLine('  📊 Interactive Chart.js visualizations', 'output');
      addTerminalLine('  🎨 Glassmorphism UI with backdrop filters', 'output');
      addTerminalLine('  🚀 Vite build system for optimal performance', 'output');
      break;

    case 'easter':
      const easterEggs = [
        '🥚 You found an easter egg! The particles respond to your mouse.',
        '🎮 Try typing "konami" followed by the Konami code.',
        '🌟 Hold Shift while scrolling for extra particle effects.',
        '🎭 The AI terminal has a hidden personality - ask it about its dreams.',
        '🔮 The globe in Origins section can be rotated with mouse drag.'
      ];
      const randomEgg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
      addTerminalLine(randomEgg, 'output');
      break;

    default:
      if (cmd.startsWith('go ')) {
        const section = cmd.split(' ')[1];
        const target = document.getElementById(section);
        if (target) {
          gsap.to(window, {
            duration: 1.5,
            scrollTo: { y: target, offsetY: 80 },
            ease: 'power3.inOut'
          });
          aiPersona(`Navigating to ${section} section...`);
        } else {
          aiPersona(`Section "${section}" not found. Available: prologue, origins, superpowers, lab, terminal, ops, contact`);
        }
      } else {
        aiPersona(`Command "${command}" not recognized. Type "help" for available commands.`);
      }
      break;
  }
}

function addTerminalLine(text, type = 'output') {
  const terminalOutput = document.getElementById('terminalOutput');
  if (!terminalOutput) return;

  const line = document.createElement('div');
  line.className = `terminal-line terminal-line--${type}`;
  line.textContent = text;
  
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;

  // Typewriter effect
  if (type === 'ai') {
    const chars = text.split('');
    line.textContent = '';
    chars.forEach((char, index) => {
      setTimeout(() => {
        line.textContent += char;
      }, index * 50);
    });
  }
}

// 📱 Daily Ops Widgets
function initializeWidgets() {
  console.log('📱 Initializing widgets carousel...');
  
  const carousel = document.getElementById('widgetsCarousel');
  const container = carousel?.querySelector('.widgets-container');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (!container || !prevBtn || !nextBtn) {
    console.error('❌ Widget carousel elements not found');
    return;
  }

  const widgets = container.querySelectorAll('.widget');
  AppState.totalWidgets = widgets.length;
  
  // Clone widgets for infinite scroll
  widgets.forEach(widget => {
    const clone = widget.cloneNode(true);
    container.appendChild(clone);
  });

  // Carousel navigation with debugging
  const updateCarousel = () => {
    const offset = AppState.currentWidgetIndex * 320; // widget width + gap
    console.log(`📱 Moving carousel to index ${AppState.currentWidgetIndex}, offset: ${offset}px`);
    
    if (typeof gsap !== 'undefined') {
      gsap.to(container, {
        x: -offset,
        duration: 0.5,
        ease: 'power2.inOut'
      });
    } else {
      container.style.transform = `translateX(-${offset}px)`;
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      console.log('📱 Next button clicked');
      AppState.currentWidgetIndex++;
      if (AppState.currentWidgetIndex >= AppState.totalWidgets) {
        AppState.currentWidgetIndex = 0;
        if (typeof gsap !== 'undefined') {
          gsap.set(container, { x: 0 });
        } else {
          container.style.transform = 'translateX(0px)';
        }
      }
      updateCarousel();
    });
    console.log('📱 Next button listener attached');
  } else {
    console.error('❌ Next button not found!');
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      console.log('📱 Previous button clicked');
      AppState.currentWidgetIndex--;
      if (AppState.currentWidgetIndex < 0) {
        AppState.currentWidgetIndex = AppState.totalWidgets - 1;
        if (typeof gsap !== 'undefined') {
          gsap.set(container, { x: -AppState.totalWidgets * 320 });
        } else {
          container.style.transform = `translateX(-${AppState.totalWidgets * 320}px)`;
        }
      }
      updateCarousel();
    });
    console.log('📱 Previous button listener attached');
  } else {
    console.error('❌ Previous button not found!');
  }

  // Auto-rotate carousel
  setInterval(() => {
    nextBtn.click();
  }, 10000);

  // Initialize widget refresh buttons
  document.querySelectorAll('.widget-refresh').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const widget = btn.closest('.widget');
      const widgetType = widget.dataset.widget;
      refreshWidget(widgetType, widget);
    });
  });

  // Initialize clock
  updateClock();
  setInterval(updateClock, 1000);

  console.log('✨ Widgets carousel initialized');
}

function refreshWidget(type, widget) {
  const content = widget.querySelector('.widget-content');
  
  // Add loading state
  gsap.to(widget, { opacity: 0.5, duration: 0.3 });
  
  setTimeout(() => {
    switch (type) {
      case 'weather':
        content.innerHTML = `
          <div class="weather-temp">${Math.floor(Math.random() * 20 + 15)}°C</div>
          <div class="weather-desc">Sunny</div>
          <div class="weather-location">Dubai, UAE</div>
        `;
        break;
      case 'quote':
        const quotes = [
          '"Innovation distinguishes between a leader and a follower." - Steve Jobs',
          '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
          '"Technology is nothing. What\'s important is that you have a faith in people." - Steve Jobs'
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const [text, author] = randomQuote.split(' - ');
        content.innerHTML = `
          <div class="quote-text">${text}</div>
          <div class="quote-author">- ${author}</div>
        `;
        break;
    }
    
    gsap.to(widget, { opacity: 1, duration: 0.3 });
  }, 1000);
}

function updateClock() {
  const clockTime = document.getElementById('clockTime');
  const clockDate = document.getElementById('clockDate');
  
  if (clockTime && clockDate) {
    const now = new Date();
    clockTime.textContent = now.toLocaleTimeString();
    clockDate.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// 📧 Contact Form
function initializeContact() {
  console.log('📧 Initializing contact form...');
  
  const contactForm = document.getElementById('contactForm');
  const feedbackBtn = document.getElementById('feedbackBtn');
  const feedbackModal = document.getElementById('feedbackModal');
  const closeFeedback = document.getElementById('closeFeedback');
  const feedbackForm = document.getElementById('feedbackForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      
      // Simulate sending
      showNotification(`Thanks ${name}! Your message has been sent.`, 'success');
      contactForm.reset();
    });
  }

  if (feedbackBtn && feedbackModal) {
    feedbackBtn.addEventListener('click', () => {
      feedbackModal.classList.add('is-visible');
    });
  }

  if (closeFeedback && feedbackModal) {
    closeFeedback.addEventListener('click', () => {
      feedbackModal.classList.remove('is-visible');
    });
  }

  if (feedbackForm && feedbackModal) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      feedbackModal.classList.remove('is-visible');
      showNotification('Feedback submitted successfully!', 'success');
    });
  }

  console.log('✨ Contact form initialized');
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10000;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  document.body.appendChild(notification);
  
  gsap.from(notification, { x: 100, opacity: 0, duration: 0.3 });
  
  setTimeout(() => {
    gsap.to(notification, {
      x: 100,
      opacity: 0,
      duration: 0.3,
      onComplete: () => notification.remove()
    });
  }, 3000);
}

// Matrix effect for terminal easter egg
function createMatrixEffect() {
  const matrixContainer = document.createElement('div');
  matrixContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    z-index: 10000;
    overflow: hidden;
    pointer-events: none;
  `;
  
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  matrixContainer.appendChild(canvas);
  document.body.appendChild(matrixContainer);
  
  const ctx = canvas.getContext('2d');
  const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const matrix = chars.split('');
  
  const fontSize = 16;
  const columns = canvas.width / fontSize;
  const drops = [];
  
  for (let x = 0; x < columns; x++) {
    drops[x] = 1;
  }
  
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
      const text = matrix[Math.floor(Math.random() * matrix.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  
  const interval = setInterval(draw, 35);
  
  // Remove effect after 3 seconds
  setTimeout(() => {
    clearInterval(interval);
    gsap.to(matrixContainer, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => matrixContainer.remove()
    });
  }, 3000);
  
  // Add initial fade in
  gsap.from(matrixContainer, { opacity: 0, duration: 0.5 });
}

// Export for debugging
export { AppState, showNotification };