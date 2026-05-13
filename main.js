/**
 * Rainbow Orbit: A modern, high-performance web game.
 * Robust Version for maximum compatibility.
 */

// Fallback to standard colors if oklch is problematic
const COLORS = [
    { name: 'Red',    value: '#ff4d4d', hue: 0 },
    { name: 'Orange', value: '#ffa64d', hue: 30 },
    { name: 'Yellow', value: '#ffff4d', hue: 60 },
    { name: 'Green',  value: '#4dff4d', hue: 120 },
    { name: 'Blue',   value: '#4d4dff', hue: 240 },
    { name: 'Purple', value: '#a64dff', hue: 280 }
];

class GameHUD extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.score = 0; this.stage = 1; this.speed = 0; this.currentColor = COLORS[0].name;
    }
    update(score, stage, color, speed) {
        this.score = score; this.stage = stage; this.currentColor = color; this.speed = Math.floor(speed);
        this.render();
    }
    render() {
        if (!this.shadowRoot) return;
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; font-family: 'Outfit', sans-serif; color: white; }
                .container {
                    display: flex; gap: 1.5rem; background: rgba(255, 255, 255, 0.1);
                    padding: 0.5rem 1.5rem; border-radius: 2rem; backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .stat { display: flex; flex-direction: column; text-align: center; }
                .label { font-size: 0.6rem; text-transform: uppercase; opacity: 0.7; letter-spacing: 0.1rem; }
                .value { font-size: 1.2rem; font-weight: 900; }
                .speed-val { color: #00ffcc; }
            </style>
            <div class="container">
                <div class="stat"><span class="label">Stage</span><span class="value">${this.stage}</span></div>
                <div class="stat"><span class="label">Target</span><span class="value">${this.currentColor}</span></div>
                <div class="stat"><span class="label">Score</span><span class="value">${this.score}</span></div>
                <div class="stat"><span class="label">Speed</span><span class="value speed-val">${this.speed}</span></div>
            </div>`;
    }
}

class GameOverlay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    show(type, callback, finalScore = null) {
        const isStart = type === 'start';
        const title = isStart ? 'RAINBOW ORBIT' : 'CORE BREACH';
        let subtext = isStart ? 'Protect the core. Match the colors.' : 'The orbit has been compromised.';
        if (finalScore !== null) subtext = `Final Score: <span style="color: white; font-weight: 900; font-size: 2rem;">${finalScore}</span><br>${subtext}`;
        
        this.shadowRoot.innerHTML = `
            <style>
                .overlay-content { text-align: center; color: rgba(255, 255, 255, 0.8); font-family: 'Outfit', sans-serif; }
                h1 { font-size: 4rem; font-weight: 900; margin: 0; color: white; letter-spacing: -2px; }
                p { font-size: 1.2rem; margin: 1.5rem 0 2.5rem; }
                button {
                    background: white; color: black; border: none; padding: 1rem 3rem;
                    font-size: 1.2rem; font-weight: 900; border-radius: 0.5rem; cursor: pointer;
                    font-family: 'Outfit', sans-serif; box-shadow: 0 0 20px rgba(255,255,255,0.3);
                    transition: transform 0.2s;
                }
                button:hover { transform: scale(1.05); }
            </style>
            <div class="overlay-content"><h1>${title}</h1><p>${subtext}</p><button id="actionBtn">${isStart ? 'INITIATE' : 'REBOOT'}</button></div>`;
        this.shadowRoot.getElementById('actionBtn').onclick = () => {
            this.style.visibility = 'hidden';
            callback();
        };
        this.style.visibility = 'visible';
        this.style.display = 'flex';
    }
}

// Register elements only if not already defined
if (!customElements.get('game-hud')) customElements.define('game-hud', GameHUD);
if (!customElements.get('game-overlay')) customElements.define('game-overlay', GameOverlay);

class Enemy {
    constructor(canvas, targetColor, speed) {
        const radius = 10;
        const side = Math.floor(Math.random() * 4);
        const stagger = Math.random() * 150;
        if (side === 0) { this.x = Math.random() * canvas.width; this.y = -radius - stagger; }
        else if (side === 1) { this.x = canvas.width + radius + stagger; this.y = Math.random() * canvas.height; }
        else if (side === 2) { this.x = Math.random() * canvas.width; this.y = canvas.height + radius + stagger; }
        else { this.x = -radius - stagger; this.y = Math.random() * canvas.height; }

        this.radius = radius;
        this.colorInfo = Math.random() < 0.4 ? targetColor : COLORS[Math.floor(Math.random() * COLORS.length)];
        this.speed = speed;
        this.isReflected = false;
        this.angle = Math.atan2(canvas.height / 2 - this.y, canvas.width / 2 - this.x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
    }
    update(dt, speed) {
        this.speed = speed;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }
    draw(ctx) {
        ctx.save();
        ctx.shadowBlur = 8; ctx.shadowColor = this.colorInfo.value;
        ctx.fillStyle = this.colorInfo.value;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) { console.error('Canvas not found'); return; }
        this.ctx = this.canvas.getContext('2d');
        this.hud = document.getElementById('hud');
        this.overlay = document.getElementById('overlay');
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        window.addEventListener('mousemove', (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
        
        this.init();
        if (this.overlay) {
            this.overlay.show('start', () => this.start());
        } else {
            console.error('Overlay not found');
            this.start(); // Emergency start if overlay fails
        }
    }

    init() {
        this.core = { radius: 25, colorIndex: 0, pulse: 0 };
        this.shield = { angle: 0, arcLength: Math.PI * 0.4, distance: 45, thickness: 6 };
        this.enemies = []; this.score = 0; this.stage = 1; this.totalMerges = 0; this.gameTime = 0;
        this.running = false; this.spawnTimer = 0; this.spawnRate = 0.7;
        if (this.hud && typeof this.hud.update === 'function') {
            this.hud.update(this.score, this.stage, COLORS[0].name, 100);
        }
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

    gameLoop(currentTime) {
        if (!this.running) return;
        let dt = Math.min((currentTime - this.lastTime) / 1000, 0.05);
        this.lastTime = currentTime;
        this.update(dt);
        this.draw();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        this.gameTime += dt;
        this.core.pulse += 3 * dt;
        const speed = 100 + (this.totalMerges * 60) + (this.gameTime * 5);
        this.spawnTimer += dt;
        if (this.spawnTimer > this.spawnRate) {
            this.enemies.push(new Enemy(this.canvas, COLORS[this.core.colorIndex], speed));
            this.spawnTimer = 0;
            this.spawnRate = Math.max(0.2, 0.7 - (this.totalMerges * 0.02) - (this.gameTime * 0.008));
        }
        this.shield.angle = Math.atan2(this.mouse.y - this.center.y, this.mouse.x - this.center.x);
        this.shield.distance = this.core.radius + 20;

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i]; e.update(dt, speed);
            const dist = Math.hypot(e.x - this.center.x, e.y - this.center.y);
            let diff = Math.atan2(e.y - this.center.y, e.x - this.center.x) - this.shield.angle;
            while (diff < -Math.PI) diff += Math.PI * 2; while (diff > Math.PI) diff -= Math.PI * 2;

            if (!e.isReflected && Math.abs(diff) < this.shield.arcLength / 2 && dist < this.shield.distance + 10 && dist > this.shield.distance - 10) {
                e.isReflected = true; e.angle += Math.PI;
            } else if (dist < this.core.radius + e.radius) {
                if (e.colorInfo.name === COLORS[this.core.colorIndex].name) {
                    this.score += 10; this.totalMerges++; this.core.radius *= 1.03;
                    this.core.colorIndex = (this.core.colorIndex + 1) % COLORS.length;
                    if (this.core.colorIndex === 0) this.stage++;
                    this.enemies.splice(i, 1);
                } else {
                    this.running = false;
                    if (this.overlay) this.overlay.show('gameover', () => this.start(), this.score);
                    return;
                }
            } else if (e.isReflected && (e.x < -200 || e.x > this.canvas.width + 200 || e.y < -200 || e.y > this.canvas.height + 200)) {
                this.enemies.splice(i, 1);
            }
        }
        if (this.hud && typeof this.hud.update === 'function') {
            this.hud.update(this.score, this.stage, COLORS[this.core.colorIndex].name, speed);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const color = COLORS[this.core.colorIndex].value;
        const pulse = Math.sin(this.core.pulse) * (this.core.radius * 0.1);
        this.ctx.save();
        this.ctx.shadowBlur = 25 + pulse; this.ctx.shadowColor = color; this.ctx.fillStyle = color;
        this.ctx.beginPath(); this.ctx.arc(this.center.x, this.center.y, this.core.radius + pulse, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.restore();

        this.ctx.save();
        this.ctx.beginPath(); this.ctx.arc(this.center.x, this.center.y, this.shield.distance, this.shield.angle - this.shield.arcLength/2, this.shield.angle + this.shield.arcLength/2);
        this.ctx.lineWidth = this.shield.thickness; this.ctx.strokeStyle = 'white'; this.ctx.lineCap = 'round';
        this.ctx.shadowBlur = 15; this.ctx.shadowColor = 'white'; this.ctx.stroke();
        this.ctx.restore();
        this.enemies.forEach(e => e.draw(this.ctx));
    }
}

// Start immediately as this is a module
new Game();
