<template>
  <div class="task-card" :data-id="task.id">
    <h5 class="task-title">{{ task.title }}</h5>

    <p class="task-desc">
      {{ task.description || "Aucune description" }}
    </p>

    <!-- Date limite -->
    <small v-if="task.dueDate" class="task-date">
       {{ formatDate(task.dueDate) }}
    </small>

    <div class="task-actions d-flex gap-1 mt-2">
      <button
        class="btn btn-sm btn-outline-primary"
        @click="$emit('status-change', task.id, 'todo')"
        :disabled="task.status === 'todo'"
      >
        To Do
      </button>

      <button
        class="btn btn-sm btn-outline-warning"
        @click="$emit('status-change', task.id, 'doing')"
        :disabled="task.status === 'doing'"
      >
        Doing
      </button>

      <button
        class="btn btn-sm btn-outline-success"
        @click="$emit('status-change', task.id, 'done')"
        :disabled="task.status === 'done'"
      >
        Done
      </button>

      <button
        class="btn btn-sm btn-outline-danger"
        @click="$emit('delete-task', task.id)"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true
  }
});






const formatDate = (date) => {
  // Firestore Timestamp
  if (date?.seconds) {
    return new Date(date.seconds * 1000).toLocaleDateString("fr-FR");
  }

  // String (YYYY-MM-DD)
  return new Date(date).toLocaleDateString("fr-FR");
};
</script>

<style scoped>
.task-card {
  background: #fff;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-bottom: 8px;
  cursor: grab;
}

.task-card:active {
  cursor: grabbing;
}

.task-title {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
}

.task-desc {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 6px;
}

.task-date {
  font-size: 0.75rem;
  color: #6c757d;
  display: block;
  margin-bottom: 6px;
}

.task-actions button {
  flex: 1;
}
</style>
