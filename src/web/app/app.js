const Vue = require("vue");
const bus = require("./bus");

Vue.use(require("vue-resource"));
Vue.component("fan", require("./components/fan.vue"));
Vue.component("humidity", require("./components/humidity.vue"));
Vue.component("temperature", require("./components/temperature.vue"));

const app = new Vue({
    el: "#app",
    mounted() {
        const socket = io();
        this.$emit("socket:registered", socket);
    }
});
