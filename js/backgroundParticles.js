function initBackgroundParticles() {
    console.log("[BG_PARTICLES] initBackgroundParticles: Function START");
    const canvas = document.getElementById('backgroundCanvas');
    if (!canvas) {
        console.error('[BG_PARTICLES] initBackgroundParticles: Background canvas not found!');
        return;
    }
    console.log("[BG_PARTICLES] initBackgroundParticles: Canvas element found:", canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('[BG_PARTICLES] initBackgroundParticles: Failed to get 2D context!');
        return;
    }
    console.log("[BG_PARTICLES] initBackgroundParticles: 2D context obtained.");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    console.log(`[BG_PARTICLES] initBackgroundParticles: Canvas dimensions set to ${width}x${height}`);

    const PARTICLE_COUNT = 120; // Slightly increased for a richer field on larger screens
    const CONNECTION_DISTANCE = 180; // Increased connection distance
    const MOUSE_INTERACTION_RADIUS = 200; // Radius for mouse interaction
    const PULSE_INTERVAL = 5000; // Milliseconds
    const ENERGY_PULSE_DURATION = 1000;
    const ENERGY_PULSE_RADIUS = 150;

    // New color palette for a "2050" sleek/futuristic feel
    const particleColors = [
        'rgba(0, 120, 255, 0.7)',  // Electric Blue
        'rgba(0, 180, 255, 0.6)',  // Bright Cyan
        'rgba(70, 100, 220, 0.5)', // Deep Space Blue
        'rgba(100, 220, 255, 0.7)', // Light Sky Blue
        'rgba(0, 80, 180, 0.6)'    // Saturated Deep Blue
    ];

    const connectionColor = 'rgba(100, 180, 255, 0.3)'; // Softened and matched to palette
    const energyPulseColor = 'rgba(150, 220, 255, 0.8)'; // Bright, energetic cyan/white

    // Re-define lineStartColor and lineEndColor based on the new connectionColor for gradients
    const lineStartColor = [100, 180, 255, 0.3]; // Derived from connectionColor
    const lineEndColor = [150, 220, 255, 0.1];   // Lighter end for gradient effect

    let particles = [];
    let spatialGrid;

    let mouse = {
        x: null,
        y: null,
        radius: Math.min(width, height) / 7, // Slightly increased interaction radius for balance
        isActive: false,
        lastMoveTime: 0
    };

    let energyNodes = []; // Special high-energy points that emit pulses
    let energyPulses = [];

    // --- Grid Optimization --- 
    const gridCellSize = CONNECTION_DISTANCE; // Cell size based on max connection distance
    let gridCols, gridRows;
    let grid = [];

    function initializeGrid() {
        gridCols = Math.ceil(width / gridCellSize);
        gridRows = Math.ceil(height / gridCellSize);
        grid = new Array(gridCols);
        for (let i = 0; i < gridCols; i++) {
            grid[i] = new Array(gridRows);
            for (let j = 0; j < gridRows; j++) {
                grid[i][j] = [];
            }
        }
    }

    function updateGrid() {
        // Clear grid
        for (let i = 0; i < gridCols; i++) {
            for (let j = 0; j < gridRows; j++) {
                grid[i][j] = [];
            }
        }
        // Populate grid
        for (const particle of particles) {
            const col = Math.floor(particle.x / gridCellSize);
            const row = Math.floor(particle.y / gridCellSize);
            if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
                grid[col][row].push(particle);
            }
        }
    }
    // --- End Grid Optimization ---
    
    // Track mouse movement and store last position
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.isActive = true;
        mouse.lastMoveTime = Date.now();
        
        // Create energy pulse at mouse position
        if (Math.random() < 0.1) { // 10% chance per move to create pulse
            createEnergyPulse(mouse.x, mouse.y);
        }
    });
    
    window.addEventListener('mouseout', () => {
        mouse.isActive = false;
    });
    
    // Check for mouse inactivity
    setInterval(() => {
        if (mouse.isActive && Date.now() - mouse.lastMoveTime > 2000) {
            mouse.isActive = false;
        }
    }, 1000);

    class EnergyPulse {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 5;
            this.maxRadius = Math.random() * 40 + 20; // Random max size
            this.speed = Math.random() * 1 + 0.5;     // Random growth speed
            this.opacity = 0.8;
            this.color = energyPulseColor;
        }
        
        update() {
            if (this.radius < this.maxRadius) {
                this.radius += this.speed;
                this.opacity = 0.8 * (1 - this.radius / this.maxRadius);
            } else {
                this.opacity = 0; // Mark for removal
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = 'transparent';
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Add inner glow
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, `rgba(0, 229, 255, ${this.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
    
    class EnergyNode {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 2;
            this.pulseInterval = Math.random() * 5000 + 3000; // Random interval
            this.lastPulseTime = Date.now() - Math.random() * 3000; // Stagger initial pulses
            this.color = connectionColor;
        }
        
        update() {
            // Gently drift
            this.x += (Math.random() - 0.5) * 0.3;
            this.y += (Math.random() - 0.5) * 0.3;
            
            // Emit energy pulses periodically
            if (Date.now() - this.lastPulseTime > this.pulseInterval) {
                createEnergyPulse(this.x, this.y);
                this.lastPulseTime = Date.now();
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            
            // Add glow
            ctx.shadowColor = connectionColor;
            ctx.shadowBlur = 10;
            ctx.fillStyle = connectionColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    class Particle {
        constructor(x, y) {
            this.id = Math.random().toString(36).substr(2, 9); // Unique ID for comparisons
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 1; // Particle size between 1 and 3
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.vx = (Math.random() - 0.5) * 0.4; // Slower velocity for smoother movement
            this.vy = (Math.random() - 0.5) * 0.4;
            this.colorIndex = Math.floor(Math.random() * particleColors.length);
            this.color = particleColors[this.colorIndex];
            this.energyLevel = Math.random(); // Random energy level for behavior variation
            
            // Dynamic properties
            this.angle = Math.random() * Math.PI * 2; // For orbital behavior
            this.orbit = Math.random() * 5;           // Orbital radius
            this.orbitSpeed = (Math.random() - 0.5) * 0.01; // Speed of orbit
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color; // Use the particle's assigned color
            ctx.fill();
        }

        update(deltaTime) {
            // Mouse interaction: enhanced behavior
            if (mouse.isActive) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    // Direction away from mouse
                    let forceDirectionX = -dx / distance;
                    let forceDirectionY = -dy / distance;
                    
                    // The closer to mouse, the stronger the repulsion
                    let force = (mouse.radius - distance) / mouse.radius;
                    let maxForce = 8; // Adjust for stronger repulsion
                    
                    let powerX = forceDirectionX * force * this.density * maxForce;
                    let powerY = forceDirectionY * force * this.density * maxForce;
                    
                    // Apply with dampening to prevent excessive speed
                    let dampening = 0.2;
                    this.vx = (this.vx + powerX) * dampening;
                    this.vy = (this.vy + powerY) * dampening;
                    
                    // Increase energy level when interacting with mouse
                    this.energyLevel = Math.min(1, this.energyLevel + 0.01);
                    
                    // If very close, make particle glow more intensely
                    if (distance < mouse.radius * 0.2) {
                        this.color = 'rgba(255, 255, 255, 0.9)';
                    }
                } else {
                    // Outside influence range, return to normal color gradually
                    if (this.color === 'rgba(255, 255, 255, 0.9)') {
                        this.color = particleColors[this.colorIndex];
                    }
                    
                    // Gradually reduce energy level
                    this.energyLevel = Math.max(0, this.energyLevel - 0.002);
                }
            } else {
                // When mouse is inactive, gradually reduce energy
                this.energyLevel = Math.max(0, this.energyLevel - 0.001);
                
                // If was glowing, return to normal
                if (this.color === 'rgba(255, 255, 255, 0.9)') {
                    this.color = particleColors[this.colorIndex];
                }
            }
            
            // Orbital behavior based on energy level
            if (this.energyLevel > 0.3) {
                // More energetic particles exhibit orbital behavior
                this.angle += this.orbitSpeed * (this.energyLevel * 2); // Energy affects speed
                this.x += Math.cos(this.angle) * this.orbit * this.energyLevel;
                this.y += Math.sin(this.angle) * this.orbit * this.energyLevel;
            }
            
            // Standard movement
            this.x += this.vx;
            this.y += this.vy;
            
            // Apply slight attraction to original position (elastic behavior)
            if (!mouse.isActive || (Math.abs(this.baseX - this.x) > 50 || Math.abs(this.baseY - this.y) > 50)) {
                this.x += (this.baseX - this.x) * 0.01;
                this.y += (this.baseY - this.y) * 0.01;
            }

            // Edge bouncing with dampening
            if (this.x < 0 || this.x > width) {
                this.vx *= -0.6; // Dampening on bounce
                // Keep particle within bounds
                this.x = this.x < 0 ? 0 : width;
            }
            
            if (this.y < 0 || this.y > height) {
                this.vy *= -0.6; // Dampening on bounce
                // Keep particle within bounds
                this.y = this.y < 0 ? 0 : height;
            }
        }
    }

    function createEnergyPulse(x, y) {
        energyPulses.push(new EnergyPulse(x, y));
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle(Math.random() * width, Math.random() * height));
        }
        
        energyNodes = [];
        const nodeCount = Math.floor(width / 350); // Slightly reduced nodes
        for (let i = 0; i < nodeCount; i++) {
            energyNodes.push(new EnergyNode());
        }
        initializeGrid(); // Initialize grid on particle creation
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            const particleA = particles[i];
            const cellX = Math.floor(particleA.x / gridCellSize);
            const cellY = Math.floor(particleA.y / gridCellSize);

            // Iterate over current cell and neighboring cells
            for (let offsetX = -1; offsetX <= 1; offsetX++) {
                for (let offsetY = -1; offsetY <= 1; offsetY++) {
                    const checkCellX = cellX + offsetX;
                    const checkCellY = cellY + offsetY;

                    if (checkCellX >= 0 && checkCellX < gridCols && checkCellY >= 0 && checkCellY < gridRows) {
                        const cellParticles = grid[checkCellX][checkCellY];
                        for (let j = 0; j < cellParticles.length; j++) {
                            const particleB = cellParticles[j];

                            // Avoid self-connection and duplicate connections (by checking ID)
                            if (particleA.id === particleB.id || particleB.id < particleA.id) {
                                continue;
                            }

                            let dx = particleA.x - particleB.x;
                            let dy = particleA.y - particleB.y;
                            let distance = Math.sqrt(dx * dx + dy * dy);

                            if (distance < CONNECTION_DISTANCE) {
                                let opacity = 1 - (distance / CONNECTION_DISTANCE);
                                let lineWidth = 0.5 - (distance / CONNECTION_DISTANCE) * 0.4;
                                
                                let combinedEnergy = (particleA.energyLevel + particleB.energyLevel) / 2;
                                opacity *= (0.3 + combinedEnergy * 0.7);
                                
                                const gradient = ctx.createLinearGradient(
                                    particleA.x, particleA.y, 
                                    particleB.x, particleB.y
                                );
                                
                                const currentLineStartColor = [...lineStartColor];
                                const currentLineEndColor = [...lineEndColor];
                                
                                if (combinedEnergy > 0.5) {
                                    currentLineStartColor[0] -= Math.floor(30 * combinedEnergy);
                                    currentLineStartColor[1] += Math.floor(20 * combinedEnergy);
                                    currentLineStartColor[2] += Math.floor(20 * combinedEnergy);
                                    currentLineStartColor[3] = Math.min(0.8, currentLineStartColor[3] + 0.3 * combinedEnergy);
                                    
                                    currentLineEndColor[0] -= Math.floor(20 * combinedEnergy);
                                    currentLineEndColor[1] += Math.floor(20 * combinedEnergy);
                                    currentLineEndColor[2] += Math.floor(30 * combinedEnergy);
                                    currentLineEndColor[3] = Math.min(0.5, currentLineEndColor[3] + 0.2 * combinedEnergy);
                                }
                                
                                gradient.addColorStop(0, `rgba(${currentLineStartColor.join(',')})`);
                                gradient.addColorStop(1, `rgba(${currentLineEndColor.join(',')})`);
                                
                                ctx.strokeStyle = gradient;
                                ctx.lineWidth = lineWidth * (1 + combinedEnergy); 
                                ctx.beginPath();
                                ctx.moveTo(particleA.x, particleA.y);
                                ctx.lineTo(particleB.x, particleB.y);
                                ctx.stroke();
                                ctx.closePath();
                            }
                        }
                    }
                }
            }
        }
    }

    function animate() {
        // console.log("[BG_PARTICLES] animate: Frame START"); // This would be too verbose
        ctx.clearRect(0, 0, width, height);
        
        updateGrid(); // Update grid before drawing connections

        energyNodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        // Update and draw all particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Connect particles with lines
        connectParticles();
        
        // Update and draw energy pulses
        for (let i = energyPulses.length - 1; i >= 0; i--) {
            energyPulses[i].update();
            energyPulses[i].draw();
            
            // Remove completed pulses
            if (energyPulses[i].opacity <= 0) {
                energyPulses.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }

    // Enhanced resize handling
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        mouse.radius = Math.min(width, height) / 7;
        
        initializeGrid(); // Re-initialize grid on resize

        particles.forEach(particle => {
            particle.baseX = Math.random() * width;
            particle.baseY = Math.random() * height;
        });
    });

    initParticles();
    console.log("[BG_PARTICLES] initBackgroundParticles: Starting animation loop.");
    animate();
    console.log(`[BG_PARTICLES] initBackgroundParticles: Enhanced background particle system initialized with ${particles.length} particles and ${energyNodes.length} energy nodes.`);
} 