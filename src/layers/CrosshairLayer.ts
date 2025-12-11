import { Layer } from "../core/Layer";

export class CrosshairLayer extends Layer {
  private mouse = { x: -1, y: -1 };

  init(ctx: CanvasRenderingContext2D, eventBus: any) {
    super.init(ctx, eventBus);

    ctx.canvas.addEventListener("mousemove", (e) => {
      const rect = ctx.canvas.getBoundingClientRect();
      this.mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });

    ctx.canvas.addEventListener("mouseleave", () => {
      this.mouse = { x: -1, y: -1 };
    });
  }

  draw() {
    if (this.mouse.x < 0) return;

    const ctx = this.ctx;
    ctx.beginPath();
    ctx.strokeStyle = "#888";

    ctx.moveTo(this.mouse.x, 0);
    ctx.lineTo(this.mouse.x, ctx.canvas.height);

    ctx.moveTo(0, this.mouse.y);
    ctx.lineTo(ctx.canvas.width, this.mouse.y);

    ctx.stroke();
  }

  getMouse() {
    return this.mouse;
  }
}

// // src/layers/CrosshairLayer.ts
// import { Layer } from "../core/Layer";

// export class CrosshairLayer extends Layer {
//   private mouse = { x: -1, y: -1 };

//   init(ctx: CanvasRenderingContext2D, eventBus: any, chart: any): void {
//     super.init(ctx, eventBus, chart);

//     const onMove = (e: MouseEvent) => {
//       const rect = this.chart.canvas.getBoundingClientRect();
//       this.mouse.x = e.clientX - rect.left;
//       this.mouse.y = e.clientY - rect.top;
//     };

//     this.chart.canvas.addEventListener("mousemove", onMove);
//     // optional: clear when leaving
//     this.chart.canvas.addEventListener("mouseleave", () => {
//       this.mouse.x = -1;
//       this.mouse.y = -1;
//     });
//   }

//   draw(): void {
//     if (this.mouse.x < 0) return;

//     const ctx = this.ctx;
//     ctx.save();
//     ctx.beginPath();
//     ctx.lineWidth = 1;
//     ctx.setLineDash([4, 4]);
//     ctx.strokeStyle = "#888";

//     ctx.moveTo(this.mouse.x, 0);
//     ctx.lineTo(this.mouse.x, ctx.canvas.height);

//     ctx.moveTo(0, this.mouse.y);
//     ctx.lineTo(ctx.canvas.width, this.mouse.y);

//     ctx.stroke();
//     ctx.restore();
//   }
// }
