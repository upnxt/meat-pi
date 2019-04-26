"use strict";

const moment = require("moment");

exports.plugin = {
    name: "humidityPlugin",
    version: "1.0.0",
    register: async function(server, options) {
        const control = options.humiditySensor;

        server.route({
            method: "GET",
            path: "/api/humidity",
            handler: async (request, h) => {
                const humidity = await control.getHumidity();
                const history = await control.getHistory();

                const response = {
                    h: formatHumidity(humidity),
                    state: 1,
                    history: history
                };

                if (response.history.length > 0) {
                    response.history = response.history.map((m) => { return { value: formatHumidity(m.value), timestamp: moment(m.timestamp).format('h:mm:ss A') }});
                }

                return response;
            }
        });

        function formatHumidity(humidity) {
            if (!humidity)
                return 0;

            return humidity.toFixed(1);
        }
    }
};
