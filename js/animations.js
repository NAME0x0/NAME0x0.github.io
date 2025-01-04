class AVAAnimationSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupBackgroundEffects();
        this.setupTerminalAnimations();
        this.setupWidgetAnimations();
    }

    setupBackgroundEffects() {
        // Grid animation
        this.animateGrid();
        
        // Scan line effect
        this.animateScanLine();
    }

    animateGrid() {
        const grid = document.querySelector('.grid-overlay');
        // Implement grid animations
    }

    animateScanLine() {
        const scanLine = document.querySelector('.scan-line');
        // Implement scan line animation
    }

    setupTerminalAnimations() {
        // Terminal typing and response animations
        this.terminalEffects = {
            typeSpeed: 50,
            cursorBlink: true
        };
    }

    typeText(element, text, callback) {
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, this.terminalEffects.typeSpeed);
    }

    setupWidgetAnimations() {
        // Widget transition animations
        document.querySelectorAll('.widget').forEach(widget => {
            this.addWidgetAnimations(widget);
        });
    }

    addWidgetAnimations(widget) {
        // Add entrance/exit animations
        widget.addEventListener('mouseenter', () => {
            // Implement hover effects
        });
    }
}

class AVAVisualization {
    constructor() {
        this.init();
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.dataArray = new Uint8Array(128);
    }

    init() {
        this.setupScene();
        this.createAICore();
        this.setupAudioVisualizer();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        
        // Update camera settings
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.z = 5;

        // Initialize renderer with correct size
        const canvas = document.getElementById('ava-visualization');
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });
        
        // Set size based on container
        const container = canvas.parentElement;
        this.renderer.setSize(container.clientWidth, container.clientHeight);

        // Add window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        if (!this.renderer || !this.camera) return;
        
        const container = this.renderer.domElement.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    createAICore() {
        // Create organic, flowing AI core visualization
        const geometry = new THREE.IcosahedronGeometry(1, 4);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                amplitude: { value: 1.0 }
            },
            vertexShader: `
                uniform float time;
                uniform float amplitude;
                varying vec3 vNormal;
                
                void main() {
                    vNormal = normal;
                    vec3 newPosition = position + normal * sin(time * 2.0 + position.y) * amplitude * 0.1;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vNormal;
                
                void main() {
                    float pulse = sin(time) * 0.5 + 0.5;
                    vec3 color = vec3(0.0, 1.0, 0.95);
                    gl_FragColor = vec4(color * pulse, 0.8);
                }
            `
        });

        this.aiCore = new THREE.Mesh(geometry, material);
        this.scene.add(this.aiCore);
        
        // Add energy field effect
        this.createEnergyField();
    }

    createEnergyField() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        
        for(let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 5;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x00fff2,
            size: 0.02,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        this.energyField = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.energyField);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update audio data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Calculate audio reactivity
        const amplitude = this.dataArray.reduce((acc, val) => acc + val, 0) / this.dataArray.length;
        
        // Animate AI core
        if (this.aiCore) {
            this.aiCore.material.uniforms.time.value += 0.01;
            this.aiCore.material.uniforms.amplitude.value = amplitude / 128;
            this.aiCore.rotation.y += 0.002;
            this.aiCore.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
        }

        // Animate energy field
        if (this.energyField) {
            this.energyField.rotation.y += 0.001;
            const positions = this.energyField.geometry.attributes.position.array;
            for(let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(Date.now() * 0.001 + positions[i]) * 0.01;
            }
            this.energyField.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

class AIHead {
    constructor() {
        this.scene = new THREE.Scene();
        this.initializeHead();
    }

    initializeHead() {
        const canvas = document.getElementById('ava-head');
        if (!canvas) {
            console.error('AI head canvas not found');
            return;
        }

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.camera.position.z = 5;

        // Create head mesh
        this.createHeadMesh();
        
        // Start animation loop
        this.animate();
    }

    createHeadMesh() {
        // Create Gideon-like head geometry
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x00fff2) },
                color2: { value: new THREE.Color(0xff00ff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec2 vUv;
                uniform float time;
                
                void main() {
                    vNormal = normal;
                    vUv = uv;
                    vec3 pos = position;
                    
                    // Add wave animation
                    pos += normal * sin(pos.y * 10.0 + time) * 0.05;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                varying vec2 vUv;
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                
                void main() {
                    // Create holographic effect
                    float scan = step(0.98, fract(vUv.y * 50.0 + time));
                    
                    // Edge glow
                    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                    
                    // Color mix
                    vec3 color = mix(color1, color2, sin(time + vUv.y * 5.0) * 0.5 + 0.5);
                    
                    // Final color
                    gl_FragColor = vec4(color + vec3(scan) + vec3(fresnel), 0.8);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.head = new THREE.Mesh(geometry, material);
        this.scene.add(this.head);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.head && this.head.material.uniforms) {
            this.head.material.uniforms.time.value = performance.now() * 0.001;
            this.head.rotation.y = Math.sin(performance.now() * 0.001) * 0.1;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

class ARCReactor {
    constructor() {
        this.initializeReactor();
        this.setupSpokes();
        this.startAnimations();
    }

    initializeReactor() {
        const reactor = document.querySelector('.reactor-core');
        for (let i = 0; i < 60; i++) {
            const spoke = document.createElement('div');
            spoke.className = 'reactor-spoke';
            spoke.style.transform = `rotate(${i * 6}deg)`;
            reactor.appendChild(spoke);
        }
    }

    setupSpokes() {
        // Create 60 marks for the reactor ring
        const marks = Array(60).fill(0).map((_, i) => {
            return `<li style="transform: rotate(${i * 6}deg) translateY(125px);"></li>`;
        }).join('');
        
        document.querySelector('.core-spokes').innerHTML = marks;
    }

    startAnimations() {
        this.pulseCore();
        this.rotateRings();
    }

    pulseCore() {
        const core = document.querySelector('.core-inner');
        setInterval(() => {
            core.style.boxShadow = '0 0 60px 25px rgba(0, 255, 242, 0.5)';
            setTimeout(() => {
                core.style.boxShadow = '0 0 40px 15px rgba(0, 255, 242, 0.3)';
            }, 100);
        }, 2000);
    }

    rotateRings() {
        // Ring rotation animations are handled in CSS
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.dataStreams = [];
        this.setupCanvases();
        this.createParticles();
        this.animate();
    }

    setupCanvases() {
        ['particle1', 'particle1_1', 'particle1_2'].forEach(id => {
            const canvas = document.getElementById(id);
            const ctx = canvas.getContext('2d');
            this.setupParticleCanvas(canvas, ctx);
        });
    }

    setupParticleCanvas(canvas, ctx) {
        // Create cyberpunk-style data streams
        for(let i = 0; i < 20; i++) {
            this.dataStreams.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: 50 + Math.random() * 100,
                speed: 1 + Math.random() * 3,
                width: 1 + Math.random() * 2,
                opacity: 0.1 + Math.random() * 0.4
            });
        }
    }

    animate() {
        ['particle1', 'particle1_1', 'particle1_2'].forEach(id => {
            const canvas = document.getElementById(id);
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Animate data streams
            this.dataStreams.forEach(stream => {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(2, 254, 255, ${stream.opacity})`;
                ctx.lineWidth = stream.width;
                ctx.moveTo(stream.x, stream.y);
                ctx.lineTo(stream.x, stream.y + stream.length);
                ctx.stroke();
                
                stream.y += stream.speed;
                if(stream.y > canvas.height) {
                    stream.y = -stream.length;
                    stream.x = Math.random() * canvas.width;
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

class ParticleAnimations {
    constructor() {
        this.setupParticles();
    }

    setupParticles() {
        // Setup particle1 (left side vertical line)
        const canvas1 = document.getElementById('particle1');
        const ctx1 = canvas1.getContext('2d');
        
        ctx1.beginPath();
        ctx1.moveTo(0, 0);
        ctx1.lineTo(0, 70);
        ctx1.lineTo(10, 85);
        ctx1.lineTo(10, 135);
        ctx1.lineTo(0, 150);
        ctx1.lineTo(0, 480);
        ctx1.lineTo(5, 490);
        ctx1.lineTo(20, 490);
        ctx1.lineTo(20, 250);
        ctx1.lineTo(10, 235);
        ctx1.lineTo(10, 185);
        ctx1.lineTo(20, 170);
        ctx1.lineTo(20, 40);
        ctx1.closePath();

        ctx1.fillStyle = "rgba(2,254,255,0.3)";
        ctx1.fill();
    }

    animateParticles() {
        // Add particle animation code
        document.querySelectorAll('.vline').forEach(line => {
            line.style.animation = 'moveVertical 3s infinite';
        });
    }
}

class HolographicEffects {
    constructor() {
        this.setupHolographicElements();
        this.animate();
    }

    setupHolographicElements() {
        // Add scanning line effect
        const scanLine = document.createElement('div');
        scanLine.className = 'scan-line-effect';
        document.body.appendChild(scanLine);

        // Add glitch effect
        const glitchOverlay = document.createElement('div');
        glitchOverlay.className = 'glitch-overlay';
        document.body.appendChild(glitchOverlay);

        this.createHolographicRings();
    }

    createHolographicRings() {
        const reactor = document.querySelector('.arc_reactor');
        for(let i = 0; i < 3; i++) {
            const ring = document.createElement('div');
            ring.className = `holo-ring ring-${i}`;
            reactor.appendChild(ring);
        }
    }

    animate() {
        // Add random glitch effects
        setInterval(() => {
            const glitch = document.querySelector('.glitch-overlay');
            if(Math.random() > 0.95) {
                glitch.style.opacity = '0.1';
                setTimeout(() => {
                    glitch.style.opacity = '0';
                }, 50);
            }
        }, 100);
    }
}

class InterfaceAnimations {
    constructor() {
        this.setupAnimations();
        this.initializeElements();
    }

    setupAnimations() {
        // Sequential element fade-ins
        const elements = [
            { selector: '#date_time', delay: 2000 },
            { selector: '.title', delay: 3000 },
            { selector: '#cpu', delay: 4000 },
            { selector: '#ram', delay: 4500 },
            { selector: '#proc', delay: 5000 },
            { selector: '.caption', delay: 6000 },
            { selector: '#note_input', delay: 7000 },
            { selector: '#temperature', delay: 8000 },
            { selector: '#mainCircle', delay: 8000 },
            { selector: '#time1', delay: 9000 }
        ];

        elements.forEach(({selector, delay}) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transition = 'opacity 1s ease-in';
                }, delay);
            }
        });
    }

    initializeElements() {
        // Initialize hover effects
        document.querySelectorAll('.widget').forEach(widget => {
            this.addHoverEffect(widget);
        });

        // Add scanning line effect
        this.createScanLine();
    }

    addHoverEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.02)';
            element.style.boxShadow = '0 0 20px var(--accent-glow)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = 'none';
        });
    }

    createScanLine() {
        const scanLine = document.createElement('div');
        scanLine.className = 'scan-line';
        document.body.appendChild(scanLine);
    }
}

// Initialize animation system
const animationSystem = new AVAAnimationSystem();

// Initialize visualization
const avaVisualization = new AVAVisualization();

// Initialize AI head
const aiHead = new AIHead();

// Initialize systems
document.addEventListener('DOMContentLoaded', () => {
    const arcReactor = new ARCReactor();
    const particles = new ParticleSystem();
    const particleAnimations = new ParticleAnimations();
    particleAnimations.animateParticles();
    
    // Fade in elements sequentially
    const elements = [
        '.datetime-module',
        '.system-metrics',
        '.reactor-core',
        '.command-interface',
        '.analytics-module'
    ];

    elements.forEach((selector, index) => {
        setTimeout(() => {
            document.querySelector(selector).classList.add('active');
        }, index * 500);
    });

    const holographicEffects = new HolographicEffects();
    
    // Add dynamic weather transitions
    const weatherModule = document.querySelector('.temp-display');
    if(weatherModule) {
        weatherModule.addEventListener('mouseover', () => {
            weatherModule.classList.add('weather-hover');
        });
        weatherModule.addEventListener('mouseout', () => {
            weatherModule.classList.remove('weather-hover');
        });
    }

    // Initialize Interface Animations
    new InterfaceAnimations();
});
