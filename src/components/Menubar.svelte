<script lang="ts">
  import { clickOutside } from "../clickoutside";
  import type { Graph, Strategy, Variant } from "../types";
  import Logo from "./Logo.svelte";

  type Props = {
    variant: Variant;
    graph: Graph;
    strategy: Strategy;
    setVariant: (v: Variant) => void;
    setGraph: (v: Graph) => void;
    setStrategy: (v: Strategy) => void;
  };
  
  let { variant, graph, strategy, setVariant, setGraph, setStrategy }: Props = $props();

  let show = $state(false);
  let active: number | null = $state(null);

  const variantText = (variant: Variant) =>
    variant === "makermaker" ? "Maker-Maker" 
    : variant === "maker" ? "Maker" 
    : "Breaker";
  const strategyText = (strategy: Strategy) =>
    strategy === "random" ? "Aléatoire"
    : strategy === "erdos" ? "Erdős-Selfridge"
    : strategy === "pairing" ? "Pairing"
    : strategy === "degree" ? "Optimale"
    : "Optimale";

  const graphText = (graph: Graph) =>
    graph === "confluence" ? "Confluence"
    : graph === "path" ? "Chemin"
    : graph === "cycle" ? "Cycle"
    : graph === "grid" ? "Grille"
    : graph === "triangle" ? "Triangulaire"
    : "Hypergraphe";

  const variants:  Variant[] = ["makermaker", "maker", "breaker"];
  const graphs: Graph[] = ["confluence", "path", "cycle", "grid", "triangle", "hypergraph"];
  
  const strategies: [Strategy, boolean][]  = $derived(
    variant === "makermaker"
    ? [
      ["random", false],
      ["degree", graph === "hypergraph"]
    ] : [
      ["random", false],
      ["erdos", false],
      ["pairing", variant === "breaker" || graph !== "path" && graph !== "cycle"],
      ["optimal", graph !== "path" && graph !== "cycle"],
    ]
  );
</script>
    
<div class="menubar">
  <div class="content">
    <div class="app-title">
      <span class="logo"><Logo /></span>
      <span>Incidence</span>
    </div>
    <div
      class={[ "dropdown-container", {show}]}
      {@attach clickOutside(() => active = null)}
    >
      <div class="dropdown">
      <button
        class={["button", {active: active === 0}]}
        onclick={() => active = active === null ? 0 : null}
      >
        Variante: {variantText(variant)}
      </button>
      <div class={["menu", {show: active === 0}]}>
        {#each variants as v}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="item" onclick={() => {active = null; show = false; setVariant(v)}}>
          {variantText(v)}
        </div>
        {/each}
        </div>
      </div>
      <div class="dropdown">
        <button
          class={["button", {active: active === 1}]}
          onclick={() => active = active === null ? 1 : null}
        >
          Graphe: {graphText(graph)}
        </button>
        <div class={["menu", {show: active === 1}]}>
          {#each graphs as g}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="item" onclick={() => {active = null; show = false; setGraph(g)}}>
              {graphText(g)}
            </div>
          {/each}
        </div>
      </div>
      <div class="dropdown">
        <button
          class={["button", {active: active === 2}]}
          onclick={() => active = active === null ? 2 : null}
        >
          Stratégie: {strategyText(strategy)}
        </button>
        <div class={["menu", {show: active === 2}]}>
          {#each strategies as [st, disabled]}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class={["item", {disabled}]} onclick={() => {active = null; show = false; setStrategy(st)}}>
              {strategyText(st)}
            </div>
          {/each}
        </div>
      </div>
    </div>
    <button class="button menu-btn" onclick={() => show = !show}>☰</button>
  </div>
</div> 

<style>
  .app-title {
    padding: 0rem 1.2rem;
    color: #667eea;
    font-size: 1.2rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    width: 2.5rem;
    height: 2.5rem;
  }

  .menubar {
    width: 100%;
    background: linear-gradient(135deg, var(--darkblue) 0%, #1f1f35 100%);
    box-shadow: 0 0.25rem 1.5rem rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid #404060;
  }

  .content {
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    gap: 2px;
  }

  .dropdown-container {
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    gap: 2px;
  }

  .dropdown {
    position: relative;
  }

  .button {
    background: transparent;
    color: #e0e0e0;
    padding: 1rem 1.5rem;
    font-size: 0.9rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0;
    min-width: 13rem;

    &:hover {
      background: rgba(102, 126, 234, 0.15);
      color: #fff;
    }

    &.active {
      background: rgba(102, 126, 234, 0.25);
      color: #fff;
    }
  }

  .menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--darkblue);
    min-width: 13rem;
    border-radius: 0 0 0.5rem 0.5rem;
    box-shadow: 0 0.5rem 1.8rem rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-0.7rem);
    transition: all 0.2s ease;
    z-index: 1000;
    overflow: hidden;
    border: 1px solid #404060;
    border-top: none;

    &.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }

  .item {
    padding: 0.7rem 1.1rem;
    color: #e0e0e0;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.9rem;

    &:hover:not(.disabled) {
      background: #3d3d5c;
      color: #fff;
    }

    &.disabled {
      color: #666;
      cursor: not-allowed;
      opacity: 0.5;
    }

    &.disabled::before {
      content: '🔒';
      font-size: 0.8rem;
    }
  }

  .menu-btn {
    display: none;
  }

  @media (orientation: portrait) {
    .dropdown-container {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 2.5rem;
      right: 1rem;
      padding: 1rem;
      border-radius: 8px;
      background: linear-gradient(135deg, #2d2d44 0%, #1f1f35 100%);
      border: 1px solid #333;
    }

    .dropdown-container.show {
      z-index: 10;
      display: flex;
    }

    .menu-btn {
      position: absolute;
      right: 0rem;
      display: block;
      background: none;
      border: none;
      color: #fff;
      font-size: 1.8rem;
      padding: 0.2rem;
      cursor: pointer;
      min-width: 3rem;
    }
}
  
</style>