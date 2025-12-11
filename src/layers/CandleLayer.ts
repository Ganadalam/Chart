import { Layer } from "../core/Layer";

export class CandleLayer extends Layer {
  private data: any[];
  private candleWidth = 6;

  constructor(data: any[]) {
    super();
    this.data = data;
  }

  setData(data: any[]) {
    this.data = data;
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.data.forEach((d, i) => {
      const x = i * (this.candleWidth + 2);

      const isUp = d.close >= d.open;
      ctx.strokeStyle = ctx.fillStyle = isUp ? "#22c55e" : "#ef4444";

      // wick
      ctx.beginPath();
      ctx.moveTo(x + this.candleWidth / 2, d.high);
      ctx.lineTo(x + this.candleWidth / 2, d.low);
      ctx.stroke();

      // body
      const top = Math.min(d.open, d.close);
      const bottom = Math.max(d.open, d.close);
      ctx.fillRect(x, top, this.candleWidth, bottom - top);
    });
  }
}

// // src/layers/CandleLayer.ts
// import { Layer } from "../core/Layer";

// export class CandleLayer extends Layer {
//   private data: { open: number; high: number; low: number; close: number; time?: number }[] = [];
//   private candleWidth = 6;

//   constructor(data: { open: number; high: number; low: number; close: number; time?: number }[]) {
//     super();
//     this.data = data;
//   }

//   init(ctx: CanvasRenderingContext2D, eventBus: any, chart: any) {
//     super.init(ctx, eventBus, chart);
//     // 차트에 데이터 등록 (chart의 스케일/priceToY가 data에 의존)
//     this.chart.setData(this.data);
//   }

//   draw(): void {
//     const ctx = this.ctx;
//     ctx.save();
//     ctx.lineWidth = 1;

//     const dpr = window.devicePixelRatio || 1;
//     const candleHalf = this.candleWidth / 2;

//     // draw only visible range for performance
//     const { from, to } = (() => {
//       const widthPx = this.chart.canvas.width / dpr;
//       const first = this.chart.xToIndex(0);
//       const last = this.chart.xToIndex(widthPx) + 1;
//       const from = Math.max(0, first);
//       const to = Math.min(Math.max(0, last), this.data.length - 1);
//       return { from, to };
//     })();

//     for (let i = from; i <= to; i++) {
//       const d = this.data[i];
//       if (!d) continue;
//       const x = this.chart.indexToX(i);
//       const isUp = d.close >= d.open;

//       ctx.strokeStyle = ctx.fillStyle = isUp ? "#22c55e" : "#ef4444";

//       // wick
//       ctx.beginPath();
//       ctx.moveTo(x + candleHalf, this.chart.priceToY(d.high));
//       ctx.lineTo(x + candleHalf, this.chart.priceToY(d.low));
//       ctx.stroke();

//       // body
//       const yOpen = this.chart.priceToY(d.open);
//       const yClose = this.chart.priceToY(d.close);
//       const yTop = Math.min(yOpen, yClose);
//       const height = Math.max(1, Math.abs(yOpen - yClose));

//       ctx.fillRect(x, yTop, this.candleWidth, height);
//     }

//     ctx.restore();
//   }
// }
