export class WorkerRenderer {
  // 실제 worker offscreen 구현은 프로젝트 상황에 맞게 추가
  constructor(canvas: HTMLCanvasElement) {
    // placeholder: 나중에 OffscreenCanvas / Worker와 통신
    console.warn("WorkerRenderer: offscreen worker is not implemented in this stub.");
  }

  // 예: chart.render -> worker.postMessage(...)
  postRender(payload: any) {
    // stub
  }
}
// // src/core/WorkerRenderer.ts
// export class WorkerRenderer {
//   private worker: Worker;

//   constructor(canvas: HTMLCanvasElement) {
//     if (!(canvas as any).transferControlToOffscreen) {
//       throw new Error("OffscreenCanvas not supported in this browser");
//     }
//     const off = (canvas as any).transferControlToOffscreen();
//     this.worker = new Worker(new URL("../workers/renderWorker.ts", import.meta.url), { type: "module" });
//     this.worker.postMessage({ type: "init", canvas: off }, [off]);
//   }

//   postMessage(msg: any) {
//     this.worker.postMessage(msg);
//   }

//   dispose() {
//     this.worker.terminate();
//   }
// }
// // export class WorkerRenderer {
// //   private worker: Worker;

// //   constructor(canvas: HTMLCanvasElement) {
// //     if (!(canvas.transferControlToOffscreen)) throw new Error("OffscreenCanvas not supported");
// //     const offscreen = canvas.transferControlToOffscreen();
// //     this.worker = new Worker(new URL("../workers/renderWorker.ts", import.meta.url), { type: "module" });
// //     this.worker.postMessage({ canvas: offscreen }, [offscreen]);
// //   }

// //   updateLayers(layers: any[]) {
// //     this.worker.postMessage({ layers });
// //   }
// // }
