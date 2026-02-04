<template>
    <div>
        <v-list
        v-model:selected="settingsSelection"
        lines="three"
        select-strategy="leaf"
        >
        <v-list-subheader>Exercícios</v-list-subheader>

        <v-list-item
        v-for="task, index in props.tasks"
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
        <template v-slot:append>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn
                    color="grey-lighten-1"
                    icon="mdi-dots-vertical"
                    variant="text"
                    v-bind="props"
                    >
                    
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item value="edit">
                    <v-list-item-title>Editar</v-list-item-title>
                    </v-list-item>

                    <v-list-item value="delet">
                    <v-list-item-title>Deletar</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
        </v-list-item>
        </v-list>
        <dialog-task-fields/>
    </div>
</template>

<script setup>
import {} from 'vue';
import DialogTaskFields from './DialogTaskFields.vue';

const settingsSelection = ref([])

const props = defineProps({
    tasks: Object
})
</script>