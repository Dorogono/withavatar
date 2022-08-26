import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Camera from "./Camera";

export default class Renderer {
  private canvas: HTMLElement;
  private sizes: Sizes;
  private scene: THREE.Scene;
  private camera: Camera;
  public instance: THREE.WebGL1Renderer;

  constructor(canvas: any, sizes: Sizes, camera: Camera, scene: THREE.Scene) {
    this.canvas = canvas;
    this.sizes = sizes;
    this.camera = camera;
    this.scene = scene;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGL1Renderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.setClearColor(0xff0000);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
