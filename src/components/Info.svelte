<script lang="ts">
  interface Props {
    title?: string;
    children: () => any;
  }

  let { title = "Règles du jeu", children }: Props = $props();
</script>

<aside class="info">
  <h3>{title}</h3>
  {@render children()}
</aside>

<style>
  .info {
    background: var(--card);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 8px 30px rgba(3,8,20,0.6);
    min-height: 30rem;
    
    & h3 {
      margin: 0 0 0.7rem 0;
      font-size: 1.2rem;
    }

    & :global(p), & :global(ul) {
      margin: 0.2rem;
      color: var(--muted);
      line-height: 1.5;
    }
  
    & :global(strong) {
      font-weight: bold;
      color: #e6eef6;
    }
}
</style>