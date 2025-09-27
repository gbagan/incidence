<script lang="ts">
  import type { Strategy, Variant } from "../types";
  import Logo from "./Logo.svelte";
  import Wrap from "./Wrap.svelte";

  type Props = {
    variant: Variant;
    select: (strat: Strategy) => void;
  }

  let { select, variant }: Props = $props();
</script>

<Wrap>
  <main class="center-card">
    <Logo />

    <section class="menu">
      <p class="desc">
        Choisis la stratégie de l'adversaire.
      </p>

      <div class="buttons">
        <button class="btn btn1" onclick={() => select("random")}>Aléatoire</button>
        <button class="btn btn2" onclick={() => select("erdos")}>Erdős-Selfridge</button>
        <button class="btn btn3" onclick={() => select("pairing")}>Pairing</button>
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
</Wrap>