import { EventBus } from "./EventBus";

export type Candle = { time: number; open: number; high: number; low: number; close: number };

export class Chart {
  private canvas: HTMLCanvasElement;
  private dpr = window.devicePixelRatio || 1;
  private candles: Candle[] = [];
  private eventBus = new EventBus();
  private workerRenderer: any = null;

  // view params
  public padding = { left: 40, right: 100, top: 20, bottom: 30 };
  public candleWidth = 6;
  public gap = 2;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  getCanvas() { return this.canvas; }
  getDPR() { return this.dpr; }
  getEventBus() { return this.eventBus; }

  setWorkerRenderer(wr: any) { this.workerRenderer = wr; }

  setCandles(c: Candle[]) {
    this.candles = c.slice();
    this.eventBus.emit("chart:update", { candles: this.candles });
  }

  getCandles() { return this.candles; }

  pushTick(price: number, time = Date.now()) {
    const last = this.candles[this.candles.length - 1];
    if (!last) {
      this.candles.push({ time, open: price, high: price, low: price, close: price });
    } else {
      const newC = { ...last, time, close: price, high: Math.max(last.high, price), low: Math.min(last.low, price) };
      this.candles[this.candles.length - 1] = newC;
    }
    this.eventBus.emit("chart:update", { candles: this.candles });
  }

  // pixel width for drawing area (excluding padding)
  getContentWidth() {
    return this.canvas.width - (this.padding.left + this.padding.right);
  }
  getContentHeight() {
    return this.canvas.height - (this.padding.top + this.padding.bottom);
  }

  // x coordinate of i-th candle (center)
  indexToX(i: number) {
    const w = this.candleWidth;
    const step = w + this.gap;
    return this.padding.left + i * step + w / 2;
  }

  // estimate index from x
  xToIndex(x: number) {
    const local = x - this.padding.left;
    if (local < 0) return -1;
    const step = this.candleWidth + this.gap;
    const idx = Math.floor(local / step);
    if (idx < 0 || idx >= this.candles.length) return -1;
    return idx;
  }

  // price -> y (pixel)
  priceToY(price: number) {
    if (!this.candles.length) return 0;
    const highs = Math.max(...this.candles.map(c => c.high));
    const lows = Math.min(...this.candles.map(c => c.low));
    const ch = this.getContentHeight();
    const top = this.padding.top;
    if (highs === lows) return top + ch / 2;
    const t = (price - lows) / (highs - lows); // 0..1
    return top + (1 - t) * ch;
  }

  // y -> price
  yToPrice(y: number) {
    if (!this.candles.length) return 0;
    const highs = Math.max(...this.candles.map(c => c.high));
    const lows = Math.min(...this.candles.map(c => c.low));
    const ch = this.getContentHeight();
    const top = this.padding.top;
    const t = 1 - (y - top) / ch;
    return lows + t * (highs - lows);
  }
}
// // src/core/Chart.ts
// import { EventBus } from "./EventBus";

// export type Candle = { open: number; high: number; low: number; close: number; time?: number };

// export class Chart {
//   public canvas: HTMLCanvasElement;
//   public ctx: CanvasRenderingContext2D;
//   public eventBus = new EventBus();

//   // viewport
//   public scale = 8; // px per candle
//   public translateX = 0;

//   // data
//   private candles: Candle[] = [];
//   private currentTickBucket: Candle | null = null;
//   private bucketMs = 60 * 1000; // 1m candles by default

//   // worker renderer (optional)
//   private workerRenderer: any = null;
//   public useWorker = false;

//   constructor(canvas: HTMLCanvasElement) {
//     this.canvas = canvas;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) throw new Error("2D ctx required");
//     this.ctx = ctx;

//     this.attachInteraction();
//   }

//   setWorkerRenderer(renderer: any) {
//     this.workerRenderer = renderer;
//     this.useWorker = !!renderer;
//   }

//   // tick format: { price, time } or { open, high, low, close, time } (either fine)
//   pushTick(price: number, time = Date.now()) {
//     // aggregate into current minute bucket
//     const bucketStart = Math.floor(time / this.bucketMs) * this.bucketMs;
//     if (!this.currentTickBucket || (this.currentTickBucket.time || 0) !== bucketStart) {
//       // finish previous
//       if (this.currentTickBucket) this.candles.push({ ...this.currentTickBucket });
//       // start new
//       this.currentTickBucket = { open: price, high: price, low: price, close: price, time: bucketStart };
//     } else {
//       // update bucket
//       this.currentTickBucket.close = price;
//       if (price > this.currentTickBucket.high) this.currentTickBucket.high = price;
//       if (price < this.currentTickBucket.low) this.currentTickBucket.low = price;
//     }

//     // keep length bounded
//     if (this.currentTickBucket && this.candles.length > 2000) this.candles.shift();

//     this.emitUpdate();
//   }

//   // set whole OHLC array
//   setCandles(c: Candle[]) {
//     this.candles = c.slice();
//     this.emitUpdate();
//   }

//   getCandles() {
//     return this.candles.slice();
//   }

//   getVisibleRange(): { from: number; to: number } {
//     const widthPx = this.canvas.width / (window.devicePixelRatio || 1);
//     const first = Math.floor((0 - this.translateX) / this.scale);
//     const last = Math.floor((widthPx - this.translateX) / this.scale);
//     return { from: Math.max(0, first), to: Math.min(this.candles.length - 1, last) };
//   }

//   indexToX(i: number) {
//     return i * this.scale + this.translateX;
//   }

//   xToIndex(x: number) {
//     return Math.floor((x - this.translateX) / this.scale);
//   }

//   // price -> y using visible price range
//   priceToY(price: number) {
//     const { from, to } = this.getVisibleRange();
//     if (from > to || this.candles.length === 0) return 0;
//     let min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY;
//     for (let i = from; i <= to; i++) {
//       const d = this.candles[i];
//       if (!d) continue;
//       if (d.low < min) min = d.low;
//       if (d.high > max) max = d.high;
//     }
//     if (min === Number.POSITIVE_INFINITY) { min = 0; max = 1; }
//     const padding = (max - min) * 0.06 || 1;
//     const top = max + padding, bottom = min - padding;
//     const height = this.canvas.height / (window.devicePixelRatio || 1);
//     const ratio = (price - bottom) / (top - bottom);
//     return height - ratio * height;
//   }

//   // interaction
//   private attachInteraction() {
//     // wheel zoom anchored at mouse
//     this.canvas.addEventListener("wheel", (e: WheelEvent) => {
//       e.preventDefault();
//       const rect = this.canvas.getBoundingClientRect();
//       const mx = e.clientX - rect.left;
//       const prevIndex = this.xToIndex(mx);
//       const factor = e.deltaY < 0 ? 1.12 : 0.88;
//       this.scale = Math.max(2, Math.min(80, this.scale * factor));
//       const newX = this.indexToX(prevIndex);
//       this.translateX += mx - newX;
//       this.emitUpdate();
//     }, { passive: false });

//     // pan
//     let dragging = false;
//     let lastX = 0;
//     this.canvas.addEventListener("mousedown", (e) => {
//       dragging = true; lastX = e.clientX;
//     });
//     window.addEventListener("mouseup", () => (dragging = false));
//     window.addEventListener("mousemove", (e) => {
//       if (!dragging) return;
//       const dx = e.clientX - lastX;
//       lastX = e.clientX;
//       this.translateX += dx;
//       this.emitUpdate();
//     });
//   }

//   // emit updates to either main renderer or worker
//   private emitUpdate() {
//     const payload = {
//       candles: this.getCandles(),
//       scale: this.scale,
//       translateX: this.translateX,
//       width: this.canvas.width,
//       height: this.canvas.height
//     };
//     if (this.useWorker && this.workerRenderer) {
//       this.workerRenderer.postMessage({ type: "update", payload });
//     } else {
//       this.eventBus.emit("chart:update", payload);
//     }
//   }

//   // allow exposing event bus for layers
//   getEventBus() {
//     return this.eventBus;
//   }
// }
// // import { Layer } from "./Layer";

// // export class Chart {
// //   private canvas: HTMLCanvasElement;
// //   private ctx: CanvasRenderingContext2D;
// //   private layers: Layer[] = [];

// //   constructor(canvas: HTMLCanvasElement) {
// //     this.canvas = canvas;
// //     this.ctx = canvas.getContext("2d")!;
// //   }

// //   addLayer(layer: Layer) {
// //     layer.init(this.ctx, {});
// //     this.layers.push(layer);
// //   }

// //   render() {
// //     this.layers.forEach((layer) => layer.draw());
// //   }
// // }
// // // // src/core/Chart.ts
// // // import { EventBus } from "./EventBus";
// // // import { Layer } from "./Layer";
// // // import { Renderer } from "./Renderer";

// // // /**
// // //  * Chart: canvas 기반 차트 엔진의 중심
// // //  * - scale: px per candle (확대/축소)
// // //  * - translateX: 전체 x축 오프셋 (팬)
// // //  * - setData: 전역 데이터(캔들)
// // //  */
// // // export class Chart {
// // //   public canvas: HTMLCanvasElement;
// // //   public renderer: Renderer;
// // //   public ctx: CanvasRenderingContext2D;
// // //   private eventBus = new EventBus();
// // //   private layers: Layer[] = [];

// // //   // viewport 상태
// // //   public scale = 8; // px per candle (기본값)
// // //   public translateX = 0; // px

// // //   // 데이터 (시간순으로 정렬된 캔들)
// // //   private data: { open: number; high: number; low: number; close: number; time?: number }[] = [];

// // //   constructor(canvas: HTMLCanvasElement) {
// // //     this.canvas = canvas;
// // //     this.renderer = new Renderer(canvas);
// // //     this.ctx = this.renderer.ctx;

// // //     this.initEvents();
// // //     this.animate = this.animate.bind(this);
// // //     requestAnimationFrame(this.animate);
// // //   }

// // //   // 레이어 등록 (Chart가 ctx/eventBus/chart 주입)
// // //   addLayer(layer: Layer): void {
// // //     layer.init(this.ctx, this.eventBus, this);
// // //     this.layers.push(layer);
// // //   }

// // //   setData(data: { open: number; high: number; low: number; close: number; time?: number }[]): void {
// // //     this.data = data;
// // //   }

// // //   getData(): typeof this.data {
// // //     return this.data;
// // //   }

// // //   // ---------------- Coordinate helpers ----------------
// // //   indexToX(index: number): number {
// // //     return index * this.scale + this.translateX;
// // //   }

// // //   xToIndex(x: number): number {
// // //     return Math.floor((x - this.translateX) / this.scale);
// // //   }

// // //   // priceToY: 화면에 보이는 데이터의 min/max를 기준으로 매핑
// // //   priceToY(price: number): number {
// // //     const { min, max } = this.getVisiblePriceRange();
// // //     const padding = (max - min) * 0.06 || 1; // 위아래 여유
// // //     const top = max + padding;
// // //     const bottom = min - padding;
// // //     const height = this.canvas.height / (window.devicePixelRatio || 1);
// // //     const ratio = (price - bottom) / (top - bottom);
// // //     // y가 위쪽 0부터 증가하므로 반전
// // //     return height - ratio * height;
// // //   }

// // //   private getVisibleIndexRange(): { from: number; to: number } {
// // //     const widthPx = this.canvas.width / (window.devicePixelRatio || 1);
// // //     const first = this.xToIndex(0);
// // //     const last = this.xToIndex(widthPx) + 1;
// // //     const from = Math.max(0, first);
// // //     const to = Math.min(Math.max(0, last), this.data.length - 1);
// // //     return { from, to };
// // //   }

// // //   private getVisiblePriceRange(): { min: number; max: number } {
// // //     const { from, to } = this.getVisibleIndexRange();
// // //     if (this.data.length === 0 || to < from) return { min: 0, max: 1 };
// // //     let min = Number.POSITIVE_INFINITY;
// // //     let max = Number.NEGATIVE_INFINITY;
// // //     for (let i = from; i <= to; i++) {
// // //       const d = this.data[i];
// // //       if (!d) continue;
// // //       if (d.low < min) min = d.low;
// // //       if (d.high > max) max = d.high;
// // //     }
// // //     if (min === Number.POSITIVE_INFINITY || max === Number.NEGATIVE_INFINITY) {
// // //       return { min: 0, max: 1 };
// // //     }
// // //     return { min, max };
// // //   }

// // //   // ---------------- Interaction ----------------
// // //   private initEvents(): void {
// // //     // wheel zoom: 마우스 위치 기준으로 scale 변경 (anchor zoom)
// // //     this.canvas.addEventListener("wheel", (e: WheelEvent) => {
// // //       e.preventDefault();
// // //       const rect = this.canvas.getBoundingClientRect();
// // //       const mouseX = e.clientX - rect.left;
// // //       const prevIndex = this.xToIndex(mouseX);
// // //       // zoom factor
// // //       const factor = e.deltaY < 0 ? 1.12 : 0.88;
// // //       this.scale = Math.max(2, Math.min(80, this.scale * factor));
// // //       // keep the same candle under mouse -> adjust translateX
// // //       const newX = this.indexToX(prevIndex);
// // //       this.translateX += mouseX - newX;
// // //     }, { passive: false });

// // //     // pan with mouse
// // //     let dragging = false;
// // //     let lastClientX = 0;
// // //     this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
// // //       dragging = true;
// // //       lastClientX = e.clientX;
// // //     });
// // //     window.addEventListener("mouseup", () => (dragging = false));
// // //     window.addEventListener("mousemove", (e: MouseEvent) => {
// // //       if (!dragging) return;
// // //       const dx = e.clientX - lastClientX;
// // //       lastClientX = e.clientX;
// // //       this.translateX += dx;
// // //     });

// // //     // resize handled in Renderer
// // //   }

// // //   // ---------------- Render loop ----------------
// // //   private animate(): void {
// // //     this.renderer.clear();

// // //     // draw layers in order
// // //     for (const layer of this.layers) {
// // //       try {
// // //         layer.draw();
// // //       } catch (e) {
// // //         // prevent a single layer crash from stopping the loop
// // //         // eslint-disable-next-line no-console
// // //         console.error("Layer draw error:", e);
// // //       }
// // //     }

// // //     requestAnimationFrame(this.animate);
// // //   }
// // // }
