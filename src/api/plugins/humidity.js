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
                const state = await control.getState();
                const humidity = await control.getHumidity();
                const history = await control.getHistory();

                const response = {
                    h: formatHumidity(humidity),
                    state: state,
                    history: history
                };

                if (response.history.length > 0) {
                    response.history = response.history.map((m) => {
                        return { value: formatHumidity(m.value), timestamp: m.timestamp };
                    });
                }

                return response;
            }
        });

        //update settings via querystring for now. implement ui/post later
        server.route({
            method: "GET",
            path: "/api/humidity/settings",
            handler: async (request, h) => {
                const result = await control.update(request.query);
                return result;
            }
        });

        function formatHumidity(humidity) {
            if (!humidity) return 0;

            return humidity.toFixed(1);
        }
    }
};
