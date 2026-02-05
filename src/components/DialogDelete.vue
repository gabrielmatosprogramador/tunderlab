<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="taskStore.showDialogDelete"
      max-width="400"
      persistent
    >
      <v-card
        prepend-icon="mdi-map-marker"
        text="Tem certeza que deseja deletar este exercício? Após a confirmação, não será possível recuperá-lo."
        title="Deletar exercício?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="taskStore.openDialogDelete">
            Cancelar
          </v-btn>

          <v-btn @click="taskStore.deleteTask">
            Deletar
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useTaskStore } from '@/stores/task.js';


const taskStore = useTaskStore();


</script>