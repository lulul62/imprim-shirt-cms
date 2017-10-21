let vm = new Vue({
        el: "#app",
        data() {
            return {
                dialog: false,
                state: {},
                constant: {
                    BASE_URL_ORDERS: "https://transfertprod-668c2.firebaseio.com/user.json",
                    BASE_URL_USER: "https://transfertprod-668c2.firebaseio.com/user/"
                },
                drawer: true,
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
            }
        }
    }
);

