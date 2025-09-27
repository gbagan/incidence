<script lang="ts">
  import type { Edge, Graph, Strategy } from "../types";
  import { countBy, delay, generate, generate2, randomPick, range, repeat } from "../util";
  import Logo from "./Logo.svelte";
  import Wrap from "./Wrap.svelte";

  type Props = {
    graph: Graph;
    strategy: Strategy;
    back: () => void
  };

  let { graph, strategy, back }: Props = $props();

  const RADIUS = 250;
  const CENTER = { x: 300, y: 300 };

  //let turn: 1 | 2 = $state(1);
  let showStrat = $state(false);

  let nodeCount = $derived.by(() => {
    switch (graph) {
      case "cycle": return 20;
      case "grid": return 64;
    }
  });

  let nodes: {x: number, y: number}[] = $derived.by(() => {
    switch (graph) {
      case "cycle":
        return generate(nodeCount, i => {
          const angle = 2 * Math.PI * i / nodeCount - Math.PI/2; // start top
          const x = CENTER.x + Math.cos(angle)*RADIUS;
          const y = CENTER.y + Math.sin(angle)*RADIUS;
          return { x, y };
        });
      default:
        return generate2(8, 8, (row, col) => ({x: 20 + 80 * col, y: 20 + 80 * row}));
    }
  })

  const edges: [number, number][] = $derived.by(() => {
    switch (graph) {
      case "cycle": return generate(nodeCount, i => [i, (i+1) % nodeCount]);
      default: return [
        ...generate2(8, 7, (i, j) => [i * 8 + j, i * 8 + j + 1] as Edge),
        ...generate2(7, 8, (i, j) => [i * 8 + j, i * 8 + j + 8] as Edge)
      ];
    }
  })

  let position = $derived(repeat(nodeCount, 0));

  let score1 = $derived(countBy(edges, ([u, v]) => position[u] === 1 && position[v] === 1));
  let score2 = $derived(countBy(edges, ([u, v]) => position[u] === 2 && position[v] === 2));
 
  let pairing = $derived(
    graph === "cycle" && strategy === "pairing" 
    ? generate(nodeCount >> 1, i => [2*i, 2*i+1])
    : null
  );

  function erdosSelfridge(position: number[]): number {
    let score = 0;
    for (const [u, v] of edges) {
      if (position[u] === 1 && position[v] === 1) {
        score += 2;
      } else if (position[u] === 1 && position[v] === 0 || position[u] === 0 && position[v] === 1) {
        score += 0.5;
      }
    }
    return score;
  }

  let erdosTable = $derived.by(() => {
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

  function computerMove(prevMove: number): number | null {
    const n = position.length;
    switch (strategy) {
      case "random":
        return randomPick(range(0, n).filter(i => position[i] === 0));
      case "erdos":
        if (erdosTable === null) {
          return null;
        }
        let max = Math.max(...erdosTable);
        if (max === -Infinity) {
          return null;
        }
        return erdosTable.indexOf(max);
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

  function pairPath(x: number, y: number, w: number, h: number, r: number){
    r = Math.max(0, Math.min(r, Math.min(w,h)/2));
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
  {@const d = pairPath(-w/2, -h/2, w, h, 50)}
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

<Wrap>
  <main class="center-card">
    <Logo/>
    <div class="backbutton">
      <button class="btn btn3" onclick={back}>Retour</button>
    </div>

    <div class="board-wrap">
      <div class="scores">
        <span class="score1">Score d'Alice: {score1}</span>
        <span class="score2">Score de Bob: {score2}</span>
      </div>
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
              player1: position[u] === 1 && position[v] === 1,
              player2: position[u] === 2 && position[v] === 2,
            }]}
          />
        {/each}
        {#if pairing !== null}
          {#each pairing as [u, v]}
            {@render pair(u, v, showStrat)}
          {/each}
        {/if}
        {#if erdosTable !== null}
          {#each erdosTable as score, i}
            {@const {x, y} = nodes[i] }
            {@render erdosSquare(x, y, score, showStrat)}
          {/each}
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
    </div>
  </main>

  <aside class="info">
    <h3>À propos du plateau</h3>
    <p>Blah blah blah Blah blah blah Blah blah blah Blah blah blahBlah blah blah
    </p>
  </aside>
</Wrap>

<style>
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
    color: rgba(124,58,237,0.9);
  }

  .score2 {
    color: #22c55e;
  }

  .board {
    width: 35rem;
    height: 35rem;
    max-width: 100%;
    background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005));
    border-radius: 0.8rem;
    padding: 1rem;
  }

  .edge{
    stroke: #9ca3af;
    stroke-width: 3;
  }
  .edge.player1 {
    stroke:rgba(124,58,237,0.9);
    stroke-width: 5;
  }
  .edge.player2 {
    stroke: #22c55e;
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
</style>