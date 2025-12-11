import React, { useEffect, useRef, useState } from "react";
import { Chart } from "./core/Chart";
import { CandleLayer } from "./layers/CandleLayer";
import { SmaLayer } from "./layers/SmaLayer";
import { AxisLayer } from "./layers/AxisLayer";
import { CrosshairLayer } from "./layers/CrosshairLayer";
import { FpsLayer } from "./layers/FpsLayer";
import { generateData } from "./mock/generateData";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = "900px";
    canvas.style.height = "500px";
    canvas.width = 900 * dpr;
    canvas.height = 500 * dpr;

    const c = new Chart(canvas);
    const data = generateData(300);
    c.setCandles(data);
    setChart(c);

    const ctx = canvas.getContext("2d")!;

    const candleLayer = new CandleLayer(data);
    const smaLayer = new SmaLayer(data, 20);
    const axisLayer = new AxisLayer(6);
    const crosshair = new CrosshairLayer();
    const fpsLayer = new FpsLayer();

    candleLayer.init(ctx, c.getEventBus(), c);
    smaLayer.init(ctx, c.getEventBus(), c);
    axisLayer.init(ctx, c.getEventBus(), c);
    crosshair.init(ctx, c.getEventBus(), c);
    fpsLayer.init(ctx, c.getEventBus(), c);

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      axisLayer.draw();
      candleLayer.draw();
      smaLayer.draw();
      crosshair.draw();
      fpsLayer.draw();
      requestAnimationFrame(render);
    }
    render();

    const interval = setInterval(() => {
      const last = c.getCandles().slice(-1)[0];
      const p = last.close + (Math.random() - 0.5) * 10;
      c.pushTick(p, Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} style={{ border: "1px solid #333" }} />;
}
// import React, { useEffect, useRef } from "react";
// import { Chart } from "./core/Chart";
// import { WorkerRenderer } from "./core/WorkerRenderer";
// import { CandleLayer } from "./layers/CandleLayer";
// import { CrosshairLayer } from "./layers/CrosshairLayer";
// import { SmaLayer } from "./layers/SmaLayer";
// import { AxisLayer } from "./layers/AxisLayer";
// import { generateData } from "./mock/generateData";
// import { EventBus } from "./core/EventBus";

// export default function App() {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const useWorker = false; // off by default to keep it simple

//   useEffect(() => {
//     const canvas = canvasRef.current!;
//     // CSS size
//     canvas.style.width = "900px";
//     canvas.style.height = "500px";
//     const dpr = window.devicePixelRatio || 1;
//     canvas.width = Math.round(900 * dpr);
//     canvas.height = Math.round(500 * dpr);

//     const chart = new Chart(canvas);
//     const data = generateData(300);
//     chart.setCandles(data);

//     const eventBus = chart.getEventBus();

//     // create layers
//     const candleLayer = new CandleLayer(data);
//     const smaLayer = new SmaLayer(data, 20);
//     const axisLayer = new AxisLayer(6);
//     const crosshair = new CrosshairLayer();

//     // init
//     const ctx = canvas.getContext("2d")!;
//     candleLayer.init(ctx, eventBus, chart);
//     smaLayer.init(ctx, eventBus, chart);
//     axisLayer.init(ctx, eventBus, chart);
//     crosshair.init(ctx, eventBus, chart);

//     // simple render loop
//     function render() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       axisLayer.draw();
//       candleLayer.draw();
//       smaLayer.draw();
//       crosshair.draw();
//       requestAnimationFrame(render);
//     }
//     render();

//     // simulate ticks
//     const interval = setInterval(() => {
//       const last = chart.getCandles().slice(-1)[0] || { close: 200, open: 200, high: 200, low: 200, time: Date.now() };
//       const p = last.close + (Math.random() - 0.5) * 10;
//       chart.pushTick(p, Date.now());
//     }, 1000);

//     return () => { clearInterval(interval); };
//   }, []);

//   return (
//     <div style={{ position: "relative" }}>
//       <canvas ref={canvasRef} style={{ border: "1px solid #333", display: "block" }} />
//     </div>
//   );
// }
// // // src/App.tsx
// // import React, { useEffect, useRef } from "react";
// // import { Chart } from "./core/Chart";
// // import { WorkerRenderer } from "./core/WorkerRenderer";
// // import { CandleLayer } from "./layers/CandleLayer";
// // import { CrosshairLayer } from "./layers/CrosshairLayer";
// // import { SmaLayer } from "./layers/SmaLayer";
// // import { AxisLayer } from "./layers/AxisLayer";
// // import { generateData } from "./mock/generateData";

// // export default function App() {
// //   const canvasRef = useRef<HTMLCanvasElement | null>(null);
// //   const tooltipRef = useRef<HTMLDivElement | null>(null);
// //   const useWorker = true; // toggle here

// //   useEffect(() => {
// //     const canvas = canvasRef.current!;
// //     // set CSS size first (Renderer/Worker might read)
// //     canvas.style.width = "900px";
// //     canvas.style.height = "500px";
// //     // set actual pixel size for offscreen too
// //     const dpr = window.devicePixelRatio || 1;
// //     canvas.width = Math.round(900 * dpr);
// //     canvas.height = Math.round(500 * dpr);

// //     const chart = new Chart(canvas);
// //     const data = generateData(300);
// //     chart.setCandles(data);

// //     // layers (main thread)
// //     const candleLayer = new CandleLayer(data);
// //     const smaLayer = new SmaLayer(data, 20);
// //     const crosshair = new CrosshairLayer();
// //     const axisLayer = new AxisLayer(data, 8);

// //     if (useWorker) {
// //       // enable worker renderer
// //       const wr = new WorkerRenderer(canvas);
// //       chart.setWorkerRenderer(wr as any);
// //     } else {
// //       // main thread init for layers
// //       const ctx = canvas.getContext("2d")!;
// //       candleLayer.init(ctx, chart.getEventBus(), chart);
// //       smaLayer.init(ctx, chart.getEventBus(), chart);
// //       axisLayer.init(ctx, chart.getEventBus());
// //       crosshair.init(ctx, chart.getEventBus(), chart);

// //       // subscribe to chart update
// //       chart.getEventBus().on("chart:update", (payload) => {
// //         // update layers' data and redraw
// //         candleLayer.setData(payload.candles || []);
// //         smaLayer.setData(payload.candles || []);
// //         axisLayer.setData(payload.candles || []);
// //         // direct draw (since chart doesn't have a render loop here)
// //         ctx.clearRect(0, 0, canvas.width, canvas.height);
// //         axisLayer.draw();
// //         candleLayer.draw();
// //         smaLayer.draw();
// //         crosshair.draw();
// //       });
// //     }

// //     // simulate incoming ticks
// //     const interval = setInterval(() => {
// //       const last = chart.getCandles().slice(-1)[0] || { close: 200 };
// //       const p = last.close + (Math.random() - 0.5) * 10;
// //       chart.pushTick(p, Date.now());
// //     }, 1000);

// //     return () => { clearInterval(interval); };
// //   }, []);

// //   return (
// //     <div style={{ position: "relative" }}>
// //       <canvas ref={canvasRef} style={{ border: "1px solid #333", display: "block" }} />
// //       <div ref={tooltipRef} style={{ position: "absolute", pointerEvents: "none" }} />
// //     </div>
// //   );
// // }

// // // import { useEffect, useRef } from "react";
// // // import { CandleLayer } from "./layers/CandleLayer";
// // // import { CrosshairLayer } from "./layers/CrosshairLayer";
// // // import { SmaLayer } from "./layers/SmaLayer";
// // // import { AxisLayer } from "./layers/AxisLayer";
// // // import { generateData } from "./mock/generateData";
// // // import { EventBus } from "./core/EventBus";

// // // export default function App() {
// // //   const canvasRef = useRef<HTMLCanvasElement | null>(null);
// // //   const tooltipRef = useRef<HTMLDivElement | null>(null);

// // //   useEffect(() => {
// // //     const canvas = canvasRef.current!;
// // //     canvas.width = 900;
// // //     canvas.height = 500;

// // //     const ctx = canvas.getContext("2d")!;
// // //     const eventBus = new EventBus();  // ← 추가! 모든 레이어에 넣을 eventBus

// // //     let data = generateData(300);

// // //     const candleLayer = new CandleLayer(data);
// // //     const smaLayer = new SmaLayer(data, 20);
// // //     const crosshair = new CrosshairLayer();
// // //     const axisLayer = new AxisLayer(data, 8);

// // //     // 반드시 eventBus와 함께 초기화
// // //     candleLayer.init(ctx, eventBus);
// // //     smaLayer.init(ctx, eventBus);
// // //     axisLayer.init(canvas.getContext("2d")!);
// // //     crosshair.init(ctx, eventBus);

// // //     const tooltip = tooltipRef.current!;

// // //     function renderLoop() {
// // //       candleLayer.setData(data);
// // //       smaLayer.setData(data);
// // //       axisLayer.setData(data);

// // //       ctx.clearRect(0, 0, canvas.width, canvas.height);

// // //       axisLayer.draw();
// // //       candleLayer.draw();
// // //       smaLayer.draw();
// // //       crosshair.draw();

// // //       // Tooltip
// // //       const mouse = crosshair.getMouse();
// // //       if (mouse.x >= 0) {
// // //         const i = Math.floor(mouse.x / 8);
// // //         const d = data[i];
// // //         if (d) {
// // //           tooltip.style.display = "block";
// // //           tooltip.style.left = mouse.x + 10 + "px";
// // //           tooltip.style.top = mouse.y + 10 + "px";
// // //           tooltip.innerHTML = `
// // //             O: ${d.open.toFixed(2)}<br/>
// // //             C: ${d.close.toFixed(2)}<br/>
// // //             H: ${d.high.toFixed(2)}<br/>
// // //             L: ${d.low.toFixed(2)}
// // //           `;
// // //         }
// // //       } else {
// // //         tooltip.style.display = "none";
// // //       }

// // //       requestAnimationFrame(renderLoop);
// // //     }
// // //     renderLoop();

// // //     // WebSocket 시뮬
// // //     const interval = setInterval(() => {
// // //       const last = data[data.length - 1];
// // //       const open = last.close;
// // //       const close = open + (Math.random() - 0.5) * 10;
// // //       const high = Math.max(open, close) + Math.random() * 5;
// // //       const low = Math.min(open, close) - Math.random() * 5;
// // //       data.push({ open, close, high, low });
// // //       if (data.length > 300) data.shift();
// // //     }, 1000);

// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   return (
// // //     <div style={{ position: "relative" }}>
// // //       <canvas ref={canvasRef} style={{ border: "1px solid #333" }} />
// // //       <div
// // //         ref={tooltipRef}
// // //         style={{
// // //           position: "absolute",
// // //           pointerEvents: "none",
// // //           background: "rgba(0,0,0,0.7)",
// // //           color: "white",
// // //           padding: "4px 6px",
// // //           borderRadius: "4px",
// // //           display: "none",
// // //           fontSize: "12px"
// // //         }}
// // //       />
// // //     </div>
// // //   );
// // // }
