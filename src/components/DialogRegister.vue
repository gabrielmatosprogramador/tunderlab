<template>
  <v-card
    class="mx-auto"
    max-width="344"
    title="Criar Conta"
  >
    <v-container>
      <v-text-field
        v-model="first"
        color="primary"
        label="Nome"
        variant="underlined"
      ></v-text-field>

      <v-text-field
        v-model="last"
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

      <v-btn color="success">
        Registrar

        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script setup>
  import { ref } from 'vue'

  const first = ref(null)
  const last = ref(null)
  const email = ref(null)
  const password = ref(null)
  const terms = ref(false)
</script>