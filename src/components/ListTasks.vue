<template>
    <div>
        <v-text-field 
        clearable 
        label="Adicionar Exercicio"
        v-model="task.title"
        @keyup.enter="addTask"
        >
    
        </v-text-field>

        <v-list
      v-model:selected="settingsSelection"
      lines="three"
      select-strategy="leaf"
    >
      <v-list-subheader>General</v-list-subheader>

      <v-list-item
        v-for="task, index in tasks"
        :key="index"
        :value="index"
      >
        <template v-slot:prepend="{ isSelected, select }">
          <v-list-item-action start>
            <v-checkbox-btn :model-value="isSelected" @update:model-value="select"></v-checkbox-btn>
          </v-list-item-action>
        </template>

        <v-list-item-title>{{ task.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ task.description }}</v-list-item-subtitle>

      </v-list-item>
    </v-list>
    </div>
</template>

<script setup>
 import ListTasks from '@/components/ListTasks.vue';

  const tasks = ref([
    { title: "Estudar Vue",
      description: "Estudar VUE com Vuetify"
    },
    { title: "Estudar React",
      description: "Estudar React com Vuetify"
    }
    
  ]);

  const settingsSelection = ref([])

  const task = ref({
    title: "",
    description: ""
  });

  const addTask = ()=>{
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

<style>

</style>