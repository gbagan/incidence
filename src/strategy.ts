const computeTable = (n: number, scoreFn: (conf: number, n: number) => number) => {
  const score_table = new Uint8Array(3 << (2 * (n-1)));
  score_table.fill(255);
  const move_table = new Uint8Array(3 << (2 * (n-1)));
  move_table.fill(255);

  function backtrack(depth: number, conf: number) {
    if (score_table[conf] !== 255) {
      return score_table[conf];
    } else if (depth === n) {
      const score = score_table[conf] = scoreFn(conf, n);
      return score;
    } else if ((depth & 1) === 0) { // maker plays
      let best = 0;
      let bestMove = 255;
      for (let i = 0; i < n; i++) {
        if (((conf >> (2 * i)) & 3) === 0) {
          const nextBest = backtrack(depth + 1, conf | (1 << (2 * i)));
          if (nextBest > best) {
            best = nextBest;
            bestMove = i;
          }
        }
      }
      score_table[conf] = best;
      move_table[conf] = bestMove;
      return best;
    } else { // breaker plays
      let worst = 255;
      let bestMove = 255;
      for (let i = 0; i < n; i++) {
        if (((conf >> (2 * i)) & 3) === 0) {
          const nextWorst = backtrack(depth + 1, conf | (2 << (2 * i)));
          if (nextWorst < worst) {
            worst = nextWorst;
            bestMove = i;
          }
        }
      }
      score_table[conf] = worst;
      move_table[conf] = bestMove;
      return worst;
    }
  }

  backtrack(0, 0);
  return move_table;
}

function scoreFn(conf: number, n: number): number {
  let score = 0;
  for (let i = 0; i < n-1; i++) {
    const v = (conf >> (2 * i)) & 15;
    if (v === 5) {
      score += 1;
    }
  }
  return score;
}

function scoreFnForLemma26(conf: number): number {
  const score = scoreFn(conf, 6);
  const u0 = conf & 3;
  const u0prime = (conf >> 12) & 3;
  return score + (u0 === 1 && u0prime === 1 ? 1 : 0);
}

class BrekerStrategy {
  size: number;
  baseTable: Uint8Array;
  lemma26Table: Uint8Array;
  lemma26Games: number[]
  baseGame: number;

  constructor(n: number) {
    this.size = n;
    this.lemma26Games = [];
    while (n > 5) {
      this.lemma26Games.push(0);
      n -= 5;
    }
    this.baseTable = computeTable(n, scoreFn);
    this.lemma26Table = computeTable(7, scoreFnForLemma26);
    this.baseGame = 0;
  }

  breakerMove(prevMove: number, depth: number = 0): number {
    const n = this.size - 5 * depth;
    const m = n - 6;
    if (n <= 5) {
      this.baseGame |= 1 << (2 * prevMove);
      const move = this.baseTable[this.baseGame];
      this.baseGame |= 2 << (2 * move);
      return move;
    } else if (prevMove < m) {
      const move = this.breakerMove(prevMove, depth+1);
      if (move < m) {
        return move;
      } else {
        // Lemma 26, Left has played on u0'
        let game = this.lemma26Games[depth];
        game |= 1 << (2 * 6);
        const answer = this.lemma26Table[game];
        game |= 2 << (2 * answer);
        this.lemma26Games[depth] = game;
        return answer + m;
      }
    } else {
      // Lemma 26, Left has played on {u0, ..., u5}
      let game = this.lemma26Games[depth]
      game |= 1 << (2 * (prevMove - m));
      const move = this.lemma26Table[game];
      game |= 2 << (2 * move);
      this.lemma26Games[depth] = game;
      if (move === 6) { // u0'
        return this.breakerMove(m, depth+1)
      } else {
        return move + m;
      }
    }
  }
}

let strat =  new BrekerStrategy(7);
let m1 = strat.breakerMove(1);
console.log("answer to 1, m1 =", m1);
let m2 = strat.breakerMove(0);
console.log("answer to 0, m2 =", m2);
let m3 = strat.breakerMove(5);
console.log("answer to 5, m3 =", m3);
let m4 = strat.breakerMove(3);
console.log("answer to 3, m4 =", m4);