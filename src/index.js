"use strict";

const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });

const logger = require("./infrastructure/logging/logger");
const db = require("./infrastructure/database/memorydb");
const dbsync = require("./infrastructure/database/dbsynchronizer");

const hapi = require("hapi");
const api = require("./api/api");
const web = require("./web/web");

const init = async () => {
    const server = hapi.server({
        port: process.env.PORT,
        host: process.env.HOST
    });

    await api.init(server);
    await web.init(server);

    await server.start();

    logger.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", async (err) => {
    logger.log(err);

    await dbsync.replicateToDisk(true);
    process.exit(1);
});

init();
