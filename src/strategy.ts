const computeTable = (n: number) => {
  const table = new Uint8Array(3 << (2 * (n-1)));
  table.fill(255)

  function backtrack(depth: number, conf: number) {
    if (table[conf] !== 255) {
      return table[conf];
    } else if (depth === n) {
      let score = 0;
      for (let i = 0; i < n; i++) {
        const v = (conf >> (2 * i)) & 15;
        if (v === 5) {
          score += 1;
        }
      }
      table[conf] = score;
      return score;
    } else if ((depth & 1) === 0) { // maker plays
      let best = 0;
      for (let i = 0; i < n; i++) {
        if (((conf >> (2 * i)) & 3) === 0) {
          best = Math.max(best, backtrack(depth + 1, conf | (1 << (2 * i))));
        }
      }
      table[conf] = best;
      return best;
    } else { // breaker plays
      let worst = n;
      for (let i = 0; i < n; i++) {
        if (((conf >> (2 * i)) & 3) === 0) {
          worst = Math.min(worst, backtrack(depth + 1, conf | (2 << (2 * i))));
        }
      }
      table[conf] = worst;
      return worst;
    }
  }

  backtrack(0, 0);
  return table;
}



const startTime = performance.now();
export const table = computeTable(13)
const endTime = performance.now();
console.log(`Table computed in ${endTime - startTime} ms`);


// table 15: 1400 ms