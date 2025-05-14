// WebGL for Advanced Particle Sphere System

async function initAIFaceWebGL(canvasId) {
  console.log("[AI_FACE_WEBGL] initAIFaceWebGL: Function START for canvas:", canvasId);

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error('[AI_FACE_WEBGL] initAIFaceWebGL: Advanced Particle Sphere canvas not found!', canvasId);
    return;
  }
  console.log("[AI_FACE_WEBGL] initAIFaceWebGL: Canvas element found:", canvas);
  
  // Ensure canvas has proper dimensions - matching CSS
  canvas.width = 120;
  canvas.height = 120;
  console.log(`[AI_FACE_WEBGL] initAIFaceWebGL: Canvas dimensions set to ${canvas.width}x${canvas.height}`);

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.error('[AI_FACE_WEBGL] initAIFaceWebGL: Unable to initialize WebGL. Your browser may not support it.');
    return;
  }
  console.log("[AI_FACE_WEBGL] initAIFaceWebGL: WebGL context obtained.");

  let error = gl.getError();
  if (error !== gl.NO_ERROR) console.error('[AI_FACE_WEBGL] WebGL error after getContext:', error);

  // Enhanced vertex shader with time uniform for animation
  const vertexShaderSource = `
    precision mediump float;
    precision mediump int;

    attribute vec3 position;
    attribute float size;
    attribute vec3 color;
    attribute float layer;
    
    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;
    uniform mediump float time;
    
    varying vec3 vColor;
    varying float vLayer;
    varying float vDepth;
    
    // Function to create a rotation matrix around Y
    mat4 rotationY(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat4(
            c, 0.0, -s, 0.0,
            0.0, 1.0, 0.0, 0.0,
            s, 0.0, c, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
    }
    
    // Function to create a rotation matrix around X
    mat4 rotationX(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat4(
            1.0, 0.0, 0.0, 0.0,
            0.0, c, s, 0.0,
            0.0, -s, c, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
    }
    
    // Function to create a rotation matrix around Z
    mat4 rotationZ(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat4(
            c, s, 0.0, 0.0,
            -s, c, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
    }

    void main(void) {
        // Create a unique rotation for each layer
        float layerOffset = layer * 0.5;
        float angleX = time * (0.1 + layer * 0.05) + layerOffset;
        float angleY = time * (0.2 - layer * 0.03) + layerOffset * 2.0;
        float angleZ = time * (0.05 + layer * 0.02) + layerOffset * 0.5;
        
        mat4 layerRotation;
        if (layer < 0.5) { 
            layerRotation = rotationY(angleY * 1.2) * rotationX(angleX * 0.4);
        } else if (layer < 1.5) {
            layerRotation = rotationZ(angleZ) * rotationY(angleY * 0.7);
        } else if (layer < 2.5) {
            layerRotation = rotationX(angleX) * rotationZ(angleZ * 0.5);
        } else {
            layerRotation = rotationY(angleY) * rotationZ(angleZ) * rotationX(angleX * 0.2);
        }
        
        vec4 modelViewPosition = viewMatrix * modelMatrix * layerRotation * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
        
        float distance = length(modelViewPosition.xyz);
        float scaleFactor = 1.0 / (1.0 + distance * 0.1);
        
        if (layer < 0.5) { // Core layer particles
            gl_PointSize = size * (1.0 + layer * 0.15) * scaleFactor * 12.0; // Increased base size for core
            gl_PointSize = max(0.8, gl_PointSize); // Increased min size for core
        } else { // Outer layers
            gl_PointSize = size * (1.0 + layer * 0.2) * scaleFactor * 9.0; // Slightly increased for outer
        }
        
        vColor = color;
        vLayer = layer;
        vDepth = -modelViewPosition.z;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    precision mediump int;
    
    varying vec3 vColor;
    varying float vLayer;
    varying float vDepth;
    
    uniform mediump float time;
    
    void main(void) {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        float alpha;
        float pulse;
        vec3 baseColor = vColor;
        float depthInfluence = 0.3;

        if (vLayer < 0.5) { // Core layer enhancements
            alpha = smoothstep(0.5, 0.25, dist); // Sharper core particle edges
            pulse = 0.2 * sin(time * 2.8 + vLayer * 2.5); // Slightly stronger pulse
            baseColor *= 1.1; // Brighter core
            depthInfluence = 0.15; 
            alpha *= (0.75 + pulse * 0.4); // More opaque core, stronger pulse impact
        } else { // Outer layers
            alpha = smoothstep(0.5, 0.28, dist); // Softer particle edges for outer layers
            pulse = 0.08 * sin(time * 2.2 + vLayer * 2.0); // Subtler outer pulse
            alpha *= (0.6 + pulse * 0.7); // Slightly more opaque base for outer
        }
        
        float depthFactor = clamp(vDepth / 5.0, 0.0, 1.0);
        
        float edgeGlowIntensity = (vLayer < 0.5) ? 0.7 : 0.55; // Increased edge glow for core
        float edgeGlow = smoothstep(0.4, 0.45, dist) * smoothstep(0.5, 0.45, dist);
        vec3 edgeColor = vec3(0.2, 0.85, 1.0) * (0.6 + 0.4 * sin(time * 3.5 + vLayer * 4.5 + (vLayer < 0.5 ? 0.5 : 0.0) )); // Brighter edge color
        
        vec3 finalColor = mix(baseColor * (1.0 - depthInfluence + depthInfluence * (1.0 - depthFactor)), edgeColor, edgeGlow * edgeGlowIntensity);
        
        if (alpha < 0.01) discard;
        
        gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  // Compile shaders
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('[AI_FACE_WEBGL] initAIFaceWebGL: Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
    return;
  }
  console.log("[AI_FACE_WEBGL] initAIFaceWebGL: Vertex shader compiled.");
  error = gl.getError();
  if (error !== gl.NO_ERROR) console.error('[AI_FACE_WEBGL] WebGL error after vertex shader compile:', error);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('[AI_FACE_WEBGL] initAIFaceWebGL: Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
    return;
  }
  console.log("[AI_FACE_WEBGL] initAIFaceWebGL: Fragment shader compiled.");
  error = gl.getError();
  if (error !== gl.NO_ERROR) console.error('[AI_FACE_WEBGL] WebGL error after fragment shader compile:', error);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('[AI_FACE_WEBGL] initAIFaceWebGL: Shader program link error:', gl.getProgramInfoLog(shaderProgram));
    return;
  }
  console.log("[AI_FACE_WEBGL] initAIFaceWebGL: Shader program linked.");
  error = gl.getError();
  if (error !== gl.NO_ERROR) console.error('[AI_FACE_WEBGL] WebGL error after program link:', error);
  
  gl.useProgram(shaderProgram);
  console.log("[AI_FACE_WEBGL] initAIFaceWebGL: Shader program set to use.");
  error = gl.getError();
  if (error !== gl.NO_ERROR) console.error('[AI_FACE_WEBGL] WebGL error after useProgram:', error);

  // --- Multi-layered Sphere Particle Generation ---
  const particleData = [];
  const layerCount = 4;
  let totalParticles = 0;
  
  for (let layer = 0; layer < layerCount; layer++) {
    const layerParticleCount = (layer === 0) ? 250 : 
                             (layer === 1 ? 400 : 
                             (layer === 2 ? 350 : 200)); 
    const radius = 0.5 + layer * 0.45; 
    
    const phi = Math.PI * (3.0 - Math.sqrt(5.0)); 
    
    for (let i = 0; i < layerParticleCount; i++) {
      const y = 1.0 - (i / (layerParticleCount - 1.0)) * 2.0;
      const radius_i = Math.sqrt(1.0 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius_i;
      const z = Math.sin(theta) * radius_i;
      
      particleData.push(x * radius, y * radius, z * radius);
      
      const particleSize = (layer === 0) ? 0.8 :  // Significantly reduced base size
                           (layer === 1 ? 0.6 :  // Significantly reduced base size
                           (layer === 2 ? 0.4 : 0.3)); // Significantly reduced base size
      particleData.push(particleSize);
      
      // Adjusted colors for a more subtle, monochromatic feel
      if (layer === 0) { 
        particleData.push(0.4, 0.8, 1.0); 
      } else if (layer === 1) {
        particleData.push(0.2, 0.6, 0.9); 
      } else if (layer === 2) {
        particleData.push(0.1, 0.4, 0.8); 
      } else { // Outermost
        particleData.push(0.05, 0.3, 0.7);
      }
      
      particleData.push(layer);
    }
    totalParticles += layerParticleCount;
  }
  
  const particleBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particleData), gl.STATIC_DRAW);
  console.log(`[AI_FACE_WEBGL] initAIFaceWebGL: Particle data buffer created with ${totalParticles} particles.`);
  error = gl.getError();
  if (error !== gl.NO_ERROR) console.error('[AI_FACE_WEBGL] WebGL error after bufferData:', error);
  
  // Set up attribute pointers
  const positionAttrLocation = gl.getAttribLocation(shaderProgram, 'position');
  const sizeAttrLocation = gl.getAttribLocation(shaderProgram, 'size');
  const colorAttrLocation = gl.getAttribLocation(shaderProgram, 'color');
  const layerAttrLocation = gl.getAttribLocation(shaderProgram, 'layer');
  
  // Each vertex has: [x,y,z, size, r,g,b, layer] = 8 floats
  const stride = 8 * Float32Array.BYTES_PER_ELEMENT;
  
  gl.vertexAttribPointer(positionAttrLocation, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(positionAttrLocation);
  error = gl.getError();
  if (error !== gl.NO_ERROR) console.error('[AI_FACE_WEBGL] WebGL error after vertexAttribPointers:', error);
  
  gl.vertexAttribPointer(sizeAttrLocation, 1, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(sizeAttrLocation);
  
  gl.vertexAttribPointer(colorAttrLocation, 3, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(colorAttrLocation);
  
  gl.vertexAttribPointer(layerAttrLocation, 1, gl.FLOAT, false, stride, 7 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(layerAttrLocation);
  error = gl.getError();
  if (error !== gl.NO_ERROR) console.error('[AI_FACE_WEBGL] WebGL error after vertexAttribPointers:', error);
  
  // Get uniform locations
  const projectionMatrixUniform = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  const viewMatrixUniform = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  const modelMatrixUniform = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  const timeUniform = gl.getUniformLocation(shaderProgram, 'time');
  const resolutionLocation = gl.getUniformLocation(shaderProgram, 'resolution');
  console.log("[AI_FACE_WEBGL] initAIFaceWebGL: Attribute and uniform locations obtained.");
  
  // Matrix creation functions
  function perspective(fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0
    ];
  }
  
  function identity() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }
  
  function translate(matrix, tx, ty, tz) {
    // Create a translation matrix and multiply
    const result = [...matrix];
    result[12] = matrix[0] * tx + matrix[4] * ty + matrix[8] * tz + matrix[12];
    result[13] = matrix[1] * tx + matrix[5] * ty + matrix[9] * tz + matrix[13];
    result[14] = matrix[2] * tx + matrix[6] * ty + matrix[10] * tz + matrix[14];
    result[15] = matrix[3] * tx + matrix[7] * ty + matrix[11] * tz + matrix[15];
    return result;
  }
  
  function rotateY(matrix, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    
    const a00 = matrix[0], a01 = matrix[1], a02 = matrix[2], a03 = matrix[3];
    const a20 = matrix[8], a21 = matrix[9], a22 = matrix[10], a23 = matrix[11];
    
    // Perform axis-specific matrix multiplication
    const out = [...matrix];
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    
    return out;
  }
  
  function rotateX(matrix, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    
    const a10 = matrix[4], a11 = matrix[5], a12 = matrix[6], a13 = matrix[7];
    const a20 = matrix[8], a21 = matrix[9], a22 = matrix[10], a23 = matrix[11];
    
    // Perform axis-specific matrix multiplication
    const out = [...matrix];
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    
    return out;
  }
  
  // Set up the perspective matrix
  const fieldOfView = Math.PI / 3;  // 60 degrees
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projMatrix = perspective(fieldOfView, aspect, zNear, zFar);
  
  // Set up view matrix (camera position)
  let viewMatrix = identity();
  viewMatrix = translate(viewMatrix, 0, 0, -4); // Move camera back
  
  // Set up model matrix (initially identity)
  let modelMatrix = identity();
  
  // Mouse interaction state
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let currentRotationX = 0;
  let currentRotationY = 0;
  
  // Mouse interaction
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    mouseY = ((e.clientY - rect.top) / canvas.clientHeight) * 2 - 1;
    
    targetRotationY = mouseX * Math.PI * 0.5; // Horizontal rotation
    targetRotationX = -mouseY * Math.PI * 0.5; // Vertical rotation (inverted for natural feel)
  });
  
  canvas.addEventListener('mouseout', () => {
    // Don't reset rotation on mouseout - keep rotating naturally
  });
  
  // Add auto-rotation even without mouse
  let autoRotateY = 0.001;
  let autoRotateX = 0.0003;
  
  // Animation and render
  let startTime = performance.now();
  let then = 0;
  
  function render(now) {
    now *= 0.001; // Convert to seconds
    const deltaTime = now - then;
    then = now;
    
    const elapsed = (performance.now() - startTime) * 0.001; // Time in seconds
    
    // Error check at start of render loop
    let renderError = gl.getError();
    if (renderError !== gl.NO_ERROR) console.error('[AI_FACE_WEBGL] WebGL error at start of render loop:', renderError);

    // Log canvas opacity once
    if (!canvas.dataset.opacityLogged) {
        console.log("[AI_FACE_WEBGL] render: Canvas current style.opacity:", canvas.style.opacity, ", computed opacity:", window.getComputedStyle(canvas).opacity);
        canvas.dataset.opacityLogged = "true"; // Log only once
    }

    // Apply smooth rotation
    currentRotationX += (targetRotationX - currentRotationX) * 0.05;
    currentRotationY += (targetRotationY - currentRotationY) * 0.05;
    
    // Add auto-rotation
    targetRotationY += autoRotateY;
    targetRotationX += autoRotateX;
    
    // Reset model matrix and apply rotations
    modelMatrix = identity();
    modelMatrix = rotateY(modelMatrix, currentRotationY);
    modelMatrix = rotateX(modelMatrix, currentRotationX);
    
    // Setup GL state
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0); // Transparent background
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Set uniforms
    gl.useProgram(shaderProgram);
    gl.uniformMatrix4fv(projectionMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniform1f(timeUniform, elapsed); // Pass time to shader
    renderError = gl.getError();
    if (renderError !== gl.NO_ERROR) console.error('[AI_FACE_WEBGL] WebGL error after setting uniforms:', renderError);
    
    // Draw particles
    gl.drawArrays(gl.POINTS, 0, totalParticles);
    renderError = gl.getError();
    if (renderError !== gl.NO_ERROR) console.error('[AI_FACE_WEBGL] WebGL error after drawArrays:', renderError);
    
    requestAnimationFrame(render);
  }
  
  console.log("[AI_FACE_WEBGL] initAIFaceWebGL: Starting render loop.");
  render();
  console.log(`[AI_FACE_WEBGL] initAIFaceWebGL: Advanced Particle Sphere setup complete with ${totalParticles} particles.`);
  let finalError = gl.getError();
  if (finalError !== gl.NO_ERROR) console.error('[AI_FACE_WEBGL] WebGL error at end of init:', finalError);
}

// Ensure initWebGL is callable (e.g. if it's set on window or called by other scripts)
// Since it's called from index.html, it needs to be global or properly scoped.
// For now, it's global by default in browser scripts.
