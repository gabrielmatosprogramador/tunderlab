// stores/counter.js
import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [{
      title: "Estudar Vue",
      description: "Estudar VUE com Vuetify"
    },
    {
      title: "Estudar React",
      description: "Estudar React com Vuetify"
    }],
    titleTaskCreation: "",
    showDialogDelete: false,
    indexTaskSelected: 0,
    showDialogTaskFields: false
  }),

  actions: {
    addTask() {
      this.tasks.push({
        title: this.titleTaskCreation
      })
      this.titleTaskCreation = "";
    },
    openDialogDelete(index) {
      this.showDialogDelete = !this.showDialogDelete;
      if (index != null) {
        this.indexTaskSelected = index;
      }
    },

    deleteTask(){
    this.tasks.splice(this.indexTaskSelected,1);
    this.openDialogDelete();
    },

    openDialog (index) {
      this.showDialogTaskFields = !this.showDialogTaskFields;
      if (index != null) {
          this.indexTaskSelected = index;
      }
    }
  }
})