/**
 * ORBIS — Three.js WebGL Scene
 * Scroll-driven orbital ring with particle field
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

  // ── Ambient light ─────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x7C3AED, 0.3));
  const pointLight = new THREE.PointLight(0x7C3AED, 2, 20);
  pointLight.position.set(0, 0, 3);
  scene.add(pointLight);

  // ── Lights ────────────────────────────────────────────────
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight.position.set(5, 3, 5);
  scene.add(dirLight);

  // ── Orbital Ring Group (holds Earth and Satellites) ────────
  const orbGroup = new THREE.Group();
  scene.add(orbGroup);
  // ── Procedural Earth Texture ─────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Fill ocean background
  ctx.fillStyle = '#060814';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Paint land masses procedurally
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      // Spherical projection coordinates to avoid stretching
      const theta = (x / canvas.width) * 2.0 * Math.PI;
      const phi = (y / canvas.height) * Math.PI;
      
      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.sin(phi) * Math.sin(theta);
      const nz = Math.cos(phi);

      // Wave-sum noise to generate continent maps
      let val = 0;
      val += Math.sin(nx * 2.2) * Math.cos(ny * 2.2) * Math.sin(nz * 2.2) * 0.5;
      val += Math.sin(nx * 4.3 + 1.0) * Math.sin(ny * 4.1) * Math.cos(nz * 4.5) * 0.25;
      val += Math.cos(nx * 8.7) * Math.cos(ny * 8.1 - 2.0) * Math.sin(nz * 8.3) * 0.12;
      val += Math.sin(nx * 16.4) * Math.cos(nz * 16.1) * 0.06;
      const h = (val + 1) / 2;

      const idx = (y * canvas.width + x) * 4;
      if (h > 0.47) {
        // Land: glowing neon violet
        data[idx]     = 110 + Math.floor(h * 30);
        data[idx + 1] = 60 + Math.floor(h * 30);
        data[idx + 2] = 230 + Math.floor(h * 25);
      } else if (h > 0.45) {
        // Shorelines: vibrant violet highlight
        data[idx]     = 167;
        data[idx + 1] = 139;
        data[idx + 2] = 250;
      } else {
        // Ocean: dark blue-black with subtle lat/long grid lines
        if (x % 64 === 0 || y % 64 === 0) {
          data[idx]     = 24;
          data[idx + 1] = 16;
          data[idx + 2] = 65;
        } else {
          data[idx]     = 6;
          data[idx + 1] = 8;
          data[idx + 2] = 20;
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const earthTexture = new THREE.CanvasTexture(canvas);

  // ── Earth Globe Group ─────────────────────────────────────
  const earthGroup = new THREE.Group();
  orbGroup.add(earthGroup);

  // Core Earth Sphere (textured)
  const earthGeo = new THREE.SphereGeometry(1.3, 32, 32);
  const earthMat = new THREE.MeshPhongMaterial({
    map: earthTexture,
    emissive: 0x7c3aed,
    emissiveMap: earthTexture,
    emissiveIntensity: 0.75,
    shininess: 25,
  });
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthGroup.add(earthMesh);

  // Soft atmospheric outer glow shell
  const atmosGeo = new THREE.SphereGeometry(1.36, 32, 32);
  const atmosMat = new THREE.MeshBasicMaterial({
    color: 0x7C3AED,
    transparent: true,
    opacity: 0.14,
    side: THREE.BackSide,
  });
  const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
  earthGroup.add(atmosMesh);

  // ── 4 Satellites & Orbit Paths ────────────────────────────
  function createSatelliteMesh() {
    const satGroup = new THREE.Group();
    
    // Main cylindrical body (metallic silver)
    const bodyGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.16, 8);
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      shininess: 100,
      specular: 0xffffff,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI / 2; // Lie flat along movement
    satGroup.add(body);

    // Instrument box (gold foil)
    const goldGeo = new THREE.BoxGeometry(0.065, 0.065, 0.065);
    const goldMat = new THREE.MeshPhongMaterial({
      color: 0xd4af37, // gold
      shininess: 80,
    });
    const goldBox = new THREE.Mesh(goldGeo, goldMat);
    goldBox.position.set(0, 0, 0.06);
    satGroup.add(goldBox);

    // Parabolic dish antenna pointing towards Earth (downward/inward)
    const dishGeo = new THREE.SphereGeometry(0.04, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const dishMat = new THREE.MeshPhongMaterial({ color: 0xdddddd, side: THREE.DoubleSide });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, -0.07, 0); // pointing inward
    dish.rotation.x = Math.PI / 2;
    satGroup.add(dish);

    // Solar panels (dark blue cell arrays)
    const panelGeo = new THREE.BoxGeometry(0.24, 0.005, 0.08);
    const panelMat = new THREE.MeshPhongMaterial({
      color: 0x1d4ed8, // dark blue
      shininess: 90,
      emissive: 0x0f172a,
    });
    
    const panelL = new THREE.Mesh(panelGeo, panelMat);
    panelL.position.set(0.15, 0, 0);
    satGroup.add(panelL);

    const panelR = panelL.clone();
    panelR.position.set(-0.15, 0, 0);
    satGroup.add(panelR);

    return satGroup;
  }

  function createOrbitPathMesh(radius, tiltX, tiltZ) {
    const orbitGeo = new THREE.TorusGeometry(radius, 0.003, 8, 120);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x7C3AED,
      transparent: true,
      opacity: 0.12,
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = tiltX;
    orbitMesh.rotation.z = tiltZ;
    return orbitMesh;
  }

  const satellites = [];
  const satData = [
    { radius: 1.8, tiltX: 0.5, tiltZ: 0.3, speed: 0.7 },
    { radius: 2.1, tiltX: -0.4, tiltZ: 0.6, speed: -0.5 },
    { radius: 2.4, tiltX: 1.1, tiltZ: -0.5, speed: 0.4 },
    { radius: 2.7, tiltX: -0.8, tiltZ: -0.9, speed: -0.3 }
  ];

  satData.forEach((data) => {
    // Torus orbit path
    const orbitPath = createOrbitPathMesh(data.radius, data.tiltX, data.tiltZ);
    orbGroup.add(orbitPath);

    // Tilt container for rotator
    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.x = data.tiltX;
    tiltGroup.rotation.z = data.tiltZ;
    orbGroup.add(tiltGroup);

    // Rotator group (rotates around Y)
    const rotator = new THREE.Group();
    tiltGroup.add(rotator);

    // Satellite mesh
    const satMesh = createSatelliteMesh();
    satMesh.position.x = data.radius;
    satMesh.rotation.y = Math.PI / 2; // Face direction of motion
    rotator.add(satMesh);

    satellites.push({ rotator, speed: data.speed });
  });

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

    // ── Rotate Earth slowly ──────────────────────────────────
    earthGroup.rotation.y = t * 0.15;

    // ── Rotate Satellites in their orbits ────────────────────
    satellites.forEach((sat) => {
      sat.rotator.rotation.y = t * sat.speed;
    });

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
