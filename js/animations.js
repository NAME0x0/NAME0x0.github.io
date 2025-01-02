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
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.head = null;
        this.init();
    }

    init() {
        this.setupScene();
        this.createHead();
        this.setupLighting();
        this.animate();
        this.setupMatrixRain();
        this.setupBackgroundEffects();
    }

    setupScene() {
        // Initialize Three.js scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('ava-visualization'),
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    createHead() {
        // Create abstract geometric head visualization
        // This will create a low-poly head mesh that looks futuristic
    }

    setupMatrixRain() {
        const canvas = document.querySelector('.matrix-rain');
        const ctx = canvas.getContext('2d');
        // Implement matrix rain effect
    }

    setupBackgroundEffects() {
        this.setupGridAnimation();
        this.setupGlowEffects();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Animate head movement
        if (this.head) {
            this.head.rotation.y += 0.005;
            this.head.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize animation system
const animationSystem = new AVAAnimationSystem();

// Initialize visualization
const avaVisualization = new AVAVisualization();
