<template>
  <v-text-field 
  clearable 
  label="Adicionar Exercicio" 
  v-model="taskStore.titleTaskCreation" 
  @keyup.enter="taskStore.addTask">
  </v-text-field>

  <ListTasks/>
</template>

<script setup>
import ListTasks from '@/components/ListTasks.vue';
import { useTaskStore } from '@/stores/task.js';


const taskStore = useTaskStore();
const tasks = ref(taskStore.tasks);

</script>