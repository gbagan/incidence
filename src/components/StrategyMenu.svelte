<script lang="ts">
  import type { Graph, Variant } from "../types";
  import Logo from "./Logo.svelte";

  type Props = {
    variant: Variant;
    select: (graph: Graph) => void;
  }

  let { select, variant }: Props = $props();
</script>

<div class="wrap">
  <main class="center-card">
    <Logo />

    <section class="menu">
      <p class="desc">
        Choisis le type de graphes. Le dernier type est un hypergraphe.
      </p>

      <div class="buttons">
        <button class="btn btn1" onclick={() => select("cycle")}>Cycle</button>
        <button class="btn btn2" onclick={() => select("grid")}>Grille</button>
      </div>
    </section>
  </main>
  <aside class="info">
    <h3>À propos du jeu</h3>
    {#if variant === "makermaker"}
      <p>
        Dans la version <strong>Maker-Maker</strong> sur les graphes, une stratégie optimale simple existe pour chacun des joueurs.
        Elle consiste à choisir un sommet de degré maximal parmi les sommets non déjà choisis.
      </p>
      <p>
        En particulier, la version Maker-Maker sur un graphe régulier finit par un match nul.
      </p>
      <p>Le résultat n'est plus vrai sur les hypergraphes, le problème étant PSPACE-complet.</p>
    {:else}
      <p>Contrairement à la version Maker-Maker, la version <strong>Maker-Breaker</strong> est difficile. Le problème est PSPACE-complet.</p>
      <p>Cependant, il existe des heuristiques, des bornes supérieures et inférieures ainsi que des statégies optimales pour
        des classes de graphes comme les chemins ou cycles.</p>
    {/if}
  </aside>
</div>