import { PerspectiveCamera, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Camera {
  private scene: Scene;
  private canvas: HTMLElement;
  private controls: OrbitControls;
  public instance: PerspectiveCamera;

  constructor(scene: Scene, canvas: HTMLElement) {
    this.scene = scene;
    this.canvas = canvas;

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new PerspectiveCamera(75, 1, 0.1, 1000);
    this.instance.position.set(0, 0, 20);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  update() {
    this.controls.update();
  }
}
