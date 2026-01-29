// Initialize Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('energy-background'),
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Create the Energy Grid
const GRID_SIZE = 40;
const GRID_DIVISIONS = 20;
const grid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, 0x30C59D, 0x58A6FF);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

// Particle System for Nodes
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 2000;
const posArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * GRID_SIZE;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x30C59D,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8
});

const particleMesh = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particleMesh);

camera.position.z = 10;
camera.position.y = 2;
camera.rotation.x = -0.2;

// Mouse Interaction
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation Loop
const clock = new THREE.Clock();
function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Animate grid and particles
    grid.rotation.y = elapsedTime * 0.05;
    particleMesh.rotation.y = elapsedTime * 0.08;
    
    // Animate camera to mouse position
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Note: The original contact form logic has been removed as it's not present in the new HTML.
// If a contact form is added back, that logic should be re-integrated here.