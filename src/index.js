"use strict";

//infrastructure
const Hapi = require("hapi");
const db = require("./infrastructure/database/memorydb");
const localstore = require("./infrastructure/database/localstore");
const dbsync = require("./infrastructure/database/dbsynchronizer");
const migrations = require("./infrastructure/database/migrations/001-initial-seed");
const bus = require("./infrastructure/events/bus");
const ConsoleLogger = require("./infrastructure/logging/console");

//managers
const SwitchStateManager = require("./api/managers/state/switchStateManager");

//controlls
const FanController = require("./api/controls/fanController");
const HumidityController = require("./api/controls/humidityController");
const TemperatureController = require("./api/controls/temperatureController");

//switches
const FanSwitch = require("./api/switches/fanSwitch");
const HumiditySwitch = require("./api/switches/humiditySwitch");
const TemperatureSwitch = require("./api/switches/temperatureSwitch");

const init = async () => {
    //database seeding/syncing
    await migrations.migration_001_initial_seed();
    await dbsync.replicateToMemory();

    //wire up poor-man's DI
    const logger = new ConsoleLogger();
    const fanStateManger = new SwitchStateManager(db, "fan");
    const fanController = new FanController(bus, db, logger, "fan", fanStateManger);
    const fanSwitch = new FanSwitch(bus, logger, fanStateManger);

    const humidityStateManager = new SwitchStateManager(db, "humidity");
    const humidityController = new HumidityController(bus, db, logger, "humidity", humidityStateManager);
    const humiditySwitch = new HumiditySwitch(bus, db, logger, "humidity", humidityStateManager);

    const temperatureStateManager = new SwitchStateManager(db, "temperature");
    const temperatureController = new TemperatureController(bus, db, logger, "temperature", temperatureStateManager);
    const temperatureSwitch = new TemperatureSwitch(bus, db, logger, "temperature", temperatureStateManager);

    //start listeners
    humiditySwitch.listen();
    temperatureSwitch.listen();

    //start sensor polling and eventing
    await humidityController.poll();
    await temperatureController.poll();

    const server = Hapi.server({
        port: 3000,
        host: "192.168.0.18"
    });

    server.route({
        method: "GET",
        path: "/",
        handler: (request, h) => {
            return "Hello World!";
        }
    });

    await server.register({
        plugin: require("./api/plugins/fan"),
        options: {
            fanController: fanController
        }
    });

    await server.register({
        plugin: require("./api/plugins/humidity"),
        options: {
            humidityController: humidityController
        }
    });

    await server.register({
        plugin: require("./api/plugins/temperature"),
        options: {
            temperatureController: temperatureController
        }
    });

    await server.start();

    console.log("Server running on %ss", server.info.uri);
};

process.on("unhandledRejection", err => {
    console.log(err);
    db.destroy();
    localstore.close();
    process.exit(1);
});

init();
