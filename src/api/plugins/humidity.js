"use strict";

exports.plugin = {
    name: "humidityPlugin",
    version: "1.0.0",
    register: async function(server, options) {
        const control = options.humiditySensor;

        options.sockets.on("connection", function(socket) {
            socket.on("humidity:init", () => {
                const response = getHumidity();
                socket.emit("humidity:poll", response);
            });

            options.bus.on("humidity:change", () => {
                const response = getHumidity();
                socket.emit("humidity:poll", response);
            });
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

        function getHumidity() {
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

        function formatHumidity(humidity) {
            if (!humidity) {
                return 0;
            }

            return parseFloat(humidity).toFixed(1);
        }
    }
};
