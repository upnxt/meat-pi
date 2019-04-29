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
            handler: (request, h) => {
                const state = control.getState();
                const humidity = control.getHumidity();
                const history = control.getHistory();

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
            handler: (request, h) => {
                const result = control.update(request.query);
                return result;
            }
        });

        function formatHumidity(humidity) {
            if (!humidity) {
                return 0;
            }

            return humidity.toFixed(1);
        }
    }
};
