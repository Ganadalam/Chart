import { Layer } from "../core/Layer";
import { Chart } from "../core/Chart";
import { EventBus } from "../core/EventBus";

export class CrosshairLayer extends Layer {
  private mouse = { x: -1, y: -1 };

  override init(ctx: CanvasRenderingContext2D, eventBus: EventBus, chart: Chart) {
    super.init(ctx, eventBus, chart);

    // attach listeners on canvas
    const canvas = ctx.canvas;
    canvas.addEventListener("mousemove", this.onMove);
    canvas.addEventListener("mouseleave", () => { this.mouse.x = -1; this.mouse.y = -1; this.eventBus.emit("crosshair:leave"); });
  }

  private onMove = (e: MouseEvent) => {
    const rect = this.ctx.canvas.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) * (this.ctx.canvas.width / rect.width);
    this.mouse.y = (e.clientY - rect.top) * (this.ctx.canvas.height / rect.height);

    this.eventBus.emit("crosshair:move", { x: this.mouse.x, y: this.mouse.y });
  };

  getMouse() { return this.mouse; }

  override draw() {
    if (this.mouse.x < 0) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(this.mouse.x, 0);
    ctx.lineTo(this.mouse.x, ctx.canvas.height);
    ctx.moveTo(0, this.mouse.y);
    ctx.lineTo(ctx.canvas.width, this.mouse.y);
    ctx.stroke();

    // price box
    const price = this.chart.yToPrice(this.mouse.y);
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(ctx.canvas.width - 90, this.mouse.y - 12, 84, 24);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(price.toFixed(2), ctx.canvas.width - 48, this.mouse.y);

    // time box
    const idx = this.chart.xToIndex(this.mouse.x);
    const candles = this.chart.getCandles();
    const d = idx >= 0 ? candles[idx] : null;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(this.mouse.x - 40, ctx.canvas.height - 28, 80, 20);
    ctx.fillStyle = "#fff";
    if (d) ctx.fillText(new Date(d.time).toLocaleTimeString(), this.mouse.x, ctx.canvas.height - 18);

    ctx.restore();
  }
}
// // src/layers/CrosshairLayer.ts
// import { Layer } from "../core/Layer";
// import { Chart } from "../core/Chart";

// export class CrosshairLayer extends Layer {
//   private mouse = { x: -1, y: -1 };
//   private chart!: Chart;

//   init(ctx: CanvasRenderingContext2D, eventBus: any, chart?: any) {
//     super.init(ctx, eventBus);
//     this.chart = chart;
//     ctx.canvas.addEventListener("mousemove", this.onMove);
//      ctx.canvas.addEventListener("mouseleave", () => {
//     this.mouse.x = -1;
//     this.mouse.y = -1;
//   });
// }
//   private onMove = (e: MouseEvent) => {
//     const rect = this.ctx.canvas.getBoundingClientRect();
//     this.mouse.x = e.clientX - rect.left;
//     this.mouse.y = e.clientY - rect.top;
//     // emit chart coords
//     if (this.eventBus) this.eventBus.emit("crosshair:move", { x: this.mouse.x, y: this.mouse.y });
//   };

//   getMouse() { return this.mouse; }

//   draw() {
//     if (this.mouse.x < 0) return;
//     const ctx = this.ctx;
//     ctx.save();
//     ctx.setLineDash([4,4]);
//     ctx.strokeStyle = "#999";
//     ctx.lineWidth = 1;

//     ctx.beginPath();
//     ctx.moveTo(this.mouse.x, 0);
//     ctx.lineTo(this.mouse.x, ctx.canvas.height);
//     ctx.moveTo(0, this.mouse.y);
//     ctx.lineTo(ctx.canvas.width, this.mouse.y);
//     ctx.stroke();

//     // price box (right)
//     // const price = this.priceToY ? null : null; // priceToY is on chart; we use eventBus to ask chart outside
//     // draw simple price box using approximate value from chart
//     const idx = this.chart.xToIndex(this.mouse.x);
//     const candles = this.chart.getCandles();
//     const d = candles[idx];
//     ctx.fillStyle = "rgba(0,0,0,0.7)";
//     ctx.fillRect(ctx.canvas.width - 90, this.mouse.y - 12, 84, 24);
//     ctx.fillStyle = "#fff";
//     if (d) ctx.fillText(d.close.toFixed(2), ctx.canvas.width - 48, this.mouse.y + 6);

//     // time box (bottom)
//     ctx.fillStyle = "rgba(0,0,0,0.7)";
//     ctx.fillRect(this.mouse.x - 40, ctx.canvas.height - 28, 80, 20);
//     ctx.fillStyle = "#fff";
//     if (d && d.time) ctx.fillText(new Date(d.time).toLocaleTimeString(), this.mouse.x, ctx.canvas.height - 12);

//     ctx.restore();
//   }
// }

// // import { Layer } from "../core/Layer";

// // export class CrosshairLayer extends Layer {
// //   private mouse = { x: -1, y: -1 };

// //   init(ctx: CanvasRenderingContext2D, eventBus: any) {
// //     super.init(ctx, eventBus);

// //     ctx.canvas.addEventListener("mousemove", (e) => {
// //       const rect = ctx.canvas.getBoundingClientRect();
// //       this.mouse = {
// //         x: e.clientX - rect.left,
// //         y: e.clientY - rect.top
// //       };
// //     });

// //     ctx.canvas.addEventListener("mouseleave", () => {
// //       this.mouse = { x: -1, y: -1 };
// //     });
// //   }

// //   draw() {
// //     if (this.mouse.x < 0) return;

// //     const ctx = this.ctx;
// //     ctx.beginPath();
// //     ctx.strokeStyle = "#888";

// //     ctx.moveTo(this.mouse.x, 0);
// //     ctx.lineTo(this.mouse.x, ctx.canvas.height);

// //     ctx.moveTo(0, this.mouse.y);
// //     ctx.lineTo(ctx.canvas.width, this.mouse.y);

// //     ctx.stroke();
// //   }

// //   getMouse() {
// //     return this.mouse;
// //   }
// // }

// // // // src/layers/CrosshairLayer.ts
// // // import { Layer } from "../core/Layer";

// // // export class CrosshairLayer extends Layer {
// // //   private mouse = { x: -1, y: -1 };

// // //   init(ctx: CanvasRenderingContext2D, eventBus: any, chart: any): void {
// // //     super.init(ctx, eventBus, chart);

// // //     const onMove = (e: MouseEvent) => {
// // //       const rect = this.chart.canvas.getBoundingClientRect();
// // //       this.mouse.x = e.clientX - rect.left;
// // //       this.mouse.y = e.clientY - rect.top;
// // //     };

// // //     this.chart.canvas.addEventListener("mousemove", onMove);
// // //     // optional: clear when leaving
// // //     this.chart.canvas.addEventListener("mouseleave", () => {
// // //       this.mouse.x = -1;
// // //       this.mouse.y = -1;
// // //     });
// // //   }

// // //   draw(): void {
// // //     if (this.mouse.x < 0) return;

// // //     const ctx = this.ctx;
// // //     ctx.save();
// // //     ctx.beginPath();
// // //     ctx.lineWidth = 1;
// // //     ctx.setLineDash([4, 4]);
// // //     ctx.strokeStyle = "#888";

// // //     ctx.moveTo(this.mouse.x, 0);
// // //     ctx.lineTo(this.mouse.x, ctx.canvas.height);

// // //     ctx.moveTo(0, this.mouse.y);
// // //     ctx.lineTo(ctx.canvas.width, this.mouse.y);

// // //     ctx.stroke();
// // //     ctx.restore();
// // //   }
// // // }
