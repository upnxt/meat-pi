<template>
    <section class="control">
        <div class="reading">
            <header>
                <h4>Humidity</h4>
                <span
                    :class="['state', state]"
                    :title="state"
                ></span>
            </header>
            <h1>{{h}}<sup>%</sup></h1>
        </div>
        <div class="chart">
            <chart
                label="%"
                step="5"
                evt="humidity:chart:update"
            />
        </div>
    </section>
</template>

<script>
import chart from "./chart.vue";
import bus from "../bus";
import parseState from "../utils/stateParser";
import manageHistory from "../utils/historyManager";

export default {
    data() {
        return {
            values: [],
            state: "disabled",
            h: -1
        };
    },
    components: {
        chart
    },
    mounted() {
        this.$parent.$on("socket:registered", socket => {
            socket.emit("humidity:init");

            socket.on("humidity:poll", response => {
                this.h = response.h;
                this.state = parseState(response.state);
                this.values = manageHistory(this.values, response.history);

                bus.$emit("humidity:chart:update", this.values);
            });
        });
    }
};
</script>