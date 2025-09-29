<script lang="ts">
    import { roundedPolygon } from "../geometry";
  import type { Edge, Graph, Strategy, Variant } from "../types";
  import { countBy, delay, generate, generate2, randomPick, range, repeat } from "../util";
    import Breadcrumb from "./Breadcrumb.svelte";
  import Logo from "./Logo.svelte";
  import Wrap from "./Wrap.svelte";

  type Props = {
    variant: Variant;
    graph: Graph;
    strategy: Strategy;
    back: () => void
  };

  let { variant, graph, strategy, back }: Props = $props();

  //let turn: 1 | 2 = $state(1);
  let showStrat = $state(false);

  let nodeCount = $derived.by(() => {
    switch (graph) {
      case "path": return 24;
      case "cycle": return 20;
      case "grid": return 64;
      case "triangle": return 80;
      case "hypergraph": return 80;
    }
  });

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
        return generate2(8, 8, (row, col) => ({x: 40 + 75 * col, y: 40 + 75 * row}));
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
        ...generate2(8, 7, (i, j) => [8 * i + j, 8 * i + j + 1] as Edge),
        ...generate2(7, 8, (i, j) => [8 * i + j, 8 * i + j + 8] as Edge)
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

  let score1 = $derived(countBy(wsets, (set => set.every(x => position[x] === 1))));
  let score2 = $derived(countBy(wsets, (set => set.every(x => position[x] === 2))));
 
  let pairing = $derived(
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

  let nodesSortedByDegree: number[] = $derived.by(() => {
    const deg = degrees;
    return range(0, nodeCount).sort((a, b) => deg[b] - deg[a]);
  });

  let maxDegrees = $derived.by(() => {
    if (strategy !== "degree" || nodesSortedByDegree.length === 0) {
      return null;
    }
    const max = nodesSortedByDegree.find(i => position[i] === 0);
    if (max === undefined) {
      return null;
    }
    const d = degrees[max];
    return range(0, nodeCount).filter(i => position[i] === 0 && degrees[i] === d)
  });


  function computerMove(prevMove: number): number | null {
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
    }
  }

  async function play(i: number) {
    if (position[i] !== 0 || showStrat) {
      return;
    }
    position = position.with(i, 1);
    //turn = turn === 1 ? 2 : 1;
    showStrat = true;
    await delay(1000);
    showStrat = false;
    let move = computerMove(i);
    if (move !== null) {
      position = position.with(move, 2);
    }
  }

  function pairPath(x: number, y: number, w: number, h: number) {
    const r = h / 2;
    return [
      'M', x + r, y,
      'H', x + w - r,
      'A', r, r, 0, 0, 1, x + w, y + r,
      'V', y + h - r,
      'A', r, r, 0, 0, 1, x + w - r, y + h,
      'H', x + r,
      'A', r, r, 0, 0, 1, x, y + h - r,
      'V', y + r,
      'A', r, r, 0, 0, 1, x + r, y,
      'Z'
    ].join(' ');
  }

</script>

{#snippet pair(u: number, v: number, visible: boolean)}
  {@const {x: x1, y: y1} = nodes[u]}
  {@const {x: x2, y: y2} = nodes[v]}
  {@const dx = x2 - x1}
  {@const dy = y2 - y1}
  {@const dist = Math.hypot(dx, dy)}
  {@const w = dist + 50}
  {@const h = 50}
  {@const angle = Math.atan2(dy, dx) * 180 / Math.PI}
  {@const midX = (x1 + x2) / 2}
  {@const midY = (y1 + y2) / 2}
  {@const d = pairPath(-w/2, -h/2, w, h)}
  <path
    {d}
    class={["pair", {visible}]}
    style:transform="translate({midX}px, {midY}px) rotate({angle}deg)"
  />
{/snippet}


{#snippet erdosSquare(x: number, y: number, score: number, visible: boolean)}
  <rect
    style:transform="translate({x}px, {y}px)"
    class={["erdos", {visible}]}
    fill="rgb(255,{255 * (1 - score)},0)"
  />
{/snippet}

{#snippet board()}
  <svg class="board" viewBox="0 0 600 600">
    <defs>
      <filter id="glow" height="200%" width="200%" x="-50%" y="-50%">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <radialGradient id="gradA" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#1e293b" stop-opacity="1"/>
      </radialGradient>
      <radialGradient id="gradB" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#22c55e" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#1e293b" stop-opacity="1"/>
      </radialGradient>
    </defs>
    {#each edges as [u, v]}
      <line
        x1={nodes[u].x}
        y1={nodes[u].y}
        x2={nodes[v].x}
        y2={nodes[v].y}
        class={["edge", {
          player1: graph !== "hypergraph" && position[u] === 1 && position[v] === 1,
          player2: graph !== "hypergraph" &&  variant === "makermaker" && position[u] === 2 && position[v] === 2,
        }]}
      />
    {/each}
    {#if pairing !== null}
      {#each pairing as [u, v]}
        {@render pair(u, v, showStrat)}
      {/each}
    {/if}
    {#if graph === "hypergraph"}
      {#each wsets as [a, b, c]}
        {#if position[a] === 1 && position[b] === 1 && position[c] === 1}
          {@const {x: x1, y: y1} = nodes[a]}
          {@const {x: x2, y: y2} = nodes[b]}
          {@const {x: x3, y: y3} = nodes[c]}
          <polygon
            points="{x1},{y1} {x2},{y2} {x3},{y3}"
            class="triangle1"
          />
        {:else if variant === "makermaker" && position[a] === 2 && position[b] === 2 && position[c] === 2}
          {@const {x: x1, y: y1} = nodes[a]}
          {@const {x: x2, y: y2} = nodes[b]}
          {@const {x: x3, y: y3} = nodes[c]}
          <polygon
            points="{x1},{y1} {x2},{y2} {x3},{y3}"
            class="triangle2"
          />
        {/if}
      {/each}
    {/if}
    {#if erdosScores !== null}
      {#each erdosScores as score, i}
        {#if score !== -Infinity}
          {@const {x, y} = nodes[i]}
          {@render erdosSquare(x, y, score, showStrat)}
        {/if}
      {/each}
    {/if}
    {#if maxDegrees !== null}
      {#each maxDegrees as i}
        {@const {x, y} = nodes[i]}
        {@render erdosSquare(x, y, 1, showStrat)}
      {/each}
    {/if}
    {#if false && graph === "hypergraph"}
      <path
        d={roundedPolygon(nodes[11].x, nodes[11].y, 90, 6, 4)}
        class="hexagon"
      />
    {/if}
    {#each nodes as {x, y}, i}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <circle
        cx={x}
        cy={y}
        r="16"
        stroke="#9ca3af"
        class="nonplayed"
        onclick={() => play(i)}
      />
      {#if position[i] === 1}
        <circle cx={x} cy={y} r="18" fill="url(#gradA)" stroke="#7c3aed" stroke-width="3" />
      {:else if position[i] === 2}
        <circle cx={x} cy={y} r="18" fill="url(#gradB)" stroke="#22c55e" stroke-width="3" />
      {/if}
    {/each}
  </svg>
{/snippet}

<Wrap>
  <Breadcrumb {variant} {graph} {strategy} />
  <main class="center-card">
    <Logo/>
    <div class="backbutton">
      <button class="btn btn3" onclick={back}>Retour</button>
    </div>

    <div class="board-wrap">
      <div class="scores">
        <span class="score1">Score d'Alice: {score1}</span>
        <span class="score2">Score de Bob: {variant === "makerbreaker" ? "ø" : score2}</span>
      </div>
      {@render board()}
    </div>
  </main>

  <aside class="info">
    <h3>À propos du plateau</h3>
    <p>Blah blah blah Blah blah blah Blah blah blah Blah blah blahBlah blah blah
    </p>
  </aside>
</Wrap>

<style>
  .backbutton {
    position: absolute;
    left: 2rem;
    bottom: 2rem;
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

  .score1 {
    color: rgba(124,58,237, 0.9);
  }

  .score2 {
    color: rgb(34, 197, 94, 0.9);
  }

  .board {
    width: 35rem;
    height: 35rem;
    max-width: 100%;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    border-radius: 0.8rem;
    padding: 1rem;
  }

  .edge {
    stroke: #9ca3af;
    stroke-width: 3;
  }

  .edge.player1 {
    stroke:rgba(124, 58, 237, 0.9);
    stroke-width: 5;
  }
  .edge.player2 {
    stroke: rgb(34, 197, 94, 0.9);
    stroke-width: 5;
  }

  .nonplayed {
    cursor: pointer;
    stroke-width: 3;
  }

  .pair {
    stroke: red;
    stroke-width: 3px;
    fill: rgba(128,0,0, 50%);
    opacity: 0;
    transition: opacity 500ms;
    &.visible {
      opacity: 1;
    }
  }

  .erdos {
    x: -30px;
    y: -30px;
    width: 60px;
    height: 60px;
    rx: 10px;
    ry: 10px;
    opacity: 0;
    transition: opacity 500ms;
    &.visible {
      opacity: 0.5;
    }
  }

  .triangle1 {
    fill: rgba(124,58,237, 0.3);
    stroke: rgba(124,58,237, 0.6);
    stroke-width: 3;
    filter: url(#glow);
  }

  .triangle2 {
    fill: rgba(34,197,94, 0.3);
    stroke: rgba(34,197,94, 0.6);
    stroke-width: 3;
    filter: url(#glow);
  }

  .hexagon {
    fill: none;
    stroke: red;
    stroke-width: 3;
    fill: rgba(255,163,175, 0.2);
    filter: url(#glow);
  }
</style>