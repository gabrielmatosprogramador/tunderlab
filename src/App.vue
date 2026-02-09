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
    // 1. Tenta recuperar o usuário assim que o App abre ou recarrega
    await authStore.fetchUser()

    // 2. (Opcional) Escuta mudanças na autenticação para manter a store sincronizada
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        authStore.user = session.user
      } else {
        authStore.user = null
      }
    })
  })
</script>
