// src/indicators/ema.ts
export const ema = (data: { close: number }[], period: number): (number | null)[] => {
  const out: (number | null)[] = [];
  if (period <= 0) return data.map(() => null);
  const k = 2 / (period + 1);
  let prev: number | null = null;
  for (let i = 0; i < data.length; i++) {
    const price = data[i].close;
    if (prev === null) {
      prev = price; // seed with first price (or use SMA of first period)
      out.push(null);
    } else {
      prev = price * k + prev * (1 - k);
      out.push(prev);
    }
  }
  return out;
};
