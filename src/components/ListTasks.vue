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

    <div v-if="taskStore.tasks.length === 0 && !taskStore.loading" class="text-center text-grey mt-10">
      <v-icon icon="mdi-clipboard-text-off" size="60" class="mb-2"></v-icon>
      <p>Nenhuma atividade cadastrada.</p>
    </div>

    <v-expansion-panels variant="popout" class="mb-4">
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
import { ref, onMounted, computed } from 'vue';
import { useTaskStore } from '@/stores/task.js';

// Importação dos sub-componentes
import DialogTaskFields from './DialogTaskFields.vue';
import DialogDelete from './DialogDelete.vue';
import DialogAddStudent from './DialogAddStudent.vue';

const taskStore = useTaskStore();
const showAddStudentDialog = ref(false);

/**
 * Lógica de Agrupamento Triplo: Aluno > Dia > Tarefas
 */
const groupedTasks = computed(() => {
  const students = {};

  taskStore.tasks.forEach(task => {
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

  // Ordem cronológica dos dias para a interface
  const order = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
  return Object.values(students).map(s => {
    const sortedDays = {};
    
    // Adiciona os dias conforme a ordem definida
    order.forEach(d => {
      if (s.days[d]) sortedDays[d] = s.days[d];
    });

    // Adiciona qualquer dia extra (ex: 'Não Definido') ao final
    Object.keys(s.days).forEach(d => {
      if (!order.includes(d)) sortedDays[d] = s.days[d];
    });

    s.days = sortedDays;
    return s;
  });
});

/**
 * Funções auxiliares para abrir modais com a tarefa correta
 */
const openEdit = (task) => {
  const index = taskStore.tasks.findIndex(t => t.id === task.id);
  if (index !== -1) taskStore.openDialog(index);
};

const openDelete = (task) => {
  const index = taskStore.tasks.findIndex(t => t.id === task.id);
  if (index !== -1) taskStore.openDialogDelete(index);
};

// Carregar dados ao montar o componente
onMounted(() => {
  taskStore.fetchTasks();
});
</script>

<style scoped>
/* Estilização suave para os painéis aninhados */
.v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
  padding: 8px 12px 16px;
}
</style>