import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111827);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Factory Floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1f2937 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Mock Machine (Motor)
const motorGeom = new THREE.BoxGeometry(1, 1, 2);
const motorMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
const motor = new THREE.Mesh(motorGeom, motorMat);
motor.position.set(-2, 0.5, 0);
scene.add(motor);

// Mock Machine (Conveyor)
const conveyorGeom = new THREE.BoxGeometry(8, 0.2, 1.5);
const conveyorMat = new THREE.MeshStandardMaterial({ color: 0x4b5563 });
const conveyor = new THREE.Mesh(conveyorGeom, conveyorMat);
conveyor.position.set(2, 0.1, 0);
scene.add(conveyor);

camera.position.set(5, 5, 8);
camera.lookAt(0, 0, 0);

// WebSocket for Data
const ws = new WebSocket(`ws://${window.location.hostname}:8000/ws/telemetry`);
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Real-time visual feedback (e.g., vibration pulse)
    if (data.motor_01) {
        motor.scale.y = 1 + data.motor_01.speed / 12000;
        motor.material.color.setHex(data.motor_01.temp > 46 ? 0xef4444 : 0x3b82f6);
    }
};

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
