import { defineStore } from "pinia";
import { db } from "@/firebase/config";
import { useAuthStore } from "@/stores/authStore";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp
} from "firebase/firestore";

export const useProjectStore = defineStore("project", {
  state: () => ({
    projects: [],
    tasks: [],
    unsubscribeTasks: null,

    loadingProjects: false, 
    loadingTasks: false,    
    error: null,
  }),

  actions: {
    

    recupererprj() {
      this.loadingProjects = true;
      this.error = null;

      const authStore = useAuthStore();
      if (!authStore.user) {
        this.error = "Utilisateur non connecté";
        this.loadingProjects = false;
        return;
      }

      const q = query(
        collection(db, "projects"),
        where("userId", "==", authStore.user.uid)
      );

      onSnapshot(
        q,
        (snapshot) => {
          this.projects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.loadingProjects = false; 
        },
        (err) => {
          console.error("Erreur fetchProjects:", err);
          this.error = err.message;
          this.loadingProjects = false;
        }
      );
    },

    async ajouterprj(project) {
      this.loadingProjects = true;
      this.error = null;

      try {
        const authStore = useAuthStore();
        if (!authStore.user) throw new Error("Utilisateur non connecté");

        await addDoc(collection(db, "projects"), {
          name: project.name,
          description: project.description || "",
          color: project.color || "#ffffff",
          userId: authStore.user.uid,
          createdAt: Timestamp.now(),
        });
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loadingProjects = false;
      }
    },

    async editerprj(projectId, data) {
      try {
        await updateDoc(doc(db, "projects", projectId), data);
      } catch (error) {
        this.error = error.message;
      }
    },

    async supprimerprj(projectId) {
      try {
        await deleteDoc(doc(db, "projects", projectId));
      } catch (error) {
        this.error = error.message;
      }
    },


    recuperertache(projectId) {
      this.loadingTasks = true;
      this.error = null;

     
      if (this.unsubscribeTasks) {
        this.unsubscribeTasks();
      }

      const tasksRef = collection(db, "projects", projectId, "tasks");

      this.unsubscribeTasks = onSnapshot(
        tasksRef,
        (snapshot) => {
          this.tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.loadingTasks = false; 
        },
        (err) => {
          console.error("Erreur fetchTasks:", err);
          this.error = err.message;
          this.loadingTasks = false;
        }
      );
    },

    async ajoutertache(projectId, task) {
      try {
        await addDoc(
          collection(db, "projects", projectId, "tasks"),
          {
            title: task.title,
            description: task.description || "",
            status: task.status || "todo",
            dueDate: task.dueDate || null,
            createdAt: Timestamp.now(),
          }
        );
      } catch (error) {
        this.error = error.message;
      }
    },

    async editertache(projectId, taskId, newStatus) {
      try {
        await updateDoc(
          doc(db, "projects", projectId, "tasks", taskId),
          { status: newStatus }
        );
      } catch (error) {
        this.error = error.message;
      }
    },

    async supprimertache(projectId, taskId) {
      try {
        await deleteDoc(
          doc(db, "projects", projectId, "tasks", taskId)
        );
      } catch (error) {
        this.error = error.message;
      }
    },

    unsubscribeTasksListener() {
      if (this.unsubscribeTasks) {
        this.unsubscribeTasks();
        this.unsubscribeTasks = null;
        this.tasks = [];
      }
    },
  },
});
