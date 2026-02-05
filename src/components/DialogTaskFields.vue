<template>
  <div class="text-center pa-4">
    <v-dialog v-model="taskStore.showDialogTaskFields" max-width="400" persistent>
      <v-card prepend-icon="mdi-map-marker" title="Editar Tarefa">
        <v-text-field 
        v-model="props.task.title"
        label="Titulo"></v-text-field>

        <v-textarea
          v-model="props.task.description"
          label="Message"
          maxlength="120"
          counter
          single-line
        ></v-textarea>

        <template v-slot:actions>


          <v-spacer></v-spacer>
          <v-btn @click="taskStore.openDialog()">
            Editar
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useTaskStore } from '@/stores/task.js';


const taskStore = useTaskStore();

const props = defineProps({
  task: Object
})

</script>