import { Layer } from "../core/Layer";

export class FpsLayer extends Layer {
  private last = performance.now();
  private frames = 0;
  private fps = 0;

  draw() {
    const now = performance.now();
    this.frames++;
    if (now - this.last > 1000) {
      this.fps = (this.frames * 1000) / (now - this.last);
      this.frames = 0;
      this.last = now;
    }

    const ctx = this.ctx;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 60, 24);
    ctx.fillStyle = "lime";
    ctx.font = "16px monospace";
    ctx.fillText(this.fps.toFixed(0), 5, 16);
  }
}
