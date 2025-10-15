<script lang="ts">
  import { RotateCcw } from '@lucide/svelte';
  import type { Edge, Graph, Strategy, Variant } from "./types";
  import { countBy, delay, generate, generate2, maximaBy, randomPick, range, repeat } from "./util";
  import { type IStrategy, PathBreakerStrategy, CycleBreakerStrategy } from "./strategy";
  import Menubar from "./components/Menubar.svelte";
  import Button from "./components/Button.svelte";
  import Info from "./components/Info.svelte";
  // import Logo from "./components/Logo.svelte";
  import Board from './components/Board.svelte';
  import Resize from "./components/Resize.svelte";

  let graph = $state<Graph>("cycle");
  let variant = $state<Variant>("makermaker");
  let strategy = $state<Strategy>("random");

  let sizeLimit = $derived.by(() => {
    switch (graph) {
      case "path":
      case "cycle": return { rowMin: 1, rowMax: 1, colMin: 5, colMax: 30 };
      case "grid": return { rowMin: 2, rowMax: 8, colMin: 2, colMax: 8 };
      case "triangle":
      case "hypergraph": return { rowMin: 2, rowMax: 10, colMin: 2, colMax: 8 };
    }
  });


  //let turn: 1 | 2 = $state(1);
  let showStrat = $state(false);

  let rowCount = $derived.by(() => {
    switch (graph) {
      case "path":
      case "cycle": return 1;
      case "grid": return 8;
      case "triangle":
      case "hypergraph": return 10;
    }
  });

  let colCount = $derived.by(() => {
    switch (graph) {
      case "path":
      case "cycle": return 18;
      case "grid":
      case "triangle":
      case "hypergraph": return 8;
    }
  });

  let nodeCount = $derived(colCount * rowCount);

  let nodes: {x: number, y: number}[] = $derived.by(() => {
    switch (graph) {
      case "path":
        return generate(nodeCount, i => ({
          x: i < 8 ? 50 + i * 60 : i < 16 ? 530 : 50 + (23 - i) * 60,
          y: i < 8 ? 80 : i < 16 ? 80 + (i - 8) * 60 : 500
        }));
      case "cycle":
        return generate(nodeCount, i => {
          const angle = 2 * Math.PI * i / nodeCount - Math.PI/2; // start top
          const x = 300 + 250 * Math.cos(angle);
          const y = 300 + 250 * Math.sin(angle);
          return { x, y };
        });
      case "grid":
        return generate2(rowCount, colCount, (row, col) => ({x: 40 + 75 * col, y: 40 + 75 * row}));
      case "triangle":
      case "hypergraph":
        const h = Math.sqrt(3) / 2;
        return generate2(10, 8, (row, col) => ({x: (row % 2 === 0 ? 20 : 55) + 70 * col, y: 20 + 70 * h * row}));
    }
  })

  const edges: [number, number][] = $derived.by(() => {
    switch (graph) {
      case "path": return generate(nodeCount - 1, i => [i, i + 1]);
      case "cycle": return generate(nodeCount, i => [i, (i+1) % nodeCount]);
      case "grid": return [
        ...generate2(rowCount, colCount-1, (i, j) => [colCount * i + j, colCount * i + j + 1] as Edge),
        ...generate2(rowCount-1, colCount, (i, j) => [colCount * i + j, colCount * i + j + colCount] as Edge)
      ];
      case "triangle":
      case "hypergraph":
        return [
        ...generate2(10, 7, (i, j) => [8 * i + j, 8 * i + j + 1] as Edge),
        ...generate2(9, 8, (i, j) => [8 * i + j, 8 * i + j + 8] as Edge),
        ...generate2(9, 7, (i, j) =>
          i % 2 === 0 
          ? [8 * i + j + 1, 8 * i + j + 8] as Edge
          : [8 * i + j, 8 * i + j + 9] as Edge
        )
      ];
    }
  })

  const wsets: number[][] = $derived.by(() => {
    if (graph !== "hypergraph") {
      return edges;
    } else {
      const sets: number[][] = [];
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 7; j++) {
          const a = 8 * i + j;
          const b = a + 1;
          const c = 8 * (i + 1) + j + i % 2;
          sets.push([a, b, c]);
        }
      }
      for (let i = 1; i < 10; i++) {
        for (let j = 0; j < 7; j++) {
          const a = 8 * i + j;
          const b = a + 1;
          const c = a - 8 + i % 2;
          sets.push([a, b, c]);
        }
      }
      return sets;
    }
  })

  let position = $derived(repeat(nodeCount, 0));

  let strategyObj: IStrategy | null = $derived(
    graph !== "path" && graph !== "cycle" || variant !== "maker" || strategy !== "optimal"
    ? null
    : graph === "path"
    ? new PathBreakerStrategy(nodeCount)
    : new CycleBreakerStrategy(nodeCount) // cycle
  )

  let restart = async () => {
    if (strategy === "pairing" && (variant === "breaker" || graph !== "path" && graph !== "cycle")
      || strategy === "degree" && graph === "hypergraph"
      || strategy === "optimal" && graph !== "path" && graph !== "cycle"
    ) {
      strategy = "random";
    }

    position = repeat(nodeCount, 0);
    //turn = 1;
    if (variant !== "breaker") {
      showStrat = false;
    } else {
      showStrat = true;
      await delay(1000);
      showStrat = false;
      let move = computerMove(null);
      if (move !== null) {
        position = position.with(move, 1);
      }
    }

  }


  let score1 = $derived(countBy(wsets, (set => set.every(x => position[x] === 1))));
  let score2 = $derived(countBy(wsets, (set => set.every(x => position[x] === 2))));
 
  let pairing: [number, number][] | null = $derived(
    (graph === "cycle" || graph === "path") && strategy === "pairing"
    ? generate(nodeCount >> 1, i => [2*i, 2*i+1])
    : null
  );

  function erdosSelfridge(position: number[]): number {
    let score = 0;
    for (const set of wsets) {
      if (set.every(x => position[x] !== 2)) {
        const c = countBy(set, x => position[x] === 0);
        score += 1 / (4 ** c);
      }
    }
    return score;
  }

  let erdosScores = $derived.by(() => {
    if (strategy !== "erdos") {
      return null;
    }
    const n = nodeCount;
    const table = repeat(n, -Infinity);
    for (let i = 0; i < n; i++) {
      if (position[i] === 0) {
        table[i] = erdosSelfridge(position.with(i, 1));
      }
    }

    const min = Math.min(...table.filter(x => x !== -Infinity));
    const max = Math.max(...table);

    return table.map(x => x === -Infinity ? -Infinity : min === max ? 0 : (x - min) / (max - min));
  });

  let degrees: number[] = $derived.by(() => {
    const deg = repeat(nodeCount, 0);
    for (const [u, v] of edges) {
      deg[u]++;
      deg[v]++;
    }
    return deg;
  });

  let maxDegrees = $derived.by(() => {
    if (strategy !== "degree") {
      return null;
    }

    return maximaBy(
      range(0, nodeCount).filter(i => position[i] === 0),
      i => degrees[i]
    )
  });

  const computerMove = (prevMove: number | null): number | null => {
    const n = position.length;
    switch (strategy) {
      case "random":
        return randomPick(range(0, n).filter(i => position[i] === 0));
      case "degree":
        if (maxDegrees === null) {
          return null;
        }
        return randomPick(maxDegrees);
      case "erdos":
        if (erdosScores === null) {
          return null;
        }
        let max = Math.max(...erdosScores);
        if (max === -Infinity) {
          return null;
        }
        return randomPick(range(0, n).filter(x => erdosScores[x] === max));
      case "pairing":
        if (pairing === null) {
          return null;
        }
        for (const [u, v] of pairing) {
          if (prevMove === u) {
            return v;
          } else if (prevMove === v) {
            return u;
          }
        }
        return randomPick(range(0, n).filter(i => position[i] === 0));
      case "optimal":
        if (prevMove === null) { // todo
          return null;
        }
        return strategyObj?.breakerMove(prevMove) ?? null
    }
  }

  const play = async (i: number) => {
    let turn = variant === "breaker" ? 2 : 1;
    let oppositeTurn = turn === 1 ? 2 : 1;

    if (position[i] !== 0 || showStrat) {
      return;
    }
    position = position.with(i, turn);
    showStrat = true;
    await delay(1000);
    showStrat = false;
    let move = computerMove(i);
    if (move !== null) {
      position = position.with(move, oppositeTurn);
    }
  }

  const resize = (r: number, c: number) => {
    if (r < sizeLimit.rowMin || r > sizeLimit.rowMax || c < sizeLimit.colMin || c > sizeLimit.colMax) {
      return;
    }
    rowCount = r;
    colCount = c;
  }
</script>

<div class="vflex">
  <Menubar {variant} {graph} {strategy}
    setVariant={v => { variant = v; restart() }}
    setGraph={g => {graph = g; restart() }}
    setStrategy={s => { strategy = s; restart() }}
  />
  <div class="wrap">
    <main class="center-card">
      <div class="board-wrap">
        <div class="scores">
          <span class="score1">Score d'Alice: {score1}</span>
          <span class="score2">Score de Bob: {variant !== "makermaker" ? "ø" : score2}</span>
          <Button onclick={restart}><RotateCcw size={20} /></Button>
        </div>
        <div class="resizable-board">
          <Resize {rowCount} {colCount} {sizeLimit} {resize} />
          <Board
            {nodes}
            {edges}
            {wsets}
            {position}
            {play}
            {graph}
            {variant}
            {pairing}
            {showStrat}
            {erdosScores}
            {maxDegrees}
          />
      </div>
      </div>
    </main>
    <Info {variant} {graph} {strategy} />
  </div>
</div>

<style>
  .wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (orientation: portrait) {
    .wrap {
      flex-direction: column;
      gap: 1.5rem;
    }
  }


  .board-wrap {
    display: flex;
    justify-content: center;
    align-items: stretch;
    flex-direction: column;
    gap: 1rem;
  }
  
  .scores {
    font-size: 1.2rem;
    display: flex;
    justify-content: space-around;
  }

  .center-card {
    position: relative;
    min-width: 20rem;
    max-width: 60rem;
    margin: 0 auto;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    border-radius: 0.8rem;
    box-shadow: var(--shadow);
    padding: 2rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;
  }

  .score1 {
    color: rgba(124,58,237, 0.9);
  }

  .score2 {
    color: rgb(34, 197, 94, 0.9);
  }

  .resizable-board {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>