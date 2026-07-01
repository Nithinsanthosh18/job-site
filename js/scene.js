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
  // Sun directional light (illuminates the day side)
  const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);

  // Violet ambient and point fill lights (illuminates the shadow/night side with a sci-fi tint)
  scene.add(new THREE.AmbientLight(0x7C3AED, 0.25));
  const pointLight = new THREE.PointLight(0x7C3AED, 2, 20);
  pointLight.position.set(0, 0, 3);
  scene.add(pointLight);

  // ── Orbital Ring Group ────────────────────────────────────
  const orbGroup = new THREE.Group();
  scene.add(orbGroup);

  // Main ring - multi-wrap (like the logo)
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xE8EAF0,
    transparent: true,
    opacity: 0.55,
  });

  // Outer ring
  const outerGeo = new THREE.TorusGeometry(1.8, 0.006, 8, 200);
  const outerRing = new THREE.Mesh(outerGeo, ringMat.clone());
  outerRing.material.opacity = 0.4;
  orbGroup.add(outerRing);

  // Middle ring - slightly tilted
  const middleGeo = new THREE.TorusGeometry(1.65, 0.008, 8, 200);
  const middleRing = new THREE.Mesh(middleGeo, ringMat.clone());
  middleRing.rotation.x = 0.15;
  middleRing.rotation.y = -0.1;
  orbGroup.add(middleRing);

  // Inner ring
  const innerGeo = new THREE.TorusGeometry(1.5, 0.006, 8, 200);
  const innerRing = new THREE.Mesh(innerGeo, ringMat.clone());
  innerRing.rotation.x = -0.1;
  innerRing.rotation.z = 0.08;
  orbGroup.add(innerRing);

  // Violet glow ring
  const glowGeo = new THREE.TorusGeometry(1.6, 0.014, 8, 200);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x7C3AED, transparent: true, opacity: 0.3 });
  const glowRing = new THREE.Mesh(glowGeo, glowMat);
  glowRing.rotation.x = 0.05;
  orbGroup.add(glowRing);

  // Orbital dot (the black dot on the logo)
  const dotGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const dotMat = new THREE.MeshBasicMaterial({ color: 0x7C3AED });
  const orbDot = new THREE.Mesh(dotGeo, dotMat);
  const dotPivot = new THREE.Object3D();
  dotPivot.add(orbDot);
  orbDot.position.set(1.72, 0, 0);
  scene.add(dotPivot);

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

  // Custom Shader Material for Day/Night blending + Ocean Specular reflections
  const earthMat = new THREE.ShaderMaterial({
    uniforms: {
      dayTexture: { value: dayTex },
      nightTexture: { value: nightTex },
      sunDirection: { value: new THREE.Vector3(5, 3, 5).normalize() },
      ambientColor: { value: new THREE.Color(0x7C3AED) },
      ambientIntensity: { value: 0.15 }
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
      uniform vec3 ambientColor;
      uniform float ambientIntensity;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Lighting angle relative to the Sun
        float dotNL = dot(normal, sunDirection);
        
        // Day/night blending factor
        float dayFactor = smoothstep(-0.15, 0.15, dotNL);
        
        vec4 dayColor = texture2D(dayTexture, vUv);
        vec4 nightColor = texture2D(nightTexture, vUv);
        
        // Specular highlight on oceans
        vec3 halfVector = normalize(sunDirection + viewDir);
        float spec = pow(max(dot(normal, halfVector), 0.0), 32.0);
        
        // Simple specular mask (oceans are blue, continents are not)
        float specularMask = smoothstep(0.1, 0.5, dayColor.b - dayColor.r);
        vec4 specColor = vec4(1.0, 1.0, 1.0, 1.0) * spec * specularMask * 0.45;
        
        // Day final color (lighting + specular)
        float diffuseLight = max(dotNL, 0.0);
        vec4 dayFinal = (dayColor * (diffuseLight * 1.0 + 0.05)) + specColor;
        
        // Night final color (city lights boost)
        vec4 nightFinal = nightColor * 2.0;
        
        // Subtle violet ambient fill in shadows
        vec4 fillCol = vec4(ambientColor, 1.0) * ambientIntensity * (1.0 - dayFactor);
        
        gl_FragColor = mix(nightFinal, dayFinal, dayFactor) + fillCol;
      }
    `
  });

  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = 0.41; // Tilt Earth's axis by 23.5 degrees
  orbGroup.add(earthGroup);

  // Earth Globe Mesh
  const earthGeo = new THREE.SphereGeometry(1.0, 64, 64);
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthGroup.add(earthMesh);

  // Cloud Layer (slightly larger, transparent)
  const cloudGeo = new THREE.SphereGeometry(1.015, 64, 64);
  const cloudMat = new THREE.MeshPhongMaterial({
    map: cloudsTex,
    transparent: true,
    opacity: 0.4,
    depthWrite: false
  });
  const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
  earthGroup.add(cloudMesh);

  // Atmosphere Glow Layer (using Fresnel Shader)
  const atmosphereGeo = new THREE.SphereGeometry(1.04, 64, 64);
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
    const r = 3 + Math.random() * 14;
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

    // ── Update Sun direction in view space for shader ────────
    const worldSunPos = new THREE.Vector3(5, 3, 5);
    const viewSunDir = worldSunPos.clone().applyMatrix4(camera.matrixWorldInverse).normalize();
    earthMat.uniforms.sunDirection.value.copy(viewSunDir);

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

    // ── Dot pivot rotates with time ──────────────────────────
    dotPivot.rotation.y = t * 0.5 + scrollProgress * Math.PI * 3;
    dotPivot.rotation.x = t * 0.12;

    // ── Glow ring pulse ──────────────────────────────────────
    glowRing.material.opacity = 0.15 + Math.sin(t * 1.2) * 0.1;

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

