<script lang="ts">
</script>

<svg viewBox="0 0 120 120">
  <line x1="60" y1="20" x2="20" y2="60" stroke="#9ca3af" stroke-width="3" />
  <line x1="60" y1="20" x2="100" y2="60" stroke="#9ca3af" stroke-width="3" />
  <line x1="20" y1="60" x2="60" y2="100" stroke="#9ca3af" stroke-width="3" />
  <line x1="100" y1="60" x2="60" y2="100" stroke="#9ca3af" stroke-width="3" />
  <line x1="20" y1="60" x2="100" y2="60" stroke="#9ca3af" stroke-width="3" />

  <circle cx="20" cy="60" r="10" fill="#1e293b" stroke="#9ca3af" stroke-width="3"/>
  <circle cx="60" cy="100" r="10" fill="#1e293b" stroke="#9ca3af" stroke-width="3"/>
  <circle cx="100" cy="60" r="10" fill="#1e293b" stroke="#9ca3af" stroke-width="3"/>

  <circle cx="60" cy="20" r="14" fill="url(#gradA)" stroke="#7c3aed" stroke-width="3" />
  <circle cx="60" cy="100" r="14" fill="url(#gradB)" stroke="#22c55e" stroke-width="3" />

  <defs>
    <radialGradient id="gradA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#1e293b" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="gradB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#1e293b" stop-opacity="1"/>
    </radialGradient>
  </defs>
</svg>