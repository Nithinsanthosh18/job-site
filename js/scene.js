/**
 * ORBIS — Three.js WebGL Scene
 * Scroll-driven orbital ring with 3D Earth and particle field
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export function initScene() {
  const canvas = document.getElementById('webgl-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  // ── Fog ──────────────────────────────────────────────────
  scene.fog = new THREE.FogExp2(0x080A0F, 0.04);

  // ── Lighting ──────────────────────────────────────────────
  // Main Sun directional light (illuminates the day side with high intensity)
  const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);

  // Blue fill directional light (adds clarity and highlights details on the shadowed side)
  const fillLight = new THREE.DirectionalLight(0x93C5FD, 1.0);
  fillLight.position.set(-5, -2, -5);
  scene.add(fillLight);

  // Violet ambient and point fill lights (illuminates the shadow/night side with a sci-fi tint)
  scene.add(new THREE.AmbientLight(0x7C3AED, 0.28));
  const pointLight = new THREE.PointLight(0x7C3AED, 2.5, 20);
  pointLight.position.set(0, 0, 4);
  scene.add(pointLight);

  // ── Orbital Ring Group ────────────────────────────────────
  const orbGroup = new THREE.Group();
  scene.add(orbGroup);

  // Single Orbit Ring (Tilted and prominent)
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xE8EAF0,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide
  });
  const ringGeo = new THREE.TorusGeometry(3.5, 0.018, 8, 200); // Widened and thickened for larger Earth
  const orbitRing = new THREE.Mesh(ringGeo, ringMat);
  orbitRing.rotation.x = 1.2;
  orbitRing.rotation.y = 0.15;
  orbGroup.add(orbitRing);

  // Orbital dot (Satellite orbiting on the ring plane)
  const dotGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const dotMat = new THREE.MeshBasicMaterial({ color: 0x7C3AED });
  const orbDot = new THREE.Mesh(dotGeo, dotMat);
  
  const dotPivot = new THREE.Object3D();
  dotPivot.rotation.x = 1.2; // Match the orbit ring tilt
  dotPivot.rotation.y = 0.15;
  dotPivot.add(orbDot);
  orbDot.position.set(3.5, 0, 0); // Position directly on the ring radius (3.5)
  orbGroup.add(dotPivot); // Nested inside orbGroup so it zooms and scales on scroll

  // Dot glow
  const dotGlowGeo = new THREE.SphereGeometry(0.14, 16, 16);
  const dotGlowMat = new THREE.MeshBasicMaterial({ color: 0x7C3AED, transparent: true, opacity: 0.25 });
  const dotGlow = new THREE.Mesh(dotGlowGeo, dotGlowMat);
  dotGlow.position.copy(orbDot.position);
  dotPivot.add(dotGlow);

  // ── 3D Earth Globe System ──────────────────────────────────
  const textureLoader = new THREE.TextureLoader();
  const dayTex = textureLoader.load('assets/earth_day.jpg');
  const nightTex = textureLoader.load('assets/earth_night.jpg');
  const cloudsTex = textureLoader.load('assets/earth_clouds.png');

  // Colorspace configuration for Three.js v0.160+
  dayTex.colorSpace = THREE.SRGBColorSpace;
  nightTex.colorSpace = THREE.SRGBColorSpace;

  // Custom Shader Material for Day/Night blending + Ocean Specular reflections + Fill lighting
  const earthMat = new THREE.ShaderMaterial({
    uniforms: {
      dayTexture: { value: dayTex },
      nightTexture: { value: nightTex },
      sunDirection: { value: new THREE.Vector3(5, 3, 5).normalize() },
      fillDirection: { value: new THREE.Vector3(-5, -2, -5).normalize() },
      ambientColor: { value: new THREE.Color(0x7C3AED) },
      ambientIntensity: { value: 0.18 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D dayTexture;
      uniform sampler2D nightTexture;
      uniform vec3 sunDirection;
      uniform vec3 fillDirection;
      uniform vec3 ambientColor;
      uniform float ambientIntensity;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Lighting angle relative to the Sun and Fill light
        float dotNL = dot(normal, sunDirection);
        float dotFill = dot(normal, fillDirection);
        
        // Day/night blending factor
        float dayFactor = smoothstep(-0.1, 0.1, dotNL);
        
        vec4 dayColor = texture2D(dayTexture, vUv);
        vec4 nightColor = texture2D(nightTexture, vUv);
        
        // Specular highlight on oceans (tighter gloss shininess)
        vec3 halfVector = normalize(sunDirection + viewDir);
        float spec = pow(max(dot(normal, halfVector), 0.0), 64.0);
        
        // Simple specular mask (oceans are blue, continents are not)
        float specularMask = smoothstep(0.1, 0.5, dayColor.b - dayColor.r);
        vec4 specColor = vec4(1.0, 1.0, 1.0, 1.0) * spec * specularMask * 0.7;
        
        // Day final color (lighting + fill + specular)
        float diffuseLight = max(dotNL, 0.0) * 1.3;
        float fillLightVal = max(dotFill, 0.0) * 0.45;
        vec4 dayFinal = (dayColor * (diffuseLight + fillLightVal + 0.05)) + specColor;
        
        // Night final color (city lights boost)
        vec4 nightFinal = nightColor * 2.8;
        
        // Subtle violet ambient fill in shadows
        vec4 fillCol = vec4(ambientColor, 1.0) * ambientIntensity * (1.0 - dayFactor);
        
        gl_FragColor = mix(nightFinal, dayFinal, dayFactor) + fillCol;
      }
    `
  });

  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = 0.41; // Tilt Earth's axis by 23.5 degrees
  orbGroup.add(earthGroup);

  // Earth Globe Mesh (Increased size to 2.56)
  const earthGeo = new THREE.SphereGeometry(2.56, 64, 64);
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthGroup.add(earthMesh);

  // Cloud Layer (Increased size to 2.59)
  const cloudGeo = new THREE.SphereGeometry(2.59, 64, 64);
  const cloudMat = new THREE.MeshPhongMaterial({
    map: cloudsTex,
    transparent: true,
    opacity: 0.4,
    depthWrite: false
  });
  const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
  earthGroup.add(cloudMesh);

  // Atmosphere Glow Layer (Increased size to 2.63)
  const atmosphereGeo = new THREE.SphereGeometry(2.63, 64, 64);
  const atmosphereMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(max(0.7 - vNormal.z, 0.0), 2.5);
        gl_FragColor = vec4(0.6, 0.4, 1.0, 1.0) * intensity;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    transparent: true,
    depthWrite: false
  });
  const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  orbGroup.add(atmosphereMesh);

  // ── Particle Field ────────────────────────────────────────
  const particleCount = 1800;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const r = 5.0 + Math.random() * 14.0; // Pushed outer boundary so stars spawn outside 2.56 Earth
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = Math.random() * 1.5 + 0.5;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    color: 0xA78BFA,
    size: 0.025,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Grid plane (subtle depth reference) ───────────────────
  const gridGeo = new THREE.PlaneGeometry(40, 40, 40, 40);
  const gridMat = new THREE.MeshBasicMaterial({
    color: 0x1C2030,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const grid = new THREE.Mesh(gridGeo, gridMat);
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = -4;
  scene.add(grid);

  // ── Scroll state ──────────────────────────────────────────
  let scrollProgress = 0;
  let targetScrollProgress = 0;

  // Smooth scroll tracking
  const updateScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    targetScrollProgress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
  };
  window.addEventListener('scroll', updateScroll, { passive: true });

  // ── Mouse parallax ────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize ────────────────────────────────────────────────
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  // ── Animation loop ────────────────────────────────────────
  const clock = new THREE.Clock();

  const animate = () => {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Lerp scroll
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    // ── Earth Globe rotation (independent and infinite) ──────
    earthMesh.rotation.y = t * 0.12;
    cloudMesh.rotation.y = t * 0.15; // Clouds rotate slightly faster for dynamic effect

    // ── Update light directions in view space for shader ─────
    const worldSunPos = new THREE.Vector3(5, 3, 5);
    const viewSunDir = worldSunPos.clone().applyMatrix4(camera.matrixWorldInverse).normalize();
    earthMat.uniforms.sunDirection.value.copy(viewSunDir);

    const worldFillPos = new THREE.Vector3(-5, -2, -5);
    const viewFillDir = worldFillPos.clone().applyMatrix4(camera.matrixWorldInverse).normalize();
    earthMat.uniforms.fillDirection.value.copy(viewFillDir);

    // ── Orb group: scroll drives rotation + Z movement ──────
    orbGroup.rotation.y = t * 0.08 + scrollProgress * Math.PI * 2.5;
    orbGroup.rotation.x = scrollProgress * Math.PI * 0.8 + mouseY * 0.15;
    orbGroup.rotation.z = scrollProgress * Math.PI * 0.3;

    // Scale + Z shift on scroll
    const scaleFactor = 1 - scrollProgress * 0.3;
    orbGroup.scale.setScalar(scaleFactor);
    orbGroup.position.z = -scrollProgress * 3;
    orbGroup.position.y = scrollProgress * 1.5;

    // ── Camera: parallax + pull back on scroll ───────────────
    camera.position.x = mouseX * 0.4;
    camera.position.y = -mouseY * 0.25 + scrollProgress * 1.5;
    camera.position.z = 5 + scrollProgress * 4;
    camera.lookAt(0, scrollProgress * 1.2, 0);

    // ── Dot pivot rotates on the ring's plane ────────────────
    dotPivot.rotation.z = t * 0.5 + scrollProgress * Math.PI * 3;

    // ── Orbit ring opacity pulse ─────────────────────────────
    orbitRing.material.opacity = 0.35 + Math.sin(t * 1.2) * 0.1;

    // ── Particles drift ──────────────────────────────────────
    particles.rotation.y = t * 0.012 + mouseX * 0.08;
    particles.rotation.x = t * 0.006 + scrollProgress * 0.4;

    // ── Point light follows mouse ────────────────────────────
    pointLight.position.x = mouseX * 3;
    pointLight.position.y = -mouseY * 2;

    renderer.render(scene, camera);
  };

  animate();

  return { scene, camera, renderer };
}


