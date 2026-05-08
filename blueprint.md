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
*   **Kinetic Shield:** A mouse-controlled arc that reflects non-matching colors with physical feedback.
*   **Progressive Difficulty:** Spawn rates and speeds increase as the core grows.
*   **Web Component UI:** HUD and Menus are encapsulated in Custom Elements.

## 3. Implementation Plan (Phase 2: Modernization)

### Step 1: Web Component UI
*   Create a `<game-hud>` component to display the current stage and score.
*   Create a `<game-overlay>` component for Start and Game Over screens.

### Step 3: Advanced Rendering (main.js)
*   Refactor to a class-based architecture (`Game`, `Core`, `Shield`, `Enemy`).
*   Implement `oklch` color transitions.
*   Add a Particle System for collisions and merges.
*   Implement "Bloom" effect using shadowBlur on Canvas.

### Step 4: Physics & Collision Refinement
*   Improve shield reflection logic (proper vector reflection).
*   Add "screenshake" effect on game over.

### Step 5: Styling & Textures
*   Update `style.css` with background textures and CSS variables for the palette.
*   Use Cascade Layers (`@layer`) to organize styles.

## 4. Current Task: Implementing the Modernized Core & UI
*   Define the Web Components.
*   Restructure `main.js` into the new class-based system.
*   Apply the visual polish.
