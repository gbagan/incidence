<script lang="ts">
  import type { Graph, Strategy, Variant } from "../types";
  import Logo from "./Logo.svelte";
  import Wrap from "./Wrap.svelte";

  type Props = {
    variant: Variant;
    strategy: Strategy;
    select: (graph: Graph) => void;
    back: () => void;
  }

  let { variant, strategy, select, back }: Props = $props();
</script>

<Wrap>
  <main class="center-card">
    <div class="logo-container">
      <Logo />
      <button class="btn btn3" onclick={back}>Retour</button>
    </div>
    <section class="menu">
      <p class="desc">
        Choisis le type de graphe que tu souhaites utiliser comme plateau de jeu.
      </p>

      <div class="buttons">
        <button class="btn btn1" onclick={() => select("cycle")}>Cycle</button>
        <button class="btn btn2" disabled={strategy === "pairing"} onclick={() => select("grid")}>Grille</button>
        <button class="btn btn3" disabled={strategy === "pairing"} onclick={() => select("triangle")}>Grille triangulaire</button>
        <button class="btn btn1" disabled={strategy === "pairing"} onclick={() => select("hypergraph")}>Hypergraphe</button>
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
        En particulier, la version Maker-Maker sur un graphe régulier d'ordre pair finit toujours par un match nul.
      </p>
      <p>Le résultat n'est plus vrai sur les hypergraphes, le problème étant PSPACE-complet pour les hypergraphes 3-uniformes.</p>
    {:else}
      <p>Contrairement à la version Maker-Maker, la version <strong>Maker-Breaker</strong> est difficile. Le problème est PSPACE-complet.</p>
      <p>Cependant, il existe des heuristiques, des bornes supérieures et inférieures ainsi que des statégies optimales pour
        des classes de graphes comme les chemins ou cycles.</p>
    {/if}
  </aside>
</Wrap>