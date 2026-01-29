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
const particleCount = 5000;
const particles = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleVelocities = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 2 + Math.random() * 2;
    particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i3 + 2] = radius * Math.cos(phi);

    particleVelocities[i3] = 0;
    particleVelocities[i3 + 1] = 0;
    particleVelocities[i3 + 2] = 0;
}

particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({
    color: 0x00ff00,
    size: 0.04,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8,
});
const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

camera.position.z = 5;

// Animation
const clock = new THREE.Clock();

function animate() {
    const delta = clock.getDelta();
    const positions = particles.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // Swirl effect
        const swirlAngle = Math.atan2(y, x);
        const swirlRadius = Math.sqrt(x * x + y * y);
        const swirlSpeed = 0.5;
        positions[i3] = swirlRadius * Math.cos(swirlAngle + swirlSpeed * delta);
        positions[i3 + 1] = swirlRadius * Math.sin(swirlAngle + swirlSpeed * delta);

        // Add some noise for a more "quantum" feel
        positions[i3] += (Math.random() - 0.5) * 0.01;
        positions[i3 + 1] += (Math.random() - 0.5) * 0.01;
        positions[i3 + 2] += (Math.random() - 0.5) * 0.01;
    }

    particles.attributes.position.needsUpdate = true;
    particleSystem.rotation.y += 0.0005;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Contact form submission
const form = document.getElementById('contact-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const webhookUrl = 'https://discord.com/api/webhooks/1466459133321675026/H07LFPt5qnHLIXcTs8dvhsDf0vPs0H_w840Jq9DzHKwN6D1NVtZLqN1qc-XAy6RydxDc';

    const payload = {
        content: `**New Contact Form Submission**\n\n**Name:** ${name}\n**Email:** ${email}\n**Message:**\n${message}`
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(response => {
        if (response.ok) {
            alert('Your message has been sent!');
            form.reset();
        } else {
            alert('There was an error sending your message. Please try again later.');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again later.');
    });
});
