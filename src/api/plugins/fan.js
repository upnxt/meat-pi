"use strict";

const moment = require("moment");

exports.plugin = {
    name: "fanPlugin",
    version: "1.0.0",
    register: async function(server, options) {
        const control = options.fanController;

        server.route({
            method: "GET",
            path: "/api/fan",
            handler: (request, h) => {
                const state = control.getState();
                const history = control.getHistory();

                const response = {
                    state: state,
                    history: history
                };

                if (response.history.length > 0) {
                    response.history = response.history.map((m) => {
                        return { value: m.value, timestamp: m.timestamp, on: moment(m.timestamp).format("MM/DD @ h:mm A") };
                    });
                }

                return response;
            }
        });

        //update settings via querystring for now. implement ui/post later
        server.route({
            method: "GET",
            path: "/api/fan/settings",
            handler: (request, h) => {
                const result = control.update(request.query);
                return result;
            }
        });
    }
};
