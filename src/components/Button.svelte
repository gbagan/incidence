<script lang="ts">
  interface Props {
    onclick?: () => void;
    children: () => any;
  }

  let { onclick, children }: Props = $props();
</script>

<button {onclick}>
  {@render children()}
</button>

<style>
  button {
    width: 2.5rem;              /* w-12 */
    height: 2.5rem;             /* h-12 */
    color: #f3f4f6;
    background-color: var(--gray-8); /* bg-gray-700 */
    border: 1px solid var(--gray-7); /* border + border-gray-600 */
    border-radius: 0.25rem;   /* rounded */
    transition: background-color 0.2s ease; /* transition-colors */
  }

  button:hover {
    background-color: var(--gray-7); /* hover:bg-gray-600 */
  }
</style>