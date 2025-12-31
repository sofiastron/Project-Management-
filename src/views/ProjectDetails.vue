<template>
 
  <LoadingSpinner
    v-if="projectStore.loadingTasks && !projectStore.tasks.length"
  />

  <div v-else-if="project" class="container py-5">
    <h2 class="mb-4">{{ project.name }}</h2>

    <div class="kanban">
      <div
        class="column"
        v-for="status in statuses"
        :key="status"
        @dragover.prevent
        @drop="onDrop($event, status)"
      >
        <h3>{{ statusLabels[status] }}</h3>

        <div class="tasks-list">
          <div
            v-for="task in tasksByStatus(status)"
            :key="task.id"
            class="task-card"
            draggable="true"
            @dragstart="onDragStart($event, task)"
            @dragend="onDragEnd"
          >
            <TaskCard
              :task="task"
              @status-change="changeStatus"
              @delete-task="deleteTask"
            />
          </div>
        </div>

        <div
          v-if="
            !projectStore.loadingTasks &&
            tasksByStatus(status).length === 0
          "
          class="empty-column"
        >
          <small>Aucune tâche</small>
        </div>

        <button
          class="btn btn-sm btn-primary mt-2 w-100"
          @click="openTaskForm(status)"
          :disabled="projectStore.loadingTasks"
        >
          + Ajouter tâche
        </button>

        <div v-if="showFormForStatus === status" class="mt-3">
          <form @submit.prevent="submitTask(status)">
            <input
              v-model="newTask.title"
              class="form-control mb-2"
              placeholder="Titre de la tâche"
              required
            />

            <textarea
              v-model="newTask.description"
              class="form-control mb-2"
              rows="2"
              placeholder="Description"
            ></textarea>

            <input
              v-model="newTask.dueDate"
              type="date"
              class="form-control mb-2"
            />

            <div class="d-flex gap-2">
              <button
                type="submit"
                class="btn btn-success btn-sm"
                :disabled="projectStore.loadingTasks"
              >
                Ajouter
              </button>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                @click="closeTaskForm"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>

        <div class="task-count mt-2">
          {{ tasksByStatus(status).length }} tâche(s)
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-5 text-muted">
    Projet introuvable
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useProjectStore } from "@/stores/projectStore";
import TaskCard from "@/components/TaskCard.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";


const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const projectStore = useProjectStore();

const projectId = route.params.id;
const project = ref(null);
const draggedTask = ref(null);

const statuses = ["todo", "doing", "done"];
const statusLabels = {
  todo: "À Faire",
  doing: "En cours",
  done: "Terminé"
};

const showFormForStatus = ref(null);

const newTask = ref({
  title: "",
  description: "",
  dueDate: ""
});


const tasksByStatus = (status) =>
  projectStore.tasks.filter(t => t.status === status);


//    Drag & Drop

const onDragStart = (e, task) => {
  draggedTask.value = task;
  e.dataTransfer.effectAllowed = "move";
};

const onDragEnd = () => {
  draggedTask.value = null;
};

const onDrop = async (e, newStatus) => {
  if (!draggedTask.value) return;

  if (draggedTask.value.status === newStatus) return;

  await changeStatus(draggedTask.value.id, newStatus);
};

const changeStatus = async (taskId, newStatus) => {
  const task = projectStore.tasks.find(t => t.id === taskId);
  if (!task) return;

  const oldStatus = task.status;
  task.status = newStatus;

  try {
    await projectStore.editertache(projectId, taskId, newStatus);
  } catch (e) {
    task.status = oldStatus;
    alert("Erreur lors du déplacement");
  }
};

const deleteTask = async (taskId) => {
  if (!confirm("Supprimer cette tâche ?")) return;

  await projectStore.supprimertache(projectId, taskId);
};


const openTaskForm = (status) => {
  showFormForStatus.value = status;
  newTask.value = { title: "", description: "", dueDate: "" };
};

const closeTaskForm = () => {
  showFormForStatus.value = null;
};

const submitTask = async (status) => {
  if (!newTask.value.title) return;

  await projectStore.ajoutertache(projectId, {
    title: newTask.value.title,
    description: newTask.value.description,
    status,
    dueDate: newTask.value.dueDate || null
  });

  closeTaskForm();
};


onMounted(() => {
  const foundProject = projectStore.projects.find(p => p.id === projectId);

  if (!foundProject || foundProject.userId !== authStore.user?.uid) {
    router.push("/dashboard");
    return;
  }

  project.value = foundProject;
  projectStore.recuperertache(projectId);
});

onUnmounted(() => {
  projectStore.unsubscribeTasksListener();
});
</script>

<style scoped>
.kanban {
  display: flex;
  gap: 20px;
}

.column {
  flex: 1;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  min-height: 400px;
}

.column h3 {
  text-align: center;
  margin-bottom: 10px;
}

.tasks-list {
  min-height: 250px;
}

.empty-column {
  text-align: center;
  font-style: italic;
  color: #6c757d;
}

.task-count {
  font-size: 0.8rem;
  text-align: center;
  color: #6c757d;
}

@media (max-width: 992px) {
  .kanban {
    flex-direction: column;
  }
}
</style>
