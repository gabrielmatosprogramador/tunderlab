<template>
  <div>
    <v-card class="mx-auto" max-width="344" title="Realizar Login">
      <v-container>
        <v-text-field
          v-model="email"
          color="primary"
          label="Email"
          variant="underlined"
        ></v-text-field>

        <v-text-field
          v-model="password"
          color="primary"
          label="Senha"
          placeholder="Sua senha"
          variant="underlined"
          type="password" 
        ></v-text-field>
      </v-container>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="handleLogin" :loading="loading">
          Login
          <v-icon icon="mdi-chevron-right" end></v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close'])
const props = defineProps(['modelValue'])

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('') 
const loading = ref(false) 

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert("Por favor, preencha e-mail e senha.")
    return
  }

  try {
    loading.value = true 
    const destinationRoute = await authStore.login(email.value, password.value)
    emit('close')
    router.push(destinationRoute)
    
  } catch (error) {
    console.error(error)
    alert("Erro ao entrar: " + (error.message || "Verifique seus dados"))
  } finally {
    loading.value = false
  }
}
</script>