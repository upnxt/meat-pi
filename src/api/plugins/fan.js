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
            handler: async (request, h) => {
                const state = await control.getState();
                const history = await control.getHistory();

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
            handler: async (request, h) => {
                const result = await control.update(request.query);
                return result;
            }
        });
    }
};
