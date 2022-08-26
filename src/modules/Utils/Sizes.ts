export default class Sizes {
  private canvas: HTMLElement;
  public pixelRatio: number;
  public width: number;
  public height: number;

  constructor(canvas: HTMLElement) {
    // Options
    this.canvas = canvas;

    // Setup
    this.width = canvas.offsetWidth;
    this.height = canvas.offsetHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  }
}
