import { Layer } from "../core/Layer";

export class SmaLayer extends Layer {
  private data: any[];
  private period: number;

  constructor(data: any[], period: number) {
    super();
    this.data = data;
    this.period = period;
  }

  setData(data: any[]) { this.data = data; }

  draw() {
    const ctx = this.ctx;
    if (!this.data.length) return;

    ctx.strokeStyle = "#facc15";
    ctx.beginPath();
    for (let i = 0; i < this.data.length; i++) {
      if (i < this.period - 1) continue;
      const sum = this.data.slice(i - this.period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
      const sma = sum / this.period;
      const x = i * 8;
      if (i === this.period - 1) ctx.moveTo(x, sma);
      else ctx.lineTo(x, sma);
    }
    ctx.stroke();
  }
}
// import { Layer } from "../core/Layer";

// export class SmaLayer extends Layer {
//   private data: any[];
//   private period: number;

//   constructor(data: any[], period: number) {
//     super();
//     this.data = data;
//     this.period = period;
//   }

//   setData(data: any[]) { this.data = data; }

//   draw() {
//     const ctx = this.ctx;
//     if (!this.data.length) return;

//     ctx.strokeStyle = "#facc15";
//     ctx.beginPath();
//     for (let i = 0; i < this.data.length; i++) {
//       if (i < this.period - 1) continue;
//       const sum = this.data.slice(i - this.period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
//       const sma = sum / this.period;
//       const x = i * 8;
//       if (i === this.period - 1) ctx.moveTo(x, sma);
//       else ctx.lineTo(x, sma);
//     }
//     ctx.stroke();
//   }
// }
// // import { Layer } from "../core/Layer";
// // import { Chart, Candle } from "../core/Chart";
// // import { EventBus } from "../core/EventBus";

// // export class SmaLayer extends Layer {
// //   private data: Candle[] = [];
// //   private period: number;

// //   constructor(data: Candle[] = [], period = 20) {
// //     super();
// //     this.data = data;
// //     this.period = period;
// //   }

// //   setData(data: Candle[]) { this.data = data; }

// //   override init(ctx: CanvasRenderingContext2D, eventBus: EventBus, chart: Chart) {
// //     super.init(ctx, eventBus, chart);
// //     this.eventBus.on("chart:update", (p) => this.setData(p.candles || []));
// //   }

// //   private calcSMA(): (number | null)[] {
// //     const res: (number | null)[] = [];
// //     const arr = this.data.map(d => d.close);
// //     let sum = 0;
// //     for (let i = 0; i < arr.length; i++) {
// //       sum += arr[i];
// //       if (i >= this.period) sum -= arr[i - this.period];
// //       if (i >= this.period - 1) res[i] = sum / this.period;
// //       else res[i] = null;
// //     }
// //     return res;
// //   }

// //   override draw() {
// //     const ctx = this.ctx;
// //     const sma = this.calcSMA();
// //     ctx.beginPath();
// //     for (let i = 0; i < sma.length; i++) {
// //       const v = sma[i];
// //       if (v == null) continue;
// //       const x = this.chart.indexToX(i);
// //       const y = this.chart.priceToY(v);
// //       if (ctx.currentPath && i === 0) { /* ignore */ }
// //       if (i === 0 || sma[i - 1] == null) ctx.moveTo(x, y);
// //       else ctx.lineTo(x, y);
// //     }
// //     ctx.lineWidth = 1.5;
// //     ctx.strokeStyle = "#f59e0b";
// //     ctx.stroke();
// //   }
// // }
// // // import { Layer } from "../core/Layer";

// // // export class SmaLayer extends Layer {
// // //   private data: any[];
// // //   private period: number;

// // //   constructor(data: any[], period = 20) {
// // //     super();
// // //     this.data = data;
// // //     this.period = period;
// // //   }

// // //   setData(data: any[]) {
// // //     this.data = data;
// // //   }

// // //   private calcSMA() {
// // //     const out: number[] = [];
// // //     for (let i = 0; i < this.data.length; i++) {
// // //       if (i < this.period) {
// // //         out.push(NaN);
// // //         continue;
// // //       }
// // //       const slice = this.data.slice(i - this.period, i);
// // //       const avg = slice.reduce((sum, d) => sum + d.close, 0) / this.period;
// // //       out.push(avg);
// // //     }
// // //     return out;
// // //   }

// // //   draw() {
// // //     const ctx = this.ctx;
// // //     const sma = this.calcSMA();
// // //     ctx.beginPath();
// // //     ctx.strokeStyle = "blue";
// // //     ctx.lineWidth = 2;

// // //     sma.forEach((v, i) => {
// // //       if (isNaN(v)) return;
// // //       const x = i * 8; // candleWidth + spacing ~ 6+2
// // //       if (i === this.period) ctx.moveTo(x, v);
// // //       else ctx.lineTo(x, v);
// // //     });
// // //     ctx.stroke();
// // //   }
// // // }
