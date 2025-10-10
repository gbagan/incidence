<script lang="ts">
  import type { Graph, Strategy, Variant } from "../types";

  type Props = {
    variant: Variant;
    graph: Graph;
    strategy: Strategy;
  };
  
  let { variant, graph, strategy }: Props = $props();

  $inspect(strategy);

</script>

<aside class="info">
  <h3>Règles du jeu</h3>
  <p>
    A chaque tour, Alice et Bob choisissent un sommet du graphe.
    Si un joueur possède les deux extrémités, il récupère l'arête et ajoute 1 à son score.
  </p>
  {#if variant === "makermaker"}
    <p>
      Dans la version <strong>Maker-Maker</strong>, Alice cherche à maximiser la différence entre son score et celui de Bob.
      Bob cherche à la minimiser.
    </p>
  {:else if variant === "makerbreaker"}
    <p>
      Dans la version <strong>Maker-Breaker</strong>, Alice (Maker) cherche à maximiser son score.
      Bob (Breaker) cherche à minimiser le score d'Alice.
    </p>
  {/if}
  <h3>Graphe</h3>
  {#if graph === "path"}
    <p>
      Un chemin est une suite de sommets où chaque sommet (sauf les extrémités) 
      est connecté à deux autres sommets.
    </p>
    {#if variant !== "makermaker"}
      <p>
        Une stratégie optimale en temps polynomial existe pour cette classe de graphes.
        Le score si les deux joueurs jouent parfaitement est asymptotiquement égal à
        <math><mfrac><mi>n</mi><mn>5</mn></mfrac></math>.
      </p>
    {/if}
  {:else if graph === "cycle"}
    <p>
      Un cycle est un graphe où chaque sommet est connecté à deux autres sommets, formant une boucle fermée.
    </p>
    {#if variant !== "makermaker"}
      <p>
        Une stratégie optimale en temps polynomial existe pour cette classe de graphes.
        Le score si les deux joueurs jouent parfaitement est asymptotiquement égal à
        <math><mfrac><mi>n</mi><mn>5</mn></mfrac></math>.
      </p>
    {/if}
  {:else if graph === "grid"}
    <p>
      Une grille est un graphe en deux dimensions où chaque sommet est connecté à
      ses voisins horizontaux et verticaux.
    </p>
  {:else if graph === "triangle"}
    <p>
      Une grille triangulaire est une variante de la grille où chaque sommet est connecté
      à ses voisins dans une disposition triangulaire.
    </p>
  {:else if graph === "hypergraph"}
    <p>
      Se joue sur une grille triangulaire. Le but est de récupérer les triangles
      (hyperarêtes) au lieu des arêtes.
    </p>
    {#if variant !== "makermaker"}
      <p>Le score si les deux joueurs jouent parfaitement est compris entre
        <math><mrow><mo>⌊</mo><mfrac><mi>n</mi><mn>28</mn></mfrac><mo>⌋</mo></mrow></math> et
        <math><mrow><mo>⌈</mo><mfrac><mi>n</mi><mn>8</mn></mfrac><mo>⌉</mo></mrow></math>.
      </p>
    {/if}
  {/if}
  <h3>Stratégie</h3>
  {#if strategy === "random"}
    <p>
      La stratégie aléatoire choisit un sommet au hasard parmi les sommets non déjà choisis.
      C'est une stratégie faible mais qui permet de varier les parties.
    </p>
  {:else if strategy === "degree"}
    <p>
      Cette stratégie est optimale pour la version Maker-Maker sur les graphes.
      Elle consiste à choisir un sommet de <strong>degré maximal</strong>
      parmi les sommets non déjà choisis.
    </p>
    <p>Elle n'est pas nécessairement optimale sur les hypergraphes.</p>
  {:else if strategy === "erdos"}
    <p>
      Cette stratégie est basée sur le théorème d'<strong>Erdős-Selfridge</strong>. todo.
    </p>
  {:else if strategy === "pairing"}
    <p>
      La stratégie de <strong>pairing</strong> consiste à regrouper les sommets par paires
      et à choisir le sommet apparié à celui choisi par l'adversaire.
      Cette stratégie appliquée à Breaker permet de garantir un score au plus
      <math><mrow><mo>⌈</mo><mfrac><mi>n</mi><mn>4</mn></mfrac><mo>⌉</mo></mrow></math>
      sur les cycles.
    </p>
  {/if}
</aside>

<style>
  .info {
    background: var(--card);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 8px 30px rgba(3,8,20,0.6);
    width: 30rem;
    min-height: 30rem;
    
    & h3 {
      margin: 0 0 0.7rem 0;
      font-size: 1.2rem;
    }

    & p {
      margin: 0.2rem;
      color: var(--muted);
      line-height: 1.5;
    }
  
    & strong {
      font-weight: bold;
      color: #e6eef6;
    }
}
</style>