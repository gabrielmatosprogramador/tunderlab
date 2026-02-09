<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="bg-primary text-white">
        <span class="text-h5">Novo Aluno</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="student.name"
                label="Nome Completo*"
                prepend-icon="mdi-account"
                variant="underlined"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="student.email"
                label="Email"
                prepend-icon="mdi-email"
                variant="underlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="student.phone"
                label="Telefone / WhatsApp"
                prepend-icon="mdi-phone"
                variant="underlined"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small class="text-caption text-grey">*Campos obrigatórios</small>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="dialog = false">
          Cancelar
        </v-btn>
        <v-btn 
          color="primary" 
          variant="elevated" 
          @click="save" 
          :loading="loading"
        >
          Salvar Aluno
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStudentStore } from '@/stores/students'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const studentStore = useStudentStore()
const loading = ref(false)

// Computada para controlar o v-model do pai de forma transparente
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const student = ref({
  name: '',
  email: '',
  phone: ''
})

const save = async () => {
  if (!student.value.name) {
    alert('O nome do aluno é obrigatório.')
    return
  }

  loading.value = true
  try {
    await studentStore.addStudent(student.value)
    student.value = { name: '', email: '', phone: '' }
    dialog.value = false
    alert('Aluno cadastrado com sucesso!')
  } catch (error) {
    alert('Erro ao cadastrar: ' + error.message)
  } finally {
    loading.value = false
  }
}
</script>