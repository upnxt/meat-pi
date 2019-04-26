"use strict";

const db = require("./infrastructure/database/memorydb");
const localstore = require("./infrastructure/database/localstore");
const dbsync = require("./infrastructure/database/dbsynchronizer");

const hapi = require("hapi");
const api = require("./api/api");
const web = require("./web/web");

const init = async () => {
    const server = hapi.server({
        port: 3000,
        host: "192.168.0.18"
    });

    await api.init(server);
    await web.init(server);

    await server.start();

    console.log("Server running on %ss", server.info.uri);
};

process.on("unhandledRejection", async (err) => {
    console.log(err);

    await dbsync.replicateToDisk(true);
    db.destroy();
    localstore.close();

    process.exit(1);
});

init();
