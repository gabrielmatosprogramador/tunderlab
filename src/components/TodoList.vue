<template>
  <v-text-field clearable label="Adicionar Exercicio" v-model="task.title" @keyup.enter="addTask">
  </v-text-field>

  <ListTasks :tasks="tasks"></ListTasks>
</template>

<script setup>
import ListTasks from '@/components/ListTasks.vue';


const tasks = ref([
  {
    title: "Estudar Vue",
    description: "Estudar VUE com Vuetify"
  },
  {
    title: "Estudar React",
    description: "Estudar React com Vuetify"
  }

]);

const settingsSelection = ref([])

const task = ref({
  title: "",
  description: ""
});

const addTask = () => {
  tasks.value.push({
    title: task.value.title,
    description: task.value.description
  })
  task.value = {
    title: "",
    description: ""
  }
}
</script>