
<template>
  <div id="app">
    <AppNavbar />
    <router-view />
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()

onMounted(() => {
  authStore.init()
})
</script>

<style>
#app {
  font-family: 'Poppins', sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  color: #333;
}
</style>
