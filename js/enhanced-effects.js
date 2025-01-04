class EnhancedEffects {
    constructor() {
        this.initializeEffects();
    }

    initializeEffects() {
        this.createArcReactorEffects();
        this.createParticleFields();
        this.createHolographicEffects();
        this.initializeAnimations();
    }

    createArcReactorEffects() {
        const reactor = document.querySelector('.arc_reactor');
        if (!reactor) return;

        // Add multiple rotating rings
        for (let i = 1; i <= 5; i++) {
            const ring = document.createElement('div');
            ring.className = `reactor-ring ring-${i}`;
            ring.style.animation = `rotate ${i * 5}s linear infinite ${i % 2 ? '' : 'reverse'}`;
            reactor.appendChild(ring);
        }

        // Add energy pulses
        const pulses = document.createElement('div');
        pulses.className = 'energy-pulses';
        for (let i = 0; i < 8; i++) {
            const pulse = document.createElement('div');
            pulse.className = 'energy-pulse';
            pulse.style.transform = `rotate(${i * 45}deg)`;
            pulses.appendChild(pulse);
        }
        reactor.appendChild(pulses);

        // Add core effects
        const core = reactor.querySelector('.core2');
        if (core) {
            const coreGlow = document.createElement('div');
            coreGlow.className = 'core-glow';
            core.appendChild(coreGlow);
        }
    }

    createParticleFields() {
        // Create floating data particles
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-field';
        
        // Add different types of particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'data-particle';
            particle.style.setProperty('--delay', `${Math.random() * 5}s`);
            particle.style.setProperty('--duration', `${3 + Math.random() * 7}s`);
            particleContainer.appendChild(particle);
        }

        document.body.appendChild(particleContainer);
    }

    createHolographicEffects() {
        // Add scanning line effect
        const scanLine = document.createElement('div');
        scanLine.className = 'scan-line';
        document.body.appendChild(scanLine);

        // Add glitch effects
        const glitchLayers = document.createElement('div');
        glitchLayers.className = 'glitch-layers';
        for (let i = 0; i < 3; i++) {
            const layer = document.createElement('div');
            layer.className = `glitch-layer layer-${i}`;
            glitchLayers.appendChild(layer);
        }
        document.body.appendChild(glitchLayers);

        // Add data stream effects
        this.createDataStreams();
    }

    createDataStreams() {
        const streams = document.createElement('div');
        streams.className = 'data-streams';
        
        for (let i = 0; i < 20; i++) {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            stream.style.left = `${Math.random() * 100}%`;
            stream.style.animationDelay = `${Math.random() * 5}s`;
            stream.style.height = `${100 + Math.random() * 150}px`;
            streams.appendChild(stream);
        }
        
        document.body.appendChild(streams);
    }

    initializeAnimations() {
        this.setupReactorPulse();
        this.setupInteractionEffects();
        this.startBackgroundAnimations();
    }

    setupReactorPulse() {
        const core = document.querySelector('.core2');
        if (!core) return;

        setInterval(() => {
            core.classList.add('pulse');
            setTimeout(() => core.classList.remove('pulse'), 200);
        }, 2000);
    }

    setupInteractionEffects() {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            // Update holographic effects based on mouse position
            document.documentElement.style.setProperty('--mouse-x', x);
            document.documentElement.style.setProperty('--mouse-y', y);
        });
    }

    startBackgroundAnimations() {
        // Create dynamic background effects
        this.animateGridOverlay();
        this.animateParticles();
    }

    animateGridOverlay() {
        const grid = document.querySelector('.grid-overlay');
        if (!grid) return;

        setInterval(() => {
            grid.style.transform = `scale(${1 + Math.random() * 0.05})`;
            setTimeout(() => {
                grid.style.transform = 'scale(1)';
            }, 200);
        }, 5000);
    }

    animateParticles() {
        const particles = document.querySelectorAll('.data-particle');
        particles.forEach(particle => {
            this.resetParticle(particle);
        });
    }

    resetParticle(particle) {
        particle.addEventListener('animationend', () => {
            particle.style.setProperty('--delay', '0s');
            void particle.offsetWidth;
            particle.style.setProperty('--delay', `${Math.random() * 5}s`);
        });
    }
}

// Initialize enhanced effects
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedEffects();
});
