const memorydb = require("./memorydb");
const localstore = require("./localstore");

module.exports.replicateToMemory = async () => {
    try {
        await localstore.replicate.to(memorydb);
        console.log("synced localstore to in-memory db");
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
        if (!memorydb.changes) {
            return;
        }

        await replicateToDisk();
    }, 1000 * 60);
};

async function replicateToDisk() {
    try {
        await memorydb.replicate.to(localstore);
        console.log("synced in-memory db to localstore");
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}
