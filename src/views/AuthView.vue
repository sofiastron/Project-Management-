<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isLoginMode = ref(true)

const email = ref('')
const password = ref('')

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  authStore.error = null
}

const submit = async () => {
  authStore.error = null

  try {
    if (isLoginMode.value) {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(email.value, password.value)
    }

    if (authStore.isAuthenticated) {
      email.value = ''
      password.value = ''
      router.push('/dashboard')
    }
  } catch (error) {

    console.error(error)
  }
}
</script>

<template>
  <div class="container vh-100 d-flex align-items-center justify-content-center">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
      
      <h3 class="text-center mb-4">
        {{ isLoginMode ? 'Connexion' : 'Inscription' }}
      </h3>

      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            placeholder="email@gmail.com"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Au moins 6 caractères"
            minlength="6"
            required
          />
        </div>

        <div v-if="authStore.error" class="alert alert-danger py-2">
          {{ authStore.error }}
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100"
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Traitement...
          </span>
          <span v-else>
            {{ isLoginMode ? 'Se connecter' : 'S’inscrire' }}
          </span>
        </button>
      </form>

      <div class="text-center mt-3">
        <button
          class="btn btn-link text-decoration-none"
          @click="toggleMode"
          :disabled="authStore.loading"
        >
          {{ isLoginMode
            ? 'Pas encore de compte ? S’inscrire'
            : 'Déjà un compte ? Se connecter'
          }}
        </button>
      </div>
    </div>
  </div>
</template>
