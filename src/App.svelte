<script lang="ts">
  import type { Graph, Strategy, Variant } from "./types";
  import VariantMenu from "./components/VariantMenu.svelte";
  import Game from "./components/Game.svelte";
  import GraphMenu from "./components/GraphMenu.svelte";
  
  let variant: Variant | null = $state(null);
  let graph: Graph | null = $state(null);
  let strategy: Strategy = $state("pairing");
</script>

{#if variant === null}
  <VariantMenu select={v => variant = v} />
{:else if graph === null}
  <GraphMenu {variant} select={g => graph = g} />
{:else}
  <Game {graph} {strategy} />
{/if}