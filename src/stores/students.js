import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from './auth'

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: [],
    loading: false
  }),
  actions: {
    async fetchStudents() {
      this.loading = true
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) console.error('Erro ao buscar alunos:', error)
      else this.students = data
      
      this.loading = false
    },

    
    async addStudent(student) {
      const authStore = useAuthStore()
      
      
      if (!authStore.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('students')
        .insert([
          {
            name: student.name,
            email: student.email,
            phone: student.phone,
            personal_id: authStore.user.id 
          }
        ])
        .select()

      if (error) throw error
      
      if (data) {
        this.students.unshift(data[0])
      }
    }
  }
})