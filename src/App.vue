<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { supabase } from '@/lib/supabaseClient'

  const authStore = useAuthStore()

  onMounted(async () => {
    await authStore.fetchUser()

    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        authStore.user = session.user
      } else {
        authStore.user = null
      }
    })
  })
</script>
