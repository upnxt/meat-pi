const memorydb = require("./memorydb");
const localStore = require("./localstore");

module.exports.replicateToMemory = async () => {
    try {
        await localStore.replicate.to(memorydb);
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
};

module.exports.replicateToDisk = async () => {
    try {
        await localStore.replicate.to(memorydb);
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
};
