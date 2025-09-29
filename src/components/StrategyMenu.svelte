<script lang="ts">
  import type { Strategy, Variant } from "../types";
  import Breadcrumb from "./Breadcrumb.svelte";
  import Logo from "./Logo.svelte";
  import Wrap from "./Wrap.svelte";

  type Props = {
    variant: Variant;
    select: (strat: Strategy) => void;
    back: () => void;
  }

  let { variant, select, back }: Props = $props();
  let hover: Strategy | null = $state(null);
</script>

<Wrap>
  <Breadcrumb {variant} />
  <main class="center-card">
    <div class="logo-container">
      <Logo />
      <button class="btn btn3" onclick={back}>Retour</button>
    </div>
    <section class="menu">
      <p class="desc">
        Choisis la stratégie de l'adversaire.
      </p>

      <div class="buttons">
        <button
          class="btn btn1"
          onclick={() => select("random")}
          onpointerenter={() => hover = "random"}
          onpointerleave={() => hover = null}
        >
          Aléatoire
        </button>
        {#if variant === "makermaker"}
          <button
            class="btn btn2"
            onclick={() => select("degree")}
            onpointerenter={() => hover = "degree"}
            onpointerleave={() => hover = null}
          >
            Optimale
          </button>  
        {:else}
          <button
            class="btn btn2"
            onclick={() => select("erdos")}
            onpointerenter={() => hover = "erdos"}
            onpointerleave={() => hover = null}
          >
            Erdős-Selfridge
          </button>
          <button
            class="btn btn3"
            onclick={() => select("pairing")}
            onpointerenter={() => hover = "pairing"}
            onpointerleave={() => hover = null}
          >
            Pairing
          </button>
        {/if}
      </div>
    </section>
  </main>
  <aside class="info">
    <h3>À propos du jeu</h3>
    {#if hover === "random"}
      <p>
        La stratégie aléatoire choisit un sommet au hasard parmi les sommets non déjà choisis.
        C'est une stratégie faible mais qui permet de varier les parties.
      </p>
    {:else if hover === "degree"}
      <p>
        Cette stratégie est optimale pour la version Maker-Maker sur les graphes.
        Elle consiste à choisir un sommet de <strong>degré maximal</strong>
        parmi les sommets non déjà choisis.
      </p>
    {:else if hover === "erdos"}
      <p>
        Cette stratégie est basée sur le théorème d'<strong>Erdős-Selfridge</strong>. todo.
        
      </p>
    {:else if hover === "pairing"}
      <p>
        La stratégie de <strong>pairing</strong> est une stratégie qui consiste à regrouper les sommets par paires
        et à choisir le sommet apparié à celui choisi par l'adversaire.
        Cette stratégie appliquée à Breaker permet de garantir un score au plus
        <math><mrow><mo>⌈</mo><mfrac><mi>n</mi><mn>4</mn></mfrac><mo>⌉</mo></mrow></math>
        sur les cycles.
      </p>
    {/if}
  </aside>
</Wrap>