class ParticleSystem {
    constructor() {
        this.particles = [];
        this.setup();
    }

    setup() {
        this.setupParticleLines();
        this.setupMatrixRain();
        this.animate();
    }

    setupParticleLines() {
        // Initialize particle1
        const canvas1 = document.getElementById('particle1');
        if (canvas1) {
            const ctx = canvas1.getContext('2d');
            this.drawParticleLine(ctx, [
                [0, 0], [0, 70], [10, 85], [10, 135],
                [0, 150], [0, 480], [5, 490], [20, 490],
                [20, 250], [10, 235], [10, 185], [20, 170],
                [20, 40], [10, 30], [10, 20], [0, 0]
            ]);
        }

        // Initialize other particle canvases
        ['particle1_1', 'particle1_2'].forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                this.drawParticleVariant(ctx, id);
            }
        });
    }

    drawParticleLine(ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        points.slice(1).forEach(point => {
            ctx.lineTo(point[0], point[1]);
        });
        ctx.fillStyle = "rgba(2,254,255,0.3)";
        ctx.fill();
    }

    setupMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.className = 'matrix-rain';
        document.body.appendChild(canvas);
        
        this.matrixRain = new MatrixRain(canvas);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.particles.forEach(particle => particle.update());
        if (this.matrixRain) this.matrixRain.render();
    }
}

class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupRain();
    }

    setupRain() {
        // Matrix rain setup implementation
        // ...existing matrix rain code...
    }

    render() {
        // Matrix rain animation implementation
        // ...existing render code...
    }
}

// Initialize Particle System
document.addEventListener('DOMContentLoaded', () => new ParticleSystem());
