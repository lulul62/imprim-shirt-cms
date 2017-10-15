let vm = new Vue({
        el: "#app",
        data() {
            return {
                baseUrlProduit: "https://transfertprod-668c2.firebaseio.com/produitList.json",
                baseUrlEditProduit: "https://transfertprod-668c2.firebaseio.com/produitList/",
                baseUrlCouleur: "https://transfertprod-668c2.firebaseio.com/couleurList.json",
                baseUrlGamme: "https://transfertprod-668c2.firebaseio.com/gammeList.json",
                baseUrlImgList: "https://transfertprod-668c2.firebaseio.com/imglist.json",
                baseUrlClient: "https://transfertprod-668c2.firebaseio.com/client.json",
                dialog: false,
                couleurList: [],
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
                edittextsuccess: "Vos modifications ont bien été prises en compte",
                deletesuccess: 'Le produit à été supprimée avec succés',
                produit: {
                    gamme: "",
                    genre: "",
                    couleur: [],
                    visuel: [],
                    poid: "",
                    prix: "",
                    printfacepossible: true,
                    isActive : false,
                    prixpromotion: "",
                    tailles : []

                },
                headers: [
                    {text: 'Gamme', value: 'gamme'},
                    {text: 'Couleur', value: 'couleur'},
                    {text: 'Visuel', value: 'visuel'},
                    {text: 'Poid', value: 'poid'},
                    {text: 'Prix (TTC)', value: 'prix'},
                    {text : 'Prix promotion (TTC)', value : 'prixpromotion'},
                    {text: "Action", value: ""}
                ],
                faceavant: "",
                facearriere: "",
                cote: "",
                items: [],
                currentCouleur: {},
                couleursList: [],
                tailles : ['XS', 'S', 'M', 'L', 'XL', 'XXL']


            }
        },
        methods: {
            /**
             * Ajoute un produit en base de donnée.
             */
            addProduit: function (event) {
                this.produit.visuel = [this.faceavant, this.facearriere, this.cote];
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
                            couleur: [],
                            visuel: [],
                            poid: "",
                            prix: "",
                            isActive : false
                        }
                            vm.imgList.forEach(function (img) {
                                img.isActive = false;
                            });
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
                if (vm.produit.gamme === "") {
                    vm.errorArray.push("Gamme");
                }
                if (vm.produit.genre === "") {
                    vm.errorArray.push("Genre")
                }
                if (vm.produit.prix === "") {
                    vm.errorArray.push("Prix");
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
                if (vm.produit.visuel.length > 3) {
                    vm.errorArray.push("3 visuels maximum par produit (coté, face avant, face arrière");
                }

            },

            /**
             * Permet de récuperer l'ensemble des images en base de donnée.
             */
            getAllImage: function (event) {
                return this.$http.get(vm.baseUrlImgList).then((img) => {
                    Object.keys(img.body).forEach((key) => {
                        vm.imgList.push({base64: img.data[key].base64});
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
                this.faceavant = this.produit.visuel[0];
                this.facearriere = this.produit.visuel[1];
                this.cote = this.produit.visuel[2];

            },
            /**
             * Ajoute un visuel dans le tableau du produit
             */
            addVisuelToProduit: function ($event, currentImage) {
                vm.produit.visuel.push(currentImage);
                return currentImage.isActive = true;
            },
            /**
             * Vide le tableau visuel de produit
             */
            clearProductVisual: function ($event) {
                vm.produit.visuel = [];
                vm.imgList.forEach(function (img) {
                    img.isActive = false;
                });
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
            cancelAction() {
                vm.dialog = false;
                vm.editModalTitle = false;
                vm.createModalTitle = true;
                vm.produit = {
                    nom: "",
                    gamme: "",
                    genre: "",
                    couleur: [],
                    visuel: [],
                    poid: "",
                    prix: "",
                    printfacepossible: true,
                    tailles : []
                };
                this.faceavant = "";
                this.facearriere = "";
                this.cote = "";
                vm.imgList.forEach(function (img) {
                    img.isActive = false;
                })
            },
            /**
             * Affiche la liste des couleurs du produit selectionné par l'utilisateur
             */
            showCurrentColorOfProduct: function ($event, currentProduit) {
                vm.couleurToShow = [];
                currentProduit.item.couleur.forEach((couleur) => {
                    vm.couleurToShow.push({"colorName": couleur});
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
vm.getAllImage();
vm.getAllProduit();