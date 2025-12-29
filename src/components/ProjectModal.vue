<script setup>
import { ref, watch } from 'vue'
import { useProjectStore } from '../stores/projectStore'

const props = defineProps({
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const projectStore = useProjectStore()

const name = ref('')
const description = ref('')
const color = ref('#0d6efd')

const saving = ref(false)
const error = ref(null)

watch(
  () => props.project,
  (newProject) => {
    if (newProject) {
      name.value = newProject.name || ''
      description.value = newProject.description || ''
      color.value = newProject.color || '#0d6efd'
    } else {
      name.value = ''
      description.value = ''
      color.value = '#0d6efd'
    }
  },
  { immediate: true }
)

const saveProject = async () => {
  if (!name.value.trim()) {
    error.value = 'Le nom du projet est obligatoire.'
    return
  }

  saving.value = true
  error.value = null

  try {
    if (props.project) {
      await projectStore.updateProject(props.project.id, {
        name: name.value,
        description: description.value,
        color: color.value
      })
    } else {
      await projectStore.addProject({
        name: name.value,
        description: description.value,
        color: color.value,
        userId: projectStore.userId
      })
    }
    emit('close')
  } catch (e) {
    error.value = e.message || 'Erreur lors de l’enregistrement.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div
    class="custom-modal-backdrop d-flex align-items-center justify-content-center"
    @click.self="emit('close')"
  >
    <div class="custom-modal card shadow-sm p-4 rounded" style="width: 100%; max-width: 420px;">

      <header class="mb-4 d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          {{ props.project ? 'Modifier le projet' : 'Nouveau projet' }}
        </h5>
        <button type="button" class="btn-close" aria-label="Fermer" @click="emit('close')"></button>
      </header>

      <form @submit.prevent="saveProject">
        <div class="mb-3">
          <label class="form-label fw-semibold">Nom</label>
          <input
            v-model="name"
            type="text"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Description</label>
          <textarea
            v-model="description"
            rows="3"
            class="form-control"
          ></textarea>
        </div>

        <div class="mb-4 d-flex align-items-center gap-3">
          <label class="form-label fw-semibold mb-0">Couleur</label>
          <input
            v-model="color"
            type="color"
            class="form-control form-control-color p-0"
            style="width: 3rem; height: 2.5rem; cursor: pointer;"
            title="Choisir une couleur"
          />
          <div :style="{ width: '32px', height: '32px', backgroundColor: color, borderRadius: '6px', border: '1px solid #ccc' }"></div>
        </div>

        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="emit('close')"
            :disabled="saving"
          >
            Annuler
          </button>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="saving"
          >
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.custom-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(30, 41, 59, 0.6); 
  z-index: 1050;
}

.custom-modal {
  background-color: white;
  border-radius: 12px;
}
</style>
