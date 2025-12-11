import { Layer } from "../core/Layer";

export class AxisLayer extends Layer {
  private data: any[];
  private tick = 8;

  constructor(data: any[], tick = 8) {
    super();
    this.data = data;
    this.tick = tick;
  }

  setData(data: any[]) { this.data = data; }

  draw() {
    const ctx = this.ctx;
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;

    for (let y = 0; y <= ctx.canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }

    for (let i = 0; i < this.data.length; i += this.tick) {
      const x = i * 8;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
  }
}
// import { Layer } from "../core/Layer";
// import { Chart } from "../core/Chart";
// import { EventBus } from "../core/EventBus";

// export class AxisLayer extends Layer {
//   private ticks = 6;

//   constructor(ticks = 6) {
//     super();
//     this.ticks = ticks;
//   }

//   override init(ctx: CanvasRenderingContext2D, eventBus: EventBus, chart: Chart) {
//     super.init(ctx, eventBus, chart);
//   }

//   override draw() {
//     const ctx = this.ctx;
//     const ch = this.chart.getContentHeight();
//     const top = this.chart.padding.top;
//     const left = this.chart.padding.left;
//     const right = ctx.canvas.width - this.chart.padding.right;

//     ctx.textAlign = "right";
//     ctx.textBaseline = "middle";
//     ctx.font = `${12}px sans-serif`;
//     const candles = this.chart.getCandles();
//     if (!candles.length) return;

//     const highs = Math.max(...candles.map(c => c.high));
//     const lows = Math.min(...candles.map(c => c.low));

//     for (let i = 0; i <= this.ticks; i++) {
//       const t = i / this.ticks;
//       const price = highs - t * (highs - lows);
//       const y = top + t * ch;
//       ctx.fillStyle = "#999";
//       ctx.fillText(price.toFixed(2), left - 6, y);
//       // horizontal grid
//       ctx.beginPath();
//       ctx.setLineDash([2, 4]);
//       ctx.moveTo(left, y);
//       ctx.lineTo(right, y);
//       ctx.strokeStyle = "rgba(150,150,150,0.08)";
//       ctx.stroke();
//       ctx.setLineDash([]);
//     }

//     // bottom time axis (simple)
//     ctx.textAlign = "center";
//     ctx.textBaseline = "top";
//     const visible = Math.min(6, candles.length);
//     for (let i = 0; i < visible; i++) {
//       const idx = Math.floor((candles.length - 1) * (i / (visible - 1 || 1)));
//       const c = candles[idx];
//       const x = this.chart.indexToX(idx);
//       ctx.fillStyle = "#999";
//       ctx.fillText(new Date(c.time).toLocaleTimeString(), x, ctx.canvas.height - this.chart.padding.bottom + 4);
//     }
//   }
// }
// // // src/layers/AxisLayer.ts
// // import { Layer } from "../core/Layer";

// // export class AxisLayer extends Layer {
// //   private data: any[] = [];
// //   private candleWidth = 8;

// //   constructor(data: any[] = [], candleWidth = 8) {
// //     super();
// //     this.data = data;
// //     this.candleWidth = candleWidth;
// //   }

// //   init(ctx: CanvasRenderingContext2D, eventBus?: any) {
// //     this.ctx = ctx;
// //     this.eventBus = eventBus;
// //   }

// //   setData(d: any[]) { this.data = d; }

// //   draw() {
// //     const ctx = this.ctx;
// //     if (!ctx) return;
// //     const w = ctx.canvas.width / (window.devicePixelRatio || 1);
// //     const h = ctx.canvas.height / (window.devicePixelRatio || 1);

// //     // compute min/max
// //     if (!this.data || this.data.length === 0) return;
// //     let min = Infinity, max = -Infinity;
// //     for (const c of this.data) {
// //       if (c.low < min) min = c.low;
// //       if (c.high > max) max = c.high;
// //     }
// //     if (min === Infinity) return;

// //     // draw horizontal grid lines + Y labels
// //     ctx.save();
// //     ctx.strokeStyle = "#e6e6e6";
// //     ctx.fillStyle = "#444";
// //     ctx.lineWidth = 1;
// //     ctx.font = "12px Arial";
// //     const steps = 5;
// //     for (let i = 0; i <= steps; i++) {
// //       const y = (h / steps) * i;
// //       const price = (max - ((max - min) / steps) * i);
// //       ctx.beginPath();
// //       ctx.moveTo(0, y);
// //       ctx.lineTo(w, y);
// //       ctx.stroke();
// //       ctx.fillText(price.toFixed(2), 6, y - 4);
// //     }

// //     // X labels: simple index-based ticks
// //     const len = this.data.length;
// //     const tickCount = Math.min(10, Math.max(2, Math.floor(w / 80)));
// //     const step = Math.max(1, Math.floor(len / tickCount));
// //     ctx.textAlign = "center";
// //     for (let i = 0; i < len; i += step) {
// //       const x = i * this.candleWidth;
// //       ctx.beginPath();
// //       ctx.moveTo(x, 0);
// //       ctx.lineTo(x, h);
// //       ctx.stroke();
// //       const label = this.data[i].time ? new Date(this.data[i].time).toLocaleTimeString() : String(i);
// //       ctx.fillText(label, x, h - 6);
// //     }
// //     ctx.restore();
// //   }
// // }
// // // import { Layer } from "../core/Layer";

// // // export class AxisLayer extends Layer {
// // //   private data: any[];
// // //   private candleWidth: number;

// // //   constructor(data: any[], candleWidth: number) {
// // //     super();
// // //     this.data = data;
// // //     this.candleWidth = candleWidth;
// // //   }

// // //   init(ctx: CanvasRenderingContext2D) {
// // //     this.ctx = ctx;
// // //   }

// // //   setData(data: any[]) {
// // //     this.data = data;
// // //   }

// // //   draw() {
// // //     const ctx = this.ctx;
// // //     if (!ctx) return;

// // //     const width = ctx.canvas.width;
// // //     const height = ctx.canvas.height;

// // //     ctx.strokeStyle = "#aaa";
// // //     ctx.lineWidth = 1;
// // //     ctx.font = "12px Arial";
// // //     ctx.fillStyle = "#000";

// // //     // Y Axis
// // //     const prices = this.data.map(d => [d.high, d.low]).flat();
// // //     const max = Math.max(...prices);
// // //     const min = Math.min(...prices);

// // //     for (let i = 0; i <= 5; i++) {
// // //       const y = (height / 5) * i;
// // //       const price = (max - ((max - min) / 5) * i).toFixed(2);
// // //       ctx.beginPath();
// // //       ctx.moveTo(0, y);
// // //       ctx.lineTo(width, y);
// // //       ctx.stroke();
// // //       ctx.fillText(price, 5, y - 2);
// // //     }

// // //     // X Axis
// // //     const len = this.data.length;
// // //     const step = Math.max(Math.floor(len / 10), 1);
// // //     for (let i = 0; i < len; i += step) {
// // //       const x = i * this.candleWidth;
// // //       ctx.beginPath();
// // //       ctx.moveTo(x, 0);
// // //       ctx.lineTo(x, height);
// // //       ctx.stroke();
// // //       ctx.fillText(i.toString(), x, height - 5);
// // //     }
// // //   }
// // // }
