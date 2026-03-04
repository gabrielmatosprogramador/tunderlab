<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6 pa-2">
      <div>
        <h2 class="text-h4 text-primary font-weight-bold">Cronograma de Treinos</h2>
        <p class="text-subtitle-1 text-grey">Organização por aluno e dia da semana</p>
      </div>
      
      <v-btn
        color="secondary"
        prepend-icon="mdi-account-plus"
        size="large"
        elevation="2"
        @click="showAddStudentDialog = true"
      >
        Novo Aluno
      </v-btn>
    </div>

    <v-row class="mb-4 pa-2">
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedStudent"
          :items="availableStudents"
          item-title="name"
          item-value="id"
          label="Filtrar por Aluno"
          placeholder="Todos os alunos"
          variant="outlined"
          density="compact"
          clearable
          prepend-inner-icon="mdi-account-search"
          hide-details
        ></v-select>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedWeek"
          :items="availableWeeks"
          label="Filtrar por Semana"
          placeholder="Todas as semanas"
          variant="outlined"
          density="compact"
          clearable
          prepend-inner-icon="mdi-calendar-range"
          hide-details
          :disabled="availableWeeks.length === 0"
        ></v-select>
      </v-col>
    </v-row>

    <div v-if="taskStore.tasks.length === 0 && !taskStore.loading" class="text-center text-grey mt-10">
      <v-icon icon="mdi-clipboard-text-off" size="60" class="mb-2"></v-icon>
      <p>Nenhuma atividade cadastrada no sistema.</p>
    </div>

    <div v-else-if="groupedTasks.length === 0" class="text-center text-grey mt-10">
      <v-icon icon="mdi-filter-variant-remove" size="60" class="mb-2"></v-icon>
      <p>Nenhum treino encontrado para os filtros selecionados.</p>
    </div>

    <v-expansion-panels v-else variant="popout" class="mb-4">
      <v-expansion-panel 
        v-for="student in groupedTasks" 
        :key="student.id"
      >
        <v-expansion-panel-title>
          <div class="d-flex align-center">
            <v-avatar color="primary" variant="tonal" size="32" class="mr-3">
              <span class="text-subtitle-2">{{ student.name.charAt(0).toUpperCase() }}</span>
            </v-avatar>
            <span class="text-h6 font-weight-bold">{{ student.name }}</span>
          </div>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          
          <v-expansion-panels variant="accordion">
            <v-expansion-panel 
              v-for="(tasks, day) in student.days" 
              :key="day"
            >
              <v-expansion-panel-title class="text-subtitle-1 font-weight-medium text-primary">
                <v-icon icon="mdi-calendar-clock" class="mr-2" size="small"></v-icon> 
                {{ day }}
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                
                <v-expansion-panels variant="outlined">
                  <v-expansion-panel 
                    v-for="task in tasks" 
                    :key="task.id"
                  >
                    <v-expansion-panel-title>
                      <div class="d-flex align-center w-100">
                        <span class="font-weight-medium">{{ task.title }}</span>
                        
                        <v-spacer></v-spacer>

                        <div class="mr-2">
                          <v-btn 
                            icon="mdi-pencil" 
                            size="x-small" 
                            variant="text" 
                            color="grey-darken-1"
                            @click.stop="openEdit(task)"
                          ></v-btn>
                          <v-btn 
                            icon="mdi-delete" 
                            size="x-small" 
                            variant="text" 
                            color="error"
                            @click.stop="openDelete(task)"
                          ></v-btn>
                        </div>
                      </div>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                      <div 
                        class="text-body-2 text-grey-darken-3 pa-3 bg-grey-lighten-4 rounded"
                        style="white-space: pre-wrap; line-height: 1.6;"
                      >
                        {{ task.description || 'Sem descrição detalhada.' }}
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <DialogTaskFields 
      :dialog="taskStore.showDialogTaskFields" 
      :task="taskStore.tasks[taskStore.indexTaskSelected]" 
      @update:dialog="taskStore.showDialogTaskFields = $event"
    />

    <DialogDelete 
      v-model="taskStore.showDialogDelete" 
    />

    <DialogAddStudent v-model="showAddStudentDialog" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useTaskStore } from '@/stores/task.js';

import DialogTaskFields from './DialogTaskFields.vue';
import DialogDelete from './DialogDelete.vue';
import DialogAddStudent from './DialogAddStudent.vue';

const taskStore = useTaskStore();
const showAddStudentDialog = ref(false);

// Refs para os filtros de busca
const selectedStudent = ref(null);
const selectedWeek = ref(null);

// Função para calcular qual semana a data pertence (mesma lógica do aluno)
const getWeekLabel = (dateString) => {
  if (!dateString) return 'Semanas Anteriores';
  const d = new Date(dateString);
  const day = d.getDay(); 
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  
  const friday = new Date(monday.getTime());
  friday.setDate(monday.getDate() + 4);

  const format = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return `Semana de ${format(monday)} a ${format(friday)}`;
};

// Adiciona o rótulo da semana e o timestamp em todas as tarefas do Store
const tasksMapped = computed(() => {
  return taskStore.tasks.map(t => ({
    ...t,
    weekLabel: getWeekLabel(t.created_at),
    timestamp: new Date(t.created_at || new Date()).getTime()
  }));
});

// Extrai os alunos que possuem treinos para compor a lista do v-select
const availableStudents = computed(() => {
  const studentsMap = {};
  taskStore.tasks.forEach(t => {
    if (t.student_id && t.students?.name) {
      studentsMap[t.student_id] = t.students.name;
    }
  });
  return Object.keys(studentsMap).map(id => ({ id, name: studentsMap[id] }));
});

// Extrai as semanas baseado no que foi filtrado (dinâmico pelo aluno)
const availableWeeks = computed(() => {
  // Se um aluno estiver selecionado, filtra as semanas só para ele. Se não, mostra as semanas de todos.
  const filteredForWeeks = selectedStudent.value 
    ? tasksMapped.value.filter(t => t.student_id === selectedStudent.value)
    : tasksMapped.value;
    
  const weeksMap = {};
  filteredForWeeks.forEach(t => {
     if(!weeksMap[t.weekLabel]) {
        weeksMap[t.weekLabel] = t.timestamp;
     }
  });
  
  return Object.entries(weeksMap)
    .sort((a, b) => b[1] - a[1]) // Garante da semana mais nova para a mais antiga
    .map(entry => entry[0]);
});

// Auto-seleciona a semana mais recente sempre que a lista de semanas atualizar
watch(availableWeeks, (newWeeks) => {
  if (newWeeks.length > 0) {
    if (!selectedWeek.value || !newWeeks.includes(selectedWeek.value)) {
      selectedWeek.value = newWeeks[0];
    }
  } else {
    selectedWeek.value = null;
  }
});

// Filtra a lista principal de tarefas com base no aluno E semana escolhidos
const filteredTasksList = computed(() => {
  return tasksMapped.value.filter(t => {
    const matchStudent = selectedStudent.value ? t.student_id === selectedStudent.value : true;
    const matchWeek = selectedWeek.value ? t.weekLabel === selectedWeek.value : true;
    return matchStudent && matchWeek;
  });
});

// Aplica o agrupamento original, mas agora sobre a lista filtrada
const groupedTasks = computed(() => {
  const students = {};

  filteredTasksList.value.forEach(task => {
    const sId = task.student_id || 'unknown';
    const sName = task.students?.name || 'Aluno Desconhecido';
    const day = task.day_of_week || 'Não Definido';

    if (!students[sId]) {
      students[sId] = { id: sId, name: sName, days: {} };
    }

    if (!students[sId].days[day]) {
      students[sId].days[day] = [];
    }

    students[sId].days[day].push(task);
  });

  const order = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
  return Object.values(students).map(s => {
    const sortedDays = {};
    
    order.forEach(d => {
      if (s.days[d]) sortedDays[d] = s.days[d];
    });

    Object.keys(s.days).forEach(d => {
      if (!order.includes(d)) sortedDays[d] = s.days[d];
    });

    s.days = sortedDays;
    return s;
  });
});

const openEdit = (task) => {
  const index = taskStore.tasks.findIndex(t => t.id === task.id);
  if (index !== -1) taskStore.openDialog(index);
};

const openDelete = (task) => {
  const index = taskStore.tasks.findIndex(t => t.id === task.id);
  if (index !== -1) taskStore.openDialogDelete(index);
};

onMounted(() => {
  taskStore.fetchTasks();
});
</script>

<style scoped>
.v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
  padding: 8px 12px 16px;
}
</style>