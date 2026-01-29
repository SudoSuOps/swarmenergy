// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('background-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting
const light = new THREE.DirectionalLight(0x00ff00, 1);
light.position.set(0, 0, 1);
scene.add(light);

// Particles
const particles = new THREE.Group();
const particleCount = 5000;
const particleGeometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({
  color: 0x00ff00,
  size: 0.02,
  blending: THREE.AdditiveBlending,
  transparent: true,
});

const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
particles.add(particleSystem);
scene.add(particles);

camera.position.z = 5;

// Animation
let scrollY = 0;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
});

function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.0005;
  particles.rotation.x = scrollY * 0.0005;
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
