/**
 * ORBIS — Projects 3D Orbital Scene
 * Scroll-driven revolving project cards using Three.js and CSS3DRenderer
 */

import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

// ── Configuration ───────────────────────────────────────────
const CARD_RADIUS = 550; // Radius of the orbital cylinder
let isTransitioning = false;
let isIntroComplete = false;
let scrollTriggerInstance = null;

// Initialize components
const webglCanvas = document.getElementById('projects-webgl');
const css3dContainer = document.getElementById('projects-css3d');

// ── Three.js Setup ──────────────────────────────────────────
const scene = new THREE.Scene();
const cssScene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 5000);
// Camera starts at the center of the ring, looking slightly forward
camera.position.set(0, 0, 0);

// WebGL Renderer (for stars background)
const webglRenderer = new THREE.WebGLRenderer({ canvas: webglCanvas, antialias: true, alpha: true });
webglRenderer.setSize(window.innerWidth, window.innerHeight);
webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// CSS3D Renderer (for HTML cards)
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.left = '0';
css3dContainer.appendChild(cssRenderer.domElement);

// ── Starfield Background (WebGL) ──────────────────────────
const starCount = 1200;
const starGeo = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  // Disperse stars in a shell around the scene
  const u = Math.random();
  const v = Math.random();
  const theta = u * 2.0 * Math.PI;
  const phi = Math.acos(2.0 * v - 1.0);
  const r = 1500 + Math.random() * 1500; // far away

  starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  starPositions[i * 3 + 2] = r * Math.cos(phi);
}

starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({
  color: 0x907ef7,
  size: 2.5,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.8
});

const starField = new THREE.Points(starGeo, starMat);
scene.add(starField);

// ── CSS3D Card Group ────────────────────────────────────────
const cardGroup = new THREE.Group();
cssScene.add(cardGroup);

// Get cards from HTML
const cardElements = Array.from(document.querySelectorAll('#project-cards-data .project-card-3d'));
const cardsCount = cardElements.length;
const cardObjects = [];

cardElements.forEach((cardEl, index) => {
  // Get container
  const id = cardEl.dataset.id;
  
  // Wrap HTML element in CSS3DObject
  const cssObj = new CSS3DObject(cardEl);
  
  // Assign random distant starting position (for fly-in entrance)
  cssObj.position.set(
    (Math.random() - 0.5) * 3500,
    (Math.random() - 0.5) * 3500,
    (Math.random() - 0.5) * 2000 - 1500
  );
  cssObj.rotation.set(
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    0
  );

  // Save metadata
  cssObj.userData = {
    id: id,
    index: index,
    // Calculate final target positions on the cylinder
    targetTheta: (index / cardsCount) * Math.PI * 2,
    targetY: 0, // Set height to 0 to keep aligned with static camera
  };

  cardGroup.add(cssObj);
  cardObjects.push(cssObj);
});

// Move the cards container elements out of the hidden div so Three.js can render them
const hiddenContainer = document.getElementById('project-cards-data');
if (hiddenContainer) {
  hiddenContainer.style.display = 'block';
  hiddenContainer.style.position = 'absolute';
  hiddenContainer.style.top = '-9999px';
  hiddenContainer.style.left = '-9999px';
}

// ── Entrance Animation ─────────────────────────────────────
function playEntranceAnimation() {
  const introTl = gsap.timeline({
    onComplete: () => {
      isIntroComplete = true;
      // Initialize ScrollTrigger after intro finishes
      initScrollInteraction();
    }
  });

  // Camera looks forward initially
  camera.lookAt(0, 0, -100);

  // 1. Cards fly into place around the camera
  cardObjects.forEach((card, i) => {
    const theta = card.userData.targetTheta;
    const targetX = CARD_RADIUS * Math.sin(theta);
    const targetZ = CARD_RADIUS * Math.cos(theta);
    const targetY = card.userData.targetY;

    // Calculate rotation to face center (where camera is static)
    // Front faces +z, so looking towards (0, targetY, 0)
    const dummy = new THREE.Object3D();
    dummy.position.set(targetX, targetY, targetZ);
    dummy.lookAt(0, targetY, 0);

    introTl.to(card.position, {
      x: targetX,
      y: targetY,
      z: targetZ,
      duration: 2.4,
      ease: 'power4.out',
    }, i * 0.15); // staggered fly-in

    introTl.to(card.rotation, {
      x: dummy.rotation.x,
      y: dummy.rotation.y,
      z: dummy.rotation.z,
      duration: 2.4,
      ease: 'power4.out',
    }, i * 0.15);
  });

  // Camera remains static at (0, 0, 0) in the center. No pullback is animated!
}

// ── Scroll Interaction (Infinite horizontal scrolling via wheel & touch drag) ──
let targetRotationY = 0;
let currentRotationY = 0;

function initScrollInteraction() {
  // Capture mouse wheel scroll for infinite horizontal revolution
  window.addEventListener('wheel', (e) => {
    if (isTransitioning) return;
    targetRotationY += e.deltaY * 0.0018;
  }, { passive: true });

  // Capture touch swipe dragging for mobile devices
  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => {
    if (isTransitioning) return;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isTransitioning) return;
    const touchX = e.touches[0].clientX;
    const diffX = touchX - touchStartX;
    targetRotationY -= diffX * 0.004;
    touchStartX = touchX;
  }, { passive: true });
}

// ── Mouse Parallax ──────────────────────────────────────────
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  if (isTransitioning) return;
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ── Click to Explore Card Zoom ──────────────────────────────
function exploreProject(cardId, clickedCard) {
  if (isTransitioning) return;
  isTransitioning = true;

  // Kill ScrollTrigger (fallback if used elsewhere)
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
  }

  // Hide headers
  gsap.to('.projects-overlay-header', {
    opacity: 0,
    y: -20,
    duration: 0.5
  });

  // Calculate clicked card world coordinates
  const cardWorldPos = new THREE.Vector3();
  clickedCard.getWorldPosition(cardWorldPos);

  // Vector pointing from card to center (inward normal)
  const normal = new THREE.Vector3(-clickedCard.position.x, 0, -clickedCard.position.z).normalize();
  
  // Target position for camera to be directly in front of the card face (approx 180 units away)
  const targetCamPos = new THREE.Vector3().copy(cardWorldPos).addScaledVector(normal, 180);

  // Force all other cards to fade or drop down out of view
  cardObjects.forEach((card) => {
    if (card !== clickedCard) {
      gsap.to(card.position, {
        y: card.position.y - 1200,
        duration: 1.2,
        ease: 'power3.in'
      });
    }
  });

  // Zoom camera into target card
  gsap.to(camera.position, {
    x: targetCamPos.x,
    y: cardWorldPos.y, // align height
    z: targetCamPos.z,
    duration: 1.4,
    ease: 'power3.inOut',
    onUpdate: () => {
      camera.lookAt(cardWorldPos);
    }
  });



  // Activate fullscreen fade transition overlay
  setTimeout(() => {
    document.getElementById('transition-overlay').classList.add('active');
  }, 900);

  // Redirect to detail page relatively
  setTimeout(() => {
    window.location.href = `project-detail.html?id=${cardId}`;
  }, 1500);
}

// Attach click listeners to cards' explore buttons
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('btn-card-explore')) {
    e.preventDefault();
    const id = e.target.dataset.id;
    const cardObj = cardObjects.find(c => c.userData.id === id);
    if (cardObj) {
      exploreProject(id, cardObj);
    }
  }
});

// Also trigger if user clicks on the card container directly
cardElements.forEach(cardEl => {
  cardEl.addEventListener('click', (e) => {
    // Avoid double trigger if clicking explore button
    if (e.target.classList.contains('btn-card-explore')) return;
    
    const id = cardEl.dataset.id;
    const cardObj = cardObjects.find(c => c.userData.id === id);
    if (cardObj) {
      exploreProject(id, cardObj);
    }
  });
});

// ── Window Resize ───────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  webglRenderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
});

// ── Render Loop ─────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  // Slow orbital background stars rotation
  starField.rotation.y = time * 0.015;
  starField.rotation.x = time * 0.005;

  if (isIntroComplete && !isTransitioning) {
    // Smooth lerp of the revolving cards group rotation
    currentRotationY += (targetRotationY - currentRotationY) * 0.08;
    cardGroup.rotation.y = currentRotationY;

    // Micro rotation on camera horizontally based on mouse (vertical remains 0)
    camera.rotation.y += (-mouseX * 0.25 - camera.rotation.y) * 0.05;
    camera.rotation.x = 0; // Value 0 for the vertical direction movement
  }

  // Render both scenes
  webglRenderer.render(scene, camera);
  cssRenderer.render(cssScene, camera);
}

// ── Start ───────────────────────────────────────────────────
// Short timeout to ensure page content loads fully before flying in
setTimeout(() => {
  playEntranceAnimation();
  animate();
  
  // Initialize cursors in window if defined
  if (window.setupCursorHover) {
    window.setupCursorHover();
  }
}, 300);
