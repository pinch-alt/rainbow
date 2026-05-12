/**
 * Rainbow Orbit: A modern, high-performance web game.
 * Leverages ES Modules, Web Components, and Canvas API.
 */

// --- Constants & Configuration ---
const COLORS = [
    { name: 'Red',    value: 'oklch(65% 0.25 20)',   hue: 20 },
    { name: 'Orange', value: 'oklch(70% 0.2 50)',    hue: 50 },
    { name: 'Yellow', value: 'oklch(85% 0.2 90)',    hue: 90 },
    { name: 'Green',  value: 'oklch(75% 0.2 140)',   hue: 140 },
    { name: 'Blue',   value: 'oklch(60% 0.2 250)',   hue: 250 },
    { name: 'Purple', value: 'oklch(60% 0.2 300)',   hue: 300 }
];

// --- Web Components ---

class GameHUD extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.score = 0;
        this.stage = 1;
        this.currentColor = COLORS[0].name;
    }

    connectedCallback() {
        this.render();
    }

    update(score, stage, color) {
        this.score = score;
        this.stage = stage;
        this.currentColor = color;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Outfit', sans-serif;
                    color: white;
                    text-align: center;
                    text-shadow: 0 4px 10px rgba(0,0,0,0.5);
                }
                .container {
                    display: flex;
                    gap: 2rem;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.5rem 2rem;
                    border-radius: 2rem;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .stat { display: flex; flex-direction: column; }
                .label { font-size: 0.7rem; text-transform: uppercase; opacity: 0.7; letter-spacing: 0.1rem; }
                .value { font-size: 1.5rem; font-weight: 900; }
                .color-tag { font-weight: 600; }
            </style>
            <div class="container">
                <div class="stat">
                    <span class="label">Stage</span>
                    <span class="value">${this.stage}</span>
                </div>
                <div class="stat">
                    <span class="label">Target</span>
                    <span class="value color-tag">${this.currentColor}</span>
                </div>
                <div class="stat">
                    <span class="label">Score</span>
                    <span class="value">${this.score}</span>
                </div>
            </div>
        `;
    }
}
customElements.define('game-hud', GameHUD);

class GameOverlay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    show(type, callback, finalScore = null) {
        this.style.display = 'flex';
        const isStart = type === 'start';
        const title = isStart ? 'RAINBOW ORBIT' : 'CORE BREACH';
        const buttonText = isStart ? 'INITIATE' : 'REBOOT';
        
        let subtext = isStart 
            ? 'Protect the core. Match the colors.' 
            : 'The orbit has been compromised.';
        
        if (finalScore !== null) {
            subtext = `Final Score: <span style="color: white; font-weight: 900; font-size: 2rem;">${finalScore}</span><br>${subtext}`;
        }
        
        this.shadowRoot.innerHTML = `
            <style>
                .content {
                    text-align: center;
                    animation: fadeIn 0.5s ease-out;
                    color: rgba(255, 255, 255, 0.8);
                }
                h1 { font-size: 4rem; font-weight: 900; margin: 0; letter-spacing: -0.1rem; color: white; }
                p { font-size: 1.2rem; margin: 1.5rem 0 2.5rem; line-height: 1.6; }
                button {
                    background: white;
                    color: black;
                    border: none;
                    padding: 1rem 3rem;
                    font-size: 1.2rem;
                    font-weight: 900;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-family: 'Outfit', sans-serif;
                    box-shadow: 0 0 20px rgba(255,255,255,0.3);
                }
                button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 40px rgba(255,255,255,0.5);
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
            <div class="content">
                <h1>${title}</h1>
                <p>${subtext}</p>
                <button id="actionBtn">${buttonText}</button>
            </div>
        `;
        
        this.shadowRoot.getElementById('actionBtn').onclick = () => {
            this.style.display = 'none';
            callback();
        };
    }
}
customElements.define('game-overlay', GameOverlay);

// --- Game Logic ---

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 10;
        this.speedY = (Math.random() - 0.5) * 10;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.02;
    }

    update(dt) {
        const factor = dt * 60;
        this.x += this.speedX * factor;
        this.y += this.speedY * factor;
        this.life -= this.decay * factor;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Enemy {
    constructor(canvas, targetColor, totalMerges) {
        const radius = 10;
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        if (side === 0) { x = Math.random() * canvas.width; y = -radius; }
        else if (side === 1) { x = canvas.width + radius; y = Math.random() * canvas.height; }
        else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height + radius; }
        else { x = -radius; y = Math.random() * canvas.height; }

        this.x = x;
        this.y = y;
        this.radius = radius;
        
        if (Math.random() < 0.4) {
            this.colorInfo = targetColor;
        } else {
            this.colorInfo = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        
        // Strictly constant speed (pixels per second)
        this.speed = 150; 
        this.isReflected = false;
        this.target = { x: canvas.width / 2, y: canvas.height / 2 };
        this.updateVelocity();
    }

    updateVelocity() {
        const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.colorInfo.value;
        ctx.fillStyle = this.colorInfo.value;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.hud = document.getElementById('hud');
        this.overlay = document.getElementById('overlay');
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.mouse = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        const handleTouch = (e) => {
            if (this.running) e.preventDefault();
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        };
        window.addEventListener('touchstart', handleTouch, { passive: false });
        window.addEventListener('touchmove', handleTouch, { passive: false });

        this.init();
        this.overlay.show('start', () => this.start());
    }

    init() {
        this.core = {
            radius: 25,
            colorIndex: 0,
            pulse: 0
        };
        this.shield = {
            angle: 0,
            arcLength: Math.PI * 0.4,
            distance: 50,
            thickness: 6
        };
        this.enemies = [];
        this.particles = [];
        this.score = 0;
        this.stage = 1;
        this.totalMerges = 0;
        this.running = false;
        this.spawnTimer = 0;
        this.spawnRate = 2.0; // Seconds

        this.hud.update(this.score, this.stage, COLORS[this.core.colorIndex].name);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    }

    start() {
        this.init();
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    gameOver() {
        this.running = false;
        this.overlay.show('gameover', () => this.start(), this.score);
    }

    createExplosion(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    gameLoop(currentTime) {
        if (!this.running) return;

        let dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Cap dt to prevent huge jumps on tab switch
        if (dt > 0.1) dt = 0.1;

        this.update(dt);
        this.draw();

        requestAnimationFrame((t) => this.gameLoop(t));
    }
update(dt) {
    const factor = dt * 60;
    this.core.pulse += 0.05 * factor;

    this.spawnTimer += dt;
    if (this.spawnTimer > this.spawnRate) {
        // Calculate dynamic speed: starting at 180, increasing by 5 per merge
        const currentSpeed = 180 + (this.totalMerges * 5);
        this.enemies.push(new Enemy(this.canvas, COLORS[this.core.colorIndex], currentSpeed));
        this.spawnTimer = 0;
        // Progressive spawn rate (faster over time)
        this.spawnRate = Math.max(0.33, 2.0 - (this.totalMerges * 0.033));
    }


        const angle = Math.atan2(this.mouse.y - this.center.y, this.mouse.x - this.center.x);
        this.shield.angle = angle;
        this.shield.distance = this.core.radius + 20;

        this.particles = this.particles.filter(p => {
            p.update(dt);
            return p.life > 0;
        });

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(dt);

            const dist = Math.hypot(enemy.x - this.center.x, enemy.y - this.center.y);
            const enemyAngle = Math.atan2(enemy.y - this.center.y, enemy.x - this.center.x);
            
            let diff = enemyAngle - this.shield.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;

            if (!enemy.isReflected && Math.abs(diff) < this.shield.arcLength / 2 && 
                dist < this.shield.distance + enemy.radius && dist > this.shield.distance - 15) {
                
                enemy.isReflected = true;
                // Keep speed magnitude constant on reflection (1.0x instead of 1.5x)
                enemy.vx = -enemy.vx;
                enemy.vy = -enemy.vy;
                this.createExplosion(enemy.x, enemy.y, '#ffffff');
            }

            if (dist < this.core.radius + enemy.radius) {
                if (enemy.colorInfo.name === COLORS[this.core.colorIndex].name) {
                    this.score += 10;
                    this.totalMerges++;
                    this.core.radius *= 1.05;
                    this.core.colorIndex = (this.core.colorIndex + 1) % COLORS.length;
                    if (this.core.colorIndex === 0) this.stage++;
                    
                    this.createExplosion(enemy.x, enemy.y, enemy.colorInfo.value);
                    this.enemies.splice(i, 1);
                    this.hud.update(this.score, this.stage, COLORS[this.core.colorIndex].name);
                } else {
                    this.gameOver();
                    return;
                }
            }

            if (enemy.isReflected && (enemy.x < -100 || enemy.x > this.canvas.width + 100 || enemy.y < -100 || enemy.y > this.canvas.height + 100)) {
                this.enemies.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const coreColor = COLORS[this.core.colorIndex].value;
        const pulseSize = Math.sin(this.core.pulse) * (this.core.radius * 0.1);
        
        this.ctx.save();
        this.ctx.shadowBlur = 30 + pulseSize;
        this.ctx.shadowColor = coreColor;
        this.ctx.fillStyle = coreColor;
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, this.core.radius + pulseSize, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, this.shield.distance, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.setLineDash([5, 10]);
        this.ctx.stroke();
        this.ctx.restore();

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, this.shield.distance, 
            this.shield.angle - this.shield.arcLength / 2, 
            this.shield.angle + this.shield.arcLength / 2);
        this.ctx.lineWidth = this.shield.thickness;
        this.ctx.strokeStyle = 'white';
        this.ctx.lineCap = 'round';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = 'white';
        this.ctx.stroke();
        this.ctx.restore();

        this.enemies.forEach(e => e.draw(this.ctx));
        this.particles.forEach(p => p.draw(this.ctx));
    }
}

new Game();
