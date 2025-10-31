import { randomPick, range } from './util';

export interface IStrategy {
  move(board: number[], prevMove: number | null): number;
}

export class RandomStrategy implements IStrategy {
  move(board: number[], _prevMove: number | null): number {
    const availableMoves = range(0, board.length).filter(i => board[i] === 0);
    return randomPick(availableMoves)!;
  }
}

export class PairingStrategy implements IStrategy {
  move(board: number[], prevMove: number): number {
    let nextMove = prevMove ^ 1;
    if (board[nextMove] === 0) {
      return nextMove;
    } else {
      const availableMoves = range(0, board.length).filter(i => board[i] === 0);
      return randomPick(availableMoves)!;
    }
  }
}

export class ErdosStrategy implements IStrategy {
  #scores: () => readonly number[];

  constructor(scores: () => readonly number[]) {
    this.#scores = scores;
  }

  move(_board: number[], _prevMove: number): number {
    const scores = this.#scores();
    const n = scores.length;
    const max = Math.max(...scores);
    return randomPick(range(0, n).filter(x => scores[x] === max))!;
  }
}

export class DegreeStrategy implements IStrategy {
  #maxdegrees: () => readonly number[];

  constructor(maxdegrees: () => readonly number[]) {
    this.#maxdegrees = maxdegrees;
  }

  move(_board: number[], _prevMove: number): number {
    return randomPick(this.#maxdegrees())!;
  }
}


const computeTable = (n: number, scoreFn: (conf: number, n: number) => number, whoStarts = 0) => {
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
    } else if (((depth + whoStarts) & 1) === 0) { // maker plays
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
  let s = score_table[0];
  let moves = range(0, n).filter(i => score_table[1 << (2 * i)] === s);
  console.log(`score = ${s}, moves = ${moves}`);

  return move_table;
}

function standardScore(conf: number, n: number): number {
  let score = 0;
  for (let i = 0; i < n-1; i++) {
    const v = (conf >> (2 * i)) & 15;
    if (v === 5) {
      score += 1;
    }
  }
  return score;
}

const scoreWithLeftBorder = (conf: number, n: number)  =>
  standardScore(conf, n) + (((conf & 3) === 1) ? 1 : 0);

const scoreWithTwoBorders = (conf: number, n: number)  =>
  standardScore(conf, n) + (((conf & 3) === 1) ? 1 : 0) + (((conf >> (2 * (n - 1)) & 3) === 1) ? 1 : 0);

/*
for (let n = 1; n <= 14; n++) {
  console.log("n =", n);
  computeTable(n+1, scoreWithLeftBorderAndDirective, 0);
  computeTable(n, scoreWithLeftBorder, 1);
}
*/

function scoreWithTwoBordersAndDirective(conf: number, n: number): number {
  const directive = (conf >> (2 * (n-1)) & 3) === 1
  return scoreWithTwoBorders(conf, n - 1) + (directive ? 1 : 0);
}

function scoreWithLeftBorderAndDirective(conf: number, n: number): number {
  const directive = (conf >> (2 * (n-1)) & 3) === 1
  return scoreWithLeftBorder(conf, n - 1) + (directive ? 1 : 0);
}

function standardScoreWithDirective(conf: number, n: number): number {
  const directive = (conf >> (2 * (n-1)) & 3) === 1
  return standardScoreWithDirective(conf, n - 1) + (directive ? 1 : 0);
}

/*
for (let i = 2; i <= 15; i++) {
  computeTable(i, scoreWithTwoBordersAndDirective);
}
*/

//const cycleScore = (conf: number, n: number)  =>
//  standardScore(conf, n) + ((conf & 3) === 1 && ((conf >> (2 * (n - 1)) & 3) === 1) ? 1 : 0)

function scoreFnForLemma26(conf: number): number {
  const score = standardScore(conf, 6);
  const u0 = conf & 3;
  const u0prime = (conf >> 12) & 3;
  return score + (u0 === 1 && u0prime === 1 ? 1 : 0);
}

export class PathMakerStrategy implements IStrategy {
  move(board: number[], _prevMove: number | null): number {
    const segments: [number, number][] = [];
    let start: null | number = null;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 0) {
        if (start === null) {
          start = i;
        }
      } else if (start !== null) {
        segments.push([start, i-1]);
        start = null;
      }
    }
    if (start !== null) {
      segments.push([start, board.length - 1]);
    }

    const makerHasLeftBorder = ([l, _]: [number, number]) => l > 0 && board[l-1] === 1;
    const makerHasRightBorder = ([_, r]: [number, number]) => r < board.length - 1 && board[r+1] === 1;

    const veryNiceSegments = segments.filter(s =>
      makerHasLeftBorder(s) && makerHasRightBorder(s) && s[0] === s[1]
    );
    if (veryNiceSegments.length > 0) {
      return randomPick(veryNiceSegments)![0];
    }

    const niceSegments = segments.filter(s => {
      const size = s[1] - s[0] + 1;
      const left = makerHasLeftBorder(s);
      const right = makerHasRightBorder(s);
      return (
        left && right
        ? size >= 3 && size % 5 !== 1
        : left || right
        ? size % 5 !== 4
        : [3, 4, 5].includes(size % 5) 
      )
    });
    if (niceSegments.length > 0) {
      const segment = randomPick(niceSegments)!;
      if (makerHasLeftBorder(segment)) {
        return segment[0];
      } else if (makerHasRightBorder(segment)) {
        return segment[1];
      } else {
        return segment[0] + 1;
      }
    }
    return randomPick(range(0, board.length).filter(i => board[i] === 0))!;
  }
}


export class PathBreakerStrategy implements IStrategy {
  size: number;
  baseTable: Uint8Array;
  lemma26Table: Uint8Array;
  lemma26Games: number[]
  baseGame: number;

  constructor(n: number, withBorder: boolean = false) {
    this.size = n;
    this.lemma26Games = [];
    while (n > 5) {
      this.lemma26Games.push(0);
      n -= 5;
    }
    this.baseTable = computeTable(n, withBorder ? scoreWithLeftBorder : standardScore);
    this.lemma26Table = computeTable(7, scoreFnForLemma26);
    this.baseGame = 0;
  }

  move(board: number[], prevMove: number, depth: number = 0): number {
    const n = this.size - 5 * depth;
    const m = n - 6;
    //console.log("breakerMove called with prevMove =", prevMove, "depth =", depth, "n =", n, "m =", m, "baseGame =", this.baseGame.toString(4));
    if (n <= 5) {
      this.baseGame |= 1 << (2 * prevMove);
      const move = this.baseTable[this.baseGame];
      if (move === 255) {
          console.log("0: No move found for game =", this.baseGame.toString(4), "at depth", depth);
        }
      this.baseGame |= 2 << (2 * move);
      return move;
    } else if (prevMove < m) {
      const move = this.move(board, prevMove, depth+1);
      if (move < m) {
        return move;
      } else {
        // Lemma 26, Left has played on u0'
        let game = this.lemma26Games[depth];
        game |= 1 << (2 * 6);
        const answer = this.lemma26Table[game];
        if (move === 255) {
          console.log("1: No move found for game =", game.toString(4), "at depth", depth);
        }
        game |= 2 << (2 * answer);
        this.lemma26Games[depth] = game;
        return answer + m;
      }
    } else {
      // Lemma 26, Left has played on {u0, ..., u5}
      let game = this.lemma26Games[depth]
      game |= 1 << (2 * (prevMove - m));
      const move = this.lemma26Table[game];
      if (move === 255) {
        console.log("2: No move found for game =", game.toString(4), "at depth", depth);
      }
      game |= 2 << (2 * move);
      this.lemma26Games[depth] = game;
      if (move === 6) { // u0'
        //console.log("lemma 26, answer on u0', depth = ", depth, "m=", m, "game =", game.toString(4));
        return this.move(board, m, depth)
      } else {
        return move + m;
      }
    }
  }
}

export class CycleBreakerStrategy implements IStrategy {
  size: number;
  pathStrat: PathBreakerStrategy;
  firstMove: number | null;

  constructor(n: number) {
    this.size = n;
    this.pathStrat = new PathBreakerStrategy(n - 2, true);
    this.firstMove = null;
  }

  move(board: number[], prevMove: number): number {
    if (this.firstMove === null) {
      this.firstMove = prevMove;
      return (prevMove + this.size - 1) % this.size;
    } else {
      const move = this.pathStrat.move(board, (prevMove - this.firstMove - 1 + this.size) % this.size);
      return (move + this.firstMove + 1) % this.size;
    }
  }
}
