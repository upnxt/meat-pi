class FanController {
    constructor(bus, db, logger, type, stateManager) {
        this.bus = bus;
        this.db = db;
        this.logger = logger;
        this.type = type;
        this.stateManager = stateManager;
    }

    getState() {
        const state = this.stateManager.state();
        return state;
    }

    getHistory() {
        try {
            const control = this.db.get(this.type);
            return control.history;
        } catch (ex) {
            this.logger.log(ex);
            return [];
        }
    }

    update(obj) {
        try {
            const control = this.db.get(this.type);

            if ("enabled" in obj) {
                control.switch.enabled = parseInt(obj.enabled);
            }

            if ("runfor" in obj) {
                control.runFor = parseInt(obj.runfor);
            }

            if ("runinterval" in obj) {
                control.runFor = parseInt(obj.runinterval);
            }

            this.db.update(control);

            return true;
        } catch (ex) {
            this.logger.log(ex);
            return false;
        }
    }

    run() {
        const control = this.db.get(this.type);
        if (control.switch.enabled != 1) {
            return;
        }

        control.history.push({ value: 1, timestamp: new Date() });
        this.db.update(control);
        this.bus.emit("fan:start");

        setTimeout(() => {
            const control2 = this.db.get(this.type);
            control2.history.push({ value: 0, timestamp: new Date() });

            this.db.update(control2);
            this.bus.emit("fan:stop");
        }, 1000 * control.runFor);
    }

    poll() {
        const control = this.db.get(this.type);
        this.run();

        setInterval(() => {
            this.run();
        }, 1000 * control.runInterval);
    }
}

module.exports = FanController;
