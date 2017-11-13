let vm = new Vue({
        el: "#app",
        data() {
            return {
                baseUrlCouleur: "https://transfertprod-668c2.firebaseio.com/couleurList.json",
                baseUrlEditCouleur: "https://transfertprod-668c2.firebaseio.com/couleurList/",
                baseUrlProduit : "https://transfertprod-668c2.firebaseio.com/produitList.json",
                dialog: false,
                edit: false,
                drawer: true,
                snackbar: false,
                editsnackbar: false,
                deletesnackbar: false,
                emptyForm: false,
                deleteModal: false,
                BASE_URL_USER: "https://transfertprod-668c2.firebaseio.com/user.json",
                y: 'bottom',
                produit : [],
                couleurToDelete : '',
                x: null,
                mode: '',
                found: false,
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
        mounted() {
            "use strict";
            this.getAllCouleurs();
            this.getAllProduit()
        },
        methods: {
            /**
             * Ajoute une couleur en base de donnée.
             */
            addCouleur() {
                if (this.couleur.value === "") {
                    return this.emptyForm = true;
                }
                this.$http.post(this.baseUrlCouleur, this.couleur).then((resp) => {
                    this.couleur.key = resp.body.name;
                    return this.$http.put(this.baseUrlEditCouleur + resp.body.name + '.json', this.couleur).then((resp) => {
                        this.couleur = {};
                        this.dialog = false;
                        this.snackbar = true;
                        return this.getAllCouleurs();
                    });
                })
            },
            /**
             * Récupére l'ensemble des couleurs en base de donnée.
             */
            getAllCouleurs(event) {
                return this.$http.get(this.baseUrlCouleur).then((resp) => {
                    this.couleursList = resp.data;
                })
            },

            /**
             * Récupére l'ensemble des produits en base de donnée.
             */
            getAllProduit (event) {
                return this.$http.get(this.baseUrlProduit).then((resp) => {
                    Object.keys(resp.data).forEach((key) => {
                        this.produit.push(resp.data[key]);
                    })
                    console.log(this.produit)
                })
            },

            /**
             * Check si une couleur est utiilsé sur un produit
             */
             checkColorPresency() {
                this.found = false;
                this.produit.forEach(produit => {
                    console.log(produit.couleur)
                        if(produit.couleur.includes(this.couleurToDelete.nom)) {
                            this.found = true;
                            return
                        }
                    })
             },

            showDeleteModal ($event, currentCouleur) {
                "use strict";
                this.couleurToDelete = currentCouleur;
                this.deleteModal = true
            },
            /**
             * Supprime la couleur cliqué par l'utilisateur.
             */
            deleteCouleur($event) {
                this.checkColorPresency()
                if(this.found === true) {
                    return swal('', 'Il est impossible de supprimer une couleur utilisée dans un produit', 'error')
                }
                 this.$http.delete(this.baseUrlEditCouleur + this.couleurToDelete.key + ".json").then((resp) => {
                    this.getAllCouleurs();
                    swal('', 'La couleur à été supprimée avec succés', 'success')
                });
            },
            /**
             * Edit de la couleur selectionné par l'utilisateur.
             */
            editCouleur($event, currentCouleur) {
                if (this.currentCouleur.nom === "") {
                    return this.emptyForm = true;
                }
                return this.$http.put(this.baseUrlEditCouleur + this.currentCouleur.key + ".json", this.currentCouleur).then((resp) => {
                    this.edit = false;
                    this.editsnackbar = true;
                    this.currentCouleur = {};
                    return this.getAllCouleurs();
                });
            },
            /**
             * Récupere la couleur que l'utilisateur selectionne.
             */
            getCurrentCouleur($event, currentCouleur) {
                setTimeout
                (function () {
                    this.edit = true;
                    this.currentCouleur = currentCouleur;
                    console.log(this.currentCouleur);
                }, 0)
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

