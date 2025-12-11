export abstract class Layer {
  protected ctx!: CanvasRenderingContext2D;
  protected eventBus: any;

  init(ctx: CanvasRenderingContext2D, eventBus: any) {
    this.ctx = ctx;
    this.eventBus = eventBus;
  }

  abstract draw(): void;
}

// // src/core/Layer.ts
// import { EventBus } from "./EventBus";
// import { Chart } from "./Chart";

// export abstract class Layer {
//   protected ctx!: CanvasRenderingContext2D;
//   protected eventBus!: EventBus;
//   protected chart!: Chart;

//   /** init은 Chart가 호출해서 ctx/eventBus/chart를 주입합니다 */
//   init(ctx: CanvasRenderingContext2D, eventBus: EventBus, chart: Chart): void {
//     this.ctx = ctx;
//     this.eventBus = eventBus;
//     this.chart = chart;
//   }

//   /** 각 Layer는 draw()를 구현 */
//   abstract draw(): void;
// }
