<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const logout = async () => {
  await authStore.logout()
  router.push('/auth')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark navbar-gradient shadow">
    <div class="container">

      <router-link class="navbar-brand fw-bold" to="/">
        KanbanApp
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3">

          <li class="nav-item">
            <router-link class="nav-link" to="/">
              Accueil
            </router-link>
          </li>

          <li v-if="isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/dashboard">
              Dashboard
            </router-link>
          </li>

          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/auth">
              Connexion
            </router-link>
          </li>

          <li v-if="isAuthenticated" class="nav-item">
            <button
              class="btn btn-outline-light btn-sm ms-lg-2"
              @click="logout"
            >
              Déconnexion
            </button>
          </li>

        </ul>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar-gradient {
  background: linear-gradient(135deg, #0d6efd, #0a58ca);
}

.nav-link {
  color: #eaf1ff !important;
}

.nav-link:hover {
  color: #ffffff !important;
}
</style>
