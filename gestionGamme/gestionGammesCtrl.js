let vm = new Vue({
        el: "#app",
        data() {
            return {
                baseUrlGamme: "https://transfertprod-668c2.firebaseio.com/gammeList.json",
                baseUrlEditGamme: "https://transfertprod-668c2.firebaseio.com/gammeList/",
                baseUrlProduit: "https://transfertprod-668c2.firebaseio.com/produitList.json",
                dialog: false,
                editModalGamme: false,
                createModalGamme: true,
                drawer: true,
                copyGamme: "",
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
             * Récupére l'ensemble des produits en base de donnée.
             */
            getAllProduit: function (event) {
                return this.$http.get(vm.baseUrlProduit).then((resp) => {
                    Object.keys(resp.data).forEach((key) => {
                        this.product.push(resp.data[key]);
                    })
                    console.log(this.product);
                })
            },
            /**
             * Supprime la gamme cliqué par l'utilisateur.
             */
            getCurrentGammeToDelete: function ($event, currentGamme) {
                vm.gammeToDelete = currentGamme;
                vm.deleteDialog = true;
            },

            /**
             * Supprime la gamme selectionné par l'utiilsateur
             * @returns {Promise.<TResult>}
             */
            deleteCurrentGamme() {
                "use strict";
                if (_.find(this.product, {'gamme': vm.gammeToDelete.name}) !== undefined) {
                    return swal('', 'Il est impossible de supprimer une gamme utilisée par un produit', 'error');
                }
                return this.$http.delete(vm.baseUrlEditGamme + vm.gammeToDelete.key + '.json').then(resp => {
                    this.getAllGamme();
                    vm.deletesnackbar = true;
                    return vm.deleteDialog = false;
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
            },

            /**
             * Export client json to csv
             */
            exportClientToCsv() {
                let users = [];
                this.$http.get(this.BASE_URL_USER).then(res => {
                    Object.keys(res.body).forEach(key => {
                        users.push({client: res.body[key].email});
                    })
                    return this.JSONToCSVConvertor(users, 'Export client', 'client')
                }, (err) => {
                    return swal('', 'Erreur interne', 'error')
                })
            },

            /**
             * Converts users JSON to CSV
             * @param JSONData
             * @param ReportTitle
             * @param ShowLabel
             * @constructor
             */
            JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
                let arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                let CSV = '';
                if (ShowLabel) {
                    let row = "";
                    for (let index in arrData[0]) {
                        row += index + ',';
                    }
                    row = row.slice(0, -1);
                    CSV += row + '\r\n';
                }

                for (let i = 0; i < arrData.length; i++) {
                    let row = "";
                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (let index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }
                    row.slice(0, row.length - 1);
                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                if (CSV == '') {
                    alert("Invalid data");
                    return;
                }

                let link = document.createElement("a");
                link.id = "lnkDwnldLnk";

                document.body.appendChild(link);

                let csv = CSV;
                blob = new Blob([csv], {type: 'text/csv'});
                let csvUrl = window.URL.createObjectURL(blob);
                let filename = 'UserExport.csv';
                $("#lnkDwnldLnk")
                    .attr({
                        'download': filename,
                        'href': csvUrl
                    });

                $('#lnkDwnldLnk')[0].click();
                document.body.removeChild(link);
            }
        }
    }
);

vm.getAllGamme();
vm.getAllProduit();