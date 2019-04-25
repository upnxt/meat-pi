const db = require("../infrastructure/database/memorydb");
const dbsync = require("../infrastructure/database/dbsynchronizer");
const migrations = require("../infrastructure/database/migrations/001-initial-seed");
const bus = require("../infrastructure/events/bus");
const ConsoleLogger = require("../infrastructure/logging/console");

//managers
const SwitchStateManager = require("./managers/state/switchStateManager");

//controls
const FanController = require("./controls/fanController");
const HumiditySensor = require("./controls/humiditySensor");
const TemperatureSensor = require("./controls/temperatureSensor");

//switches
const FanSwitch = require("./switches/fanSwitch");
const HumiditySwitch = require("./switches/humiditySwitch");
const TemperatureSwitch = require("./switches/temperatureSwitch");

module.exports.init = async (server) => {
    //database seeding/syncing
    await migrations.migration_001_initial_seed();

    //replicate the localstore db to the in-memory db. using in-memory as working store to minimize sdcard writes
    await dbsync.replicateToMemory();
    dbsync.replicateToDisk();

    //wire up poor-man's DI
    const logger = new ConsoleLogger();
    const fanStateManger = new SwitchStateManager(db, "fan");
    const fanController = new FanController(bus, db, logger, "fan", fanStateManger);
    const fanSwitch = new FanSwitch(bus, logger, fanStateManger);

    const humidityStateManager = new SwitchStateManager(db, "humidity");
    const humiditySensor = new HumiditySensor(bus, db, logger, "humidity", humidityStateManager);
    const humiditySwitch = new HumiditySwitch(bus, db, logger, "humidity", humidityStateManager);

    const temperatureStateManager = new SwitchStateManager(db, "temperature");
    const temperatureSensor = new TemperatureSensor(bus, db, logger, "temperature", temperatureStateManager);
    const temperatureSwitch = new TemperatureSwitch(bus, db, logger, "temperature", temperatureStateManager);

    //start listeners
    await fanSwitch.listen();
    await humiditySwitch.listen();
    await temperatureSwitch.listen();

    //start sensor polling and eventing
    await fanController.poll();
    await humiditySensor.poll();
    await temperatureSensor.poll();

    //api routes
    await server.register({
        plugin: require("./plugins/fan"),
        options: {
            fanController: fanController
        }
    });

    await server.register({
        plugin: require("./plugins/humidity"),
        options: {
            humiditySensor: humiditySensor
        }
    });

    await server.register({
        plugin: require("./plugins/temperature"),
        options: {
            temperatureSensor: temperatureSensor
        }
    });
};