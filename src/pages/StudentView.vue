<template>
  <v-img 
  src="@/assets/crossbackground.jpg" 
  cover 
  class="position-absolute w-100 h-100 opacity-25 ma-0 pl-0"
  gradient="to top right, rgba(0,0,0,.8), rgba(77,77,77,.8)"
  >
    <v-container>
      <div class="mb-6 mt-4">
        <h2 class="text-h4 text-primary font-weight-bold">Meus Treinos</h2>
        <p class="text-subtitle-1 text-grey">Bem-vindo à sua área de aluno</p>
      </div>

      <div v-if="loading" class="text-center mt-10">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <div v-else-if="groupedTasks.length === 0" class="text-center text-grey mt-10">
        <v-icon icon="mdi-dumbbell-off" size="60" class="mb-2"></v-icon>
        <p>Nenhum treino encontrado.</p>
      </div>

      <v-expansion-panels v-else variant="popout">
        <v-expansion-panel v-for="dayGroup in groupedTasks" :key="dayGroup.day">
          <v-expansion-panel-title>
            <div class="d-flex align-center">
              <v-icon icon="mdi-calendar-today" color="primary" class="mr-3"></v-icon>
              <span class="text-h6 font-weight-medium">{{ dayGroup.day }}</span>
              <v-chip size="x-small" class="ml-3" color="secondary">
                {{ dayGroup.tasks.length }}
              </v-chip>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-expansion-panels variant="outlined">
              <v-expansion-panel v-for="task in dayGroup.tasks" :key="task.id">
                <v-expansion-panel-title>
                  {{ task.title }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div style="white-space: pre-wrap;" class="bg-grey-lighten-4 pa-3 rounded">
                    {{ task.description || 'Sem descrição.' }}
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div class="text-center mt-8">
        <v-btn color="error" variant="text" @click="handleLogout">Sair</v-btn>
      </div>
    </v-container>
  </v-img>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabaseClient'

const router = useRouter()
const authStore = useAuthStore()
const tasks = ref([])
const loading = ref(false)

const fetchMyTasks = async () => {
  loading.value = true
  const { data: studentData } = await supabase
    .from('students')
    .select('id')
    .eq('email', authStore.user.email)
    .single()

  if (studentData) {
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .eq('student_id', studentData.id)

    tasks.value = tasksData || []
  }
  loading.value = false
}

const groupedTasks = computed(() => {
  const days = {}
  tasks.value.forEach(task => {
    const day = task.day_of_week || 'Outros'
    if (!days[day]) days[day] = []
    days[day].push(task)
  })

  const order = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  const sorted = []
  order.forEach(d => { if (days[d]) sorted.push({ day: d, tasks: days[d] }) })
  Object.keys(days).forEach(d => { if (!order.includes(d)) sorted.push({ day: d, tasks: days[d] }) })

  return sorted
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/LoginPage')
}

onMounted(() => {
  fetchMyTasks()
})
</script>