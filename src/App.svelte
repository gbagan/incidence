<script lang="ts">
  import type { Graph, Strategy, Variant } from "./types";
  import VariantMenu from "./components/VariantMenu.svelte";
  import Game from "./components/Game.svelte";
  import GraphMenu from "./components/GraphMenu.svelte";
  import StrategyMenu from "./components/StrategyMenu.svelte";
  
  let variant: Variant | null = $state(null);
  let graph: Graph | null = $state(null);
  let strategy: Strategy | null = $state(null);
</script>

{#if variant === null}
  <VariantMenu select={v => variant = v} />
{:else if strategy === null}
  <StrategyMenu {variant} select={s => strategy = s} back={() => variant = null} />
{:else if graph === null}
  <GraphMenu {variant} {strategy} select={g => graph = g} back={() => strategy = null} />
{:else}
  <Game {variant} {graph} {strategy} back={() => graph = null} />
{/if}