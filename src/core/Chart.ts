import { Layer } from "./Layer";

export class Chart {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private layers: Layer[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
  }

  addLayer(layer: Layer) {
    layer.init(this.ctx, {});
    this.layers.push(layer);
  }

  render() {
    this.layers.forEach((layer) => layer.draw());
  }
}
// // src/core/Chart.ts
// import { EventBus } from "./EventBus";
// import { Layer } from "./Layer";
// import { Renderer } from "./Renderer";

// /**
//  * Chart: canvas 기반 차트 엔진의 중심
//  * - scale: px per candle (확대/축소)
//  * - translateX: 전체 x축 오프셋 (팬)
//  * - setData: 전역 데이터(캔들)
//  */
// export class Chart {
//   public canvas: HTMLCanvasElement;
//   public renderer: Renderer;
//   public ctx: CanvasRenderingContext2D;
//   private eventBus = new EventBus();
//   private layers: Layer[] = [];

//   // viewport 상태
//   public scale = 8; // px per candle (기본값)
//   public translateX = 0; // px

//   // 데이터 (시간순으로 정렬된 캔들)
//   private data: { open: number; high: number; low: number; close: number; time?: number }[] = [];

//   constructor(canvas: HTMLCanvasElement) {
//     this.canvas = canvas;
//     this.renderer = new Renderer(canvas);
//     this.ctx = this.renderer.ctx;

//     this.initEvents();
//     this.animate = this.animate.bind(this);
//     requestAnimationFrame(this.animate);
//   }

//   // 레이어 등록 (Chart가 ctx/eventBus/chart 주입)
//   addLayer(layer: Layer): void {
//     layer.init(this.ctx, this.eventBus, this);
//     this.layers.push(layer);
//   }

//   setData(data: { open: number; high: number; low: number; close: number; time?: number }[]): void {
//     this.data = data;
//   }

//   getData(): typeof this.data {
//     return this.data;
//   }

//   // ---------------- Coordinate helpers ----------------
//   indexToX(index: number): number {
//     return index * this.scale + this.translateX;
//   }

//   xToIndex(x: number): number {
//     return Math.floor((x - this.translateX) / this.scale);
//   }

//   // priceToY: 화면에 보이는 데이터의 min/max를 기준으로 매핑
//   priceToY(price: number): number {
//     const { min, max } = this.getVisiblePriceRange();
//     const padding = (max - min) * 0.06 || 1; // 위아래 여유
//     const top = max + padding;
//     const bottom = min - padding;
//     const height = this.canvas.height / (window.devicePixelRatio || 1);
//     const ratio = (price - bottom) / (top - bottom);
//     // y가 위쪽 0부터 증가하므로 반전
//     return height - ratio * height;
//   }

//   private getVisibleIndexRange(): { from: number; to: number } {
//     const widthPx = this.canvas.width / (window.devicePixelRatio || 1);
//     const first = this.xToIndex(0);
//     const last = this.xToIndex(widthPx) + 1;
//     const from = Math.max(0, first);
//     const to = Math.min(Math.max(0, last), this.data.length - 1);
//     return { from, to };
//   }

//   private getVisiblePriceRange(): { min: number; max: number } {
//     const { from, to } = this.getVisibleIndexRange();
//     if (this.data.length === 0 || to < from) return { min: 0, max: 1 };
//     let min = Number.POSITIVE_INFINITY;
//     let max = Number.NEGATIVE_INFINITY;
//     for (let i = from; i <= to; i++) {
//       const d = this.data[i];
//       if (!d) continue;
//       if (d.low < min) min = d.low;
//       if (d.high > max) max = d.high;
//     }
//     if (min === Number.POSITIVE_INFINITY || max === Number.NEGATIVE_INFINITY) {
//       return { min: 0, max: 1 };
//     }
//     return { min, max };
//   }

//   // ---------------- Interaction ----------------
//   private initEvents(): void {
//     // wheel zoom: 마우스 위치 기준으로 scale 변경 (anchor zoom)
//     this.canvas.addEventListener("wheel", (e: WheelEvent) => {
//       e.preventDefault();
//       const rect = this.canvas.getBoundingClientRect();
//       const mouseX = e.clientX - rect.left;
//       const prevIndex = this.xToIndex(mouseX);
//       // zoom factor
//       const factor = e.deltaY < 0 ? 1.12 : 0.88;
//       this.scale = Math.max(2, Math.min(80, this.scale * factor));
//       // keep the same candle under mouse -> adjust translateX
//       const newX = this.indexToX(prevIndex);
//       this.translateX += mouseX - newX;
//     }, { passive: false });

//     // pan with mouse
//     let dragging = false;
//     let lastClientX = 0;
//     this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
//       dragging = true;
//       lastClientX = e.clientX;
//     });
//     window.addEventListener("mouseup", () => (dragging = false));
//     window.addEventListener("mousemove", (e: MouseEvent) => {
//       if (!dragging) return;
//       const dx = e.clientX - lastClientX;
//       lastClientX = e.clientX;
//       this.translateX += dx;
//     });

//     // resize handled in Renderer
//   }

//   // ---------------- Render loop ----------------
//   private animate(): void {
//     this.renderer.clear();

//     // draw layers in order
//     for (const layer of this.layers) {
//       try {
//         layer.draw();
//       } catch (e) {
//         // prevent a single layer crash from stopping the loop
//         // eslint-disable-next-line no-console
//         console.error("Layer draw error:", e);
//       }
//     }

//     requestAnimationFrame(this.animate);
//   }
// }
