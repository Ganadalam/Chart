// src/indicators/sma.ts
export const sma = (data: { close: number }[], period: number): (number | null)[] => {
  const out: (number | null)[] = [];
  if (period <= 0) return data.map(() => null);

  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].close;
    if (i >= period) {
      sum -= data[i - period].close;
    }
    if (i >= period - 1) {
      out.push(sum / period);
    } else {
      out.push(null);
    }
  }
  return out;
};
