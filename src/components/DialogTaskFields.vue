<template>
  <div class="text-center pa-4">
    <v-dialog v-model="props.dialog" max-width="400" persistent>
      <!-- <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps">
          Open Dialog
        </v-btn>
      </template> -->

      <v-card prepend-icon="mdi-map-marker" title="Editar Tarefa">
        <v-text-field 
        v-model="props.task.title"
        label="Titulo"></v-text-field>

        <v-text-field 
        v-model="props.task.description"
        label="Descrição"></v-text-field>

        <template v-slot:actions>


          <v-spacer></v-spacer>
          <v-btn @click="$emit('openDialog')">
            Agree
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  dialog: Boolean,
  task: Object
})

</script>