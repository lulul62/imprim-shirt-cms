let vm = new Vue({
        el: "#app",
        data() {
            return {
                dialog: false,
                state: {},
                constant: {
                    BASE_URL_ORDERS: "https://transfertprod-668c2.firebaseio.com/user.json",
                    BASE_URL_USER: "https://transfertprod-668c2.firebaseio.com/user/",
                },
                drawer: true,
                currentAd: '',
                adDialog: false,
                baseUrlAd: 'https://transfertprod-668c2.firebaseio.com/styleList/ad.json',
                orders: [],
                max25chars: (v) => v.length <= 25 || 'Input too long!',
                tmp: '',
                search: '',
                pagination: {},
                headers: [
                    {
                        text: 'Référence',
                        align: 'left',
                        sortable: true,
                        value: 'Référence'
                    },
                    {text: 'Client', value: 'Client', sortable: true},
                    {text: 'Date', value: 'Date', sortable: true},
                    {text: 'Status', value: 'Status', sortable: true},
                    {text: 'Action', value: 'Action', sortable: true}
                ],
                items: [],
                currentOrder: {}
            }
        },

        mounted() {
            "use strict";
            this.getAllOrders();
            this.getPublicityLink();

        },
        methods: {
            /**
             * Retourne l'ensemble des commandes de tout les utilisateurs.
             * @returns {Promise.<TResult>}
             */
            getAllOrders() {
                "use strict";
                moment.locale('fr');
                return this.$http.get(this.constant.BASE_URL_ORDERS).then(resp => {
                    let orders = [];
                    for (let key in resp.data) {
                        for (var orderKey in resp.data[key].orders) {
                            orders.push(resp.data[key].orders[orderKey]);
                        }
                    }

                    orders.forEach(order => {
                        if (order.date === undefined) {
                            order.date = moment(order.order_date).format('DD-MMM-YYYY');
                        }
                    });

                    return this.items = [...orders];
                })
            },
            /**
             * Retourne la commande selectionné par l'utilisateur.
             * @param order
             * @returns {boolean}
             */
            getCurrentOrder(order) {
                "use strict";
                this.currentOrder = order;
                this.dialog = true;
                console.log(this.currentOrder);
            },

            /**
             * Mise à jour de l'état d'une commande dans le cas d'un changement d'état.
             * @returns {Promise.<TResult>}
             */
            updateOrderState() {
                delete this.currentOrder.date;
                fetch(this.constant.BASE_URL_USER + this.currentOrder.customerInformation.userkey + '/orders/' + this.currentOrder.key + '.json', {
                    method: 'PUT',
                    body: JSON.stringify(this.currentOrder),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(res => {
                    swal('', 'Les informations de la commande ' + this.currentOrder.reference + ' ont été mises à jour avec succès.', 'success');
                    this.dialog = false;
                    this.getAllOrders();
                }, (err) => {
                    swal('', 'Erreur lors de la mise à jour de la commande', 'error');
                    return this.dialog = false;
                })
            },

            /**
             * Export client json to csv
             */
            exportClientToCsv() {
                vm.usersToExport = [];
                this.$http.get(this.constant.BASE_URL_ORDERS).then(res => {
                    Object.keys(res.body).forEach(key => {
                        vm.usersToExport.push({
                            client: res.body[key].name + ' ' + res.body[key].firstname,
                            email: res.body[key].email
                        });
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
