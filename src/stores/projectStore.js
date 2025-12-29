import { defineStore } from 'pinia'
import { db } from '../firebase/config'
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    userId: null,
  }),
  actions: {
    setUserId(id) {
      this.userId = id
    },
    fetchProjects(userId) {
      this.setUserId(userId)
      const q = query(collection(db, 'projects'), where('userId', '==', userId))
      onSnapshot(q, (snapshot) => {
        this.projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      })
    },
    async addProject(project) {
      await addDoc(collection(db, 'projects'), project)
    },
    async updateProject(projectId, updatedData) {
      const projectRef = doc(db, 'projects', projectId)
      await updateDoc(projectRef, updatedData)
    },
    async deleteProject(projectId) {
      const projectRef = doc(db, 'projects', projectId)
      await deleteDoc(projectRef)
    },
  }
})
