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

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function randomPick<A>(arr: A[]): A | null {
  if (arr.length === 0) {
    return null;
  } else {
    return arr[Math.random() * arr.length | 0];
  }
}