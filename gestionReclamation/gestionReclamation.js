new Vue({
        el: "#app",
        data() {
            return {
                drawer: true,
                BASE_URL_DEMANDS: 'https://transfertprod-668c2.firebaseio.com/demands.json',
                BASE_URL_MAIL: 'http://localhost:3000/mail',
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
             * delete
             */
            deleteDemands() {


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
