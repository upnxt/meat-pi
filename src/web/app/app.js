const Vue = require("vue");

Vue.use(require("vue-resource"));
Vue.component("humidity", require("./components/humidity.vue"));
Vue.component("temperature", require("./components/temperature.vue"));

const app = new Vue({
    el: "#app"
});
