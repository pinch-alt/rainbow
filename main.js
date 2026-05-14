/**
 * Rainbow Orbit: Ultra-Optimized & Fixed Version.
 */

const COLORS = [
    { name: 'Red',    value: '#ff4d4d' },
    { name: 'Orange', value: '#ffa64d' },
    { name: 'Yellow', value: '#ffff4d' },
    { name: 'Green',  value: '#4dff4d' },
    { name: 'Blue',   value: '#4d4dff' },
    { name: 'Purple', value: '#a64dff' }
];

class GameHUD extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    update(score, stage, color, speed) {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; font-family: 'Outfit', sans-serif; color: white; width: 100%; }
                .container {
                    display: flex; justify-content: space-around; background: rgba(255, 255, 255, 0.1);
                    padding: 0.5rem 1rem; border-radius: 2rem; backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2); margin: 0 1rem;
                }
                .stat { display: flex; flex-direction: column; text-align: center; }
                .label { font-size: 0.5rem; text-transform: uppercase; opacity: 0.7; letter-spacing: 0.1rem; }
                .value { font-size: 1rem; font-weight: 900; }
                @media (min-width: 600px) {
                    .container { gap: 1.5rem; justify-content: center; width: auto; margin: 0; }
                    .label { font-size: 0.6rem; }
                    .value { font-size: 1.2rem; }
                }
                .speed-val { color: #00ffcc; }
            </style>
            <div class="container">
                <div class="stat"><span class="label">Stage</span><span class="value">${stage}</span></div>
                <div class="stat"><span class="label">Target</span><span class="value">${color}</span></div>
                <div class="stat"><span class="label">Score</span><span class="value">${score}</span></div>
                <div class="stat"><span class="label">Speed</span><span class="value speed-val">${Math.floor(speed)}</span></div>
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
        if (finalScore !== null) {
            subtext = `Final Score: <span style="color: white; font-weight: 900; font-size: 2rem;">${finalScore}</span><br>${subtext}`;
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
        
        this.shadowRoot.innerHTML = `
            <style>
                .overlay-content { text-align: center; color: rgba(255, 255, 255, 0.8); font-family: 'Outfit', sans-serif; padding: 2rem; }
                h1 { font-size: 3rem; font-weight: 900; margin: 0; color: white; letter-spacing: -2px; line-height: 1; }
                p { font-size: 1rem; margin: 1.5rem 0 2.5rem; }
                button {
                    background: white; color: black; border: none; padding: 1.2rem 3rem;
                    font-size: 1.2rem; font-weight: 900; border-radius: 0.5rem; cursor: pointer;
                    font-family: 'Outfit', sans-serif; box-shadow: 0 0 20px rgba(255,255,255,0.3);
                    transition: transform 0.2s; -webkit-tap-highlight-color: transparent;
                }
                @media (min-width: 600px) { h1 { font-size: 4rem; } p { font-size: 1.2rem; } }
                button:hover { transform: scale(1.05); }
                button:active { transform: scale(0.95); }
            </style>
            <div class="overlay-content"><h1>${title}</h1><p>${subtext}</p><button id="actionBtn">${isStart ? 'INITIATE' : 'REBOOT'}</button></div>`;
        
        const btn = this.shadowRoot.getElementById('actionBtn');
        btn.onclick = (e) => {
            e.stopPropagation();
            this.style.visibility = 'hidden';
            this.style.display = 'none';
            if (isStart && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
            callback();
        };
        this.style.visibility = 'visible';
        this.style.display = 'flex';
    }
}

if (!customElements.get('game-hud')) customElements.define('game-hud', GameHUD);
if (!customElements.get('game-overlay')) customElements.define('game-overlay', GameOverlay);

class Enemy {
    constructor(canvas, targetColor, speed, requiredDistance = 0) {
        this.radius = 10;
        this.colorInfo = Math.random() < 0.4 ? targetColor : COLORS[Math.floor(Math.random() * COLORS.length)];
        this.isReflected = false;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const canvasDiagonal = Math.hypot(centerX, centerY);
        const baseDistance = canvasDiagonal + this.radius + Math.random() * 50;
        
        this.distanceToCenter = Math.max(baseDistance, requiredDistance);
        const angleFromCenter = Math.random() * Math.PI * 2;
        
        this.x = centerX + Math.cos(angleFromCenter) * this.distanceToCenter;
        this.y = centerY + Math.sin(angleFromCenter) * this.distanceToCenter;
        this.angle = Math.atan2(centerY - this.y, centerX - this.x);
    }
    update(dt, speed) {
        const vx = Math.cos(this.angle) * speed;
        const vy = Math.sin(this.angle) * speed;
        this.x += vx * dt;
        this.y += vy * dt;
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
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.hud = document.getElementById('hud');
        this.overlay = document.getElementById('overlay');
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.targetShieldAngle = 0;
        const updatePointer = (e) => {
            this.targetShieldAngle = Math.atan2(e.clientY - this.center.y, e.clientX - this.center.x);
        };
        window.addEventListener('pointerdown', updatePointer);
        window.addEventListener('pointermove', updatePointer);
        
        this.init();
        if (this.overlay) this.overlay.show('start', () => this.start());
    }

    init() {
        this.core = { radius: 25, colorIndex: 0, pulse: 0 };
        this.shield = { angle: 0, arcLength: Math.PI * 0.4, distance: 45, thickness: 8 };
        this.enemies = []; this.score = 0; this.stage = 1; this.totalMerges = 0; this.gameTime = 0;
        this.running = false; this.spawnTimer = 0; this.spawnRate = 0.7;
        this.currentSpeed = 200; // Reduced base speed
        this.lastEnemyDistance = 0;
        if (this.hud) this.hud.update(this.score, this.stage, COLORS[0].name, this.currentSpeed);
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
        let dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;
        this.update(dt);
        this.draw();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        this.gameTime += dt;
        this.core.pulse += 3 * dt;
        
        this.lastEnemyDistance -= this.currentSpeed * dt;
        if (this.lastEnemyDistance < 0) this.lastEnemyDistance = 0;

        // Reduced piecewise increments
        let inc = this.currentSpeed >= 700 ? 1 : (this.currentSpeed >= 600 ? 2 : (this.currentSpeed >= 500 ? 4 : 8));
        this.currentSpeed += inc * dt;
        
        this.spawnTimer += dt;
        if (this.spawnTimer > this.spawnRate) {
            const requiredDist = this.lastEnemyDistance + (0.2 * this.currentSpeed);
            const newEnemy = new Enemy(this.canvas, COLORS[this.core.colorIndex], this.currentSpeed, requiredDist);
            this.enemies.push(newEnemy);
            this.lastEnemyDistance = newEnemy.distanceToCenter;
            this.spawnTimer = 0;
            this.spawnRate = Math.max(0.2, 0.7 - (this.totalMerges * 0.02) - (this.gameTime * 0.008));
        }

        let angleDiff = this.targetShieldAngle - this.shield.angle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        this.shield.angle += angleDiff * 50 * dt;
        this.shield.distance = this.core.radius + 20;

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i]; e.update(dt, this.currentSpeed);
            const dist = Math.hypot(e.x - this.center.x, e.y - this.center.y);
            let diff = Math.atan2(e.y - this.center.y, e.x - this.center.x) - this.shield.angle;
            while (diff < -Math.PI) diff += Math.PI * 2; while (diff > Math.PI) diff -= Math.PI * 2;

            if (!e.isReflected && Math.abs(diff) < this.shield.arcLength / 2 && dist < this.shield.distance + 15 && dist > this.shield.distance - 15) {
                e.isReflected = true; e.angle += Math.PI;
                if (navigator.vibrate) navigator.vibrate(20);
            } else if (dist < this.core.radius + 10) {
                if (e.colorInfo.name === COLORS[this.core.colorIndex].name) {
                    this.score += 10; this.totalMerges++; this.core.radius *= 1.02;
                    this.currentSpeed += 5; // Reduced merge bonus
                    this.core.colorIndex = (this.core.colorIndex + 1) % COLORS.length;
                    if (this.core.colorIndex === 0) this.stage++;
                    this.enemies.splice(i, 1);
                    if (navigator.vibrate) navigator.vibrate(40);
                } else {
                    this.running = false;
                    if (this.overlay) this.overlay.show('gameover', () => this.start(), this.score);
                    return;
                }
            } else if (e.isReflected && (e.x < -200 || e.x > this.canvas.width + 200 || e.y < -200 || e.y > this.canvas.height + 200)) {
                this.enemies.splice(i, 1);
            }
        }
        if (this.hud) this.hud.update(this.score, this.stage, COLORS[this.core.colorIndex].name, this.currentSpeed);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const color = COLORS[this.core.colorIndex].value;
        const pulse = Math.sin(this.core.pulse) * (this.core.radius * 0.1);
        
        // Guide
        this.ctx.save();
        this.ctx.beginPath(); this.ctx.arc(this.center.x, this.center.y, this.shield.distance, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; this.ctx.setLineDash([5, 10]); this.ctx.stroke();
        this.ctx.restore();

        // Core
        this.ctx.save();
        this.ctx.shadowBlur = 30 + pulse; this.ctx.shadowColor = color; this.ctx.fillStyle = color;
        this.ctx.beginPath(); this.ctx.arc(this.center.x, this.center.y, this.core.radius + pulse, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.restore();

        // Shield
        this.ctx.save();
        this.ctx.beginPath(); 
        this.ctx.arc(this.center.x, this.center.y, this.shield.distance, this.shield.angle - this.shield.arcLength/2, this.shield.angle + this.shield.arcLength/2);
        this.ctx.lineWidth = this.shield.thickness; this.ctx.strokeStyle = 'white'; this.ctx.lineCap = 'round';
        this.ctx.shadowBlur = 20; this.ctx.shadowColor = 'white'; this.ctx.stroke();
        this.ctx.restore();
        
        for (const e of this.enemies) e.draw(this.ctx);
    }
}

new Game();
