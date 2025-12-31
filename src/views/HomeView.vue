<script setup>
import { useAuthStore } from '../stores/authStore'
const authStore = useAuthStore()
</script>

<template>
  <div class="container py-5 text-center">

    <h1 class="display-4 fw-bold mb-4">
      Bienvenue sur Kanban Simplifié
    </h1>

    <p class="lead text-secondary mb-5">
      Gérez vos projets et tâches facilement en temps réel.
    </p>

    <div v-if="!authStore.isAuthenticated">
      <router-link
        to="/auth"
        class="btn btn-primary btn-lg px-5"
      >
        Se connecter / S’inscrire
      </router-link>
    </div>

    <div v-else>
      <router-link
        to="/dashboard"
        class="btn btn-lightblue btn-lg px-5"
      >
        Accéder au Dashboard
      </router-link>
    </div>

  </div>
</template>

<style scoped>
.btn-lightblue {
  background-color:#0099ff; 
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-lightblue:hover {
  background-color:#0026ff;
  color: white;
}
</style>
