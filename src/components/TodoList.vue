<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedStudentId"
          :items="studentStore.students"
          item-title="name"
          item-value="id"
          label="Aluno"
          placeholder="Selecione um aluno"
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-account"
        ></v-select>
      </v-col>

      <v-col cols="12" md="2">
        <v-select
          v-model="taskStore.dayTaskCreation"
          :items="['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']"
          label="Dia"
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-calendar"
        ></v-select>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field
          v-model="taskStore.titleTaskCreation"
          label="Exercício"
          placeholder="Ex: Supino Reto"
          variant="outlined"
          density="compact"
          hide-details
          :disabled="!selectedStudentId"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="taskStore.descriptionTaskCreation"
          label="Descrição"
          placeholder="Ex: 3x12 - 40kg"
          variant="outlined"
          density="compact"
          hide-details
          :disabled="!selectedStudentId"
          @keyup.enter="handleAddTask"
        >
          <template v-slot:append-inner>
            <v-btn
              icon="mdi-plus"
              variant="text"
              color="primary"
              :disabled="!selectedStudentId || !taskStore.titleTaskCreation"
              @click="handleAddTask"
            ></v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <ListTasks />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ListTasks from '@/components/ListTasks.vue';
import { useTaskStore } from '@/stores/task.js';
import { useStudentStore } from '@/stores/students.js';

const taskStore = useTaskStore();
const studentStore = useStudentStore();

// Estado local para o aluno selecionado
const selectedStudentId = ref(null);

/**
 * Função para adicionar a tarefa vinculada ao aluno e ao dia
 */
const handleAddTask = async () => {
  // Validação básica
  if (!taskStore.titleTaskCreation || !selectedStudentId.value) {
    return;
  }

  try {
    await taskStore.addTask(
      taskStore.titleTaskCreation,
      taskStore.descriptionTaskCreation,
      selectedStudentId.value,
      taskStore.dayTaskCreation // Passando o dia selecionado (Segunda, Terça, etc)
    );
    
    // Sucesso: Os campos de título e descrição são limpos automaticamente pela Action na Store
  } catch (error) {
    console.error("Erro ao adicionar exercício:", error);
    alert("Falha ao salvar exercício no banco de dados.");
  }
};

/**
 * Ao carregar o componente, buscamos os alunos e as tarefas do Supabase
 */
onMounted(async () => {
  try {
    // Carrega a lista de alunos do personal
    await studentStore.fetchStudents();
    // Carrega todas as tarefas para exibir na lista
    await taskStore.fetchTasks();
  } catch (error) {
    console.error("Erro ao inicializar dados:", error);
  }
});
</script>

<style scoped>
/* Adicione estilos personalizados se necessário */
</style>