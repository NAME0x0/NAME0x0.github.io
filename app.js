// Three.js will be dynamically imported to reduce initial bundle size
let THREE;

// GSAP and Chart.js loaded via CDN in HTML
// gsap, Chart are globally available

// Global App State
const AppState = {
  theme: localStorage.getItem('theme') || 'dark',
  terminalHistory: [],
  historyIndex: -1,
  currentWidgetIndex: 0,
  totalWidgets: 0,
  globeRotationY: 0,
  initialized: {
    prologue: false,
    origins: false,
    superpowers: false,
    projects: false,
    terminal: false,
    widgets: false,
    contact: false,
    sprout: false
  }
};

// Helpers
function createCircleTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function createArcGeometry(startVec3, endVec3, altitude = 0.6, segments = 64) {
  const mid = startVec3.clone().add(endVec3).multiplyScalar(0.5);
  const midLength = mid.length();
  mid.normalize();
  mid.multiplyScalar(midLength + altitude);
  const curve = new THREE.QuadraticBezierCurve3(startVec3, mid, endVec3);
  const points = curve.getPoints(segments);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  geometry.setDrawRange(0, 0);
  return geometry;
}

// Wait for CDN libraries with retries (Three.js is imported)
function waitForLibraries(retries = 50) {
  return new Promise((resolve, reject) => {
    const check = () => {
      if (typeof gsap !== 'undefined' && 
          typeof Chart !== 'undefined' &&
          typeof ScrollTrigger !== 'undefined') {
        console.log('✅ CDN libraries loaded, Three.js imported as module');
        resolve();
      } else if (retries > 0) {
        console.log(`⏳ Waiting for CDN libraries... (${retries} retries left)`);
        setTimeout(check, 200);
        retries--;
      } else {
        reject(new Error('CDN Libraries failed to load'));
      }
    };
    check();
  });
}

// Full initialization
async function initializePortfolio() {
  console.log('🎬 Initializing cinematic portfolio...');
  
  try {
    await waitForLibraries();
    // Dynamically import Three when needed
    if (!THREE) {
      const mod = await import('three');
      THREE = mod;
    }
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    console.log('✅ All libraries loaded successfully');
    
    // Core initializations
    initializeTheme();
    initializeNavigation();
    initializeScrollAnimations();
    initializeHackerVibe();
    initializeChapterHUD();
    enableTiltInteractions();
    initializeGlassLight();
    initializeOnboarding();
  initializeCodexStory();
    
    // Initialize all sections with proper timing
    console.log('🎭 Initializing all sections...');
    
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

    // Expose globally for debugging
    window.AppState = AppState;
    window.initializePrologueAnimation = initializePrologueAnimation;
    window.initializeSuperpowersAnimation = initializeSuperpowersAnimation;
    window.initializeWidgets = initializeWidgets;
    
    console.log('✨ Cinematic portfolio ready!');
    
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
    initializePortfolioBasic();
  }
}

// Basic initialization fallback (no animations)
function initializePortfolioBasic() {
  console.log('⚠️ Initializing basic portfolio functionality...');
  
  try {
    initializeTheme();
    initializeNavigation();
    initializeTerminal();
    initializeContact();
    
    // Show message about missing features
    setTimeout(() => {
      const message = document.createElement('div');
      message.style.cssText = `
        position: fixed; top: 20px; left: 20px; right: 20px;
        background: #ff9800; color: #000; padding: 12px 20px;
        border-radius: 8px; z-index: 10000; text-align: center;
        font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;
      message.innerHTML = '⚠️ Some animations may not be available due to library loading issues. Basic functionality is working.';
      document.body.appendChild(message);
      
      setTimeout(() => message.remove(), 5000);
    }, 1000);
    
    console.log('✅ Basic functionality initialized');
  } catch (error) {
    console.error('❌ Even basic initialization failed:', error);
  }
}

// DOM initialization with ES6 modules
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOM loaded, starting module-based initialization...');
  
  // Small delay to ensure CDN libraries are loaded
  setTimeout(() => {
    initializePortfolio().catch(error => {
      console.error('❌ Full initialization failed:', error);
      initializePortfolioBasic();
    });
  }, 500);
});

// 90s Hacker vibe overlay
function initializeHackerVibe() {
  // CRT scanlines
  const scan = document.createElement('div');
  scan.style.cssText = `
    position: fixed; inset: 0; pointer-events: none; z-index: 9998;
    background: repeating-linear-gradient(
      to bottom,
      rgba(0,255,65,0.06) 0px,
      rgba(0,255,65,0.06) 1px,
      transparent 2px,
      transparent 4px
    );
    mix-blend-mode: screen;
  `;
  document.body.appendChild(scan);
  if (typeof gsap !== 'undefined') {
    gsap.to(scan, { opacity: 0.7, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  // Vignette
  const vignette = document.createElement('div');
  vignette.style.cssText = `
    position: fixed; inset: 0; pointer-events: none; z-index: 9997;
    background: radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%);
  `;
  document.body.appendChild(vignette);
}

// Theme Management
function initializeTheme() {
  document.documentElement.setAttribute('data-theme', AppState.theme);
  document.documentElement.setAttribute('data-color-scheme', AppState.theme);
  // Update meta theme-color for mobile address bar
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', AppState.theme === 'dark' ? '#000000' : '#F5F5F5');
  }
  
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
  document.documentElement.setAttribute('data-color-scheme', AppState.theme);
  localStorage.setItem('theme', AppState.theme);
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', AppState.theme === 'dark');
  }
  
  // Smooth theme transition
  if (typeof gsap !== 'undefined') {
    gsap.to(document.documentElement, { duration: 0.3, ease: 'power2.inOut' });
  }
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', AppState.theme === 'dark' ? '#000000' : '#F5F5F5');
  }
  
  console.log(`🎨 Theme switched to: ${AppState.theme}`);
}

// Navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  // Awakening Interface: floating intro typing bar in prologue
  const prologue = document.getElementById('prologue');
  if (prologue && !document.getElementById('awakeningBar')) {
    const bar = document.createElement('div');
    bar.id = 'awakeningBar';
    bar.setAttribute('role', 'status');
    bar.style.cssText = `position:absolute;left:50%;top:18%;transform:translateX(-50%);padding:10px 14px;border-radius:10px;
      color:var(--text);border:1px solid var(--border);backdrop-filter:var(--glass-blur);background:rgba(var(--surface-rgb),0.12);
      box-shadow:var(--glass-shadow);font-family: 'Courier New', monospace; font-size: 14px; white-space: pre;`;
    bar.textContent = '';
    prologue.appendChild(bar);
    const msg = "Hello, world... I'm NAME0x0";
    let i = 0;
    const type = () => {
      if (i <= msg.length) { bar.textContent = msg.slice(0, i++); setTimeout(type, 60); }
    };
    setTimeout(type, 500);
  }

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

    // Cinematic gradient sweep and parallax accent
    const accent = document.createElement('div');
    accent.style.cssText = `position:absolute;inset:0;pointer-events:none;opacity:0;background:radial-gradient(1000px 300px at 20% 10%, rgba(255,92,0,0.08), rgba(0,0,0,0) 60%);mix-blend-mode:screen;`;
    section.appendChild(accent);
    gsap.to(accent, {
      opacity: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
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
    background: linear-gradient(90deg, #00ff41, #00ffaa);
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

// Chapter HUD (Scrollytelling chapters)
function initializeChapterHUD() {
  const chapters = [
    { id: 'prologue', label: 'Prologue' },
    { id: 'origins', label: 'Origins' },
    { id: 'superpowers', label: 'Superpowers' },
    { id: 'lab', label: 'Lab' },
    { id: 'terminal', label: 'Command' },
    { id: 'ops', label: 'Ops' },
    { id: 'contact', label: 'Signal' },
  ];
  const hud = document.createElement('div');
  hud.id = 'chapterHUD';
  hud.style.cssText = `
    position: fixed; top: 50%; right: 20px; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 10px; z-index: 9996; pointer-events: none;
  `;
  chapters.forEach((c, i) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.textContent = c.label;
    item.setAttribute('data-target', c.id);
    item.style.cssText = `
      pointer-events: all; cursor: pointer; padding: 8px 12px; font-size: 12px;
      color: var(--text); background: rgba(var(--surface-rgb), 0.1);
      border: 1px solid var(--border); border-radius: 999px; opacity: 0.7;
      backdrop-filter: var(--glass-blur); transition: all .25s ease;
    `;
    item.addEventListener('click', () => {
      const target = document.getElementById(c.id);
      if (target) {
        gsap.to(window, { duration: 1.2, scrollTo: { y: target, offsetY: 80 }, ease: 'power3.inOut' });
      }
    });
    hud.appendChild(item);
  });
  document.body.appendChild(hud);

  // Highlight active chapter
  gsap.utils.toArray('.section').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: (st) => {
        const id = st.trigger.id;
        hud.querySelectorAll('button').forEach(btn => {
          const active = btn.getAttribute('data-target') === id;
          btn.style.opacity = active ? '1' : '0.6';
          btn.style.borderColor = active ? 'var(--accent)' : 'var(--border)';
        });
      }
    });
  });
}

// Micro-interaction: 3D tilt on hover for cards and widgets
function enableTiltInteractions() {
  const tiltables = document.querySelectorAll('.project-card, .widget, .skill-item, .timeline-item');
  tiltables.forEach(el => {
    el.style.transformStyle = 'preserve-3d';
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10; // degrees
      const rotateX = ((y / rect.height) - 0.5) * -10;
      el.style.transition = 'transform 0.08s ease-out';
      el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.3s ease';
      el.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });
}

// Enhanced glass light reflections
function initializeGlassLight() {
  const glassy = document.querySelectorAll('.glass-card, .project-card-front, .project-card-back, .widget, .contact-form');
  glassy.forEach(el => {
    const light = document.createElement('div');
    light.className = 'glass-light-layer';
    light.setAttribute('data-js-background-attachment-fixed', '');
    el.style.position = 'relative';
    light.style.cssText = `
      position:absolute;inset:0;opacity:.08;z-index:-1;background-image:radial-gradient(750px 750px at 0 0, rgba(255,255,255,.6), rgba(255,255,255,0) 60%);
      background-repeat:repeat; background-size:750px 750px; pointer-events:none; border-radius:inherit;
    `;
    el.appendChild(light);
  });

  // Simulate background-attachment: fixed
  const updatePositions = () => {
    document.querySelectorAll('[data-js-background-attachment-fixed]').forEach(el => {
      const r = el.getBoundingClientRect();
      el.style.backgroundPositionX = `${-r.x}px`;
      el.style.backgroundPositionY = `${-r.y}px`;
    });
    requestAnimationFrame(updatePositions);
  };
  requestAnimationFrame(updatePositions);
}

// Playful onboarding overlay (opt-in, dismissible)
function initializeOnboarding() {
  if (sessionStorage.getItem('onboardingDismissed') === '1') return;
  const overlay = document.createElement('div');
  overlay.id = 'onboardingOverlay';
  overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;`;
  overlay.innerHTML = `
    <div class="glass-card" style="max-width:720px;width:90%;padding:24px;border-radius:16px;text-align:center;">
      <h3 style="margin-bottom:8px;">Welcome to the Cinematic Portfolio</h3>
      <p style="opacity:0.8;margin-bottom:16px;">Use the right HUD to jump chapters. Scroll to advance the story. Type <code>help</code> in the Command Center to explore.</p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="obEnter" class="btn btn--primary">Enter</button>
        <button id="obVoice" class="btn btn--secondary">Play Voice Intro</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#obEnter').addEventListener('click', () => {
    sessionStorage.setItem('onboardingDismissed', '1');
    if (typeof gsap !== 'undefined') gsap.to('#onboardingOverlay', { opacity: 0, duration: 0.35, onComplete: () => overlay.remove() });
    else overlay.remove();
  });
  overlay.querySelector('#obVoice').addEventListener('click', () => {
    if (window.playIntroVoice) window.playIntroVoice();
  });
}

// Add a Codex mini-HUD for frame jumps
function initializeCodexStory() {
  if (document.getElementById('codexHUD')) return;
  const hud = document.createElement('div');
  hud.id = 'codexHUD';
  hud.style.cssText = `position:fixed;left:20px;bottom:20px;display:flex;gap:8px;z-index:9996;pointer-events:auto;flex-wrap:wrap;`;
  const frames = [
    { key: 'seed', label: 'Data Seed' },
    { key: 'sprout', label: 'Neural Sprout' },
    { key: 'rings', label: 'Growth Rings' },
    { key: 'constellation', label: 'Constellation' },
    { key: 'vault', label: 'Archive Vault' },
    { key: 'nexus', label: 'Command Nexus' },
    { key: 'flux', label: 'Flux Dashboard' },
    { key: 'beacon', label: 'Beacon' },
  ];
  frames.forEach(f => {
    const btn = document.createElement('button');
    btn.className = 'btn btn--outline';
    btn.textContent = f.label;
    btn.style.opacity = '0.85';
    btn.addEventListener('click', () => executeCommand(f.key));
    hud.appendChild(btn);
  });
  document.body.appendChild(hud);
}

// 🎬 PROLOGUE: Particle Genesis Animation
function initializePrologueAnimation() {
  console.log('🌟 Initializing particle genesis...');
  if (!THREE) return;
  
  const container = document.getElementById('particlesContainer');
  if (!container) {
    console.error('❌ Particles container not found');
    return;
  }

  console.log('🎨 Three.js module imported successfully');

  try {
    // Create Three.js scene with error handling
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // WebGL renderer with fallback handling
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      console.log('✅ WebGL renderer created successfully');
    } catch (webglError) {
      console.warn('⚠️ WebGL failed, particles disabled:', webglError);
      return; // Skip particles if WebGL fails
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create particle system with error handling (spherical sprites, smaller size)
    const particleCount = 1800;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const radius = 10;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.cos(phi);
      positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      colors[i3] = 1;
      colors[i3 + 1] = 0.36;
      colors[i3 + 2] = 0;
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const sprite = createCircleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      map: sprite,
      alphaTest: 0.01,
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      opacity: 0.9
    });
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

  // Create central "enigma" energy core as volumetric glow
  const coreGeometry = new THREE.SphereGeometry(1.2, 64, 64);
  const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xff5c00, transparent: true, opacity: 0.0 });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  scene.add(core);
  const auraGeometry = new THREE.SphereGeometry(1.6, 64, 64);
  const auraMaterial = new THREE.MeshBasicMaterial({ color: 0xff8f00, transparent: true, opacity: 0.0, wireframe: true });
  const aura = new THREE.Mesh(auraGeometry, auraMaterial);
  scene.add(aura);

  camera.position.z = 5;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    particleSystem.rotation.y += 0.0018;
    particleSystem.rotation.x += 0.0008;
    core.rotation.y += 0.01;
    aura.rotation.y -= 0.008;
    
    renderer.render(scene, camera);
  }
  animate();

  // Scroll-triggered morphing animation (particles -> energy core -> globe)
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
        // 0->0.4: fade-in core, reduce particles
        if (progress < 0.4) {
          particleMaterial.opacity = gsap.utils.mapRange(0, 0.4, 0.9, 0.2, progress);
          coreMaterial.opacity = gsap.utils.mapRange(0, 0.4, 0.0, 0.9, progress);
          auraMaterial.opacity = gsap.utils.mapRange(0.2, 0.4, 0.0, 0.6, progress);
        }
        // 0.4->0.7: collapse particles into the core
        else if (progress < 0.7) {
          const t = gsap.utils.mapRange(0.4, 0.7, 0, 1, progress);
          core.scale.setScalar(1.2 + t * 0.4);
          aura.scale.setScalar(1.6 + t * 0.6);
          particleMaterial.opacity = Math.max(0, 0.2 - t * 0.2);
        }
        // 0.7->1: transform core into globe shell
        else {
          const t = gsap.utils.mapRange(0.7, 1, 0, 1, progress);
          coreMaterial.opacity = 0.9 * (1 - t);
          auraMaterial.opacity = 0.6 * (1 - t);
          core.scale.setScalar(1.6 + t * 0.8);
        }
      }
    }
  });

  // Circuit traces (Data Seed → Circuits)
  addCircuitTraces();

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

    console.log('✨ Particle genesis initialized');
    
  } catch (threeError) {
    console.error('❌ Three.js initialization failed:', threeError);
    // Fallback: Show static background
    container.style.background = 'radial-gradient(circle, rgba(255,92,0,0.1) 0%, rgba(0,0,0,0.9) 100%)';
  }
}

// Add simple DOM-based circuit traces emanating from center
function addCircuitTraces() {
  const host = document.getElementById('prologue');
  if (!host) return;
  const layer = document.createElement('div');
  layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:2;';
  host.appendChild(layer);
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.4;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.height = '2px';
    line.style.width = '0px';
    line.style.background = 'linear-gradient(90deg, rgba(255,92,0,0.5), rgba(255,92,0,0))';
    line.style.transformOrigin = '0 50%';
    const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.2);
    const len = 120 + Math.random() * 120;
    line.style.left = `${cx}px`;
    line.style.top = `${cy}px`;
    line.style.transform = `rotate(${angle}rad)`;
    layer.appendChild(line);
    if (typeof gsap !== 'undefined') {
      gsap.to(line, { width: len, duration: 1.2, delay: 0.2 + i * 0.05, ease: 'power2.out' });
    } else {
      line.style.width = `${len}px`;
    }
  }
  // Auto fade the layer after a moment
  if (typeof gsap !== 'undefined') {
    gsap.to(layer, { opacity: 0, delay: 3, duration: 1, onComplete: () => layer.remove() });
  }
}

// 🌍 ORIGINS: Interactive Globe Animation
function initializeOriginsAnimation() {
  console.log('🌍 Initializing globe journey...');
  if (!THREE) return;
  
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

  // Create globe shell with dual layers (wireframe + atmosphere)
  const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
  const globeWire = new THREE.MeshBasicMaterial({ color: 0xff5c00, wireframe: true, transparent: true, opacity: 0.35 });
  const globeSurf = new THREE.MeshBasicMaterial({ color: 0x0a0a0a, wireframe: false, transparent: true, opacity: 0.15 });
  const globe = new THREE.Mesh(globeGeometry, globeWire);
  const globeSurface = new THREE.Mesh(globeGeometry.clone(), globeSurf);
  globeSurface.scale.setScalar(0.998);
  scene.add(globeSurface);
  scene.add(globe);

  // Add origin countries and custom arcs
  const countries = [
    { name: 'Pakistan', lat: 30.3753, lon: 69.3451 },
    { name: 'Qatar', lat: 25.276987, lon: 51.520008 },
    { name: 'Oman', lat: 21.4735, lon: 55.9754 },
    { name: 'Saudi Arabia', lat: 23.8859, lon: 45.0792 },
    { name: 'UAE', lat: 25.2048, lon: 55.2708 },
    { name: 'Hungary', lat: 47.4979, lon: 19.0402 }
  ];

  const markers = [];
  const arcs = [];
  const sprite = createCircleTexture();
  const markerMat = new THREE.SpriteMaterial({ map: sprite, color: 0xff5c00, transparent: true, opacity: 0.95 });
  countries.forEach((country, index) => {
    const pos = latLonToVector3(country.lat, country.lon, 2.05);
    const marker = new THREE.Sprite(markerMat.clone());
    marker.scale.set(0.15, 0.15, 1);
    marker.position.copy(pos);
    scene.add(marker);
    markers.push(marker);
  });

  // Create great-circle arcs between consecutive origins
  for (let i = 0; i < countries.length - 1; i++) {
    const start = latLonToVector3(countries[i].lat, countries[i].lon, 2.02);
    const end = latLonToVector3(countries[i + 1].lat, countries[i + 1].lon, 2.02);
    const arcGeom = createArcGeometry(start, end, 0.8, 96);
    const arcMat = new THREE.LineBasicMaterial({ color: 0xff8f00, transparent: true, opacity: 0.0 });
    const arc = new THREE.Line(arcGeom, arcMat);
    scene.add(arc);
    arcs.push(arc);
  }

  camera.position.z = 5;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    AppState.globeRotationY += 0.0035;
    globe.rotation.y = AppState.globeRotationY;
    globeSurface.rotation.y = AppState.globeRotationY * 1.02;
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
        // reveal arcs progressively
        const step = 1 / Math.max(1, arcs.length);
        arcs.forEach((arc, i) => {
          const t = gsap.utils.clamp(0, 1, (progress - i * step) / step);
          const count = Math.floor(t * 96);
          arc.geometry.setDrawRange(0, count);
          arc.material.opacity = t * 0.9;
          arc.geometry.attributes.position.needsUpdate = true;
        });
        // Trigger Neural Sprout once when Origins enters center
        if (!AppState.initialized.sprout && progress > 0.05) {
          AppState.initialized.sprout = true;
          const sprout = document.getElementById('neural-sprout');
          if (sprout) {
            sprout.style.opacity = '1';
          }
        }
        }
      }
    });

  console.log('✨ Globe journey initialized');
}

// 💪 SUPERPOWERS: 3D Rings Animation
function initializeSuperpowersAnimation() {
  console.log('💪 Initializing 3D skill rings...');
  if (!THREE) return;
  
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

  if (typeof Chart !== 'undefined') {
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
  }

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

  // Vault door open on enter
  const labSection = document.getElementById('lab');
  const vault = document.getElementById('vault-door');
  if (labSection && vault) {
    ScrollTrigger.create({
      trigger: labSection,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        document.body.classList.add('vault-open');
        gsap.to('#vault-door', { opacity: 0, duration: 0.8, delay: 0.8, onComplete: () => vault.remove() });
      }
    });
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
  addTerminalLine('█▀▀ █ █   ▀█▀ ▀█▀ ▀█▀  ▄█  NAME0x0 AI OPS CONSOLE', 'ai');
  addTerminalLine('█▄▄ █ █▄▄  █   █   █  ▄▀   type `help` — 1990s cyberdeck online…', 'ai');
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

    // Narrative jumps
    case 'codex':
      aiPersona('Summoning the Quantum Codex...');
      initializeCodexStory();
      break;
    case 'seed':
      aiPersona('Frame 1 — The Data Seed');
      gsap.to(window, { duration: 1.2, scrollTo: { y: '#prologue', offsetY: 80 }, ease: 'power3.inOut' });
      break;
    case 'sprout':
      aiPersona('Frame 2 — The Neural Sprout');
      gsap.to(window, { duration: 1.2, scrollTo: { y: '#origins', offsetY: 80 }, ease: 'power3.inOut' });
      break;
    case 'rings':
      aiPersona('Frame 3 — The Growth Rings');
      gsap.to(window, { duration: 1.2, scrollTo: { y: '#superpowers', offsetY: 80 }, ease: 'power3.inOut' });
      break;
    case 'constellation':
      aiPersona('Frame 4 — The Digital Constellation');
      gsap.to(window, { duration: 1.2, scrollTo: { y: '#origins', offsetY: 80 }, ease: 'power3.inOut' });
      break;
    case 'vault':
      aiPersona('Frame 5 — The Archive Vault');
      gsap.to(window, { duration: 1.2, scrollTo: { y: '#lab', offsetY: 80 }, ease: 'power3.inOut' });
      break;
    case 'nexus':
      aiPersona('Frame 6 — The Command Nexus');
      gsap.to(window, { duration: 1.2, scrollTo: { y: '#terminal', offsetY: 80 }, ease: 'power3.inOut' });
      break;
    case 'flux':
      aiPersona('Frame 7 — The Flux Dashboard');
      gsap.to(window, { duration: 1.2, scrollTo: { y: '#ops', offsetY: 80 }, ease: 'power3.inOut' });
      break;
    case 'beacon':
      aiPersona('Frame 8 — The Beacon of Connection');
      gsap.to(window, { duration: 1.2, scrollTo: { y: '#contact', offsetY: 80 }, ease: 'power3.inOut' });
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
  if (type !== 'input') {
    line.style.textShadow = '0 0 6px rgba(0,255,65,0.6)';
    line.style.color = '#00ff41';
  }
  
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