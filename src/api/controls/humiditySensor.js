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

            await this.db.update(control);
            this.bus.emit("humidity:change", control.value);
        }, 1000 * 10);
    }
}

module.exports = HumiditySensor;
