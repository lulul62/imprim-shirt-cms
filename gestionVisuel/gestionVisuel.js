let vm = new Vue({
  el: "#app",
  data() {
    return {
      dialog: false,
      edit: false,
      drawer: true,
      snackbar: false,
      editsnackbar: false,
      deletesnackbar: false,
      emptyForm: false,
      y: 'bottom',
      x: null,
      mode: '',
      timeout: 3000,
      emptyFormText: "Le champs de la couleur est obligatoire.",
      successtext: "Enregistrement de la couleur effectué avec succés",
      edittextsuccess: "Enregistrement de vos modifications effectué avec succés",
      deletesuccess: 'La couleur à été supprimée avec succés'
    }
  }
}
);
