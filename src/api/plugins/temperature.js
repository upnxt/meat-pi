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
            handler: async (request, h) => {
                const state = await control.getState();
                const temp = await control.getTemp();
                const history = await control.getHistory();

                const response = {
                    f: toFahrenheit(temp),
                    c: toCelsius(temp),
                    state: state,
                    history: history
                };

                if (response.history.length > 0) {
                    response.history = response.history.map((m) => { return { value: toFahrenheit(m.value), timestamp: moment(m.timestamp).format('h:mm:ss A') }});
                }

                return response;
            }
        });

        // server.route({
        //     method: "PUT",
        //     path: "/api/temperature",
        //     handler: async (request, h) => {
        //         await tempService.update({
        //             manual_switch: 0,
        //             state: 1,
        //             gpio: 11,
        //             deviceId: "28-0316859573ff",
        //             targetTemp: 18,
        //             recoveryMaxTemp: 24,
        //             initialCoolingTimeout: 60,
        //             residualCoolingMultiplier: 6
        //         });

        //         return true;
        //     }
        // });

        function toFahrenheit(temp) {
            return ((temp * 9) / 5 + 32).toFixed(1);
        }

        function toCelsius(temp) {
            return temp.toFixed(1);
        }
    }
};
