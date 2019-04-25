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

        await this.db.put(control);

        //poll
        setInterval(async () => {
            let control = await this.db.get(this.type);

            const dht = new sensor.DHT22(control.gpio);
            const readout = dht.read();
            const humidity = readout.humidity;
            
            if (humidity == control.value)
                return;

            control.value = humidity;

            await this.db.put(control);
            this.bus.emit("humidity:change", control.value);
        }, 1000);
    }
}

module.exports = HumiditySensor;
