# Rainbow Orbit: Color Collision Game Blueprint

## 1. Overview
"Rainbow Orbit" is a high-performance, visually stunning web game where players protect an evolving central core. The game leverages modern web standards (Baseline), including Web Components, Canvas API, and advanced CSS (OKLCH, Container Queries).

## 2. Detailed Outline & Current State

### Visual Design & Aesthetics
*   **Color Palette:** Utilizing `oklch` for ultra-vibrant, perceptually uniform colors.
*   **Effects:** Glow, Depth (shadows), and Texture (noise) for a premium feel.
*   **Orbit Guideline:** A thin, dashed line marking the shield's rotation path for better precision.

### Features
*   **Evolving Core:** Central circle changes color in the rainbow sequence.
*   **Kinetic Shield:** Mouse/touch-controlled arc for reflection.
*   **Real-Time Progressive Speed Physics:** Enemies speed up dynamically based on merges and time elapsed.
*   **Dynamic Difficulty:** Both spawn rate and enemy speed scale with `totalMerges` and `gameTime`.
*   **Unified Render Engine:** Sync via `requestAnimationFrame` for maximum performance.

## 3. Implementation Plan (Phase 2: Modernization)

### Step 4: Physics & Collision Refinement (Optimized)
*   **Dynamic Speed Scaling:** Implemented `getCurrentSpeed()` logic with a more accessible difficulty curve.
*   **Reduced Piecewise Progression:** Base speed reduced to **200**. Speed increases by +8/sec initially, slowing to +4/sec (at 500+), +2/sec (at 600+), and **+1/sec (at 700+)**.
*   **Merge Bonus:** Speed increase per merge reduced to **+5** for a smoother experience.
*   **Performance Optimization:** Streamlined render loop and removed redundant variables/logic to ensure 60FPS on all devices.
*   **Real-Time Updates:** Enemies now update their velocity every frame to reflect global speed changes immediately.

### Step 5: Enhanced Touch Support & Mobile Optimization
*   **Absolute Pointer Tracking:** Shield follows the finger/mouse position exactly for maximum intuition.
*   **Haptic Feedback:** Integrated the Vibration API to provide tactile feedback during merges and game-over states.
*   **Fullscreen Mode:** Implemented request for fullscreen mode upon game initiation.
*   **Responsive UI:** Optimized HUD and Overlay for various screen sizes.

### Step 6: Difficulty Rebalancing (Requested)
*   **Spawn Frequency Reduction:** Reduced frequency to 80% of the previous state (interval increased by 1.25x). `baseSpawnRate` updated from 0.875 to **1.09375**.
*   **Speed Progression Halved:** The dynamic speed increase per second has been reduced by 50% across all speed tiers (e.g., initial increase reduced from +4/sec to **+2/sec**).
*   **Merge Bonus Adjustment:** Speed bonus per successful merge maintained at a lower level for consistency.
