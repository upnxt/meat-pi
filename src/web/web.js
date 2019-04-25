const path = require("path");

module.exports.init = async (server) => {
    await server.register(require("inert"));

    server.route({
        method: "GET",
        path: "/{param*}",
        handler: {
            directory: {
                path: path.join(__dirname, "../../public")
            }
        }
    });
};
