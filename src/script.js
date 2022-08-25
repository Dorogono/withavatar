import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { VRMLoader } from "three/examples/jsm/loaders/VRMLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Pane } from "tweakpane";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { unzipSunc } from "three/examples/jsm/libs/fflate.module";
import { MeshPhongMaterial } from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");
const btn = document.querySelector("button");
const pane = new Pane();

const sizes = {
  width: canvas.offsetWidth,
  height: canvas.offsetHeight,
};

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

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
camera.position.set(0, 0, 120);
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
 * JSZip
 */
let name, blobs;
const input = document.getElementById("uploadInput");
input.addEventListener("change", (evt) => {
  function handleFile(f) {
    // console.log("title : ", f.name);

    JSZip.loadAsync(f).then((zip) => {
      zip.forEach((filename) => {
        const file = zip.file(filename);
        file
          .async("arraybuffer")
          .then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/octet-stream",
            });
            blobs = URL.createObjectURL(blob);
          })
          .then(() => {
            new GLTFLoader().load(blobs, (gltf) => {
              const obj = gltf.scene;
              obj.traverse((child) => {
                if (child.isMesh) {
                  child.material.morphtargets = true;
                  if (child.morphTargetInfluences) {
                    morphtargets = child.morphTargetInfluences;
                  }
                  if (child.morphTargetDictionary) {
                    morphNames = child.morphTargetDictionary;
                  }
                  // child.material = new THREE.MeshBasicMaterial({
                  //   color: 0xff0000,
                  //   wireframe: true,
                  // });
                }
                if (child.name === "Armature") {
                  // console.log(child);
                }
              });
              model = obj;
              model.position.set(-15, -44, 0);
              // model.position.set(0, -5, 0);
              const mesh = gltf.scene.children[0];
              // mesh.scale.setScalar(0.02);
              // tc.attach(model);
              scene.add(gltf.scene);
            });
          });
      });
    });
  }

  const files = evt.target.files;
  for (let i = 0; i < files.length; i++) {
    handleFile(files[i]);
  }
});

/**
 * Model
 */
let model,
  morphtargets = [],
  morphNames = {};
let position;
const size = 0.1;

const box1 = new THREE.Mesh(
  new THREE.BoxGeometry(size, size, size),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const box2 = new THREE.Mesh(
  new THREE.BoxGeometry(size, size, size),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const tc = new TransformControls(camera, renderer.domElement);
// const ktx2Loader = new KTX2Loader()
//   .setTranscoderPath("/basis/")
//   .detectSupport(renderer);

// new GLTFLoader()
//   .setKTX2Loader(ktx2Loader)
//   .setMeshoptDecoder(MeshoptDecoder)
//   .load("scene.glb", (gltf) => {
//     console.time("loadGLTF");
//     const obj = gltf.scene;

//     obj.traverse((child) => {
//       if (child.isMesh) {
//         child.material.morphtargets = true;
//         if (child.morphTargetInfluences) {
//           morphtargets = child.morphTargetInfluences;
//         }
//         if (child.morphTargetDictionary) {
//           morphNames = child.morphTargetDictionary;
//         }
//         // child.material = new THREE.MeshBasicMaterial({
//         //   color: 0xff0000,
//         //   wireframe: true,
//         // });
//       }
//       if (child.name === "Armature") {
//         console.log(child);
//       }
//     });
//     model = obj;
//     model.position.set(-15, -44, 0);
//     // model.position.set(0, -5, 0);
//     const mesh = gltf.scene.children[0];
//     // mesh.scale.setScalar(0.02);
//     // tc.attach(model);
//     scene.add(model);
//     console.timeEnd("loadGLTF");
//   });

// const loader = new FBXLoader();
// loader.load("man.fbx", (obj) => {
//   obj.traverse((child) => {
//     if (child.isMesh) {
//       console.log(child.name, child.material.name);
//       child.material.morphtargets = true;
//       if (child.morphTargetInfluences) {
//         morphtargets = child.morphTargetInfluences;
//       }
//       if (child.morphTargetDictionary) {
//         morphNames = child.morphTargetDictionary;
//       }
//       // child.material = new THREE.MeshBasicMaterial({
//       //   color: 0xff0000,
//       //   wireframe: true,
//       // });
//     }
//     if (child.name === "Armature") {
//       // console.log(child);
//     }
//     if (child.type === "SkinnedMesh") {
//       position = child.position;
//     }
//   });
//   // const texture = new THREE.TextureLoader().load("guradino.png");
//   // obj.children[0].material = new THREE.MeshStandardMaterial({
//   // map: texture,
//   // });
//   // console.log(obj);
//   // obj.scale.setScalar(0.01);
//   model = obj;
//   scene.add(obj);
//   // scene.add(new THREE.SkeletonHelper(model));
// });
const morphMap = new Map();
let targetArrIdx = 0;
const vrmLoader = new VRMLoader();
vrmLoader.load("female_two.vrm", (vrm) => {
  const obj = vrm.scene;
  model = obj;
  const helper = new THREE.BoundingBoxHelper(obj, 0xff0000);
  helper.update();
  helper.geometry.computeBoundingBox();
  box1.position.set(
    helper.geometry.boundingBox.max.x,
    helper.geometry.boundingBox.max.y,
    helper.geometry.boundingBox.max.z
  );
  box2.position.set(
    helper.geometry.boundingBox.min.x,
    helper.geometry.boundingBox.min.y,
    helper.geometry.boundingBox.min.z
  );

  scene.add(box1, box2);
  scene.add(helper);
  console.log(helper);

  obj.traverse((child) => {
    if (child.isMesh) {
      child.material.morphtargets = true;
      if (child.morphTargetInfluences) {
        morphtargets.push(child.morphTargetInfluences);
        const morphDicEntries = Object.entries(child.morphTargetDictionary);
        morphDicEntries.forEach((morphtarget) => {
          if (!morphMap.has(morphtarget[0])) {
            morphMap.set(morphtarget[0], [[targetArrIdx, morphtarget[1]]]);
          } else {
            morphMap.get(morphtarget[0]).push([targetArrIdx, morphtarget[1]]);
          }
        });
        targetArrIdx++;
      }
      if (child.type === "SkinnedMesh") {
      }
      // if (child.morphTargetDictionary) {
      //   const entries = Object.entries(child.morphTargetDictionary);
      //   const len = entries.length;
      //   let i = 0;
      //   while (i < len) {
      //     morphNames[entries[i][0]] = entries[i][1];
      //     i++;
      //   }
      // }
      // child.material = new THREE.MeshBasicMaterial({
      //   color: 0xff0000,
      //   wireframe: true,
      // });
    }
    if (child.name === "Armature") {
      // console.log(child);
    }
  });

  scene.add(obj);
});

window.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 87: // W
      tc.setMode("translate");
      break;

    case 69: // E
      tc.setMode("rotate");
      break;

    case 82: // R
      tc.setMode("scale");
      break;

    default:
      break;
  }
});
const findModel = () => {
  if (model) {
    const PARAMS = {};
    const morphArr = Array.from(morphMap.entries());
    morphArr.forEach((morph) => {
      PARAMS[morph[0]] = 0;
      const input = pane.addInput(PARAMS, morph[0], { min: 0, max: 1 });
      input.on("change", (e) => {
        morph[1].forEach((morphInfo) => {
          morphtargets[morphInfo[0]][morphInfo[1]] = e.value;
        });
      });
    });

    // const nameArr = Object.entries(morphNames);
    // const name = Object.keys(morphNames);
    // for (let i = 0; i < n; i++) {
    //   PARAMS[nameArr[i][0]] = 0;
    // }

    // let i = 0;
    // while (i < n) {
    //   const input = pane.addInput(PARAMS, name[i], { min: 0, max: 1 });
    //   input.on("change", (e) => {
    //     const name = e.target.label;
    //     const idx = morphNames[name];
    //     const point = name.split(".")[0];
    //     if (point === "blendShape1") {
    //       morphtargets[0][idx] = e.value;
    //       morphtargets[1][idx] = e.value;
    //       morphtargets[2][idx] = e.value;
    //       morphtargets[3][idx] = e.value;
    //     }
    //     if (point === "blendShape2") {
    //       morphtargets[4][idx] = e.value;
    //       morphtargets[5][idx] = e.value;
    //     }
    //   });
    //   i++;
    // }
    cancelAnimationFrame(findModel);
  } else {
    requestAnimationFrame(findModel);
  }
};
findModel();

// loader.load("man.fbx", (obj) => {
//   // obj.scale.setScalar(0.04);
//   scene.add(obj);
// });
// loader.load("shoes2.fbx", (obj) => {
//   // obj.scale.setScalar(0.04);
//   scene.add(obj);
// });
const Pos = {
  x: camera.position.x,
  y: camera.position.y,
  z: camera.position.z,
};

const x = pane.addInput(Pos, "x", { min: -500, max: 500 });
const y = pane.addInput(Pos, "y", { min: -500, max: 500 });
const z = pane.addInput(Pos, "z", { min: -500, max: 500 });

x.on("change", (e) => {
  camera.position.x = e.value;
});
y.on("change", (e) => {
  camera.position.y = e.value;
});
z.on("change", (e) => {
  camera.position.z = e.value;
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

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

tc.addEventListener("dragging-changed", (e) => {
  controls.enableZoom = !e.value;
  console.log(model.position);
});

// controls.update();

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
