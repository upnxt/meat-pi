<template>
    <section class="control">
        <div class="reading">
            <header>
                <h4>Temperature</h4>
                <span
                    :class="['state', state]"
                    :title="state"
                ></span>
            </header>
            <h1>{{f}}<sup>&deg;F</sup></h1>
            <footer>{{c}}<sup>&deg;C</sup></footer>
        </div>
        <div class="chart">
            <chart
                label="F"
                step="1"
                evt="temperature:chart:update"
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
    props: ["socket"],
    data() {
        return {
            values: [],
            state: "disabled",
            f: -1,
            c: -1
        };
    },
    components: {
        chart
    },
    mounted() {
        this.$parent.$on("socket:registered", socket => {
            socket.emit("temperature:init");

            socket.on("temperature:poll", response => {
                this.f = response.f;
                this.c = response.c;
                this.state = parseState(response.state);
                this.values = manageHistory(this.values, response.history);

                bus.$emit("temperature:chart:update", this.values);
            });
        });
    }
};
</script>