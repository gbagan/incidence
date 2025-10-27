export function repeat<A>(n: number, val: A): A[] {
  const res = new Array(n);
  res.fill(val);
  return res;
}

export function generate<A>(n: number, f: (i: number) => A): A[] {
  const res = new Array(n);
  for (let i = 0; i < n; i++) {
    res[i] = f(i);
  }
  return res;
}

export function range(start: number, end: number, step?: number): number[] {
  const res = [];
  step = step ?? 1;
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      res.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      res.push(i);
    }
  }
  return res
}

export function countBy<A>(arr: A[], pred: (x: A, i: number) => boolean): number {
  let count = 0;
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    if (pred(arr[i], i)) {
      count += 1;
    }
  }
  return count;
}

export const generate2 = <A>(n: number,  m: number, f: (i: number, j: number) => A) => 
  generate(n * m, i => f(i / m | 0, i % m));

export const maximaBy = <A>(arr: readonly A[], f: (a: A) => number): A[] => {
  let maxVal = -Infinity;
  const res: A[] = [];
  for (const a of arr) {
    const val = f(a);
    if (val > maxVal) {
      maxVal = val;
      res.length = 0;
      res.push(a);
    } else if (val === maxVal) {
      res.push(a);
    }
  }
  return res;
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function randomPick<A>(arr: readonly A[]): A | null {
  if (arr.length === 0) {
    return null;
  } else {
    return arr[Math.random() * arr.length | 0];
  }
}