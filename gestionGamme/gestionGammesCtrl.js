let vm = new Vue({
  el: "#app",
  data() {
    return {
      baseUrlGamme: "https://transfertprod-668c2.firebaseio.com/gammeList.json",
      baseUrlEditGamme: "https://transfertprod-668c2.firebaseio.com/gammeList/",
      dialog: false,
      editModalGamme: false,
      createModalGamme : true,
      drawer: true,
      copyGamme : "",
      snackbar: false,
      editsnackbar: false,
      deletesnackbar: false,
      emptyForm: false,
      y: 'bottom',
      x: null,
      mode: '',
      timeout: 3000,
      emptyFormText: "Le champs de nom de la gamme est obligatoire.",
      successtext: "Enregistrement de la gamme effectué avec succés",
      edittextsuccess: "Enregistrement de vos modifications effectué avec succés",
      deletesuccess: 'La gamme à été supprimé avec succés',
      gamme: {
        name: ""
      },
      currentGamme: {
      },
      gammeList: [
      ],
      mini: false,

    }
  },
  methods: {
    /**
     * Ajoute une gamme en base de donnée.
     */
    addGamme: function (event) {
      if (vm.gamme.name === "") {
        return vm.emptyForm = true;
      }
      this.$http.post(vm.baseUrlGamme, vm.gamme).then((resp) => {
        vm.gamme.key = resp.body.name;
        return this.$http.put(vm.baseUrlEditGamme + resp.body.name + '.json', vm.gamme).then((resp) => {
          vm.gamme.name = "";
          vm.dialog = false;
          vm.snackbar = true;
          return vm.getAllGamme();
        });
      })
    },
    /**
     * Récupére l'ensemble des gammes en base de donnée.
     */
    getAllGamme: function (event) {
      return this.$http.get(vm.baseUrlGamme).then((resp) => {
        vm.gammeList = resp.data;
      })
    },
    /**
     * Supprime la gamme cliqué par l'utilisateur.
     */
    deleteGamme: function ($event, currentGamme) {
      let gammeToDelete = currentGamme;
      return this.$http.delete(vm.baseUrlEditGamme + gammeToDelete.key + ".json").then((resp) => {
        vm.deletesnackbar = true;
        return vm.getAllGamme();
      });
    },
    /**
     * Edit de la gamme selectionné par l'utilisateur. 
     */
    editGamme: function () {
      if (vm.gamme.name === "") {
        return vm.emptyForm = true;
      }
      return this.$http.put(vm.baseUrlEditGamme + vm.gamme.key + ".json", vm.gamme).then((resp) => {
        vm.editsnackbar = true;
        vm.createModalGamme = true;
        vm.dialog = false;
         vm.editModalGamme = false;
        vm.gamme.name = "";
        return vm.getAllGamme();
      });
    },
    /**
     * Récupere la gamme que l'utilisateur selectionne. 
     */
    getCurrentGamme: function ($event, currentGamme) {
   
        vm.editModalGamme = true;
        vm.createModalGamme = false;
          vm.dialog = true;
          $event.stopPropagation();
          vm.gamme = currentGamme;
             vm.copyGamme = vm.gamme.name;
    }
  }
}
);

vm.getAllGamme();