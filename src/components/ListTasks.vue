<template>
    <div>
        <v-list v-model:selected="settingsSelection" lines="three" select-strategy="leaf">
            <v-list-subheader>Exercícios</v-list-subheader>

            <v-list-item v-for="task, index in props.tasks" :key="index" :value="index">
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
                            <v-list-item value="edit">
                                <v-list-item-title @click="openDialog(index)">Editar</v-list-item-title>
                            </v-list-item>

                            <v-list-item value="delet">
                                <v-list-item-title>Deletar</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-list-item>
        </v-list>
        <dialog-task-fields 
        :dialog="showDialogTaskFields"
        :task="tasks[indexTaskSelected]"
        @openDialog="openDialog" />
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import DialogTaskFields from './DialogTaskFields.vue';

const settingsSelection = ref([])

const props = defineProps({
    tasks: Object
})

const indexTaskSelected = ref(0);
const showDialogTaskFields = ref(false);

const openDialog = (index) => {
    showDialogTaskFields.value = !showDialogTaskFields.value;
    if(index != null) {
        indexTaskSelected.value = index;
    }
}
</script>