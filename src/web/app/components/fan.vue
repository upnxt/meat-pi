<template>
    <section class="control">
        <div class="reading">
            <header>
                <h4>Fan</h4>
                <span
                    :class="['state', state]"
                    :title="state"
                ></span>
            </header>
            <h1>{{state}}</h1>
        </div>
        <div class="chart">
            <ul v-for="entry in history">
                <li><strong>{{entry.on}}</strong> ran for {{entry.duration}} minute{{(duration != 1 ? "s" : "")}} </li>
            </ul>
        </div>
    </section>
</template>

<script>
import bus from "../bus";
import parseState from "../utils/stateParser";
import manageHistory from "../utils/historyManager";

export default {
    data() {
        return {
            values: [],
            history: [],
            state: "disabled"
        };
    },
    mounted() {
        this.$parent.$on("socket:registered", socket => {
            socket.on("fan:poll", response => {
                this.h = response.h;
                this.state = parseState(response.state);
                this.values = manageHistory(this.values, response.history);

                for (let i = 0; i < this.values.length; i++) {
                    if (
                        this.values[i].value == 1 &&
                        this.values[i + 1] &&
                        this.values[i + 1].value == 0
                    ) {
                        var exists = this.history.filter(
                            m => m.on == this.values[i].on
                        );
                        if (exists.length > 0) {
                            continue;
                        }

                        this.history.push({
                            on: this.values[i].on,
                            duration: Math.floor(
                                (new Date(this.values[i + 1].timestamp) -
                                    new Date(this.values[i].timestamp)) /
                                    1000 /
                                    60
                            )
                        });
                    }
                }
            });
        });
    }
};
</script>