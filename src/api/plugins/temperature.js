"use strict";

exports.plugin = {
    name: "temperaturePlugin",
    version: "1.0.0",
    register: async function(server, options) {
        const control = options.temperatureSensor;

        options.sockets.on("connection", function(socket) {
            socket.on("temperature:init", () => {
                const response = getTemperature();
                socket.emit("temperature:poll", response);
            });

            options.bus.on("temperature:change", () => {
                const response = getTemperature();
                socket.emit("temperature:poll", response);
            });
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

        function getTemperature() {
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

        function toFahrenheit(temp) {
            return ((temp * 9) / 5 + 32).toFixed(1);
        }

        function toCelsius(temp) {
            return temp.toFixed(1);
        }
    }
};
