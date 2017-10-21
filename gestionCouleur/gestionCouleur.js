let vm = new Vue({
        el: "#app",
        data() {
            return {
                baseUrlCouleur: "https://transfertprod-668c2.firebaseio.com/couleurList.json",
                baseUrlEditCouleur: "https://transfertprod-668c2.firebaseio.com/couleurList/",
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
                edittextsuccess: "Vos modifications ont bien été prises en compte",
                deletesuccess: 'La couleur à été supprimée avec succés',
                couleur: {
                    value: "",
                    nom: ""
                },
                currentCouleur: {},
                couleursList: [],

            }
        },
        methods: {
            /**
             * Ajoute une couleur en base de donnée.
             */
            addCouleur() {
                if (vm.couleur.value === "") {
                    return vm.emptyForm = true;
                }
                this.$http.post(vm.baseUrlCouleur, vm.couleur).then((resp) => {
                    vm.couleur.key = resp.body.name;
                    return this.$http.put(vm.baseUrlEditCouleur + resp.body.name + '.json', vm.couleur).then((resp) => {
                        vm.couleur = {};
                        vm.dialog = false;
                        vm.snackbar = true;
                        return vm.getAllCouleurs();
                    });
                })
            },
            /**
             * Récupére l'ensemble des couleurs en base de donnée.
             */
            getAllCouleurs: function (event) {
                return this.$http.get(vm.baseUrlCouleur).then((resp) => {
                    vm.couleursList = resp.data;
                })
            },
            /**
             * Supprime la couleur cliqué par l'utilisateur.
             */
            deleteCouleur: function ($event, currentCouleur) {
                let couleurToDelete = currentCouleur;
                return this.$http.delete(vm.baseUrlEditCouleur + couleurToDelete.key + ".json").then((resp) => {
                    vm.deletesnackbar = true;
                    return vm.getAllCouleurs();
                });
            },
            /**
             * Edit de la couleur selectionné par l'utilisateur.
             */
            editCouleur: function ($event, currentCouleur) {
                if (vm.currentCouleur.nom === "") {
                    return vm.emptyForm = true;
                }
                return this.$http.put(vm.baseUrlEditCouleur + vm.currentCouleur.key + ".json", vm.currentCouleur).then((resp) => {
                    vm.edit = false;
                    vm.editsnackbar = true;
                    vm.currentCouleur = {};
                    return vm.getAllCouleurs();
                });
            },
            /**
             * Récupere la couleur que l'utilisateur selectionne.
             */
            getCurrentCouleur: function ($event, currentCouleur) {
                setTimeout
                (function () {
                    vm.edit = true;
                    vm.currentCouleur = currentCouleur;
                    console.log(vm.currentCouleur);
                }, 0)
            }
        }
    }
);
vm.getAllCouleurs();