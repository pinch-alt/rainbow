# Rainbow Orbit: Color Collision Game Blueprint

## 1. Overview
"Rainbow Orbit" is a high-performance, visually stunning web game where players protect an evolving central core. The game leverages modern web standards (Baseline), including Web Components, Canvas API, and advanced CSS (OKLCH, Container Queries).

## 2. Detailed Outline & Current State

### Visual Design & Aesthetics
*   **Color Palette:** Utilizing `oklch` for ultra-vibrant, perceptually uniform colors.
*   **Effects:** Glow, Depth (shadows), and Texture (noise) for a premium feel.

### Features
*   **Evolving Core:** Central circle changes color in the rainbow sequence.
*   **Kinetic Shield:** Mouse/touch-controlled arc for reflection.
*   **Real-Time Progressive Speed Physics:** Enemies speed up dynamically based on merges and time elapsed.
*   **Dynamic Difficulty:** Both spawn rate and enemy speed scale with `totalMerges` and `gameTime`.
*   **Unified Render Engine:** Sync via `requestAnimationFrame` for maximum performance.

## 3. Implementation Plan (Phase 2: Modernization)

### Step 4: Physics & Collision Refinement (Optimized)
*   **Dynamic Speed Scaling:** Implemented `getCurrentSpeed()` which combines base speed, merge bonuses (+45), and time bonuses (+8/sec).
*   **Real-Time Updates:** Enemies now update their velocity every frame to reflect global speed changes immediately.
*   **Spawn Rate Acceleration:** Spawn rate now decreases over time and with merges for a more intense experience.

## 4. Current State: Dynamic Real-Time Physics
*   The issue where speed didn't seem to increase has been resolved by making speed updates real-time and continuous.
*   Difficulty curve is now exponential-like, providing a much more challenging and satisfying progression.
