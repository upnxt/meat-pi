const logger = require("../../logging/logger");
const localstore = require("../localstore");

async function controlsUp() {
    var data = await localstore.getAll();
    if (data) {
        return;
    }

    let docs = [];

    //temp control seed
    //targetTemp: 18,
    //recoveryMaxTemp: 24,
    docs.push({
        _id: "temperature",
        gpio: 7,
        deviceId: "28-0316859573ff",
        targetTemp: 4.4,
        recoveryTemp: 7,
        initialCoolingTimeout: 60,
        residualCoolingMultiplier: 6,
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
