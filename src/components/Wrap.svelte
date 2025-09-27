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