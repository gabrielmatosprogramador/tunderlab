import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null, 
    studentId: null 
  }),
  actions: {
    async login(email, password) {
      // 1. Login no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      this.user = data.user

      // 2. Tenta encontrar na tabela de PERSONAIS (profiles)
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', this.user.id)
        .maybeSingle() 
      
      if (profile) {
        return '/' 
      }

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('email', this.user.email)
        .maybeSingle()

      if (student) {
        return '/StudentDashboard' 
      }
      
      throw new Error("Usuário não possui perfil de Personal nem de Aluno.")
    },

    async register(email, password, fullName, phone) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        
        options: {
          data: { 
            full_name: fullName, 
            phone: phone 
          }
        }
      })
      if (error) throw error
      this.user = data.user
    },
    
    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
    },
    
    async fetchUser() {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        this.user = data.user
        const { data: profile } = await supabase.from('profiles').select('id').eq('id', this.user.id).single()
        if (profile) {
          this.role = 'personal'
        } else {
          const { data: student } = await supabase.from('students').select('id').eq('email', this.user.email).single()
          if (student) {
            this.role = 'student'
            this.studentId = student.id
          }
        }
      }
    }
  }
})