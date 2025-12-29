<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useProjectStore } from '../stores/projectStore'
import ProjectModal from '../components/ProjectModal.vue'

const authStore = useAuthStore()
const projectStore = useProjectStore()

const showModal = ref(false)
const editingProject = ref(null)

onMounted(() => {
  if (authStore.user) {
    projectStore.fetchProjects(authStore.user.uid)
  }
})

const openModalForCreate = () => {
  editingProject.value = null
  showModal.value = true
}

const openModalForEdit = (project) => {
  editingProject.value = project
  showModal.value = true
}

const deleteProject = async (projectId) => {
  if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
    await projectStore.deleteProject(projectId)
  }
}
</script>

<template>
  <div class="container py-5">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">Mes Projets</h2>

      <button
  class="btn btn-custom"
  @click="openModalForCreate"
>
  <i class="bi bi-plus-lg me-1"></i>
  Nouveau projet
</button>

    </div>

    <div
      v-if="projectStore.projects.length === 0"
      class="alert alert-info text-center"
    >
      Aucun projet trouvé.
    </div>

    <div class="row g-4">
      <div
        v-for="project in projectStore.projects"
        :key="project.id"
        class="col-md-6 col-lg-4"
      >
        <div
          class="card h-100 shadow-sm"
          :style="{ borderTop: `5px solid ${project.color || '#0d6efd'}` }"
        >
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-semibold">
              {{ project.name }}
            </h5>

            <p class="card-text text-muted flex-grow-1">
              {{ project.description || 'Aucune description' }}
            </p>

            <div class="d-flex justify-content-end gap-2">
              <button
                class="btn btn-outline-primary btn-sm"
                @click="openModalForEdit(project)"
              >
                Modifier
              </button>

              <button
                class="btn btn-outline-danger btn-sm"
                @click="deleteProject(project.id)"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ProjectModal
      v-if="showModal"
      :project="editingProject"
      @close="showModal = false"
    />
  </div>
</template>
<style scoped>
.btn-custom {
  background-color: #0099ff; 
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-custom:hover {
  background-color: #0026ff; 
  color: white;
}
</style>