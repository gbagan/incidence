<script lang="ts">
  interface Props {
    idx?: number;
    onclick: () => void;
    onpointerenter?: () => void;
    onpointerleave?: () => void;
    disabled?: boolean;
    children: () => any;
  }

  let { idx = 2, onclick, onpointerenter, onpointerleave, disabled = false, children }: Props = $props();
</script>

<button class={idx % 3 === 0 ? "btn1" : idx % 3 === 1 ? "btn2" : "btn3"}
  disabled={disabled}
  onclick={onclick}
  onpointerenter={onpointerenter}
  onpointerleave={onpointerleave}
>
  {@render children()}
</button>

<style>
  button {
    min-width: 10rem;
    padding: 1rem 1.5rem;
    border-radius: 0.7rem;
    border: none;
    cursor: pointer;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.2px;
    backdrop-filter: blur(6px);
    box-shadow: 0 6px 18px rgba(2,6,23,0.5);
    transition:transform .14s ease, box-shadow 0.14s ease;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: not-allowed;
    }

    &.btn1{
      background:linear-gradient(90deg, rgba(255,255,255,0.03), rgba(124,58,237,0.14));
      color:#fff
    }

    &.btn2{
      background:linear-gradient(90deg, rgba(255,255,255,0.02), rgba(34,197,94,0.08));
      color:#eafaf0
    }

    &.btn3{
      background:linear-gradient(90deg, rgba(255,255,255,0.02), rgba(239,68,68,0.08));
      color:#fff;
    }

    &:hover:not(:disabled) {
      transform:translateY(-0.4rem);
      box-shadow:0 18px 42px rgba(2,6,23,0.7);
    }
  }
</style>