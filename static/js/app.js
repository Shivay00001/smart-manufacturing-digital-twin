
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 2;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Machine Model (Simplified simulation of a CNC machine)
const machineGroup = new THREE.Group();

const baseGeometry = new THREE.BoxGeometry(2, 0.5, 2);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
machineGroup.add(base);

const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1.5);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x336699 });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = 1.25;
machineGroup.add(body);

const statusLightGeometry = new THREE.SphereGeometry(0.2);
const statusLightMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const statusLight = new THREE.Mesh(statusLightGeometry, statusLightMaterial);
statusLight.position.set(0, 2.5, 0);
machineGroup.add(statusLight);

scene.add(machineGroup);

// WebSocket for Data
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // Update UI
    document.getElementById('status').innerText = data.status;
    document.getElementById('temp').innerText = `${data.temperature} °C`;
    document.getElementById('vibration').innerText = `${data.vibration} mm/s`;

    // Update 3D visualization
    if (data.status === 'OPERATIONAL') {
        statusLight.material.color.setHex(0x00ff00);
    } else {
        statusLight.material.color.setHex(0xff0000);
    }

    // Demonstrate vibration
    machineGroup.position.x = (Math.random() - 0.5) * (data.vibration / 50);
};

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    machineGroup.rotation.y += 0.005;

    renderer.render(scene, camera);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
