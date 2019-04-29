"use strict";

const moment = require("moment");

exports.plugin = {
    name: "temperaturePlugin",
    version: "1.0.0",
    register: async function(server, options) {
        const control = options.temperatureSensor;

        server.route({
            method: "GET",
            path: "/api/temperature",
            handler: (request, h) => {
                const state = control.getState();
                const temp = control.getTemp();
                const history = control.getHistory();

                const response = {
                    f: toFahrenheit(temp),
                    c: toCelsius(temp),
                    state: state,
                    history: history
                };

                if (response.history.length > 0) {
                    response.history = response.history.map((m) => {
                        return { value: toFahrenheit(m.value), timestamp: m.timestamp };
                    });
                }

                return response;
            }
        });

        //update settings via querystring for now. implement ui/post later
        server.route({
            method: "GET",
            path: "/api/temperature/settings",
            handler: (request, h) => {
                const result = control.update(request.query);
                return result;
            }
        });

        function toFahrenheit(temp) {
            return ((temp * 9) / 5 + 32).toFixed(1);
        }

        function toCelsius(temp) {
            return temp.toFixed(1);
        }
    }
};
