<script lang="ts">
  import type { Variant } from "../types";
  import Logo from "./Logo.svelte";
  import Wrap from "./Wrap.svelte";

  type Props = {
    select: (variant: Variant) => void;
  }

  let { select }: Props = $props();
</script>

<Wrap>
  <main class="center-card">
    <Logo />

    <section class="menu" aria-label="Menu des modes de jeu">
      <p class="desc">
        Choisis la version du jeu: Maker-Maker ou Maker-Breaker.
      </p>

      <div class="buttons">
        <button class="btn btn1" onclick={() => select("makermaker")}>Maker-Maker</button>
        <button class="btn btn2" onclick={() => select("makerbreaker")}>Maker-Breaker</button>
      </div>
    </section>
  </main>
  <aside class="info" aria-label="Explication du jeu">
    <h3>À propos du jeu</h3>
    <p>
      <strong>Incidence</strong> est un jeu positionnel à score se jouant sur un graphe (ou un hypergraphe dans sa version généralisée).
    </p>
    <p>
      A chaque tour, Alice et Bob choisissent un sommet du graphe.
      Si un joueur possède les deux extrémités, il récupère l'arête.
    </p>
    <p>
      Il existe deux variantes du jeu.
    </p>
    <ul>
        <li>
          <strong>Maker-Maker</strong>: chaque joueur gagne un point en
          récupérant une arête. Le gagnant est le joueur ayant le plus de points.
        </li>
        <li>
          <strong>Maker-Breaker</strong>: seule Alice gagne des points. Le but d'Alice est
          de maximiser son score tandis que le but de Bob est de le minimiser.
        </li>
      </ul>
  </aside>
</Wrap>