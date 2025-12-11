import { useEffect, useRef } from "react";
import { Chart } from "./core/Chart";
import { CandleLayer } from "./layers/CandleLayer";
import { CrosshairLayer } from "./layers/CrosshairLayer";
import { SmaLayer } from "./layers/SmaLayer";
import { generateData } from "./mock/generateData";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = 900;
    canvas.height = 500;
    const chart = new Chart(canvas);

    let data = generateData(300);

    const candleLayer = new CandleLayer(data);
    const crosshair = new CrosshairLayer();
    const smaLayer = new SmaLayer(data, 20);

    chart.addLayer(candleLayer);
    chart.addLayer(smaLayer);
    chart.addLayer(crosshair);

    const tooltip = tooltipRef.current!;
    function renderLoop() {
      candleLayer.setData(data);
      smaLayer.setData(data);
      chart.render();

      // Tooltip
      const mouse = crosshair.getMouse();
      if (mouse.x >= 0) {
        const i = Math.floor(mouse.x / 8);
        const d = data[i];
        if (d) {
          tooltip.style.display = "block";
          tooltip.style.left = mouse.x + 10 + "px";
          tooltip.style.top = mouse.y + 10 + "px";
          tooltip.innerHTML = `O: ${d.open.toFixed(2)}<br>C: ${d.close.toFixed(2)}<br>H: ${d.high.toFixed(2)}<br>L: ${d.low.toFixed(2)}`;
        }
      } else {
        tooltip.style.display = "none";
      }

      requestAnimationFrame(renderLoop);
    }
    renderLoop();

    // WebSocket 시뮬: 1초마다 새로운 틱
    const interval = setInterval(() => {
      const last = data[data.length - 1];
      const open = last.close;
      const close = open + (Math.random() - 0.5) * 10;
      const high = Math.max(open, close) + Math.random() * 5;
      const low = Math.min(open, close) - Math.random() * 5;
      data.push({ open, close, high, low });
      if (data.length > 300) data.shift();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <canvas ref={canvasRef} style={{ border: "1px solid #333" }} />
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "4px 6px",
          borderRadius: "4px",
          display: "none",
          fontSize: "12px"
        }}
      />
    </div>
  );
}
// // src/App.tsx
// import React, { useEffect, useRef } from "react";
// import { Chart } from "./core/Chart";
// import { CandleLayer } from "./layers/CandleLayer";
// import { CrosshairLayer } from "./layers/CrosshairLayer";
// import { generateData } from "./mock/generateData";

// export default function App(): JSX.Element {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current!;
//     // CSS 크기 먼저 지정 (렌더러가 이를 읽어 DPR 적용)
//     canvas.style.width = "900px";
//     canvas.style.height = "500px";

//     const chart = new Chart(canvas);
//     const data = generateData(600);

//     chart.addLayer(new CandleLayer(data));
//     chart.addLayer(new CrosshairLayer());
//   }, []);

//   return (
//     <div style={{ padding: 10 }}>
//       <canvas ref={canvasRef} style={{ border: "1px solid #333", display: "block" }} />
//       <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
//         Canvas-based real-time candlestick engine — demo
//       </div>
//     </div>
//   );
// }
