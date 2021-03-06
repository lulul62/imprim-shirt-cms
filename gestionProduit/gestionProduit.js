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
                baseUrlAd: 'https://transfertprod-668c2.firebaseio.com/styleList/ad.json',
                dialog: false,
                couleurList: [],
                gammeList: [],
                visual: false,
                seeVisual: false,
                imgList: [],
                BASE_URL_USER: "https://transfertprod-668c2.firebaseio.com/user.json",
                saveModal: false,
                isLoading: false,
                createModalTitle: true,
                notificationError: "",
                errorForm: false,
                editModalTitle: false,
                couleurToShow: [],
                seeColor: false,
                genreList: ["Homme", "Femme", "Fille", "Garçon", 'Doming', 'Mug'],
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
                    activateDiscount : false,
                    printfacepossible: true,
                    isActive: false,
                    prixpromotion: "",
                    tailles: []

                },
                headers: [
                    {text: 'Gamme', value: 'gamme'},
                    {text: 'Couleur', value: 'couleur'},
                    {text: 'Visuel', value: 'visuel'},
                    {text: 'Poid', value: 'poid'},
                    {text: 'Prix (TTC)', value: 'prix'},
                    {text: 'Prix promotion (TTC)', value: 'prixpromotion'},
                    {text: "Action", value: ""}
                ],
                currentAd: '',
                faceavant: "",
                facearriere: "",
                cote: "",
                adDialog: false,
                couleursRef: [],
                items: [],
                currentCouleur: {},
                couleursList: [],
                tailles: ['XS', 'S', 'M', 'L', 'XL', 'XXL']


            }
        },
        mounted() {
            this.getAllCouleur();
            this.getAllGamme();
            this.getAllImage();
            this.getAllProduit();
            this.getPublicityLink();
        },
        methods: {
            /**
             * Ajoute un produit en base de donnée.
             */
            addProduit(event) {
                this.produit.visuel = [this.faceavant, this.facearriere, this.cote];
                this.checkForm();
                if(this.produit.prixpromotion === "" && this.produit.activateDiscount) {
                    return swal('', "Impossible d'activer la promotion si le champ prix promotion n'est pas renseigné", 'error')
                }
                if (this.errorArray.length > 0) {
                    return swal('', "Les champs suivants sont incorrects ou manquants : " + this.errorArray.toString(), 'error');
                }
                this.produit.prix = this.produit.prix.replace(",", ".")
                this.produit.prixpromotion = this.produit.prixpromotion.replace(",", ".")
                this.produit.poid = this.produit.poid.replace(",", ".")
                this.dialog = false;
                this.saveModal = true;
                return this.$http.post(this.baseUrlProduit, this.produit).then((produit) => {
                    this.notificationError = "";
                    this.produit.key = produit.body.name;
                    this.$http.put(`${this.baseUrlEditProduit + produit.body.name}.json`, this.produit).then((resp) => {
                        this.produit = {
                            nom: "",
                            gamme: "",
                            genre: "",
                            couleur: [],
                            visuel: [],
                            poid: "",
                            prix: "",
                            isActive: false
                        }
                        this.imgList.forEach(img => {
                            img.isActive = false;
                        });
                        this.snackbar = true;
                        this.successtext = "Le produit à été enregistré en base avec succés";
                        this.getAllProduit();
                        return this.saveModal = false;
                    });
                });
            },
            /**
             * Récupére l'ensemble des produits en base de donnée.
             */
            getAllProduit(event) {
                this.items = [];
                return this.$http.get(this.baseUrlProduit).then((resp) => {
                    Object.keys(resp.data).forEach((key) => {
                        this.items.push(resp.data[key]);
                    })
                }, (err) => {
                    swal('', 'Un erreur interne est survenue, veuillez re essayer ultérieurement', 'error')
                })
            },
            /**
             * Récupére l'ensemble des gammes en base de donnée.
             */
            getAllGamme(event) {
                return this.$http.get(this.baseUrlGamme).then((gammes) => {
                    Object.keys(gammes.data).forEach(key => {
                        this.gammeList.push(gammes.data[key].name);
                    });
                }, (err) => {
                    swal('', 'Un erreur interne est survenue, veuillez re essayer ultérieurement', 'error')
                })
            },
            /**
             * Récupére l'ensemble des couleurs en base de donnée.
             */
            getAllCouleur(event) {
                this.$http.get(this.baseUrlCouleur).then((couleur) => {
                    Object.keys(couleur.data).forEach(key => {
                        this.couleursList.push(couleur.data[key].nom);
                        this.couleursRef.push({
                            name: couleur.data[key].nom,
                            color: couleur.data[key].value
                        })
                    });
                }, (err) => {
                    swal('', 'Un erreur interne est survenue, veuillez re essayer ultérieurement', 'error')
                })
            },
            /**
             * Check de l'état du formulaire avant l'envoie d'un nouveau produit
             */
            checkForm() {
                this.errorArray = [];
                if (this.produit.gamme === "") {
                    this.errorArray.push("Gamme");
                }
                if (this.produit.genre === "") {
                    this.errorArray.push("Genre")
                }
                if (this.produit.prix === "") {
                    this.errorArray.push("Prix");
                }
                if (this.produit.poid === "") {
                    this.errorArray.push("Poid");
                }
                if (this.faceavant === "") {
                    this.errorArray.push("Face avant");
                }
                console.log(this.produit)
                if(this.produit.prixpromotion !== "") {
                    return this.checkDecimalPrice()
                }
                    if(this.produit.prix.indexOf(".") == -1) {
                        this.errorArray.push("Les prix doivent êtres indiqués en décimal")
                    }

            },

            checkDecimalPrice() {
                "use strict";
                let priceArray = [this.produit.prix, this.produit.prixpromotion];
                console.log(priceArray);
                if (priceArray[0].indexOf(".") == -1 || priceArray[1].indexOf(".") == -1) {
                    this.errorArray.push('Les prix doivent êtres indiqués en decimal');
                }
            },

            /**
             * Permet de récuperer l'ensemble des images en base de donnée.
             */
            getAllImage(event) {
                return this.$http.get(this.baseUrlImgList).then((img) => {
                    Object.keys(img.body).forEach((key) => {
                        this.imgList.push({base64: img.data[key].base64});
                    });
                })
            },
            /**
             * Supprime le produit cliqué par l'utilisateur.
             */
            deleteProduit($event, currentProduit) {
                let produitToDelete = currentProduit;
                return this.$http.delete(`${this.baseUrlEditProduit + produitToDelete.key}.json`).then((resp) => {
                    this.deletesnackbar = true;
                    return this.getAllProduit();
                });
            },
            /**
             * Edit du produit selectionné par l'utilisateur.
             */
            editProduit($event) {
                this.produit.visuel = [this.faceavant, this.facearriere, this.cote];
                this.checkForm();
                if(this.produit.prixpromotion === "" && this.produit.activateDiscount) {
                    return swal('', "Impossible d'activer la promotion si le champ prix promotion n'est pas renseigné", 'error')
                }
                if (this.errorArray.length > 0) {
                    return swal('', "Les champs suivants sont incorrects ou manquants :" + this.errorArray.toString(), 'error');
                }
                this.produit.prix = this.produit.prix.replace(",", ".")
                this.produit.prixpromotion = this.produit.prixpromotion.replace(",", ".")
                this.produit.poid = this.produit.poid.replace(",", ".")
                this.dialog = false;
                this.saveModal = true;
                return this.$http.put(`${this.baseUrlEditProduit + this.produit.key}.json`, this.produit).then((resp) => {
                    this.editsnackbar = true;
                    this.getAllProduit();
                    return this.saveModal = false;
                });
            },
            /**
             * Récupere le produit que l'utilisateur selectionne.
             */
            getCurrentProduit($event, currentProduit) {
                this.editModalTitle = true;
                this.createModalTitle = false;
                $event.stopPropagation();
                this.dialog = true;
                this.produit = currentProduit;
                this.faceavant = this.produit.visuel[0];
                this.facearriere = this.produit.visuel[1];
                this.cote = this.produit.visuel[2];

            },
            /**
             * Ajoute un visuel dans le tableau du produit
             */
            addVisuelToProduit($event, currentImage) {
                this.produit.visuel.push(currentImage);
                return currentImage.isActive = true;
            },
            /**
             * Vide le tableau visuel de produit
             */
            clearProductVisual($event) {
                this.produit.visuel = [];
                this.imgList.forEach(img => {
                    img.isActive = false;
                });
            },
            /**
             * Affiche la liste des visuels du produit selectionné par l'utilisateur
             */
            showCurrentVisualOfproduct($event, currentProduit) {
                this.visualToShow = [];
                currentProduit.item.visuel.forEach(visual => {
                    if(visual !== '') {
                        this.visualToShow.push(visual)
                    }
                })

            },
            /**
             * Ferme la modal et annule toute les actions relatives à celle ci
             */
            cancelAction() {
                this.dialog = false;
                this.editModalTitle = false;
                this.createModalTitle = true;
                this.produit = {
                    nom: "",
                    gamme: "",
                    genre: "",
                    couleur: [],
                    visuel: [],
                    poid: "",
                    prix: "",
                    printfacepossible: true,
                    tailles: []
                };
                this.faceavant = "";
                this.facearriere = "";
                this.cote = "";
                this.imgList.forEach(img => {
                    img.isActive = false;
                })
            },
            /**
             * Affiche la liste des couleurs du produit selectionné par l'utilisateur
             */
            showCurrentColorOfProduct($event, currentProduit) {
                this.couleurToShow = [];
                console.log(currentProduit.item.couleur)
                currentProduit.item.couleur.forEach(colorName => {
                    let index = _.findIndex(this.couleursRef, { 'name': colorName });
                    this.couleurToShow.push({colorName : this.couleursRef[index].color})
                });
                console.log(this.couleurToShow)
                return this.couleurToShow
            },

            /**
             * Export client json to csv
             */
            exportClientToCsv() {
                vm.usersToExport = [];
                this.$http.get(this.BASE_URL_USER).then(res => {
                    Object.keys(res.body).forEach(key => {
                        vm.usersToExport.push({client: res.body[key].name + ' ' + res.body[key].firstname, email: res.body[key].email});
                    })
                    return downloadCSV()
                }, (err) => {
                    return swal('', 'Erreur interne', 'error')
                })
            },

            /**
             * show edit ad dialog
             */
            showAdDialog () {
                console.log('je passe')
                  this.getPublicityLink()
                    this.adDialog = true
                },

            /**
             * Save ad in database
             */
            saveAd () {
                this.$http.put(this.baseUrlAd, JSON.stringify(this.currentAd)).then(res => {
                    swal('', 'Publicité mise à jour avec succés', 'success')
                    this.adDialog = false
                    this.getPublicityLink()
                }, (err) => {
                    console.log(err)
                    swal('', 'Une erreur interne est survenue, veuillez re essayer ultérieurement', 'error')

                })
            },

            /**
             * Get ad form database
             */
             getPublicityLink () {
               this.$http.get(this.baseUrlAd).then(res => {
                    this.currentAd = res.body
               }, (err) => {
                   "use strict";
                   console.log(err)
               })

            }
        }
    }
);

function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function downloadCSV(args) {
    var data, filename, link;

    var csv = convertArrayOfObjectsToCSV({
        data: vm.usersToExport
    });
    if (csv == null) return;

    filename = 'Export client.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}




