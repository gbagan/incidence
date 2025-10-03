<script lang="ts">
  import type { Graph, Strategy, Variant } from "../types";
  import Breadcrumb from "./Breadcrumb.svelte";
  import Logo from "./Logo.svelte";
  import Button from "./Button.svelte";
  import Menu from "./Menu.svelte";
  import Wrap from "./Wrap.svelte";
  import Info from "./Info.svelte";

  type Props = {
    variant: Variant;
    strategy: Strategy;
    select: (graph: Graph) => void;
    back: () => void;
  }

  let { variant, strategy, select, back }: Props = $props();
  let hover: Graph | null = $state(null);
</script>

<Wrap>
  <Breadcrumb {variant} {strategy} />
  <main class="center-card">
    <div class="logo-container">
      <Logo />
      <Button onclick={back}>Retour</Button>
    </div>
    <Menu
      title="Choisis le type de graphe que tu souhaites utiliser comme plateau de jeu."
      {select}
      hover={g => hover = g}
      buttons={[
        { id: "path", text: "Chemin" },
        { id: "cycle", text: "Cycle" },
        { id: "grid", text: "Grille", disabled: strategy === "pairing" },
        { id: "triangle", text: "Grille triangulaire", disabled: strategy === "pairing" },
        { id: "hypergraph", text: "Hypergraphe", disabled: strategy === "pairing" || strategy === "degree" }
      ]}
    />
  </main>
  <Info>
    {#if hover === "path"}
      <p>
        Un chemin est une suite de sommets où chaque sommet (sauf les extrémités) 
        est connecté à deux autres sommets.
      </p>
      <p>
        Une stratégie optimale en temps polynomial existe pour cette classe de graphes.
        Le score si les deux joueurs jouent parfaitement est asymptotiquement égal à
        <math><mfrac><mi>n</mi><mn>5</mn></mfrac></math>.
      </p>
    {:else if hover === "cycle"}
      <p>
        Un cycle est un graphe où chaque sommet est connecté à deux autres sommets, formant une boucle fermée.
      </p>
      <p>
        Une stratégie optimale en temps polynomial existe pour cette classe de graphes.
        Le score si les deux joueurs jouent parfaitement est asymptotiquement égal à
        <math><mfrac><mi>n</mi><mn>5</mn></mfrac></math>.
      </p>
    {:else if hover === "grid"}
      <p>
        Une grille est un graphe en deux dimensions où chaque sommet est connecté à
        ses voisins horizontaux et verticaux.
      </p>
    {:else if hover === "triangle"}
      <p>
        Une grille triangulaire est une variante de la grille où chaque sommet est connecté
        à ses voisins dans une disposition triangulaire.
      </p>
    {:else if hover === "hypergraph"}
      <p>
        Se joue également sur un graphe triangulaire mais il faut récupérer les triangles
        (hyperarêtes) au lieu des arêtes.
      </p>
      <p>Le score si les deux joueurs jouent parfaitement est compris entre
        <math><mrow><mo>⌊</mo><mfrac><mi>n</mi><mn>28</mn></mfrac><mo>⌋</mo></mrow></math> et
        <math><mrow><mo>⌈</mo><mfrac><mi>n</mi><mn>8</mn></mfrac><mo>⌉</mo></mrow></math>.
      </p>
    {:else}
      <p>
        Le jeu Incidence a été étudié sur plusieurs classes de graphes.
        Pour certaines classes, comme les chemins ou les cycles, le jeu possède une stratégie optimale en temps polynomial.
      </p>
    {/if}
  </Info>
</Wrap>