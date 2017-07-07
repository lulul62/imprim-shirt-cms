let vm = new Vue({
  el: "#app",
  data() {
    return {
      baseUrlProduit: "https://transfertprod-668c2.firebaseio.com/produitList.json",
      baseUrlEditProduit: "https://transfertprod-668c2.firebaseio.com/produitList/",
      baseUrlCouleur: "https://transfertprod-668c2.firebaseio.com/couleurList.json",
      baseUrlStyle: "https://transfertprod-668c2.firebaseio.com/styleList.json",
      baseUrlGamme: "https://transfertprod-668c2.firebaseio.com/gammeList.json",
      baseUrlImgList: "https://transfertprod-668c2.firebaseio.com/imglist.json",
      baseUrlClient: "https://transfertprod-668c2.firebaseio.com/client.json",
      dialog: false,
      couleurList: [],
      styleList: [],
      gammeList: [],
      visual: false,
      seeVisual: false,
      imgList: [],
      saveModal: false,
      isLoading: false,
      createModalTitle: true,
      notificationError: "",
      errorForm: false,
      editModalTitle: false,
      formSnackbar: false,
      couleurToShow: [],
      seeColor: false,
      genreList: ["Homme", "Femme", "Fille", "Garçon"],
      edit: false,
      e6: 1,
      drawer: true,
      snackbar: false,
      errorArray: [],
      editsnackbar: false,
      deletesnackbar: false,
      visualToShow: [],
      emptyForm: false,
      search: "",
      y: 'bottom',
      x: null,
      mode: '',
      timeout: 3000,
      successtext: "Enregistrement du produit effectué avec succés",
      edittextsuccess: "Enregistrement de vos modifications effectué avec succés",
      deletesuccess: 'Le produit à été supprimée avec succés',
      produit: {
        nom: "",
        gamme: "",
        genre: "",
        style: "",
        couleur: [],
        visuel: [],
        poid: "",
        prix: "",
        prixpromotion: ""
      },
      headers: [

        { text: 'Nom', value: 'nom' },
        { text: 'Gamme', value: 'gamme' },
        { text: 'Genre', value: 'genre' },
        { text: 'Style', value: 'style' },
        { text: 'Couleur', value: 'couleur' },
        { text: 'Visuel', value: 'visuel' },
        { text: 'Poid', value: 'poid' },
        { text: 'Prix', value: 'prix' },
        { text: "Action", value: "" }
      ],
      items: [],
      currentCouleur: {
      },
      couleursList: [],

    }
  },
  methods: {
    /**
     * Ajoute un produit en base de donnée.
     */
    addProduit: function (event) {
      vm.checkForm();
      if (vm.errorArray.length > 0) {
        vm.formSnackbar = true;
        return vm.notificationError = vm.errorArray.toString();
      }
      vm.dialog = false;
      vm.saveModal = true;
      return this.$http.post(vm.baseUrlProduit, vm.produit).then((produit) => {
        vm.notificationError = "";
        vm.produit.key = produit.body.name;
        this.$http.put(vm.baseUrlEditProduit + produit.body.name + '.json', vm.produit).then((resp) => {
          vm.produit = {
            nom: "",
            gamme: "",
            genre: "",
            style: "",
            couleur: [],
            visuel: [],
            poid: "",
            prix: ""
          },
              vm.snackbar = true;
            vm.successtext = "Le produit à été enregistré en base avec succés";
          vm.getAllProduit();
          return vm.saveModal = false;
        });
      });
    },
    /**
     * Récupére l'ensemble des produits en base de donnée.
     */
    getAllProduit: function (event) {
      vm.items = [];
      return this.$http.get(vm.baseUrlProduit).then((resp) => {
        Object.keys(resp.data).forEach((key) => {
          vm.items.push(resp.data[key]);
        })
      })
    },
    /**
     * Récupére l'ensemble des gammes en base de donnée.
     */
    getAllGamme: function (event) {
      return this.$http.get(vm.baseUrlGamme).then((gammes) => {
        Object.keys(gammes.data).forEach(function (key) {
          vm.gammeList.push(gammes.data[key].name);
        });
      })
    },
    /**
     * Récupére l'ensemble des couleurs en base de donnée.
     */
    getAllCouleur: function (event) {
      return this.$http.get(vm.baseUrlCouleur).then((couleur) => {
        Object.keys(couleur.data).forEach(function (key) {
          vm.couleurList.push(couleur.data[key].value);
        });
      })
    },
    /**
     * Check de l'état du formulaire avant l'envoie d'un nouveau produit 
     */
    checkForm: function () {
      vm.errorArray = [];
      if (vm.produit.nom === "") {
        vm.errorArray.push("Nom");
      }
      if (vm.produit.gamme === "") {
        vm.errorArray.push("Gamme");
      }
      if (vm.produit.genre === "") {
        vm.errorArray.push("Genre")
      }
      if (vm.produit.style === "") {
        vm.errorArray.push("Style");
      }
      if (vm.produit.prix === "") {
        vm.errorArray.push("Prix");
      }
      if (vm.produit.prixpromotion === "") {
        vm.errorArray.push("Prix promotion");
      }
      if (vm.produit.poid === "") {
        vm.errorArray.push("Poid");
      }
      if (vm.produit.couleur.length === 0) {
        vm.errorArray.push("Couleur");
      }
      if (vm.produit.visuel.length === 0) {
        vm.errorArray.push("Visuel");
      }
      if(vm.produit.visuel.length > 3) {
        vm.errorArray.push("3 visuels maximum par produit (coté, face avant, face arrière");
      }

    },

    /**
     * Permet de récuperer l'ensemble des images en base de donnée. 
     */
    getAllImage: function (event) {
      return this.$http.get(vm.baseUrlImgList).then((img) => {
        Object.keys(img.data).forEach((key) => {
          vm.imgList.push({ base64: img.data[key].base64 });
        })
        console.log(vm.imgList)
      })
    },
    /**
     * Récupére l'ensemble des styles en base de donnée.
     */
    getAllStyle: function (event) {
      return this.$http.get(vm.baseUrlStyle).then((style) => {
        Object.keys(style.data).forEach(function (key) {
          vm.styleList.push(style.data[key].name);
        });
      })
    },
    /**
     * Supprime le produit cliqué par l'utilisateur.
     */
    deleteProduit: function ($event, currentProduit) {
      let produitToDelete = currentProduit;
      return this.$http.delete(vm.baseUrlEditProduit + produitToDelete.key + ".json").then((resp) => {
        vm.deletesnackbar = true;
        return vm.getAllProduit();
      });
    },
    /**
     * Edit du produit selectionné par l'utilisateur. 
     */
    editProduit: function ($event) {
      vm.checkForm();
      if (vm.errorArray.length > 0) {
        vm.formSnackbar = true;
        return vm.notificationError = vm.errorArray.toString();
      }
      vm.dialog = false;
      vm.saveModal = true;
      return this.$http.put(vm.baseUrlEditProduit + vm.produit.key + ".json", vm.produit).then((resp) => {
        vm.editsnackbar = true;
        vm.getAllProduit();
        return vm.saveModal = false;
      });
    },
    /**
     * Récupere le produit que l'utilisateur selectionne. 
     */
    getCurrentProduit: function ($event, currentProduit) {
      vm.editModalTitle = true;
      vm.createModalTitle = false;
      $event.stopPropagation();
      vm.dialog = true;
      vm.produit = currentProduit;

    },
    /**
     * Ajoute un visuel dans le tableau du produit
     */
    addVisuelToProduit: function ($event, currentImage) {
      vm.produit.visuel.push(currentImage);
    },
    /**
     * Vide le tableau visuel de produit
     */
    clearProductVisual: function ($event) {
      return vm.produit.visuel = [];
    },
    /**
     * Affiche la liste des visuels du produit selectionné par l'utilisateur
     */
    showCurrentVisualOfproduct: function ($event, currentProduit) {
      vm.visualToShow = currentProduit.item.visuel;
    },

    /**
     * Ferme la modal et annule toute les actions relatives à celle ci 
     */
    cancelAction: function () {
      vm.dialog = false;
      vm.editModalTitle = false;
      vm.createModalTitle = true;
      vm.produit = {
        nom: "",
        gamme: "",
        genre: "",
        style: "",
        couleur: [],
        visuel: [],
        poid: "",
        prix: ""
      }
    },
    /**
     * Affiche la liste des couleurs du produit selectionné par l'utilisateur
     */
    showCurrentColorOfProduct: function ($event, currentProduit) {
      vm.couleurToShow = [];
      currentProduit.item.couleur.forEach((couleur) => {
        vm.couleurToShow.push({ "colorName": couleur });
      });
    },
    /**
     * Export de la base de donnée client
     */
    exportClientDatabase: function ($event) {
      return this.$http.get(vm.baseUrlClient).then((clientFile) => {
        let link = document.createElement("a");
        link.download = "base de donnée client.txt";
        let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clientFile.data));
        link.href = "data:" + data;
        link.click();
      })
    }
  }
}
);

vm.getAllCouleur();
vm.getAllGamme();
vm.getAllStyle();
vm.getAllImage();
vm.getAllProduit();