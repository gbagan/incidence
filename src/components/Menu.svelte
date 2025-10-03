<script lang="ts" generics="A">
  import Button from './Button.svelte';

  type ButtonProp = {
    id: A;
    text: string;
    disabled?: boolean;
  }
  
  interface Props {
    title: string;
    buttons: ButtonProp[];
    select: (id: A) => void;
    hover: (id: A | null) => void;
  }

  let { title, buttons, select, hover }: Props = $props();
</script>

<section class="menu">
  <p class="desc">{title}</p>
  <div class="buttons">
    {#each buttons as {id, text, disabled}, i}
      <Button
        idx={i}
        disabled={disabled}
        onclick={() => select(id)}
        onpointerenter={() => hover(id)}
        onpointerleave={() => hover(null)}
      >
        {text}
      </Button>
    {/each}
  </div>
</section>

<style>
  .menu {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }

  .desc {
    color: var(--muted);
    text-align: center;
    max-width: 35rem;
  }

  .buttons {
    display:flex;
    gap: 1rem;
    flex-wrap:wrap;
    justify-content:center
  }
</style>