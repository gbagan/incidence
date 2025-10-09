  <script lang="ts">

  type Props = {children: () => any};

  let {children}: Props = $props();
</script>

<div class="wrap">
  {@render children()}
</div>

<style>
  
  @media (orientation: portrait) {
    .wrap{
      grid-template-columns:1fr;
      padding: 2rem;
    }
  }
</style>