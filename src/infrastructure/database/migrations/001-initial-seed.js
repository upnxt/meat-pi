const logger = require("../../logging/logger");
const localstore = require("../localstore");

async function controlsUp() {
    var data = await localstore.getAll();
    if (data) {
        logger.log("migration 001 already ran. returning early.");
        return;
    }

    logger.log("running migration 001...");

    let docs = [];

    //temp control seed

    /*
        for curing: 
            targetTemp: 18,
            recoveryMaxTemp: 24,
            initialCoolingTimeout: 60,
            residualCoolingMultiplier: 6,

        for kegerator
            targetTemp: 3.4,
            recoveryMaxTemp: 7,
            initialCoolingTimeout: 90,
            residualCoolingMultiplier: 6,
    */

    docs.push({
        _id: "temperature",
        gpio: 7,
        deviceId: "28-0316859573ff",
        targetTemp: 3.4,
        recoveryTemp: 7,
        initialCoolingTimeout: 90,
        residualCoolingMultiplier: 6,
        historyInterval: 2,
        historyLimit: 40,
        history: [],
        switch: {
            enabled: 1,
            gpio: 13,
            state: 0
        }
    });

    //humidity control seed
    docs.push({
        _id: "humidity",
        gpio: 2,
        targetHumidity: 74,
        historyInterval: 2,
        historyLimit: 40,
        history: [],
        switch: {
            enabled: 1,
            gpio: 5,
            state: 0
        }
    });

    //fan control seed
    docs.push({
        _id: "fan",
        runFor: 120,
        runInterval: 21600,
        historyLimit: 30,
        history: [],
        switch: {
            enabled: 1,
            gpio: 0,
            state: 0
        }
    });

    localstore.update(docs);
}

module.exports.migration_001_initial_seed = async () => {
    await controlsUp();
};
