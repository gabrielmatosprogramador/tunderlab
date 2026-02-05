<template>
  <div>
    <v-expansion-panels variant="accordion">
      
      <v-expansion-panel 
        v-for="(task, index) in taskStore.tasks" 
        :key="index"
      >
        <v-expansion-panel-title>
          <template v-slot:default>
            <div class="d-flex align-center w-100">
              
              <div class="mr-2">
                 <v-checkbox-btn 
                    :model-value="settingsSelection.includes(index)" 
                    @click.stop="toggleSelection(index)"
                 ></v-checkbox-btn>
              </div>

              <span class="text-h6 font-weight-regular">
                  {{ task.title }}
              </span>
              
              <v-spacer></v-spacer>

              <div class="mr-2">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn 
                      color="grey-lighten-1" 
                      icon="mdi-dots-vertical" 
                      variant="text" 
                      v-bind="props"
                      @click.stop
                    >
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item value="edit" @click="taskStore.openDialog(index)">
                      <v-list-item-title>Editar</v-list-item-title>
                    </v-list-item>

                    <v-list-item value="delet" @click="taskStore.openDialogDelete(index)">
                      <v-list-item-title>Deletar</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

            </div>
          </template>
        </v-expansion-panel-title>

        <v-expansion-panel-text style="white-space: pre-wrap;">
          <div v-if="task.description" class="text-body-1 text-grey-darken-1">
            {{ task.description }}
          </div>
          <div v-else class="text-caption text-grey-lighten-1">
            Sem descrição.
          </div>
        </v-expansion-panel-text>

      </v-expansion-panel>
    </v-expansion-panels>

    <dialog-task-fields 
      :dialog="taskStore.showDialogTaskFields" 
      :task="taskStore.tasks[taskStore.indexTaskSelected]" 
    />

    <dialog-delete/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DialogTaskFields from './DialogTaskFields.vue';
import DialogDelete from './DialogDelete.vue';
import { useTaskStore } from '@/stores/task.js';

const taskStore = useTaskStore();

const settingsSelection = ref([]);

const toggleSelection = (index) => {
  if (settingsSelection.value.includes(index)) {
    settingsSelection.value = settingsSelection.value.filter(i => i !== index);
  } else {
    settingsSelection.value.push(index);
  }
}
</script>