<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
        <v-list>
          <v-list-item
            prepend-avatar="https://github.com/yurimarcon/avatars/blob/main/Colored/ToyFaces_Colored_BG_8.jpg?raw=true"
            :subtitle="userRoleLabel" 
            :title="authStore.userName || 'Carregando...'"
          >
            <template v-slot:append>
              <v-btn 
                icon="mdi-logout" 
                variant="text" 
                size="small" 
                color="error"
                @click="handleLogout"
                title="Sair do sistema"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list
          :lines="false"
          density="compact"
          nav
        >
          <v-list-item
            v-for="(item, i) in menuItems"
            :key="i"
            :to="item.to"
            :value="item"
            color="primary"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
        
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <div>
        <v-app-bar-title class="col-sm">Tunder Lab</v-app-bar-title>
      </div>
      <div>
        <v-app-bar-title class="col-sm">
          <v-img
            :width="100"
            aspect-ratio="4/3"
            cover
            src="@/assets/TunderLabLogo1.png"
          ></v-img>
        </v-app-bar-title>
      </div>
      <div>
        <v-app-bar-title class="col-sm"></v-app-bar-title>
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useAuthStore } from '@/stores/auth' // Importar a Store
  import { useRouter } from 'vue-router'     // Importar o Router

  const drawer = ref(null)
  
  const authStore = useAuthStore()
  const router = useRouter()

  // Define o subtítulo com base na role (Personal ou Aluno)
  const userRoleLabel = computed(() => {
    if (authStore.role === 'personal') return 'Personal Trainer'
    if (authStore.role === 'student') return 'Aluno TunderLab'
    return 'Bem-vindo'
  })

  // Define os itens do menu dinamicamente
  // Se for Aluno, mostra "Meus Treinos", se for Personal, mostra "Home"
  const menuItems = computed(() => {
    if (authStore.role === 'student') {
      return [
        { text: 'Meus Treinos', icon: 'mdi-dumbbell', to: '/StudentView'},
        { text: 'Sobre', icon: 'mdi-information', to: '/about'},
      ]
    }
    
    // Menu do Personal
    return [
      { text: 'Gestão de Alunos', icon: 'mdi-folder', to: '/'}, // Home
      { text: 'Sobre', icon: 'mdi-information', to: '/about'},
    ]
  })

  // Função de Logout
  const handleLogout = async () => {
    await authStore.logout()
    router.push('/LoginPage')
  }
</script>

<style scoped>
    a {
        text-decoration: none;
        color: #505050;
    }
</style>