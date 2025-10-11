<script lang="ts">
  import { fly } from "svelte/transition";

  type Props = {
    color: number,
    x: number,
    y: number,
  }
  
  let { color, x, y }: Props = $props();
</script>

<circle
  cx={x}
  cy={y}
  r="18"
  fill={color === 1 ? "url(#gradA)" : "url(#gradB)"}
  stroke={color === 1 ? "#7c3aed" : "#22c55e"}
  stroke-width="3"
  transition:fly={{ y: -130, duration: 500 }}
/>