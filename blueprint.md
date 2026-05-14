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
*   **Dynamic Speed Scaling:** Implemented `getCurrentSpeed()` logic with piecewise progression (+15, +8, +4, +2).
*   **Performance Optimization:** Streamlined render loop and removed redundant variables/logic to ensure 60FPS on all devices.
*   **Real-Time Updates:** Enemies now update their velocity every frame to reflect global speed changes immediately.

### Step 5: Enhanced Touch Support & Mobile Optimization
*   **Absolute Pointer Tracking:** Shield follows the finger/mouse position exactly for maximum intuition.
*   **Haptic Feedback:** Integrated the Vibration API to provide tactile feedback during merges and game-over states.
*   **Fullscreen Mode:** Implemented request for fullscreen mode upon game initiation.
*   **Responsive UI:** Optimized HUD and Overlay for various screen sizes.

## 4. Current State: Performance & UX Refinement
*   Codebase has been refactored for maximum efficiency.
*   **Current Task:** Monitoring performance and ensuring seamless touch-to-shield synchronization.
