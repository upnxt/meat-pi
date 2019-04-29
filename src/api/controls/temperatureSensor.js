const ds18b20 = require("ds18b20");

class TemperatureSensor {
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

    getTemp() {
        try {
            const control = this.db.get(this.type);
            return control.value;
        } catch (ex) {
            this.logger.log(ex);
            return 0;
        }
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
                control.switch.enabled = obj.enabled;
            }

            if ("targettemp" in obj) {
                control.targetTemp = obj.targettemp;
            }

            if ("recoverymaxtemp" in obj) {
                control.recoveryMaxTemp = obj.recoverymaxtemp;
            }

            this.db.update(control);

            return true;
        } catch (ex) {
            this.logger.log(ex);
            return false;
        }
    }

    poll() {
        //reset in case of failure/restart to prevent false values
        let control1 = this.db.get(this.type);
        control1.value = 0;

        this.db.update(control1);

        //poll
        setInterval(() => {
            let control = this.db.get(this.type);
            const temp = ds18b20.temperatureSync(control.deviceId);

            if (temp == control.value) {
                return;
            }

            control.value = temp;

            //no need to log excessively if we're only displaying the last few entries in the ui
            let pushHistory = true;

            if (control.history.length > 0) {
                const diff = Math.abs(new Date(control.history[control.history.length - 1].timestamp) - new Date());
                const minutes = Math.floor(diff / 1000 / 60);
                if (minutes < 30) pushHistory = false;
            }

            if (pushHistory) {
                control.history.push({ value: control.value, timestamp: new Date() });
            }

            if (control.history.length > 100) {
                control.history = control.history.splice(control.history.length - 100);
            }

            this.db.update(control);
            this.bus.emit("temperature:change", control.value);
        }, 1000);
    }
}

module.exports = TemperatureSensor;
