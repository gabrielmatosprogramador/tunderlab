import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,     
    studentId: null, 
    userName: ''     
  }),

  actions: {
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      
      this.user = data.user

      await this.fetchUser()

      if (this.role === 'personal') {
        return '/' 
      }
      
      if (this.role === 'student') {
        return '/StudentView' 
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
      if (this.user) await this.fetchUser()
    },
    
    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.role = null
      this.studentId = null
      this.userName = '' 
    },
    
    async fetchUser() {
      const { data } = await supabase.auth.getUser()
      
      if (data.user) {
        this.user = data.user
        let { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name') 
          .eq('id', this.user.id)
          .maybeSingle()

        if (profile) {
          this.role = 'personal'
          this.userName = profile.full_name || 'Personal'
          return 
        }
        let { data: student } = await supabase
          .from('students')
          .select('id, name') 
          .eq('email', this.user.email) 
          .maybeSingle()
          
        if (student) {
          this.role = 'student'
          this.studentId = student.id
          this.userName = student.name || 'Aluno'
        }
      } else {
        this.user = null
        this.role = null
        this.studentId = null
        this.userName = ''
      }
    }
  }
})