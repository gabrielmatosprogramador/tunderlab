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
import { useRouter } from 'vue-router' 
const router = useRouter()

const handleLogin = async () => {
  try {
    loading.value = true
    const routeDestination = await authStore.login(email.value, password.value)
    emit('close') 
    router.push(routeDestination)
    
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>