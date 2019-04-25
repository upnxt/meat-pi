class FanController {
    constructor(bus, db, logger, type, stateManager) {
        this.bus = bus;
        this.db = db;
        this.logger = logger;
        this.type = type;
        this.stateManager = stateManager;
    }

    async getState() {
        var state = await this.stateManager.state();
        return state;
    }

    async poll() {
        const control = await this.db.get("fan");

        setInterval(async () => {
            this.bus.emit("fan:start");

            setTimeout(() => {
                this.bus.emit("fan:stop");
            }, 1000 * runFor);
        }, 1000 * control.runInterval);
    }
}

module.exports = FanController;
