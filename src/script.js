import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// HTML Elements
const checkPosBtn = document.querySelector('.checkPos')
const showPosDiv = document.createElement('div')
showPosDiv.classList.add('showPos')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let model = null

gltfLoader.load(
    'models/Fox/glTF/Fox.gltf',
    (gltf) =>
    {
        model = gltf.scene
        model.scale.setScalar(0.02)

        scene.add(gltf.scene)
    }
)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 40000)
camera.position.set(2, 0, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * TransformControls
 */
const tc = new TransformControls(camera, renderer.domElement)
tc.addEventListener('dragging-changed', (e) =>
{
    controls.enabled = !e.value
})

// model이 null 값이 아닐 때까지
const checkModel = () =>
{
    if(model != null)
    {
        tc.attach(model)
        scene.add(tc)
        window.cancelAnimationFrame(checkModel)
    }

    window.requestAnimationFrame(checkModel)
}

window.addEventListener('keydown', (e) =>
{
    switch(e.keyCode)
    {
        case 87: // W
            tc.setMode('translate')
            break;
        
        case 69: // E
            tc.setMode('rotate')
            break;

        case 82: // R
            tc.setMode('scale')
            break;

        default:
            break;
    }
})

checkPosBtn.addEventListener('click', () =>
{
    console.log(model.position, model.rotation, model.scale)

    showPosDiv.innerHTML =
        `Position) [ ${model.position.x}, ${model.position.y}, ${model.position.z} ]
        <br />
        Rotation) [ ${model.rotation.x}, ${model.rotation.y}, ${model.rotation.z} ]
        <br />
        Scale) [ ${model.scale.x}, ${model.scale.y}, ${model.scale.z} ]
        `
    
    document.body.appendChild(showPosDiv)
})

const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
checkModel()