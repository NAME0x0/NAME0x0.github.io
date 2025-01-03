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

class AIVisualization {
    constructor() {
        this.scene = new THREE.Scene();
        this.setupCamera();
        this.setupRenderer();
        this.createHead();
        this.animate();
    }

    setupCamera() {
        const canvas = document.getElementById('ai-head');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.z = 5;
    }

    createHead() {
        const headGeometry = new THREE.Group();
        
        // Create main head form
        const faceGeometry = new THREE.SphereGeometry(1, 64, 64);
        const faceMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                intensity: { value: 1.0 },
                primaryColor: { value: new THREE.Color(0x00fff2) },
                secondaryColor: { value: new THREE.Color(0xff00ff) },
                pulseSpeed: { value: 2.0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                uniform float time;
                
                void main() {
                    vNormal = normal;
                    vPosition = position;
                    
                    // Create Gideon-like face morphing
                    vec3 pos = position;
                    float morphFactor = sin(time * 0.5 + position.y * 2.0) * 0.05;
                    pos += normal * morphFactor;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                uniform float time;
                uniform float intensity;
                uniform vec3 primaryColor;
                uniform vec3 secondaryColor;
                uniform float pulseSpeed;
                
                void main() {
                    // Create Gideon's face glow effect
                    float edgeGlow = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 5.0);
                    float scanLine = step(0.98, fract((vPosition.y + time) * 30.0)) * 0.5;
                    float dataPulse = sin(time * pulseSpeed + vPosition.y * 10.0) * 0.5 + 0.5;
                    
                    // Holographic color mixing
                    vec3 baseColor = mix(primaryColor, secondaryColor, dataPulse);
                    vec3 glowColor = primaryColor * edgeGlow * 2.0;
                    
                    // Final color composition
                    vec3 finalColor = baseColor + glowColor + vec3(scanLine);
                    float opacity = 0.7 + edgeGlow * 0.3;
                    
                    gl_FragColor = vec4(finalColor * intensity, opacity);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        headGeometry.add(face);

        // Add holographic data streams
        this.createDataStreams(headGeometry);
        
        // Add energy field
        this.createEnergyField(headGeometry);

        this.head = headGeometry;
        this.scene.add(this.head);
    }

    createDataStreams(parent) {
        const streamGeometry = new THREE.BufferGeometry();
        const streamCount = 50;
        const positions = new Float32Array(streamCount * 3);
        
        for(let i = 0; i < streamCount * 3; i += 3) {
            const angle = (i / streamCount) * Math.PI * 2;
            const radius = 1.2;
            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = Math.sin(angle) * radius;
            positions[i + 2] = 0;
        }
        
        streamGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const streamMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00fff2) }
            },
            vertexShader: `
                uniform float time;
                
                void main() {
                    vec3 pos = position;
                    float wave = sin(time * 2.0 + position.y * 5.0) * 0.1;
                    pos.z += wave;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = 2.0;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                
                void main() {
                    gl_FragColor = vec4(color, 0.6);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const streams = new THREE.Points(streamGeometry, streamMaterial);
        parent.add(streams);
    }

    createHolographicGrid() {
        const gridGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const gridMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vPosition;
                uniform float time;
                
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vPosition;
                uniform float time;
                
                void main() {
                    vec2 grid = abs(fract(vPosition.xy * 10.0 + time * 0.2) - 0.5);
                    float lines = step(0.48, max(grid.x, grid.y));
                    gl_FragColor = vec4(vec3(0.0, 1.0, 0.95), lines * 0.3);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.holographicGrid = new THREE.Mesh(gridGeometry, gridMaterial);
        this.scene.add(this.holographicGrid);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = performance.now() * 0.001;
        
        // Animate head and effects
        if (this.head) {
            this.head.rotation.y = Math.sin(time * 0.5) * 0.1;
            this.head.children.forEach(child => {
                if (child.material.uniforms) {
                    child.material.uniforms.time.value = time;
                }
            });
        }

        // Update grid animations
        if (this.holographicGrid && this.holographicGrid.material.uniforms) {
            this.holographicGrid.material.uniforms.time.value = time;
            this.holographicGrid.rotation.y = time * 0.1;
        }

        // Update energy field
        if (this.energyField) {
            // ...existing energy field animation...
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize animation system
const animationSystem = new AVAAnimationSystem();

// Initialize visualization
const avaVisualization = new AVAVisualization();
