const logger = require("../../infrastructure/logging/logger");
const memorydb = require("./memorydb");
const localstore = require("./localstore");

module.exports.replicateToMemory = async () => {
    try {
        const docs = await localstore.getAll();
        memorydb.replicateFrom(docs);
        
        logger.log("synced localstore to in-memory db");
    } catch (ex) {
        logger.log(ex);
        throw ex;
    }
};

module.exports.replicateToDisk = (force) => {
    if (force) {
        replicateToDisk();
    }

    setInterval(async () => {
        if (!memorydb.changed) {
            return;
        }

        await replicateToDisk();
    }, 1000 * 60 * 10);
};

async function replicateToDisk() {
    try {
        localstore.update(memorydb.data);

        memorydb.changed = false;
        logger.log("synced in-memory db to localstore");
    } catch (ex) {
        logger.log(ex);
    }
}
