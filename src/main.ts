import { GUI } from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

THREE.ColorManagement.enabled = false;

const gui = new GUI();
const canvas = document.querySelector("canvas") as HTMLCanvasElement;

const graveNumber = 25;

const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

// Textures
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load("/textures/bricks/ambientOcclusion.jpg");
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load("/textures/bricks/roughness.jpg");

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load("/textures/grass/ambientOcclusion.jpg");
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load("/textures/grass/roughness.jpg");

const grassTextures: THREE.Texture[] = [
  grassColorTexture,
  grassAmbientOcclusionTexture,
  grassNormalTexture,
  grassRoughnessTexture,
];
grassTextures.forEach((texture: THREE.Texture) => {
  texture.repeat.set(8, 8);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
});

//Objects
const house = new THREE.Group();
scene.add(house);

/// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.position.y = 1.25;
house.add(walls);

/// Roof
const roof = new THREE.Mesh(new THREE.ConeGeometry(3.5, 1, 4), new THREE.MeshStandardMaterial({ color: "#b35f45" }));
roof.position.y = 2.5 + 0.5;
roof.rotateY(Math.PI * 0.25);
house.add(roof);

/// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
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
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

// Graves
const graves = new THREE.Group();
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

const createGrave = (x: number, z: number): THREE.Mesh => {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  grave.position.set(x, 0.3, z);

  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.6;

  return grave;
};

for (let i = 0; i < graveNumber; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3.5 + Math.random() * 6;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const grave = createGrave(x, z);
  graves.add(grave);
}
scene.add(graves);

//lights
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
scene.add(moonLight);

const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

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
createLightControls(doorLight, lightFolder.addFolder("Door Light"));

// Ghosts
const gostsGroup = new THREE.Group();
scene.add(gostsGroup);

const ghostLights: THREE.PointLight[] = [];

const createGhostLight = (color: string, intensity: number, distance: number) => {
  const ghostLight = new THREE.PointLight(color, intensity, distance);
  ghostLights.push(ghostLight);
  gostsGroup.add(ghostLight);

  return ghostLight;
};
const ghost1 = createGhostLight("#ff00ff", 2, 3);
const ghost2 = createGhostLight("#00ffff", 2, 3);
const ghost3 = createGhostLight("#ffff00", 2, 3);

const updateGhostPosition = (
  ghost: THREE.PointLight,
  angleModifier: number,
  radiusModifier: number,
  yModifier: number
): void => {
  const elapsedTime = clock.getElapsedTime();
  const angle = elapsedTime * angleModifier;
  ghost.position.x = Math.cos(angle) * radiusModifier;
  ghost.position.z = Math.sin(angle) * radiusModifier;
  ghost.position.y = Math.sin(elapsedTime * yModifier);
};
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
renderer.setClearColor("#262837");
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);

  // Ghosts
  updateGhostPosition(ghost1, 0.2, 4, 2);
  updateGhostPosition(ghost2, -0.1, 6, 3);
  updateGhostPosition(ghost3, 0.2, 8 + Math.sin(elapsedTime * 0.32), 4);

  window.requestAnimationFrame(tick);
};

tick();
