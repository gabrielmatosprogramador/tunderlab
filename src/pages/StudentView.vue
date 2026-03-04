<template>
  <div style="position: relative; min-height: 100vh;">
    <v-img 
      src="@/assets/crossbackground.jpg" 
      cover 
      class="position-fixed w-100 h-100 opacity-25 ma-0 pl-0"
      style="top: 0; left: 0; z-index: 0; pointer-events: none;"
      gradient="to top right, rgba(0,0,0,.8), rgba(77,77,77,.8)"
    ></v-img>

    <v-container style="position: relative; z-index: 1;">
      <div class="mb-6 mt-4">
        <h2 class="text-h4 text-primary font-weight-bold">Meus Treinos</h2>
        <p class="text-subtitle-1 text-grey">Bem-vindo à sua área de aluno</p>
      </div>

      <div v-if="loading" class="text-center mt-10">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <div v-else-if="tasks.length === 0" class="text-center text-grey mt-10">
        <v-icon icon="mdi-dumbbell-off" size="60" class="mb-2"></v-icon>
        <p>Nenhum treino encontrado.</p>
      </div>

      <div v-else>
        <v-select
          v-model="selectedWeek"
          :items="availableWeeks"
          label="Histórico de Semanas"
          placeholder="Selecione a semana"
          variant="solo"
          prepend-inner-icon="mdi-calendar-range"
          class="mb-6"
        ></v-select>

        <div v-if="!currentWeekData || currentWeekData.sortedDays.length === 0" class="text-center text-grey mt-10">
          <v-icon icon="mdi-calendar-blank" size="60" class="mb-2"></v-icon>
          <p>Nenhum treino para a semana selecionada.</p>
        </div>

        <v-expansion-panels v-else variant="popout">
          <v-expansion-panel v-for="dayGroup in currentWeekData.sortedDays" :key="dayGroup.day">
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
      </div>

      <div class="text-center mt-8">
        <v-btn color="error" variant="text" @click="handleLogout">Sair</v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabaseClient'

const router = useRouter()
const authStore = useAuthStore()
const tasks = ref([])
const loading = ref(false)

// Ref para armazenar a semana selecionada no menu dropdown
const selectedWeek = ref(null)

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
      .order('created_at', { ascending: false }) // Garante a ordenação pela data de criação

    tasks.value = tasksData || []
  }
  loading.value = false
}

// Função utilitária para converter a data do banco de dados na respectiva "Semana"
const getWeekLabel = (dateString) => {
  if (!dateString) return 'Semanas Anteriores';
  const d = new Date(dateString);
  
  // Retrocede os dias até chegar na segunda-feira daquela semana
  const day = d.getDay(); 
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  
  // Avança 4 dias para encontrar a sexta-feira da mesma semana
  const friday = new Date(monday.getTime());
  friday.setDate(monday.getDate() + 4);

  const format = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return `Semana de ${format(monday)} a ${format(friday)}`;
}

// 1. Agrupa todas as tarefas por Semanas e depois por Dias
const tasksByWeek = computed(() => {
  const weeks = {};

  tasks.value.forEach(task => {
    const weekLabel = getWeekLabel(task.created_at);
    
    // Se a semana ainda não existe no objeto, cria ela
    if (!weeks[weekLabel]) {
      weeks[weekLabel] = {
        label: weekLabel,
        timestamp: new Date(task.created_at || new Date()).getTime(),
        days: {}
      };
    }
    
    // Distribui as tarefas dentro dos dias correspondentes
    const day = task.day_of_week || 'Outros';
    if (!weeks[weekLabel].days[day]) weeks[weekLabel].days[day] = [];
    weeks[weekLabel].days[day].push(task);
  });

  // Ordena as semanas da mais recente para a mais antiga
  const sortedWeeks = Object.values(weeks).sort((a, b) => b.timestamp - a.timestamp);

  // Ordena os dias dentro da semana (Segunda a Domingo)
  const order = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  sortedWeeks.forEach(week => {
    const sortedDays = [];
    order.forEach(d => {
      if (week.days[d]) sortedDays.push({ day: d, tasks: week.days[d] });
    });
    Object.keys(week.days).forEach(d => {
      if (!order.includes(d)) sortedDays.push({ day: d, tasks: week.days[d] });
    });
    week.sortedDays = sortedDays;
  });

  return sortedWeeks;
})

// 2. Extrai apenas os nomes das semanas ("Semana de X a Y") para o menu cascade
const availableWeeks = computed(() => {
  return tasksByWeek.value.map(w => w.label);
})

// 3. Devolve para o HTML apenas os dados correspondentes à semana que está selecionada
const currentWeekData = computed(() => {
  if (!selectedWeek.value) return null;
  return tasksByWeek.value.find(w => w.label === selectedWeek.value) || null;
})

// Observa o carregamento de novas semanas. 
// Assim que os treinos carregarem, seleciona a semana mais atual automaticamente para não aparecer vazio.
watch(availableWeeks, (newWeeks) => {
  if (newWeeks.length > 0 && !selectedWeek.value) {
    selectedWeek.value = newWeeks[0];
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/LoginPage')
}

onMounted(() => {
  fetchMyTasks()
})
</script>