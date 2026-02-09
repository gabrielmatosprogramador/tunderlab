// src/stores/task.js
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    loading: false,
    
    // Campos para criação rápida na interface
    titleTaskCreation: "",
    descriptionTaskCreation: "",
    dayTaskCreation: "Segunda", // Valor padrão solicitado
    
    // Controles de Interface
    showDialogDelete: false,
    showDialogTaskFields: false,
    indexTaskSelected: -1,
  }),

  actions: {
    // 1. BUSCAR TAREFAS (READ)
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

    // 2. ADICIONAR TAREFA (CREATE)
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
            day_of_week: dayOfWeek // Novo campo integrado
          }
        ])
        .select()

      if (error) {
        throw error
      }

      if (data) {
        // Adicionamos a nova tarefa ao topo da lista local
        this.tasks.unshift(data[0]) 
        
        // Limpamos os campos de criação
        this.titleTaskCreation = ""
        this.descriptionTaskCreation = ""
        
        // Recarregamos para garantir que o relacionamento 'students(name)' venha preenchido
        await this.fetchTasks()
      }
    },

    // 3. ATUALIZAR TAREFA (UPDATE)
    async updateTask(task) {
      if (!task.id) return

      const { error } = await supabase
        .from('tasks')
        .update({ 
          title: task.title, 
          description: task.description,
          day_of_week: task.day_of_week // Garante que o dia também seja editável
        })
        .eq('id', task.id)

      if (error) {
        throw error
      } else {
        // Atualiza o registro na lista local sem precisar de um novo fetch
        const index = this.tasks.findIndex(t => t.id === task.id)
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...task }
        }
      }
    },

    // 4. DELETAR TAREFA (DELETE)
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
        // Remove da lista local e fecha o modal
        this.tasks.splice(this.indexTaskSelected, 1)
        this.showDialogDelete = false
      }
    },

    // --- MÉTODOS DE CONTROLE DA UI ---

    openDialogDelete(index) {
      this.showDialogDelete = true
      this.indexTaskSelected = index
    },

    openDialog(index) {
      this.showDialogTaskFields = true
      this.indexTaskSelected = index
    }
  }
})