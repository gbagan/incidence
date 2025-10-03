<script lang="ts">
  import type { Variant } from "../types";
  import Breadcrumb from "./Breadcrumb.svelte";
    import Info from "./Info.svelte";
  import Logo from "./Logo.svelte";
  import Menu from "./Menu.svelte";
  import Wrap from "./Wrap.svelte";

  type Props = {
    select: (variant: Variant) => void;
  }

  let { select }: Props = $props();
  let hover: Variant | null = $state(null);
</script>

<Wrap>
  <Breadcrumb />
  <main class="center-card">
    <Logo />

    <Menu
      title="Choisis la version du jeu."
      {select}
      hover={v => hover = v}
      buttons={[
        { id: "makermaker", text: "Maker-Maker" },
        { id: "makerbreaker", text: "Maker-Breaker" }
      ]}
    />
  </main>
  <Info>
    {#if hover === "makermaker"}
      <p>
        Dans la version <strong>Maker-Maker</strong> sur les graphes, une stratégie optimale simple existe pour chacun des joueurs.
        Elle consiste à choisir un sommet de <strong>degré maximal</strong> parmi les sommets non déjà choisis.
      </p>
      <p>
        En particulier, la version Maker-Maker sur un graphe régulier finit par un match nul.
      </p>
      <p>Le résultat n'est plus vrai sur les hypergraphes, le problème étant PSPACE-complet.</p>
    {:else if hover === "makerbreaker"}
      <p>Contrairement à la version Maker-Maker, la version <strong>Maker-Breaker</strong> est difficile. Le problème est PSPACE-complet.</p>
      <p>Cependant, il existe des heuristiques, des bornes supérieures et inférieures ainsi que des statégies optimales pour
        des classes de graphes comme les chemins ou cycles.</p>
    {:else}
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
    {/if}
  </Info>
</Wrap>