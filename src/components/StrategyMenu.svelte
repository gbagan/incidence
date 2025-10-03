<script lang="ts">
  import type { Strategy, Variant } from "../types";
  import Breadcrumb from "./Breadcrumb.svelte";
  import Button from "./Button.svelte";
  import Info from "./Info.svelte";
  import Logo from "./Logo.svelte";
  import Menu from "./Menu.svelte";
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
      <Button onclick={back}>Retour</Button>
    </div>
    <Menu
      title="Choisis la stratégie de l'adversaire."
      {select}
      hover={s => hover = s}
      buttons={
        variant === "makermaker" ? [
          { id: "random", text: "Aléatoire" },
          { id: "degree", text: "Optimale" }
        ] : [
          { id: "random", text: "Aléatoire" },
          { id: "erdos", text: "Erdős-Selfridge" },
          { id: "pairing", text: "Pairing" }
        ]
      }
    /> 
  </main>
  <Info>
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
  </Info>
</Wrap>