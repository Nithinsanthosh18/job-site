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

  // ── Earth Globe Group ─────────────────────────────────────
  const earthGroup = new THREE.Group();
  orbGroup.add(earthGroup);

  // Core solid sphere representing Earth
  const earthGeo = new THREE.SphereGeometry(1.3, 32, 32);
  const earthMat = new THREE.MeshPhongMaterial({
    color: 0x110d29,
    emissive: 0x070514,
    transparent: true,
    opacity: 0.8,
    shininess: 15,
  });
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthGroup.add(earthMesh);

  // Grid wireframe overlay
  const gridGeo = new THREE.SphereGeometry(1.31, 24, 24);
  const gridMat = new THREE.MeshBasicMaterial({
    color: 0x7C3AED,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const earthGrid = new THREE.Mesh(gridGeo, gridMat);
  earthGroup.add(earthGrid);

  // Holographic point-cloud continents
  const globePointsCount = 800;
  const globePositions = new Float32Array(globePointsCount * 3);
  for (let i = 0; i < globePointsCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 1.32;

    globePositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    globePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    globePositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const globePointsGeo = new THREE.BufferGeometry();
  globePointsGeo.setAttribute('position', new THREE.BufferAttribute(globePositions, 3));
  const globePointsMat = new THREE.PointsMaterial({
    color: 0xA78BFA,
    size: 0.035,
    transparent: true,
    opacity: 0.75,
  });
  const globePoints = new THREE.Points(globePointsGeo, globePointsMat);
  earthGroup.add(globePoints);

  // ── 4 Satellites & Orbit Paths ────────────────────────────
  function createSatelliteMesh() {
    const satGroup = new THREE.Group();
    
    // Body (violet glow box)
    const bodyGeo = new THREE.BoxGeometry(0.12, 0.08, 0.08);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0xA78BFA, emissive: 0x5b21b6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    satGroup.add(body);

    // Solar panels
    const panelGeo = new THREE.BoxGeometry(0.015, 0.04, 0.2);
    const panelMat = new THREE.MeshBasicMaterial({ color: 0xE8EAF0, transparent: true, opacity: 0.7 });
    
    const panelL = new THREE.Mesh(panelGeo, panelMat);
    panelL.position.set(0.07, 0, 0);
    satGroup.add(panelL);

    const panelR = panelL.clone();
    panelR.position.set(-0.07, 0, 0);
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
