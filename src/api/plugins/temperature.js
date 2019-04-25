"use strict";

exports.plugin = {
    name: "temperaturePlugin",
    version: "1.0.0",
    register: async function(server, options) {
        const control = options.temperatureController;

        //status
        server.route({
            method: "GET",
            path: "/api/temperature",
            handler: async (request, h) => {
                const state = await control.getState();
                const temp = await control.getTemp();

                const response = {
                    f: formattedFahrenheit(temp),
                    c: formattedCelsius(temp),
                    state: state
                };

                return response;
            }
        });

        //update
        server.route({
            method: "PUT",
            path: "/api/temperature",
            handler: async (request, h) => {
                await tempService.update({
                    manual_switch: 0,
                    state: 1,
                    gpio: 11,
                    deviceId: "28-0316859573ff",
                    targetTemp: 18,
                    recoveryMaxTemp: 24,
                    initialCoolingTimeout: 60,
                    residualCoolingMultiplier: 6
                });

                return true;
            }
        });

        function formattedFahrenheit(temp) {
            return ((temp * 9) / 5 + 32).toFixed(2) + "F";
        }

        function formattedCelsius(temp) {
            return temp.toFixed(2) + "C";
        }
    }
};
