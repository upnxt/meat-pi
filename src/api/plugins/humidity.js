"use strict";

exports.plugin = {
  name: "humidityPlugin",
  version: "1.0.0",
  register: async function(server, options) {
    const control = options.humiditySensor;

    //status
    server.route({
      method: "GET",
      path: "/api/humidity",
      handler: async (request, h) => {
        const humidity = await control.getHumidity();

        const response = {
          h: formatHumidity(humidity),
          state: 1
        };

        return response;
      }
    });

    function formatHumidity(humidity) {
      return humidity.toFixed(2) + "%";
    }
  }
};
