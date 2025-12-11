// src/core/rendererWorker.ts
let ctx: OffscreenCanvasRenderingContext2D;
let canvasWidth = 0;
let canvasHeight = 0;
let candles: any[] = [];
let scale = 1;
let offset = 0;

onmessage = (e) => {
  const msg = e.data;
  if (msg.canvas) {
    ctx = msg.canvas.getContext("2d")!;
    canvasWidth = msg.width;
    canvasHeight = msg.height;
    render();
  }
  if (msg.type === "update") {
    candles = msg.candles;
    render();
  }
  if (msg.type === "zoom") {
    const before = (msg.centerX / scale + offset);
    scale *= msg.factor;
    offset = before - msg.centerX / scale;
    render();
  }
  if (msg.type === "pan") {
    offset += msg.dx / scale;
    render();
  }
};

function render() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // simple candle draw
  candles.forEach((d, i) => {
    const x = (i - offset) * (6 + 2) * scale;
    if (x < 0 || x > canvasWidth) return;
    const isUp = d.close >= d.open;
    ctx.strokeStyle = ctx.fillStyle = isUp ? "#22c55e" : "#ef4444";

    // wick
    ctx.beginPath();
    ctx.moveTo(x + 3, d.high);
    ctx.lineTo(x + 3, d.low);
    ctx.stroke();

    // body
    const top = Math.min(d.open, d.close);
    const bottom = Math.max(d.open, d.close);
    ctx.fillRect(x, top, 6 * scale, (bottom - top) * scale);
  });
}
// // src/workers/renderWorker.ts
// // NOTE: this file runs in worker context
// let ctx: OffscreenCanvasRenderingContext2D | null = null;
// let state: any = { candles: [], scale: 8, translateX: 0, width: 0, height: 0 };

// onmessage = (ev) => {
//   const { data } = ev;
//   if (data.type === "init" && data.canvas) {
//     const canvas: OffscreenCanvas = data.canvas;
//     ctx = canvas.getContext("2d")!;
//     state.width = canvas.width;
//     state.height = canvas.height;
//     requestAnimationFrame(loop);
//   }
//   if (data.type === "update") {
//     state = { ...state, ...data.payload };
//   }
// };

// function loop() {
//   if (!ctx) return;
//   const dpr = 1; // Offscreen canvas pixels already set by main thread
//   ctx.clearRect(0, 0, state.width, state.height);

//   // draw grid
//   ctx.strokeStyle = "#eee";
//   ctx.lineWidth = 1;
//   ctx.beginPath();
//   const gridY = 5;
//   for (let i = 0; i <= gridY; i++) {
//     const y = (state.height / gridY) * i;
//     ctx.moveTo(0, y);
//     ctx.lineTo(state.width, y);
//   }
//   ctx.stroke();

//   // draw candles
//   const candleW = Math.max(2, state.scale * 0.9);
//   ctx.lineWidth = 1;
//   for (let i = 0; i < state.candles.length; i++) {
//     const d = state.candles[i];
//     const x = i * state.scale + state.translateX;
//     if (x + candleW < 0 || x > state.width) continue;
//     const isUp = d.close >= d.open;
//     ctx.fillStyle = isUp ? "#22c55e" : "#ef4444";
//     ctx.strokeStyle = ctx.fillStyle;

//     // wick
//     const yHigh = priceToY(d.high);
//     const yLow = priceToY(d.low);
//     ctx.beginPath();
//     ctx.moveTo(x + candleW / 2, yHigh);
//     ctx.lineTo(x + candleW / 2, yLow);
//     ctx.stroke();

//     // body
//     const yOpen = priceToY(d.open);
//     const yClose = priceToY(d.close);
//     const yTop = Math.min(yOpen, yClose);
//     const height = Math.max(1, Math.abs(yOpen - yClose));
//     ctx.fillRect(x, yTop, candleW, height);
//   }

//   requestAnimationFrame(loop);
// }

// function priceToY(price: number) {
//   // simple mapping based on visible min/max across visible candles
//   // compute min/max:
//   const from = Math.max(0, Math.floor((0 - state.translateX) / state.scale));
//   const to = Math.min(state.candles.length - 1, Math.floor((state.width - state.translateX) / state.scale));
//   if (from > to || state.candles.length === 0) return state.height / 2;
//   let min = Infinity, max = -Infinity;
//   for (let i = from; i <= to; i++) {
//     const d = state.candles[i];
//     if (!d) continue;
//     if (d.low < min) min = d.low;
//     if (d.high > max) max = d.high;
//   }
//   if (min === Infinity) { min = 0; max = 1; }
//   const padding = (max - min) * 0.06 || 1;
//   const top = max + padding, bottom = min - padding;
//   const ratio = (price - bottom) / (top - bottom);
//   return state.height - ratio * state.height;
// }

// // let ctx: OffscreenCanvasRenderingContext2D;

// // onmessage = (e) => {
// //   if (e.data.canvas) {
// //     ctx = e.data.canvas.getContext("2d")!;
// //     requestAnimationFrame(renderLoop);
// //   }
// //   if (e.data.layers) {
// //     (self as any).layers = e.data.layers;
// //   }
// // };

// // function renderLoop() {
// //   if (!ctx || !(self as any).layers) return;
// //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
// //   (self as any).layers.forEach((layer: any) => {
// //     if (layer.draw) layer.draw(ctx);
// //   });
// //   requestAnimationFrame(renderLoop);
// // }
