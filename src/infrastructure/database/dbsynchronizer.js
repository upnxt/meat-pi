const memorydb = require("./memorydb");
const localstore = require("./localstore");

module.exports.replicateToMemory = async () => {
    try {
        await localstore.replicate.to(memorydb);
    } catch (ex) {
        console.log(ex);
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
    }, 1000 * 60 * 30);
};

async function replicateToDisk() {
    try {
        await memorydb.replicate.to(localstore);
        memorydb.changed = false;
        console.log("synced in-memory db to localstore");
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}
