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

// Initialize animation system
const animationSystem = new AVAAnimationSystem();

// Initialize visualization
const avaVisualization = new AVAVisualization();

// Initialize AI head
const aiHead = new AIHead();
