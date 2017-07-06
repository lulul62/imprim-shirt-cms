let vm = new Vue({
  el: "#app",
  data() {
    return {
      baseUrlStyle: "https://transfertprod-668c2.firebaseio.com/styleList.json",
      baseUrlEditStyle: "https://transfertprod-668c2.firebaseio.com/styleList/",
      baseUrlGamme: "https://transfertprod-668c2.firebaseio.com/gammeList.json",
      dialog: false,
      edit: false,
      drawer: true,
      editModal: false,
      createModal: false,
      snackbar: false,
      errorArray: [],
      editsnackbar: false,
      deletesnackbar: false,
      emptyForm: false,
      y: 'bottom',
      x: null,
      mode: '',
      timeout: 3000,
      formError: false,
      emptyFormText: "",
      successtext: "Enregistrement du style effectué avec succés",
      edittextsuccess: "Enregistrement de vos modifications effectué avec succés",
      deletesuccess: 'Le style à été supprimé avec succés',
      style: {
        name: "",
        genre: "",
        gamme: "",
      },
      genre: ["Homme", "Femme", "Fille", "Garçon"],
      currentStyle: {
      },
      styleList: [
      ],
      gammesList: [],
      mini: false,

    }
  },
  methods: {
    /**
     * Ajoute un style en base de donnée.
     */
    addStyle: function (event) {
      vm.checkForm();
      if (vm.errorArray.length > 0) {
        console.log("erruer");
        vm.emptyFormText = vm.errorArray.toString();
        return vm.formError = true;
      }
      vm.formError = false;
      this.$http.post(vm.baseUrlStyle, vm.style).then((resp) => {
        vm.style.key = resp.body.name;
        return this.$http.put(vm.baseUrlEditStyle + resp.body.name + '.json', vm.style).then((resp) => {
          vm.style = {
            name: "",
            genre: "",
            gamme: ""
          };
          vm.dialog = false;
          vm.snackbar = true;
          return vm.getAllStyles();
        });
      })
    },
    /**
     * Récupére l'ensemble des styles en base de donnée.
     */
    getAllStyles: function (event) {
      return this.$http.get(vm.baseUrlStyle).then((resp) => {
        vm.styleList = resp.data;
      })
    },

    /**
     * Récupere l'ensemble des gammes.
     */
    getAllGammes: function (event) {
      return this.$http.get(vm.baseUrlGamme).then((gammes) => {
        Object.keys(gammes.data).forEach(function (key) {
          vm.gammesList.push(gammes.data[key].name);
        });
      })
    },
    /**
     * Supprime le style cliqué par l'utilisateur.
     */
    deleteStyle: function ($event, currentStyle) {
      let styleToDelete = currentStyle;
      return this.$http.delete(vm.baseUrlEditStyle + styleToDelete.key + ".json").then((resp) => {
        vm.deletesnackbar = true;
        return vm.getAllStyles();
      });
    },

    checkForm: function () {
      vm.errorArray = [];
      if (vm.style.genre === "") {
        vm.errorArray.push("Genre");
      }
      if (vm.style.name === "") {
        vm.errorArray.push("Nom");
      }
      if (vm.style.gamme === "") {
        vm.errorArray.push("Gamme");
      }
      console.log(vm.errorArray);
    },
    /**
     * Edit du style selectionné par l'utilisateur. 
     */
    editStyle: function () {
      vm.errorArray = [];
      vm.checkForm();
      if (vm.errorArray.length > 0) {
        vm.emptyFormText = vm.errorArray.toString();
        return vm.formError = true;
      }

      vm.formError = false;
      return this.$http.put(vm.baseUrlEditStyle + vm.style.key + ".json", vm.style).then((resp) => {
        vm.dialog = false;
        vm.createModal = true;
        vm.editModal = false;
        vm.editsnackbar = true;
        vm.style = "";

        return vm.getAllStyles();
      });
    },
    /**
     * Récupere le style que l'utilisateur sÒelectionne. 
     */
    getCurrentStyle: function ($event, currentStyle) {
      vm.editModal = true;
      vm.createModal = false;
      vm.dialog = true;
      $event.stopPropagation();
      vm.style = currentStyle;

    }
  }
}
);
vm.getAllGammes();
vm.getAllStyles();