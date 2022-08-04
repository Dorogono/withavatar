import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Canvas
const canvas = document.querySelector("canvas.webgl");
const btn = document.querySelector("button");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

/**
 * Loader
 */
function exportGLTF(input) {
  const gltfExporter = new GLTFExporter();

  const options = {
    trs: false,
    onlyVisible: true,
    truncateDrawRange: true,
    binary: true,
    maxTextureSize: 4096,
  };
  gltfExporter.parse(
    input,
    function (result) {
      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, "scene.glb");
      } else {
        const output = JSON.stringify(result, null, 2);
        console.log(output);
        saveString(output, "scene.gltf");
      }
    },
    function (error) {
      console.log("An error happened during parsing", error);
    },
    options
  );
}

const link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link); // Firefox workaround, see #6594

function save(blob, filename) {
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  // URL.revokeObjectURL( url ); breaks Firefox...
}

function saveString(text, filename) {
  save(new Blob([text], { type: "text/plain" }), filename);
}

function saveArrayBuffer(buffer, filename) {
  save(new Blob([buffer], { type: "application/octet-stream" }), filename);
}

/**
 * Model
 */
let model;
const loader = new FBXLoader();
loader.load("hood.fbx", (obj) => {
  obj.scale.setScalar(0.04);
  model = obj;
  scene.add(obj);
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(-5, 5, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  40000
);
camera.position.set(0, 8, 3);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.75, 0);

const tick = () => {
  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

btn.addEventListener("click", () => {
  exportGLTF(model);
});
