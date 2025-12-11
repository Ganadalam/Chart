import { Layer } from "../core/Layer";

export class SmaLayer extends Layer {
  private data: any[];
  private period: number;

  constructor(data: any[], period = 20) {
    super();
    this.data = data;
    this.period = period;
  }

  setData(data: any[]) {
    this.data = data;
  }

  private calcSMA() {
    const out: number[] = [];
    for (let i = 0; i < this.data.length; i++) {
      if (i < this.period) {
        out.push(NaN);
        continue;
      }
      const slice = this.data.slice(i - this.period, i);
      const avg = slice.reduce((sum, d) => sum + d.close, 0) / this.period;
      out.push(avg);
    }
    return out;
  }

  draw() {
    const ctx = this.ctx;
    const sma = this.calcSMA();
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    sma.forEach((v, i) => {
      if (isNaN(v)) return;
      const x = i * 8; // candleWidth + spacing ~ 6+2
      if (i === this.period) ctx.moveTo(x, v);
      else ctx.lineTo(x, v);
    });
    ctx.stroke();
  }
}
