// src/stores/task.js
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    loading: false,
    
    titleTaskCreation: "",
    descriptionTaskCreation: "",
    dayTaskCreation: "Segunda", 
    
  
    showDialogDelete: false,
    showDialogTaskFields: false,
    indexTaskSelected: -1,
  }),

  actions: {
    async fetchTasks() {
      this.loading = true
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          students (name)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar tarefas:', error.message)
      } else {
        this.tasks = data || []
      }
      this.loading = false
    },

    
    async addTask(title, description, studentId, dayOfWeek) {
      if (!studentId) {
        alert('Erro: Selecione um aluno antes de adicionar o exercício.')
        return
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([
          { 
            title: title, 
            description: description, 
            student_id: studentId,
            day_of_week: dayOfWeek 
          }
        ])
        .select()

      if (error) {
        throw error
      }

      if (data) {
        this.tasks.unshift(data[0]) 
        
        this.titleTaskCreation = ""
        this.descriptionTaskCreation = ""
        
        
        await this.fetchTasks()
      }
    },

  
    async updateTask(task) {
      if (!task.id) return

      const { error } = await supabase
        .from('tasks')
        .update({ 
          title: task.title, 
          description: task.description,
          day_of_week: task.day_of_week 
        })
        .eq('id', task.id)

      if (error) {
        throw error
      } else {
        
        const index = this.tasks.findIndex(t => t.id === task.id)
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...task }
        }
      }
    },

    
    async deleteTask() {
      const taskToDelete = this.tasks[this.indexTaskSelected]
      
      if (!taskToDelete || !taskToDelete.id) return

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskToDelete.id)

      if (error) {
        alert('Erro ao deletar: ' + error.message)
      } else {
        this.tasks.splice(this.indexTaskSelected, 1)
        this.showDialogDelete = false
      }
    },
    openDialogDelete(index) {
      this.showDialogDelete = true
      this.indexTaskSelected = index
    },

    openDialog(index) {
      this.showDialogTaskFields = true
      this.indexTaskSelected = index
    },
    async fetchStudentTasks(studentId) {
      this.loading = true
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

      if (error) console.error(error)
      else this.tasks = data || []
      
      this.loading = false
    },
  }
})