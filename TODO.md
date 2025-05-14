# Project TODO List: NAME0x0 Personal Website

## Phase 1: Initial Setup & Basic HTML (COMPLETE)

- [x] Review user specification document.
- [x] Create `index.html` with basic structure (header, intro, links, terminal container).
- [x] Setup meta tags (charset, viewport, description).
- [x] Import Fira Code & Orbitron from Google Fonts.
- [x] Add `anime.js` library (CDN v3.2.1).
- [x] Create `README.md` and `TODO.md`.

## Phase 2: Directory Structure & Initial CSS (COMPLETE)

- [x] Create directories: `css/`, `js/`, `shaders/`, `assets/`.
- [x] Create `css/styles.css`.
- [x] Implement initial CSS from specification (body, container, header, intro, links, terminal styles).

## Phase 3: JavaScript Placeholders & Basic Shaders (COMPLETE)

- [x] Create `js/main.js` (basic event listeners, preloader logic placeholder).
- [x] Create `js/webgl.js` (placeholder for WebGL init).
- [x] Create `js/animations.js` (placeholder for animation functions).
- [x] Create `shaders/vertexShader.glsl` and `shaders/fragmentShader.glsl` (basic rotating cube).

## Phase 4: WebGL Implementation (COMPLETE)

- [x] Implement WebGL rotating cube in `js/webgl.js`.
  - [x] Load, compile, and link shaders.
  - [x] Define cube vertices, colors, and indices.
  - [x] Setup buffers, attributes, and uniforms.
  - [x] Implement projection and view matrices.
  - [x] Create basic render loop with rotation.
  - [x] Set WebGL canvas background to transparent.
- [x] Change WebGL from rotating cube to particle sphere (bottom-right).
  - [x] Update `js/webgl.js` for particle sphere (Fibonacci lattice, `gl.POINTS`, blending).
  - [x] Embed shaders directly in `js/webgl.js` and modify for particles.
  - [x] Delete old `.glsl` files.
  - [x] Adjust WebGL canvas size (150x150px).

## Phase 5: UI Enhancements & Initial Animations (COMPLETE)

- [x] Update `css/styles.css` for cyberpunk/modern aesthetic:
  - [x] Body background to black.
  - [x] Retro CTL scanline effect on body.
  - [x] CSS preloader (spinner).
  - [x] Terminal styling (dark green bg, enhanced glow).
  - [x] WebGL canvas styling for bottom-right position.
- [x] Update `index.html` with preloader HTML.
- [x] Implement header animation (fade in, slide up) in `js/animations.js`.
- [x] Implement staggered fade-in for pre-existing terminal lines in `js/animations.js`.
- [x] Add top-left system info widget (clock, date, status) and top-right user info widget (HTML in `index.html`, CSS in `styles.css`).
- [x] Update `js/main.js` for clock/date in system widget.
- [x] Enhance terminal content (AI boot sequence, structured prompt with blinking cursor).
- [x] Enhance CSS: global text phosphor glow, subtler body scanlines, terminal inner glow, internal scanlines, distinct message colors, styled prompt, blinking cursor.
- [x] Implement AI multi-line typing effect for welcome messages in `js/animations.js`.
- [x] Hide user prompt until AI finishes typing.
- [x] Fix cursor placement and style (remove margin, change to `_`).

## Phase 6: Terminal Interactivity & Commands (COMPLETE)

- [x] Enable user input in terminal after AI typing animation (`contenteditable`, focus in `js/animations.js`).
- [x] Implement command processing in `js/main.js`:
  - [x] Event listener for `Enter` key.
  - [x] `processCommand` function.
  - [x] `appendMessageToTerminal` helper function.
  - [x] Implement `google <query>` command (client-side).
  - [x] Implement `clear` command.
  - [x] Implement `date` command (client-side).
  - [x] Implement `time` command (client-side).
  - [x] Implement `weather <location>` command (client-side using Open-Meteo).
  - [x] Implement `ip` command (client-side using ip-api.com).
- [x] Remove Python MCP server and Flask backend dependencies.
  - [x] Update `js/main.js` to use client-side JS/APIs for all commands.
  - [x] Mark Python server files for deletion (`python_mcp_servers/` directory).
  - [x] Delete `python_mcp_servers` directory and its contents.

## Phase 7: UI/UX Refinement - "Cyberpunk Elegance" (COMPLETE)

- [x] Improve HTML title for thematic relevance.
- [x] Introduce "Orbitron" font for headers/accented text and refine "Fira Code" usage.
- [x] Introduce vibrant cyan as a primary accent color.
- [x] Enhance header styling: Orbitron font, cyan accent, glitch/flicker text animations.
- [x] Enhance widget styling: Orbitron titles, cyan borders/accents, pulsing status indicators.
- [x] Improve link styling: modern look with cyan accents and hover effects.
- [x] Update terminal styling: Deepen box-shadows, recolor system/AI messages and prompt elements with new accents.
- [x] Update preloader: Thematic "system check" text lines, animated with JS in `js/main.js`.
- [x] Add subtle scrolling animation to terminal's internal scanlines.

## Phase 8: UI/UX Overhaul - "JARVIS-Inspired" Aesthetic (COMPLETE)

- [x] **Goal**: Shift from cyberpunk to a sophisticated, clean, futuristic "JARVIS" look.
- [x] **Color Palette**: Implement a new color scheme (deep blues, silvers, electric blues, whites on dark backgrounds).
  - [x] Update `css/styles.css` with new palette for all elements (body, header, terminal, widgets, links, preloader, canvas).
- [x] **Text Styling & Fonts**: Refine text rendering for clarity and high-tech feel.
  - [x] Adjust `text-shadow` for cleaner, more subtle glows (blues/whites).
  - [x] Ensure Orbitron and Fira Code are styled appropriately for the new aesthetic.
- [x] **UI Elements Redesign (`css/styles.css`)**:
  - [x] **Header**: Replace glitch/flicker with cleaner animation (e.g., subtle pulse).
  - [x] **Widgets**: Redesign for a more integrated, sophisticated look (borders, backgrounds, text colors).
  - [x] **Terminal**: Update background, borders, and all text element colors to align with the new palette. Make internal scanlines a cleaner grid or very subtle lines.
  - [x] **Links**: Update styling to match the new cool, futuristic palette.
  - [x] **Scanlines**: Remove or make body scanlines extremely subtle and modern.
- [x] **Preloader**: Update preloader text and animation to fit a "JARVIS system boot" theme.
  - [x] Update preloader HTML in `index.html` with new thematic text.
  - [x] Update `js/main.js` (`animatePreloader` function) to manage new preloader sequence and status changes (e.g., "PENDING" to "ONLINE").
- [x] **HTML Title**: Update `index.html` title to reflect the new aesthetic (e.g., "NAME0x0 :: Advanced Interface // System Online").

## Phase 9: Content & Final Touches

- [ ] **Investigate & Fix: Page Appears Empty**
  - [ ] Check `css/styles.css`: Ensure `loader` is initially visible and `dashboard-main` is appropriately hidden/shown.
  - [ ] Verify `js/main.js`: Confirm `animatePreloader` function correctly hides the loader and reveals `dashboard-main`.
  - [ ] Ensure no JavaScript errors are preventing scripts from running.
- [ ] **About Me Section**: Design and implement a section/modal for "About Me" content.
  - [ ] Content ideas: Brief bio, skills (programming languages, tools, technologies), education, interests/hobbies related to IT and tech.
  - [ ] Consider how to display this: a new terminal command? A link that opens a stylized modal?
- [ ] **Projects Section**: Design and implement a way to showcase projects.
  - [ ] How to present? Links to GitHub? Interactive elements?
- [ ] **Contact Information**: Add a way for users to contact (e.g., email, LinkedIn).
  - [ ] Terminal command `contact`? Link in widgets or main links section?
- [ ] **Help Command**: Implement a comprehensive `help` command in the terminal listing all available commands and their usage.
- [ ] **Favicon**: Create and add a custom favicon.
- [ ] **Responsiveness Check**: Thoroughly test and refine responsiveness across different screen sizes (desktop, tablet, mobile).
- [ ] **Performance Optimization**: Minify CSS/JS, optimize images (if any added later).
- [ ] **Cross-browser Testing**: Ensure compatibility with major browsers.
- [ ] **Accessibility (A11y)**: Review for basic accessibility (e.g., color contrast, keyboard navigation for terminal).
- [ ] **Final Code Cleanup**: Remove any unused code, comments, console logs.

## Future Considerations / Wishlist

- [ ] More advanced WebGL background/effects.
- [ ] Interactive storyline or easter eggs within the terminal.
- [ ] Sound effects for terminal interactions (typing, command execution, errors).
- [ ] Blog integration or a section for articles/thoughts.
- [ ] Custom animations for specific commands or events.