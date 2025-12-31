<template>
  <div class="loading-overlay">
    <div class="spinner"></div>
    <p class="mt-2">Chargement...</p>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 45px;
  height: 45px;
  border: 5px solid #ddd;
  border-top: 5px solid #0d6efd;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
