<script lang="ts">
  type Props = {
    variant?: Variant | null;
    graph?: Graph | null;
    strategy?: Strategy | null;
  };

  let { variant, graph, strategy }: Props = $props();

  let variantText = $derived(variant === "makermaker" ? "Maker-Maker" : variant ? "Maker-Breaker" : null);
  let strategyText = $derived(
    strategy === "random" ? "Aléatoire"
    : strategy === "erdos" ? "Erdős-Selfridge"
    : strategy === "pairing" ? "Pairing"
    : null
  );
  let graphText = $derived(
    graph === "path" ? "Chemin"
    : graph === "cycle" ? "Cycle"
    : graph === "grid" ? "Grille"
    : graph === "triangle" ? "Grille triangulaire"
    : "Hypergraphe"
  );

</script>

<nav class="breadcrumb">
  <span>{variantText ?? "?"}</span>
  {#if strategy}
    &nbsp;>&nbsp;<span>{strategyText}</span>
  {/if}
  {#if graph}
    &nbsp;>&nbsp;<span>{graphText}</span>
  {/if}
</nav>

<style>
  .breadcrumb {
    position:absolute;
    top: 12px;
    left:12px;
    padding: 6px 12px;
    background:rgba(15,23,36,0.92);
    border: 1px solid #374151;
    border-radius: 0.4rem;
    font-size: 0.8rem;
    color:#a5b4fc;
  }

  .breadcrumb span {
    color:#e6eef6;
  }
</style>