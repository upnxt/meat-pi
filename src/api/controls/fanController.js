class FanController {
    constructor(bus, db, logger, type, stateManager) {
        this.bus = bus;
        this.db = db;
        this.logger = logger;
        this.type = type;
        this.stateManager = stateManager;
    }

    async getState() {
        const state = await this.stateManager.state();
        return state;
    }

    async getHistory() {
        try {
            const control = await this.db.get(this.type);
            return control.history;
        } catch (ex) {
            this.logger.log(ex);
            return [];
        }
    }

    async update(obj) {
        try {
            const control = await this.db.get(this.type);

            if ("enabled" in obj) {
                control.switch.enabled = obj.enabled;
            }

            if ("runfor" in obj) {
                control.runFor = obj.runfor;
            }

            if ("runinterval" in obj) {
                control.runFor = obj.runinterval;
            }

            await this.db.update(control);

            return true;
        } catch (ex) {
            this.logger.log(ex);
            return false;
        }
    }

    async run() {
        const control = await this.db.get(this.type);
        if (control.switch.enabled != 1) {
            return;
        }

        control.history.push({ value: 1, timestamp: new Date() });
        await this.db.update(control);

        this.bus.emit("fan:start");

        setTimeout(async () => {
            const control2 = await this.db.get(this.type);
            control2.history.push({ value: 0, timestamp: new Date() });
            await this.db.update(control2);

            this.bus.emit("fan:stop");
        }, 1000 * control.runFor);
    }

    async poll() {
        const control = await this.db.get(this.type);
        await this.run();

        setInterval(async () => {
            await this.run();
        }, 1000 * control.runInterval);
    }
}

module.exports = FanController;
