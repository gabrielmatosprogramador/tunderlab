<template>
    <div>
        <v-list v-model:selected="settingsSelection" lines="three" select-strategy="leaf">
            <v-list-subheader>Exercícios</v-list-subheader>

            <v-list-item v-for="task, index in taskStore.tasks" :key="index" :value="index">
                <template v-slot:prepend="{ isSelected, select }">
                    <v-list-item-action start>
                        <v-checkbox-btn :model-value="isSelected" @update:model-value="select"></v-checkbox-btn>
                    </v-list-item-action>
                </template>

                <v-list-item-title>{{ task.title }}</v-list-item-title>

                <v-list-item-subtitle>{{ task.description }}</v-list-item-subtitle>
                
                <template v-slot:append>
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn color="grey-lighten-1" icon="mdi-dots-vertical" variant="text" v-bind="props">

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
                </template>
            </v-list-item>
        </v-list>
        <dialog-task-fields 
        :dialog="taskStore.showDialogTaskFields" 
        :task="taskStore.tasks[taskStore.indexTaskSelected]" 
        />

        <dialog-delete/>
    </div>
</template>

<script setup>
import DialogTaskFields from './DialogTaskFields.vue';
import DialogDelete from './DialogDelete.vue';
import { useTaskStore } from '@/stores/task.js';

const taskStore = useTaskStore();

const settingsSelection = ref([]);

</script>