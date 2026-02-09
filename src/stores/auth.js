import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null
  }),
  actions: {
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      this.user = data.user
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
      this.user = data.user
    }
  }
})