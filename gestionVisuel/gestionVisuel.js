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
                visualAreLoad: false,
                y: 'bottom',
                x: null,
                mode: '',
                baseUrlImg: "https://transfertprod-668c2.firebaseio.com/imglist.json",
                img: {
                    base64: '',
                    name: '',
                    id: ''
                },
                state: {
                    visualToDelete: "",
                    currentProductName: []
                },
                visualsList: [],
                timeout: 3000,
                emptyFormText: "Le champs de la couleur est obligatoire.",
                successtext: "Enregistrement de la couleur effectué avec succés",
                edittextsuccess: "Enregistrement de vos modifications effectué avec succés",
                deletesuccess: 'La couleur à été supprimée avec succés'
            }
        },
        created() {
            "use strict";
            this.getAllVisual();
        },
        mounted() {
            "use strict";
            this.visualAreLoad = true;
        },
        methods: {
            /**
             * Retourne l'ensemble des visuels présent en base de donnée.
             * @returns {Promise.<TResult>}
             */
            getAllVisual() {
                "use strict";
                return this.$http.get(this.baseUrlImg).then((resp) => {
                    let visuals = [];
                    for (let key in resp.data) {
                        visuals.push({
                            visual: resp.data[key].base64,
                            id: resp.data[key].id
                        });
                    }
                    this.visualsList = visuals;

                })
            },

            /**
             * Ajouter une nouvelle image en base de donnée
             */
            addNewImg() {
                "use strict";
                if (this.img.base64 === "") {
                    return swal("", "Le champs image est obligatoire", "error");
                }
                this.img.id = this.guid();
                this.$http.post(this.baseUrlImg, this.img).then(resp => {
                    this.img.name = "";
                    this.img.base64 = "";
                    swal("", "Image enregistrée avec succés en base de donnée.", "success");
                    this.getAllVisual();
                    return this.dialog = false;
                });

            },

            /**
             * Supprime l'image selectionné par l'utilisateur
             * @param currentVisual
             */
            deleteCurrentVisual(currentVisual) {
                this.state.visualToDelete = currentVisual;
                let url = encodeURI(vm.baseUrlImg + "?orderBy=" + '"id"' + "&equalTo=" + JSON.stringify(this.state.visualToDelete.id));
                this.$http.get(url).then(resp => {
                    let keyToDelete = Object.keys(resp.data).toString();
                    this.$http.delete("https://transfertprod-668c2.firebaseio.com/imglist/" + keyToDelete + ".json").then(resp => {
                        "use strict";
                        this.getAllVisual();
                        return swal(
                            '',
                            'Le visuel à été supprimé avec succés !',
                            'success'
                        )
                    })

                });
            },

            /**
             * Retourne un ID aléatoire pour chaque visuel ajouté
             * @returns {string}
             */
            guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }

                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }


        }
    }
);


