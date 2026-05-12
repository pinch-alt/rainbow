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
*   **Progressive Speed Physics:** Enemies move at a constant speed per instance, but the base speed increases as the player merges more colors.
*   **Dynamic Difficulty:** Both spawn rate and enemy speed scale with `totalMerges`.
*   **Unified Render Engine:** Sync via `requestAnimationFrame` for maximum performance.

## 3. Implementation Plan (Phase 2: Modernization)

### Step 4: Physics & Collision Refinement
*   **Speed Scaling:** Increase enemy speed based on `totalMerges`.
*   **Difficulty Balancing:** Fine-tune the speed and spawn rate curves for a challenging experience.

## 4. Current Task: Implementing Progressive Speed Scaling
*   Update `Enemy` class to accept a dynamic `speed` parameter.
*   Calculate `baseSpeed` in the `Game` class based on `totalMerges`.
*   Increase the starting base speed for a more engaging beginning.
*   Commit and push changes.
