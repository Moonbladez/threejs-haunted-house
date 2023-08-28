import { GUI } from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

THREE.ColorManagement.enabled = false;

const gui = new GUI();

const canvas = document.querySelector("canvas") as HTMLCanvasElement;

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

//Objects
const house = new THREE.Group();
scene.add(house);

/// Walls
const walls = new THREE.Mesh(new THREE.BoxGeometry(4, 2.5, 4), new THREE.MeshStandardMaterial({ color: "#ac8e82" }));
walls.position.y = 1.25;
house.add(walls);

/// Roof
const roof = new THREE.Mesh(new THREE.ConeGeometry(3.5, 1, 4), new THREE.MeshStandardMaterial({ color: "#b35f45" }));
roof.position.y = 2.5 + 0.5;
roof.rotateY(Math.PI * 0.25);
house.add(roof);

/// Door
const door = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshStandardMaterial({ color: "#aa7b7b" }));
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

/// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const createBush = (
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  positionX: number,
  positionY: number,
  positionZ: number
): void => {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.scale.set(scaleX, scaleY, scaleZ);
  bush.position.set(positionX, positionY, positionZ);
  house.add(bush);
};

createBush(0.5, 0.5, 0.5, 0.8, 0.2, 2.2);
createBush(0.25, 0.25, 0.25, 1.4, 0.1, 2.1);
createBush(0.4, 0.4, 0.4, -0.8, 0.1, 2.2);
createBush(0.15, 0.15, 0.15, -1, 0.05, 2.6);

// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: "#a9c388" }));
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight("#ffffff", 0.5);
moonLight.position.set(4, 5, -2);

const createLightControls = (light: THREE.Light, gui: GUI) => {
  gui.add(light, "intensity").min(0).max(1).step(0.001);

  if (light! instanceof THREE.DirectionalLight) {
    gui.add(light.position, "x").min(-5).max(5).step(0.001);
    gui.add(light.position, "y").min(-5).max(5).step(0.001);
    gui.add(light.position, "z").min(-5).max(5).step(0.001);
  }
};
const lightFolder = gui.addFolder("Lights");
createLightControls(ambientLight, lightFolder.addFolder("Ambient Light"));
createLightControls(moonLight, lightFolder.addFolder("Moon Light"));
scene.add(moonLight);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
