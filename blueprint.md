# Rainbow Orbit: Color Collision Game Blueprint

## 1. Overview
"Rainbow Orbit" is a high-performance, visually stunning web game where players protect an evolving central core. The game leverages modern web standards (Baseline), including Web Components, Canvas API, and advanced CSS (OKLCH, Container Queries).

## 2. Detailed Outline & Current State

### Visual Design & Aesthetics
*   **Color Palette:** Utilizing `oklch` for ultra-vibrant, perceptually uniform colors (Red, Orange, Yellow, Green, Blue, Purple).
*   **Effects:** 
    *   **Glow:** Interactive elements (shield, circles) feature dynamic outer glows.
    *   **Depth:** Multi-layered drop shadows on UI elements.
    *   **Texture:** Subtle noise texture on the background for a premium feel.
*   **Typography:** Expressive fonts for hero text and HUD.

### Features
*   **Evolving Core:** The central circle changes color in the rainbow sequence (Red -> Purple) upon successful absorption of matching colors.
*   **Kinetic Shield:** A mouse/touch-controlled arc that reflects non-matching colors.
*   **Constant Speed Physics:** Enemies move at a strictly constant speed, regardless of interaction state or reflection.
*   **Unified Render Engine:** Logic and rendering are synced via `requestAnimationFrame` for maximum performance and to prevent browser throttling.
*   **Delta Time Integration:** All physical calculations use delta time (dt), ensuring consistent movement speed.
*   **Web Component UI:** HUD and Menus are encapsulated in Custom Elements.

## 3. Implementation Plan (Phase 2: Modernization)

### Step 1: Web Component UI
*   Create a `<game-hud>` component to display the current stage and score.
*   Create a `<game-overlay>` component for Start and Game Over screens.

### Step 3: Advanced Rendering (main.js)
*   Refactor to a class-based architecture.
*   Implement `oklch` color transitions and particle systems.

### Step 4: Physics & Collision Refinement
*   **Speed Optimization:** Ensure enemies maintain constant velocity.
*   **Loop Unification:** Migrate from `setInterval` to `requestAnimationFrame` for the main loop.

### Step 5: Styling & Textures
*   Update `style.css` with background textures and CSS variables.

## 4. Current Task: Ensuring Constant Ball Speed & Performance
*   Refactor the game loop to use `requestAnimationFrame` only.
*   Fix `Enemy` reflection logic to maintain constant speed magnitude (1.0x factor).
*   Ensure smooth, non-throttled movement even when input is idle.
