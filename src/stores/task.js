// stores/counter.js
import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
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
      this.saveLocalData();
    },

    deleteTask(){
    this.tasks.splice(this.indexTaskSelected,1);
    this.openDialogDelete();
    this.saveLocalData();
    },

    openDialogDelete(index) {
      this.showDialogDelete = !this.showDialogDelete;
      if (index != null) {
        this.indexTaskSelected = index;
      }
      this.saveLocalData();

    },

    openDialog (index) {
      this.showDialogTaskFields = !this.showDialogTaskFields;
      if (index != null) {
          this.indexTaskSelected = index;
      }
      this.saveLocalData();
    },

    saveLocalData(){
      localStorage.setItem('tasks',
        JSON.stringify(this.tasks)
      )
    },

    getTasks(){
      let items = localStorage.getItem('tasks');
      if(items){
        this.tasks = JSON.parse(items);
    }
    }
  }
})