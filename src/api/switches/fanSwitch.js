class FanSwitch {
    constructor(bus, logger, stateManager) {
        this.bus = bus;
        this.logger = logger;
        this.stateManager = stateManager;
    }

    async listen() {
        this.bus.on("fan:start", (value) => {
            this.stateManager.setOn();
            this.logger.log("[switch] fan started");
        });

        this.bus.on("fan:stop", (value) => {
            this.stateManager.setOff();
            this.logger.log("[switch] fan stopped");
        });
    }
}

module.exports = FanSwitch;
