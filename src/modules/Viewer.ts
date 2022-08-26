import { Scene } from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Environment from "./Utils/Environment";

let instance: any = null;

export default class Viewer {
  private time: Time;
  private renderer: Renderer;
  private environment: Environment;
  public model: string;
  public canvas: any;
  public sizes: Sizes;
  public scene: Scene;
  public camera: Camera;

  constructor(canvas: HTMLElement, model: string) {
    if (instance) return instance;
    instance = this;

    // Options
    this.canvas = canvas;
    this.model = model;

    // Setup
    this.sizes = new Sizes(this.canvas);
    this.time = new Time();
    this.scene = new Scene();
    this.camera = new Camera(this.scene, this.canvas);
    this.renderer = new Renderer(
      this.canvas,
      this.sizes,
      this.camera,
      this.scene
    );
    this.environment = new Environment(this.scene);
    this.time.on("tick", () => {
      this.update();
    });
  }

  update() {
    // console.log(this.renderer);
    this.camera.update();
    this.renderer.update();
  }
}
