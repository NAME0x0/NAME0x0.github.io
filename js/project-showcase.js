/**
 * Project Showcase
 * Creates interactive 3D visualizations for projects
 * Optimized for performance with adaptive complexity
 */

if (typeof window.ProjectShowcase === 'undefined') {
  class ProjectShowcase {
    constructor() {
      this.projects = {
        ava: {
          container: document.getElementById('ava-model'),
          scene: null,
          camera: null,
          renderer: null,
          model: null,
          animationFrame: null
        },
        tangled: {
          container: document.getElementById('tangled-model'),
          scene: null,
          camera: null,
          renderer: null,
          model: null,
          animationFrame: null
        },
        mavis: {
          container: document.getElementById('mavis-model'),
          scene: null,
          camera: null,
          renderer: null,
          model: null,
          animationFrame: null
        }
      };
      
      this.devicePerformance = 'high'; // Will be set based on device capability
      this.isVisible = false;
      this.activeProject = null;
      
      // Initialize
      this.init();
    }
    
    init() {
      // Detect device performance
      this.detectPerformance();
      
      // Initialize modal
      this.initModal();
      
      // Add event listeners
      window.addEventListener('resize', () => this.handleResize());
      
      // Listen for section changes
      document.addEventListener('sectionChanged', (e) => {
        if (e.detail.section === 'project-execution') { // Corrected section name
          this.isVisible = true;
          // Delay slightly to allow DOM to update dimensions after section becomes active
          setTimeout(() => {
            if (this.isVisible) { // Re-check in case section changed again quickly
              console.log('ProjectShowcase: sectionChanged - Initializing projects for project-execution (delayed)');
              this.initializeProjects();
            }
          }, 100); // 100ms delay, adjust if needed
        } else {
          this.isVisible = false;
          this.pauseAllProjects();
        }
      });
      
      // Listen for preloader completion
      document.addEventListener('preloaderComplete', () => {
        // Initialize projects after preloader
        // setTimeout(() => { // Removed redundant setTimeout
          // Only initialize if projects section is visible
          const projectSection = document.getElementById('project-execution'); // Corrected section ID
          if (projectSection && projectSection.classList.contains('active')) {
            console.log('ProjectShowcase: Preloader complete and project section active, initializing projects.');
            this.isVisible = true;
            this.initializeProjects();
          }
        // }, 1000); // Removed redundant setTimeout
      });
    }
    
    detectPerformance() {
      // Simple performance detection based on device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
      
      if (isMobile || isLowEndDevice) {
        this.devicePerformance = 'low';
      } else {
        // Check if device has good GPU
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
          this.devicePerformance = 'medium';
        } else {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
          
          if (renderer.indexOf('Intel') >= 0) {
            this.devicePerformance = 'medium';
          } else {
            this.devicePerformance = 'high';
          }
        }
      }
      
      console.log(`Project Showcase - Device performance: ${this.devicePerformance}`);
    }
    
    initModal() {
      this.modal = document.getElementById('project-details');
      this.closeModalButton = this.modal ? this.modal.querySelector('.close-modal') : null;
      this.viewDetailsButtons = document.querySelectorAll('.view-details');

      if (!this.modal || !this.closeModalButton) {
        console.error('Modal elements not found for ProjectShowcase in initModal');
        return;
      }
      
      // Close modal when close button is clicked
      this.closeModalButton.addEventListener('click', () => {
        this.modal.classList.remove('active');
      });
      
      // Close modal when clicking outside content
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.modal.classList.remove('active');
        }
      });
      
      // Open modal when view details button is clicked
      if (this.viewDetailsButtons && this.viewDetailsButtons.length > 0) {
        this.viewDetailsButtons.forEach(button => {
          button.addEventListener('click', () => {
            const project = button.getAttribute('data-project');
            this.openProjectDetails(project);
          });
        });
      } else {
        console.warn('View details buttons not found or empty for ProjectShowcase in initModal');
      }
    }
    
    openProjectDetails(projectKey) { // Renamed parameter to avoid conflict
      if (!this.modal) return;

      const modalTitle = this.modal.querySelector('#modal-title');
      const modalDescription = this.modal.querySelector('#modal-description');
      const modalFeatures = this.modal.querySelector('#modal-features');
      const modalTech = this.modal.querySelector('#modal-tech');
      const modalGithub = this.modal.querySelector('#modal-github');

      if (!modalTitle || !modalDescription || !modalFeatures || !modalTech || !modalGithub) {
        console.error('Modal content elements not found');
        return;
      }
      
      // Project details
      const projectDataStore = { // Renamed to avoid conflict with a potential global 'projects'
        ava: {
          title: 'AVA - Afsah\'s Virtual Assistant',
          description: 'AVA is a personal virtual assistant designed to automate daily tasks and provide a JARVIS-like experience. It uses natural language processing to understand commands and perform various actions.',
          features: [
            'Voice recognition and response',
            'Task automation and scheduling',
            'Smart home device integration',
            'Web searching and information retrieval',
            'Personalized recommendations'
          ],
          tech: ['Python', 'Natural Language Processing', 'Speech Recognition', 'APIs'],
          github: 'https://github.com/NAME0x0/AVA'
        },
        tangled: {
          title: 'Tangled - Quantum Browser Entanglement',
          description: 'Tangled creates a visual representation of quantum entanglement between browser windows. When multiple windows are open, they establish a connection and share state information, creating an interactive visualization of quantum principles.',
          features: [
            'Real-time communication between browser windows',
            'Interactive particle system with physics simulation',
            'Visual representation of quantum entanglement',
            'Responsive design for different screen sizes',
            'Customizable visualization parameters'
          ],
          tech: ['JavaScript', 'WebSockets', 'WebGL', 'HTML5 Canvas', 'Physics Simulation'],
          github: 'https://github.com/NAME0x0/Tangled'
        },
        mavis: {
          title: 'MAVIS - Modern Architecture Virtual Interface System',
          description: 'MAVIS is an advanced system built with Rust, focusing on performance optimization and modern programming paradigms. It provides a virtual interface for interacting with complex architectural systems.',
          features: [
            'High-performance data processing',
            'Memory-safe operations with Rust',
            'Modular architecture for extensibility',
            'Cross-platform compatibility',
            'Low-level system integration'
          ],
          tech: ['Rust', 'Systems Programming', 'Concurrency', 'Performance Optimization'],
          github: 'https://github.com/NAME0x0/MAVIS'
        }
      };
      
      // Set modal content
      if (projectDataStore[projectKey]) {
        const projectDetails = projectDataStore[projectKey]; // Renamed to avoid conflict
        
        modalTitle.textContent = projectDetails.title;
        
        // Description
        modalDescription.innerHTML = `<p>${projectDetails.description}</p>`;
        
        // Features
        let featuresHTML = '<h4>Key Features</h4><ul>';
        projectDetails.features.forEach(feature => {
          featuresHTML += `<li>${feature}</li>`;
        });
        featuresHTML += '</ul>';
        modalFeatures.innerHTML = featuresHTML;
        
        // Technologies
        let techHTML = '<h4>Technologies</h4><div class="modal-tech-tags">';
        projectDetails.tech.forEach(tech => {
          techHTML += `<span class="tech-module">${tech}</span>`; // Corrected class to tech-module as per HTML
        });
        techHTML += '</div>';
        modalTech.innerHTML = techHTML;
        
        // GitHub link
        modalGithub.href = projectDetails.github;
        
        // Show modal
        this.modal.classList.add('active');
      }
    }
    
    initializeProjects() {
      console.log('ProjectShowcase: Attempting to initialize projects...');
      // Only initialize if not already initialized and THREE is available
      if (this.projects.ava.scene) {
        console.log('ProjectShowcase: Projects already initialized (AVA scene exists).');
        return;
      }

      console.log('ProjectShowcase: Checking for THREE.js...');
      if (typeof THREE === 'undefined') {
        console.warn('ProjectShowcase: THREE.js not found, project showcase will not initialize.');
        return;
      }
      console.log('ProjectShowcase: THREE.js found.');
      
      // Initialize each project
      console.log('ProjectShowcase: Initializing AVA...');
      if (this.projects.ava.container) this.initializeAVA();
      else console.warn('ProjectShowcase: AVA container not found.');
      
      console.log('ProjectShowcase: Initializing Tangled...');
      if (this.projects.tangled.container) this.initializeTangled();
      else console.warn('ProjectShowcase: Tangled container not found.');
      
      console.log('ProjectShowcase: Initializing MAVIS...');
      if (this.projects.mavis.container) this.initializeMAVIS();
      else console.warn('ProjectShowcase: MAVIS container not found.');
      
      // Add hover events to project holograms (previously cards)
      const projectHolograms = document.querySelectorAll('.project-hologram');
      projectHolograms.forEach(hologram => {
        hologram.addEventListener('mouseenter', () => {
          const project = hologram.getAttribute('data-project');
          this.activeProject = project;
        });
        
        hologram.addEventListener('mouseleave', () => {
          this.activeProject = null;
        });
      });
    }
    
    initializeAVA() {
      console.log('ProjectShowcase: Inside initializeAVA().');
      const project = this.projects.ava;
      if (!project.container) {
        console.warn('ProjectShowcase: AVA container check failed inside initializeAVA.');
        return;
      }
      console.log('ProjectShowcase: AVA container found, proceeding with Three.js setup.');
      
      // Create scene
      project.scene = new THREE.Scene();
      
      // Create camera
      project.camera = new THREE.PerspectiveCamera(75, project.container.clientWidth / project.container.clientHeight, 0.1, 1000);
      project.camera.position.z = 3; // Adjusted Z for better view
      
      // Create renderer with transparency
      project.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      console.log(`ProjectShowcase: AVA container dimensions before setSize: ${project.container.clientWidth}x${project.container.clientHeight}`);
      project.renderer.setSize(project.container.clientWidth, project.container.clientHeight);
      project.renderer.setPixelRatio(window.devicePixelRatio);
      project.container.appendChild(project.renderer.domElement);
      
      // Create a brain-like structure for AVA
      const brainGeometry = new THREE.SphereGeometry(1.2, 16, 16); // Reduced segments for performance
      const brainMaterial = new THREE.MeshPhongMaterial({
        color: 0xFF5F1F, // Neon Orange
        emissive: 0xD94E33, // Rust Orange
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7,
        wireframe: true
      });
      
      project.model = new THREE.Mesh(brainGeometry, brainMaterial);
      project.scene.add(project.model);
      
      // Add neural connections (lines)
      const neuronCount = this.devicePerformance === 'high' ? 50 : (this.devicePerformance === 'medium' ? 30 : 15);
      const neurons = [];
      
      for (let i = 0; i < neuronCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        const x = 1.2 * Math.sin(phi) * Math.cos(theta);
        const y = 1.2 * Math.sin(phi) * Math.sin(theta);
        const z = 1.2 * Math.cos(phi);
        
        neurons.push(new THREE.Vector3(x, y, z));
      }
      
      // Create connections between neurons
      const connectionsMaterial = new THREE.LineBasicMaterial({
        color: 0xFF5F1F, // Neon Orange
        transparent: true,
        opacity: 0.2
      });
      
      for (let i = 0; i < neuronCount; i++) {
        // Connect to closest neurons
        for (let j = i + 1; j < neuronCount; j++) {
          if (neurons[i].distanceTo(neurons[j]) < 1.0) { // Adjusted distance
            const geometry = new THREE.BufferGeometry().setFromPoints([neurons[i], neurons[j]]);
            const line = new THREE.Line(geometry, connectionsMaterial);
            project.scene.add(line);
          }
        }
      }
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Softer ambient
      project.scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(0xFF5F1F, 0.7, 50); // Adjusted intensity and distance
      pointLight.position.set(2, 2, 2);
      project.scene.add(pointLight);
      
      // Animation function
      const animate = () => {
        if (!this.isVisible && project.animationFrame) {
            cancelAnimationFrame(project.animationFrame);
            project.animationFrame = null;
            return;
        }
        project.animationFrame = requestAnimationFrame(animate);
        
        // Rotate model
        project.model.rotation.x += 0.003;
        project.model.rotation.y += 0.006;
        
        // Pulse effect if this is the active project
        if (this.activeProject === 'ava') {
          const time = Date.now() * 0.0005;
          const scale = 1 + Math.sin(time) * 0.03;
          project.model.scale.set(scale, scale, scale);
          brainMaterial.emissiveIntensity = 0.4 + Math.sin(time) * 0.1;
        } else {
          brainMaterial.emissiveIntensity = 0.3;
        }
        
        project.renderer.render(project.scene, project.camera);
      };
      
      // Start animation
      if(this.isVisible) animate();
    }
    
    initializeTangled() {
      console.log('ProjectShowcase: Inside initializeTangled().');
      const project = this.projects.tangled;
      if (!project.container) {
        console.warn('ProjectShowcase: Tangled container check failed inside initializeTangled.');
        return;
      }
      console.log('ProjectShowcase: Tangled container found, proceeding with Three.js setup.');
      
      // Create scene
      project.scene = new THREE.Scene();
      
      // Create camera
      project.camera = new THREE.PerspectiveCamera(75, project.container.clientWidth / project.container.clientHeight, 0.1, 1000);
      project.camera.position.z = 4; // Adjusted Z
      
      // Create renderer with transparency
      project.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      console.log(`ProjectShowcase: Tangled container dimensions before setSize: ${project.container.clientWidth}x${project.container.clientHeight}`);
      project.renderer.setSize(project.container.clientWidth, project.container.clientHeight);
      project.renderer.setPixelRatio(window.devicePixelRatio);
      project.container.appendChild(project.renderer.domElement);
      
      // Create particle system for Tangled
      const particleCount = this.devicePerformance === 'high' ? 150 : (this.devicePerformance === 'medium' ? 80 : 40);
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      // Create two clusters of particles (entangled)
      for (let i = 0; i < particleCount; i++) {
        // Position
        const cluster = i < particleCount / 2 ? -1 : 1;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.2;
        
        positions[i * 3] = cluster * 1.2 + Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
        
        // Color - using NASA-inspired palette
        const color = new THREE.Color();
        color.set(cluster === -1 ? 0xFF5F1F : 0xD94E33); // Neon Orange and Rust Orange
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.7
      });
      
      project.model = new THREE.Points(particles, particleMaterial);
      project.scene.add(project.model);
      
      // Add connecting lines between particles
      const linesMaterial = new THREE.LineBasicMaterial({
        color: 0xFFD700, // Gold for connections
        transparent: true,
        opacity: 0.15
      });
      
      const lineCount = this.devicePerformance === 'high' ? 30 : (this.devicePerformance === 'medium' ? 15 : 8);
      
      for (let i = 0; i < lineCount; i++) {
        const index1 = Math.floor(Math.random() * (particleCount / 2));
        const index2 = Math.floor(Math.random() * (particleCount / 2)) + Math.floor(particleCount / 2);
        
        const point1 = new THREE.Vector3(
          positions[index1 * 3],
          positions[index1 * 3 + 1],
          positions[index1 * 3 + 2]
        );
        
        const point2 = new THREE.Vector3(
          positions[index2 * 3],
          positions[index2 * 3 + 1],
          positions[index2 * 3 + 2]
        );
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([point1, point2]);
        const line = new THREE.Line(lineGeometry, linesMaterial);
        project.scene.add(line);
      }
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      project.scene.add(ambientLight);
      
      const pointLight1 = new THREE.PointLight(0xFF5F1F, 0.6, 50);
      pointLight1.position.set(-2, 1, 3);
      project.scene.add(pointLight1);
      
      const pointLight2 = new THREE.PointLight(0xD94E33, 0.6, 50);
      pointLight2.position.set(2, -1, 3);
      project.scene.add(pointLight2);
      
      // Animation function
      const animate = () => {
        if (!this.isVisible && project.animationFrame) {
            cancelAnimationFrame(project.animationFrame);
            project.animationFrame = null;
            return;
        }
        project.animationFrame = requestAnimationFrame(animate);
        
        project.model.rotation.y += 0.003;
        
        if (this.activeProject === 'tangled') {
          const time = Date.now() * 0.0008;
          const positions = project.model.geometry.attributes.position.array;
          
          for (let i = 0; i < particleCount; i++) {
            const ix = i * 3;
            positions[ix + 1] += Math.sin(time + positions[ix] * 0.5) * 0.005;
          }
          project.model.geometry.attributes.position.needsUpdate = true;
          particleMaterial.opacity = 0.9;
        } else {
          particleMaterial.opacity = 0.7;
        }
        
        project.renderer.render(project.scene, project.camera);
      };
      if(this.isVisible) animate();
    }
    
    initializeMAVIS() {
      console.log('ProjectShowcase: Inside initializeMAVIS().');
      const project = this.projects.mavis;
      if (!project.container) {
        console.warn('ProjectShowcase: MAVIS container check failed inside initializeMAVIS.');
        return;
      }
      console.log('ProjectShowcase: MAVIS container found, proceeding with Three.js setup.');

      project.scene = new THREE.Scene();
      project.camera = new THREE.PerspectiveCamera(75, project.container.clientWidth / project.container.clientHeight, 0.1, 1000);
      project.camera.position.z = 3.5; // Adjusted Z

      project.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      console.log(`ProjectShowcase: MAVIS container dimensions before setSize: ${project.container.clientWidth}x${project.container.clientHeight}`);
      project.renderer.setSize(project.container.clientWidth, project.container.clientHeight);
      project.renderer.setPixelRatio(window.devicePixelRatio);
      project.container.appendChild(project.renderer.domElement);

      const gearGroup = new THREE.Group();

      const mainMaterial = new THREE.MeshPhongMaterial({
        color: 0xFF5F1F, // Neon Orange
        emissive: 0xD94E33, // Rust Orange
        emissiveIntensity: 0.2,
        shininess: 50,
        specular: 0x555555
      });

      const accentMaterial = new THREE.MeshPhongMaterial({
        color: 0xC0C0C0, // Silver
        emissive: 0x555555,
        emissiveIntensity: 0.1,
        shininess: 80,
        specular: 0x888888
      });

      // Main Torus (Gear Body)
      const mainGear = new THREE.Mesh(new THREE.TorusGeometry(1, 0.2, 12, 30), mainMaterial);
      gearGroup.add(mainGear);

      // Teeth
      const teethCount = 10;
      const toothShape = new THREE.Shape();
      toothShape.moveTo(-0.1, -0.1);
      toothShape.lineTo(0.1, -0.1);
      toothShape.lineTo(0.15, 0.1);
      toothShape.lineTo(-0.15, 0.1);
      toothShape.closePath();
      const extrudeSettings = { depth: 0.15, bevelEnabled: false };
      const toothGeometry = new THREE.ExtrudeGeometry(toothShape, extrudeSettings);

      for (let i = 0; i < teethCount; i++) {
        const angle = (i / teethCount) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeometry, mainMaterial);
        tooth.position.set(Math.cos(angle) * 1.15, Math.sin(angle) * 1.15, 0);
        tooth.rotation.z = angle + Math.PI / 2;
        gearGroup.add(tooth);
      }
      
      // Inner Structure (Cylinder)
      const innerCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 20), accentMaterial);
      innerCylinder.rotation.x = Math.PI / 2;
      gearGroup.add(innerCylinder);

      project.model = gearGroup;
      project.scene.add(project.model);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      project.scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.position.set(1, 1, 1);
      project.scene.add(directionalLight);

      const animate = () => {
        if (!this.isVisible && project.animationFrame) {
            cancelAnimationFrame(project.animationFrame);
            project.animationFrame = null;
            return;
        }
        project.animationFrame = requestAnimationFrame(animate);
        project.model.rotation.z += 0.005;
        if (this.activeProject === 'mavis') {
          mainMaterial.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.001) * 0.1;
          project.model.rotation.y += 0.008;
        } else {
          mainMaterial.emissiveIntensity = 0.2;
        }
        project.renderer.render(project.scene, project.camera);
      };
      if(this.isVisible) animate();
    }
    
    handleResize() {
      // Update each project's renderer and camera
      Object.keys(this.projects).forEach(key => {
        const project = this.projects[key];
        
        if (project.renderer && project.camera && project.container) {
          const width = project.container.clientWidth;
          const height = project.container.clientHeight;
          
          if (width > 0 && height > 0) {
            project.camera.aspect = width / height;
            project.camera.updateProjectionMatrix();
            project.renderer.setSize(width, height);
          }
        }
      });
    }
    
    pauseAllProjects() {
      // Cancel animation frames to save resources
      Object.keys(this.projects).forEach(key => {
        const project = this.projects[key];
        
        if (project.animationFrame) {
          cancelAnimationFrame(project.animationFrame);
          project.animationFrame = null;
        }
      });
    }
    
    // Clean up resources
    destroy() {
      this.pauseAllProjects();
      
      // Remove event listeners
      window.removeEventListener('resize', () => this.handleResize());
      // Add cleanup for other listeners if necessary
      
      // Dispose of Three.js resources
      Object.keys(this.projects).forEach(key => {
        const project = this.projects[key];
        
        if (project.scene) {
            project.scene.traverse(object => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
        if (project.renderer) {
          project.renderer.dispose();
          if (project.renderer.domElement && project.renderer.domElement.parentNode) {
            project.renderer.domElement.parentNode.removeChild(project.renderer.domElement);
          }
        }
      });
    }
  }

  // Store the class in the window object
  window.ProjectShowcase = ProjectShowcase;

  // Initialize project showcase when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
        console.error('THREE.js is not loaded. ProjectShowcase will not initialize.');
        return;
    }
    if (!window.projectShowcase) { // Check if already initialized
        window.projectShowcase = new ProjectShowcase();
    }
  });
} // End of class declaration check
