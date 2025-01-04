class ParticleSystem {
    constructor() {
        this.setupCanvases();
    }

    setupCanvases() {
        // Particle 1
        const canvas1 = document.getElementById('particle1');
        const ctx1 = canvas1.getContext('2d');
        this.drawParticle1(ctx1);

        // Particle 1_1
        const canvas1_1 = document.getElementById('particle1_1');
        const ctx1_1 = canvas1_1.getContext('2d');
        this.drawParticle1_1(ctx1_1);

        // Particle 1_2
        const canvas1_2 = document.getElementById('particle1_2');
        const ctx1_2 = canvas1_2.getContext('2d');
        this.drawParticle1_2(ctx1_2);
    }

    drawParticle1(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 70);
        ctx.lineTo(10, 85);
        ctx.lineTo(10, 135);
        ctx.lineTo(0, 150);
        ctx.lineTo(0, 480);
        ctx.lineTo(5, 490);
        ctx.lineTo(20, 490);
        ctx.lineTo(20, 250);
        ctx.lineTo(10, 235);
        ctx.lineTo(10, 185);
        ctx.lineTo(20, 170);
        ctx.lineTo(20, 40);
        ctx.lineTo(10, 30);
        ctx.lineTo(10, 20);
        ctx.closePath();
        ctx.fillStyle = "rgba(2,254,255,0.3)";
        ctx.fill();
    }

    drawParticle1_1(ctx) {
        ctx.beginPath();
        ctx.lineTo(0, 0);
        ctx.lineTo(10, 15);
        ctx.lineTo(10, 65);
        ctx.lineTo(0, 80);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fillStyle = "rgba(2,254,255,0.3)";
        ctx.fill();
    }

    drawParticle1_2(ctx) {
        ctx.beginPath();
        ctx.lineTo(10, 80);
        ctx.lineTo(0, 65);
        ctx.lineTo(0, 15);
        ctx.lineTo(10, 0);
        ctx.lineTo(10, 80);
        ctx.closePath();
        ctx.fillStyle = "rgba(2,254,255,0.3)";
        ctx.fill();
    }
}

// Initialize particles
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});
