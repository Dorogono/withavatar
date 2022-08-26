import {
  AmbientLight,
  Color,
  MeshNormalMaterial,
  Scene,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
} from "three";

export default class Environment {
  private scene: Scene;
  private sunLight: AmbientLight;

  constructor(scene: Scene) {
    this.scene = scene;
    this.scene.background = new Color(0xefede4);
    this.setSunLight();
  }

  setSunLight() {
    this.sunLight = new AmbientLight(0xfff, 1);
    const geo = new BoxGeometry(5, 5, 5);
    const mat = new MeshBasicMaterial({ color: 0xff0000 });
    const box = new Mesh(geo, mat);
    box.position.set(0, 0, 0);
    this.scene.add(this.sunLight);
    this.scene.add(box);
  }
}
