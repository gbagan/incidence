import { repeat } from "./util";

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

class PathStruct {
  table: Uint8Array;
  lemma26Table: Uint8Array;
  games: (0 | 1 | 2)[][]

  constructor(n: number) {
    this.games = [];
    while (n > 0) {
      this.games.push(repeat(n, 0) as (0 | 1 | 2)[]);
      n -= 5;
    }
    this.table = computeTable(n + 5, scoreFn);
    this.lemma26Table = computeTable(7, scoreFnForLemma26);
  }

  breakerMove(prevMove: number, depth: number = 0): number {
    const game = this.games[depth];
    const n = game.length;
    game[prevMove] = 1;
    if (n <= 5) {
      const encoding = game.reduce((acc: number, v, i) => acc | (v << (2 * i)), 0);
      const move = this.table[encoding];
      game[move] = 2;
      return move;
    } else if (prevMove < n - 6) {
      const m = this.breakerMove(prevMove, depth+1);
      game[m] = 2;
      return m;
    } else {
      // Lemma 26
      const m = n - 6;
      const encoding =
        game.slice(m).reduce((acc: number, v, i) => acc | (v << (2 * i)), 0);
        + this.games[depth+1][m] << 12;
      const move = this.lemma26Table[encoding];
      game[move + m] = 2;
      return move + m;
    }
  }
}

// table 15: 1400 ms