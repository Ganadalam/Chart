export function generateData(n: number) {
  const data = [];
  let last = 200;
  for (let i = 0; i < n; i++) {
    const open = last + (Math.random() - 0.5) * 10;
    const close = open + (Math.random() - 0.5) * 10;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    data.push({ open, close, high, low });
    last = close;
  }
  return data;
}
// // src/mock/generateData.ts
// export function generateData(count = 300) {
//   const data: { open: number; high: number; low: number; close: number; time?: number }[] = [];
//   let price = 1000;
//   const now = Date.now();

//   for (let i = 0; i < count; i++) {
//     const open = price;
//     const change = (Math.random() - 0.5) * 20;
//     const close = Math.max(1, open + change);
//     const high = Math.max(open, close) + Math.random() * 8;
//     const low = Math.min(open, close) - Math.random() * 8;
//     price = close;
//     data.push({ open, high, low, close, time: now - (count - i) * 60 * 1000 });
//   }

//   return data;
// }
