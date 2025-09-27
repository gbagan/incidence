<script lang="ts">
  import { fade } from "svelte/transition";

  type Props = {children: () => any};

  let {children}: Props = $props();
</script>

<div class="wrap"
  in:fade={{ duration: 300, delay: 300 }}
  out:fade={{ duration: 300 }}
>
  {@render children()}
</div>

<style>
  .wrap{
    min-height:100vh;
    display:grid;
    grid-template-columns:1fr 420px;
    align-items:center;
    gap: 2.5rem;
    padding: 3rem;
  }
  
  @media (max-width:920px) {
    .wrap{
      grid-template-columns:1fr;
      padding: 2rem;
    }
  }
</style>