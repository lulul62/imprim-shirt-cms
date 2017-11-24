 new Vue({
        el: "#app",
        data() {
            return {
                baseUrlGamme: "https://transfertprod-668c2.firebaseio.com/gammeList.json",
                baseUrlEditGamme: "https://transfertprod-668c2.firebaseio.com/gammeList/",
                baseUrlProduit: "https://transfertprod-668c2.firebaseio.com/produitList.json",
                dialog: false,
                editModalGamme: false,
                baseUrlAd: 'https://transfertprod-668c2.firebaseio.com/styleList/ad.json',
                createModalGamme: true,
                drawer: true,
                copyGamme: "",
                currentAd: '',
                adDialog: false,
                snackbar: false,
                deleteDialog: false,
                editsnackbar: false,
                deletesnackbar: false,
                BASE_URL_USER: "https://transfertprod-668c2.firebaseio.com/user.json",
                emptyForm: false,
                y: 'bottom',
                x: null,
                mode: '',
                timeout: 3000,
                emptyFormText: "Le champs de nom de la gamme est obligatoire.",
                successtext: "Enregistrement de la gamme effectué avec succés",
                edittextsuccess: "Vos modifications ont bien été prises en compte",
                deletesuccess: 'La gamme a été supprimée avec succès',
                gamme: {
                    name: ""
                },
                product : [],
                gammeToDelete: {},
                currentGamme: {},
                gammeList: [],
                mini: false,

            }
        },
        mounted() {
            this.getAllProduit();
            this.getAllGamme();
            this.getPublicityLink();

        },
        methods: {
            /**
             * Ajoute une gamme en base de donnée.
             */
            addGamme: function (event) {
                if (this.gamme.name === "") {
                    return this.emptyForm = true;
                }
                this.$http.post(this.baseUrlGamme, this.gamme).then((resp) => {
                    this.gamme.key = resp.body.name;
                    return this.$http.put(this.baseUrlEditGamme + resp.body.name + '.json', this.gamme).then((resp) => {
                        this.gamme.name = "";
                        this.dialog = false;
                        this.snackbar = true;
                        return this.getAllGamme();
                    });
                })
            },
            /**
             * Récupére l'ensemble des gammes en base de donnée.
             */
            getAllGamme: function (event) {
                return this.$http.get(this.baseUrlGamme).then((resp) => {
                    this.gammeList = resp.data;
                })
            },
            /**
             * Récupére l'ensemble des produits en base de donnée.
             */
            getAllProduit: function (event) {
                return this.$http.get(this.baseUrlProduit).then((resp) => {
                    Object.keys(resp.data).forEach((key) => {
                        this.product.push(resp.data[key]);
                    })
                })
            },
            /**
             * Supprime la gamme cliqué par l'utilisateur.
             */
            getCurrentGammeToDelete: function ($event, currentGamme) {
                this.gammeToDelete = currentGamme;
                this.deleteDialog = true;
            },

            /**
             * Supprime la gamme selectionné par l'utiilsateur
             * @returns {Promise.<TResult>}
             */
            deleteCurrentGamme() {
                "use strict";
                if (_.find(this.product, {'gamme': this.gammeToDelete.name}) !== undefined) {
                    return swal('', 'Il est impossible de supprimer une gamme utilisée par un produit', 'error');
                }
                return this.$http.delete(this.baseUrlEditGamme + this.gammeToDelete.key + '.json').then(resp => {
                    this.getAllGamme();
                    this.deletesnackbar = true;
                    return this.deleteDialog = false;
                });
            },

            /**
             * Edit de la gamme selectionné par l'utilisateur.
             */
            editGamme: function () {
                if (this.gamme.name === "") {
                    return this.emptyForm = true;
                }
                return this.$http.put(this.baseUrlEditGamme + this.gamme.key + ".json", this.gamme).then((resp) => {
                    this.editsnackbar = true;
                    this.createModalGamme = true;
                    this.dialog = false;
                    this.editModalGamme = false;
                    this.gamme.name = "";
                    return this.getAllGamme();
                });
            },
            /**
             * Récupere la gamme que l'utilisateur selectionne.
             */
            getCurrentGamme: function ($event, currentGamme) {

                this.editModalGamme = true;
                this.createModalGamme = false;
                this.dialog = true;
                $event.stopPropagation();
                this.gamme = currentGamme;
                this.copyGamme = this.gamme.name;
            },

            /**
             * Export client json to csv
             */
            exportClientToCsv() {
                this.usersToExport = [];
                this.$http.get(this.BASE_URL_USER).then(res => {
                    Object.keys(res.body).forEach(key => {
                        this.usersToExport.push({client: res.body[key].name + ' ' + res.body[key].firstname, email: res.body[key].email});
                    })
                    return downloadCSV()
                }, (err) => {
                    return swal('', 'Erreur interne', 'error')
                })
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
        data: this.usersToExport
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

