<script lang="ts">
  import Button from "./Button.svelte";
  import { Plus, Minus } from '@lucide/svelte';

  type Props = {
    resize: (r: number, c: number) => void;
    rowCount: number;
    colCount: number;
    sizeLimit: { rowMin: number; rowMax: number; colMin: number; colMax: number; };
  };

  let { resize, rowCount, colCount, sizeLimit }: Props = $props();  
</script>

<div class="container">
  {#if sizeLimit.colMin < sizeLimit.colMax}
    <span class="title">Largeur: {colCount} </span>
    <div class="buttons">
      <Button onclick={() => resize(rowCount, colCount - 1)}><Minus size={20} /></Button>
      <Button onclick={() => resize(rowCount, colCount + 1)}><Plus size={20} /></Button>
    </div>
  {/if}
  {#if sizeLimit.rowMin < sizeLimit.rowMax}
    <span class="title">Hauteur: {rowCount}</span>
    <div class="buttons">
      <Button onclick={() => resize(rowCount - 1, colCount)}><Minus size={20} /></Button>
      <Button onclick={() => resize(rowCount + 1, colCount)}><Plus size={20} /></Button>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .buttons {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .title {
    color: #e0e0e0;
  }
</style>