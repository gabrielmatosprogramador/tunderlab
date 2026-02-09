<template>
  <v-card class="mx-auto" max-width="344" title="Criar Conta">
    <v-container>
      <v-text-field
        v-model="name"
        color="primary"
        label="Nome"
        variant="underlined"
      ></v-text-field>

      <v-text-field
        v-model="phone"
        color="primary"
        label="Telefone"
        variant="underlined"
      ></v-text-field>

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

      <v-checkbox
        v-model="terms"
        color="secondary"
        label="I agree to site terms and conditions"
      ></v-checkbox>
    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="handleRegister" :loading="loading" :disabled="!terms">
        Registrar
        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  
  const emit = defineEmits(['close'])

  // Inicie strings vazias em vez de null para evitar warnings em inputs
  const name = ref('')
  const phone = ref('')
  const terms = ref(false)
  const email = ref('')
  const password = ref('')

  const authStore = useAuthStore()
  const loading = ref(false)

  const handleRegister = async () => {
    try {
      loading.value = true
      // Agora a ordem bate com a store: email, senha, NOME, telefone
      await authStore.register(email.value, password.value, name.value, phone.value)
      emit('close')
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }
</script>