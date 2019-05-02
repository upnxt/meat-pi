const sensor = require("rpi-dht-sensor");

class HumiditySensor {
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

    getHumidity() {
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
                control.switch.enabled = parseInt(obj.enabled);
            }

            if ("targethumidity" in obj) {
                control.targetHumidity = parseFloat(obj.targethumidity);
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
        const control1 = this.db.get(this.type);
        control1.value = 0;

        this.db.update(control1);

        //dht22 doesn't update very often, poll at a minimum of every 5 seconds
        setInterval(() => {
            const control = this.db.get(this.type);
            const dht = new sensor.DHT22(control.gpio);
            const readout = dht.read();
            const humidity = parseFloat(readout.humidity).toFixed(1);

            if (humidity == control.value || Math.abs(humidity - control.value) < 0.25) {
                return;
            }

            control.value = humidity;

            //no need to log excessively if we're only displaying the last few entries in the ui
            let pushHistory = true;

            if (control.history.length > 0) {
                const diff = Math.abs(new Date(control.history[control.history.length - 1].timestamp) - new Date());
                const minutes = Math.floor(diff / 1000 / 60);
                if (minutes < control.historyInterval) {
                    pushHistory = false;
                }
            }

            if (pushHistory) {
                control.history.push({ value: control.value, timestamp: new Date() });
            }

            if (control.history.length > control.historyLimit) {
                control.history = control.history.splice(control.history.length - control.historyLimit);
            }

            this.db.update(control);

            if (control.switch.enabled != 1) {
                this.bus.emit("humidity:forceoff");
                return;
            }

            this.bus.emit("humidity:change", control.value);
        }, 1000 * 5);
    }
}

module.exports = HumiditySensor;
