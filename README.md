# NAME0x0 Personal Website

This is the repository for my personal website with a terminal-like interface and WebGL features.

## Project Overview

This website serves as my personal landing page and portfolio, designed with a unique terminal-style interface. It features links to my GitHub, projects, blog, and contact information, enhanced by a WebGL canvas showing a rotating cube and animations using anime.js.

## Technology Stack

- **HTML5**: For the website structure
- **CSS3**: For styling, including custom gradients and terminal-like appearance
- **JavaScript**: For dynamic functionality
- **WebGL**: For rendering a 3D rotating cube
- **anime.js**: (Specification: v4.2.0, Currently using: v3.2.1) For smooth animations
- **Google Fonts**: Using Fira Code for a monospace terminal look

## Site Structure

```
NAME0x0.github.io/
│
├── index.html              # Main entry page
├── css/
│   └── styles.css          # Main stylesheet
│
├── js/
│   ├── main.js            # Core JavaScript functionality
│   ├── webgl.js           # WebGL implementation
│   └── animations.js      # Animation controls using anime.js
│
├── shaders/
│   ├── vertexShader.glsl   # Vertex shader for WebGL
│   └── fragmentShader.glsl # Fragment shader for WebGL
│
├── assets/
│   └── favicon.ico         # Site favicon
│
└── README.md              # Project documentation
```

## Features

- Terminal-like interface with interactive elements
- WebGL-rendered 3D rotating cube
- Smooth animations using anime.js
- Responsive design
- Links to GitHub, projects, blog, and contact information