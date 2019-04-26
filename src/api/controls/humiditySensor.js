const sensor = require("rpi-dht-sensor");

class HumiditySensor {
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

    async getHumidity() {
        try {
            const control = await this.db.get(this.type);
            return control.value;
        } catch (ex) {
            this.logger.log(ex);
            return 0;
        }
    }

    async getHistory() {
        try {
            const control = await this.db.get(this.type);
            return control.history;
        }
        catch(ex) {
            this.logger.log(ex);
            return [];
        }
    }

    async poll() {
        //reset in case of failure/restart to prevent false values
        let control = await this.db.get(this.type);
        control.value = 0;

        await this.db.update(control);

        //dht22 doesn't update very often, poll at a minimum of every 5 seconds
        setInterval(async () => {
            let control = await this.db.get(this.type);

            const dht = new sensor.DHT22(control.gpio);
            const readout = dht.read();
            const humidity = readout.humidity;

            if (humidity == control.value || Math.abs(humidity - control.value) < 0.25) {
                return;
            }

            control.value = humidity;

            //no need to log excessively if we're only displaying the last few entries in the ui
            let pushHistory = true;

            if (control.history.length > 0) {
                const diff = Math.abs(new Date(control.history[control.history.length - 1].timestamp) - new Date());
                const minutes = Math.floor((diff/1000)/60);
                if (minutes < 30)
                    pushHistory = false;
            }

            if (pushHistory)
                control.history.push({ value: control.value, timestamp: new Date() });

            if (control.history.length > 100)
                control.history = control.history.splice(control.history.length - 100);

            await this.db.update(control);
            this.bus.emit("humidity:change", control.value);
        }, 1000 * 3);
    }
}

module.exports = HumiditySensor;
