let vm = new Vue({
        el: "#app",
        data() {
            return {
                drawer: true,
                BASE_URL_DEMANDS: 'https://transfertprod-668c2.firebaseio.com/demands.json',
                BASE_URL_MAIL: 'http://imprimshirtcli.herokuapp.com/mail',
                BASE_URL_USER: 'https://transfertprod-668c2.firebaseio.com/user.json',
                headers: [
                    {text: 'Client', value: 'client'},
                    {text: 'Type', value: 'type'},
                    {text: 'Date', value: 'date'},
                    {text: 'Détails', value: 'details'}
                ],
                search: '',
                mini: false,
                currentDemands: {},
                items: [],
                mail: {
                    message: '',
                    demands: {}
                },
                dialog: false
            }
        },
        mounted() {
            this.getAllDemands()
        },
        methods: {
            async getAllDemands() {
                moment.locale('fr');
                let response = await fetch(this.BASE_URL_DEMANDS);
                let data = await response.json();
                Object.keys(data).forEach(key => {
                    this.items.push(data[key])
                });

                this.items.forEach(item => {
                    item.formatted_date = moment(item.date).format('DD-MMM-YYYY');
                })

                console.log(this.items)
            },

            /**
             * Get selected demands
             */
            getCurrentDemands(item) {
                this.currentDemands = item;
            },

            /**
             * Send a mail response to the customer
             */
            sendMailResponse() {
                this.mail.demands = this.currentDemands;
                this.mail.type = "demands";
                console.log(this.mail)
                if (this.mail.message === '') {
                    return swal('', 'Le champs message est obligatoire', 'error')
                }
                this.$http.post(this.BASE_URL_MAIL, this.mail).then(res => {
                    this.dialog = false;
                    this.mail = {
                        message: '',
                        demands: {}
                    };
                    swal('', 'Email de réponse envoyé au client', 'success')
                }, (err) => {
                    swal('', 'Une erreur interne est survenue', 'error')

                })
            },

            /**
             * Export client json to csv
             */
            exportClientToCsv() {
                vm.usersToExport = [];
                this.$http.get(this.BASE_URL_USER).then(res => {
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
