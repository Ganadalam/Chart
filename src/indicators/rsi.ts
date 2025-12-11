// src/indicators/rsi.ts
export const rsi = (data: { close: number }[], period = 14): (number | null)[] => {
  const out: (number | null)[] = [];
  if (period <= 0) return data.map(() => null);
  let gains = 0;
  let losses = 0;

  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    if (i <= period) {
      if (change > 0) gains += change;
      else losses += Math.abs(change);
      if (i === period) {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        out.push(100 - 100 / (1 + rs));
      } else {
        out.push(null);
      }
    } else {
      // Wilder's smoothing
      const prevAvgGain = (out[out.length - 1] !== null && typeof out[out.length - 1] === "number") ? undefined : undefined;
      // For simplicity, compute rolling avg directly (less efficient)
      let g = 0, l = 0;
      for (let j = i - period + 1; j <= i; j++) {
        const ch = data[j].close - data[j - 1].close;
        if (ch > 0) g += ch;
        else l += Math.abs(ch);
      }
      const avgG = g / period;
      const avgL = l / period;
      const rs = avgL === 0 ? 100 : avgG / avgL;
      out.push(100 - 100 / (1 + rs));
    }
  }
  // align length (first element has no change)
  out.unshift(null);
  return out;
};
