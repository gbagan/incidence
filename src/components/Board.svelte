<script lang="ts">
  import Peg from "./Peg.svelte";
  import { roundedPolygon, roundedRectangle } from "../geometry";
  import type { Graph, Variant } from "../types";
    
  type Node = { x: number, y: number };
  type Edge = [number, number];
    
  interface Props {
    nodes: Node[],
    edges: Edge[],
    wsets: number[][],
    position: number[],
    play: (i: number) => void,
    graph: Graph,
    variant: Variant,
    pairing: [number, number][] | null,
    showStrat: boolean,
    erdosScores: number[] | null,
    maxDegrees: number[] | null,
  }
    
    let {
        nodes,
        edges,
        wsets,
        position,
        play,
        graph,
        variant,
        pairing,
        showStrat,
        erdosScores,
        maxDegrees,
    }: Props = $props();
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
  {@const d = roundedRectangle(-w/2, -h/2, w, h, h/2)}
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
    {#if position[i] !== 0}
      <Peg {x} {y} color={position[i]} />
    {/if}
  {/each}
</svg>

<style>
  .board {
    width: 75vmin;
    height: 75vmin;
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