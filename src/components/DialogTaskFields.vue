<template>
  <v-dialog v-model="props.dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white">
        {{ isEditing ? 'Editar Tarefa' : 'Nova Tarefa' }}
      </v-card-title>

      <v-card-text class="pt-4">
        <v-container>
          <v-text-field
            v-model="localTask.title"
            label="Título"
            variant="outlined"
          ></v-text-field>

          <v-textarea
            v-model="localTask.description"
            label="Descrição"
            variant="outlined"
            rows="3"
          ></v-textarea>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="emit('update:dialog', false)">
          Cancelar
        </v-btn>
        <v-btn 
          color="primary" 
          variant="elevated" 
          @click="handleSave" 
          :loading="loading"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useTaskStore } from '@/stores/task'

const props = defineProps(['dialog', 'task'])
const emit = defineEmits(['update:dialog']) // Importante para fechar o modal corretamente

const taskStore = useTaskStore()
const loading = ref(false)
const localTask = ref({ title: '', description: '' })

// Verifica se estamos editando (se tem ID)
const isEditing = computed(() => !!props.task?.id)

// Quando a prop 'task' muda (ao abrir o modal), atualizamos o formulário local
watch(() => props.task, (newTask) => {
  if (newTask) {
    localTask.value = { ...newTask } // Cria uma cópia para não editar a store direto antes de salvar
  } else {
    localTask.value = { title: '', description: '' }
  }
}, { immediate: true })

const handleSave = async () => {
  loading.value = true
  try {
    if (isEditing.value) {
      
      await taskStore.updateTask(localTask.value)
    } else {
      alert("Para criar tarefas novas, use o formulário principal.")
      return
    }
    emit('update:dialog', false) 
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>