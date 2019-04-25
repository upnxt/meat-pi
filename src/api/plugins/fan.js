"use strict";

exports.plugin = {
    name: "fanPlugin",
    version: "1.0.0",
    register: async function(server, options) {
        const control = options.fanController;

        //status
        server.route({
            method: "GET",
            path: "/api/fan",
            handler: async (request, h) => {
                const state = await control.getState();

                const response = {
                    state: state
                };

                return response;
            }
        });
    }
};
