const localstore = require("../localstore");

async function controlsUp() {
    //temp control seed
    try {
        await localstore.get("temperature");
    } catch (ex) {
        await localstore.put({
            _id: "temperature",
            gpio: 7,
            deviceId: "28-0316859573ff",
            targetTemp: 18,
            recoveryMaxTemp: 24,
            initialCoolingTimeout: 60,
            residualCoolingMultiplier: 6,
            switch: {
                enabled: 1,
                gpio: 13,
                state: 0
            }
        });
    }

    //humidity control seed
    try {
        await localstore.get("humidity");
    } catch (ex) {
        await localstore.put({
            _id: "humidity",
            gpio: 2,
            targetHumidity: 74,
            switch: {
                enabled: 1,
                gpio: 3,
                state: 0
            }
        });
    }

    //fan control seed
    try {
        await localstore.get("fan");
    } catch (ex) {
        await localstore.put({
            _id: "fan",
            runFor: 120,
            runInterval: 21600,
            switch: {
                enabled: 1,
                gpio: 0,
                state: 0
            }
        });
    }
}

module.exports.migration_001_initial_seed = async () => {
    await controlsUp();
};
