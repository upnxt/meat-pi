const ds18b20 = require("ds18b20");

class TemperatureSensor {
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

    async getTemp() {
        try {
            const control = await this.db.get(this.type);
            return control.value;
        } catch (ex) {
            this.logger.log(ex);
            return 0;
        }
    }

    async update(obj) {
        let control = await this.db.get(this.type);
        await this.db.put({
            _id: this.type,
            _rev: control._rev,
            ...obj
        });
    }

    async poll() {
        //reset in case of failure/restart to prevent false values
        let control = await this.db.get(this.type);
        control.value = 0;

        await this.db.put(control);

        //poll
        setInterval(async () => {
            let control = await this.db.get(this.type);
            const temp = ds18b20.temperatureSync(control.deviceId);
            
            if (temp == control.value)
                return;

            control.value = temp;

            await this.db.put(control);
            this.bus.emit("temperature:change", control.value);
        }, 1000);
    }
}

module.exports = TemperatureSensor;
