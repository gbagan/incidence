<script lang="ts">
  import katexify from "../katexify";
  import type { Graph, Strategy, Variant } from "../types";
  import Breadcrumb from "./Breadcrumb.svelte";
  import Logo from "./Logo.svelte";
  import Wrap from "./Wrap.svelte";

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
      <button class="btn btn3" onclick={back}>Retour</button>
    </div>
    <section class="menu">
      <p class="desc">
        Choisis le type de graphe que tu souhaites utiliser comme plateau de jeu.
      </p>

      <div class="buttons">
        <button
          class="btn btn1"
          onclick={() => select("path")}
          onpointerenter={() => hover = "path"}
          onpointerleave={() => hover = null}
        >
          Chemin
        </button>
        <button
          class="btn btn2"
          onclick={() => select("cycle")}
          onpointerenter={() => hover = "cycle"}
          onpointerleave={() => hover = null}
        >
          Cycle
        </button>
        <button
          class="btn btn3"
          disabled={strategy === "pairing"}
          onclick={() => select("grid")}
          onpointerenter={() => hover = "grid"}
          onpointerleave={() => hover = null}
        >
          Grille
        </button>
        <button
          class="btn btn2"
          disabled={strategy === "pairing"}
          onclick={() => select("triangle")}
          onpointerenter={() => hover = "triangle"}
          onpointerleave={() => hover = null}
        >
          Grille triangulaire
        </button>
        <button
          class="btn btn3"
          disabled={strategy === "pairing" || strategy === "degree"}
          onclick={() => select("hypergraph")}
          onpointerenter={() => hover = "hypergraph"}
          onpointerleave={() => hover = null}
        >
          Hypergraphe
        </button>
      </div>
    </section>
  </main>
  <aside class="info">
    <h3>À propos du jeu</h3>
    {#if hover === "path"}
      <p>
        Un chemin est une suite de sommets où chaque sommet (sauf les extrémités) 
        est connecté à deux autres sommets.
      </p>
      <p>
        Une stratégie optimale en temps polynomial existe pour cette classe de graphes.
        Le score si les deux joueurs jouent parfaitement est asymptotiquement égal à
        {@html katexify("\\frac{n}{5}")}
      </p>
    {:else if hover === "cycle"}
      <p>
        Un cycle est un graphe où chaque sommet est connecté à deux autres sommets, formant une boucle fermée.
      </p>
      <p>
        Une stratégie optimale en temps polynomial existe pour cette classe de graphes.
        Le score si les deux joueurs jouent parfaitement est asymptotiquement égal à
        {@html katexify("\\frac{n}{5}")}.
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
        {@html katexify("\\left \\lfloor \\frac{n}{28} \\right \\rfloor")} et
        {@html katexify("\\left \\lceil \\frac{n}{8} \\right \\rceil")}.
      </p>
    {:else}
      <p>
        Le jeu Incidence a été étudié sur plusieurs classes de graphes.
        Pour certaines classes, comme les chemins ou les cycles, le jeu possède une stratégie optimale en temps polynomial.
      </p>
    {/if}
  </aside>
</Wrap>