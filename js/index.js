let vm = new Vue({
    el: "#app",
    data() {
        return {
            user: {
                username: "",
                password: ""
            },
        }
    },
    methods: {
        /**
         * getAdminInfo
         */
        compare: function (event) {
            if (vm.user.username !== "Admin" && vm.user.password !== "Admin") {
                return window.alert("Les identifiants sont incorrects");
            }
            window.location = "https://imprimshirtadmin.herokuapp.com/gestionProduit/gestionProduit.html"; 
        }
    }
}
);
