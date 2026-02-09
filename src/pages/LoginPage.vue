<template>
  <v-container class="fill-height bg-deep-blue-darken-4" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        
        <h1 class="text-h3 font-weight-bold mb-6 text-white">Bem-vindo ao</h1>
        
        <div class="d-flex justify-center gap-4">
            <v-img
            :width="300"
            aspect-ratio="16/9"
            cover
            src="@/assets/TunderLabLogo1.png"
            ></v-img>
        </div>
        <div class="d-flex justify-center gap-4">
          <v-btn 
            color="primary" 
            size="x-large" 
            class="mr-4"
            prepend-icon="mdi-login"
            @click="dialogLogin = true"
          >
            Entrar
          </v-btn>

          <v-btn 
            color="secondary" 
            size="x-large"
            prepend-icon="mdi-account-plus" 
            @click="dialogRegister = true"
          >
            Criar Conta
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialogLogin"
      width="auto"
    >
      <DialogLogin/>
    </v-dialog>

    <v-dialog
      v-model="dialogRegister"
      width="auto"
    >
      <DialogRegister />
    </v-dialog>

  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  
  import DialogLogin from '@/components/DialogLogin.vue'
  import DialogRegister from '@/components/DialogRegister.vue'

  const dialogLogin = ref(false)
  const dialogRegister = ref(false)
</script>

<route lang="yaml">
    meta:
        layout: login
</route>