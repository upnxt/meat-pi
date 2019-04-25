const rpio = require("rpio");

class HumditySwitch {
    constructor(bus, db, logger, type, stateManager) {
        this.bus = bus;
        this.db = db;
        this.logger = logger;
        this.type = type;
        this.stateManager = stateManager;
    }

    async listen() {
        this.bus.on("humidity:change", async (value) => {
            const control = await this.db.get(this.type);

            //manually disabled the control via config, return early
            if (!control.switch.enabled)
            {
                this.stateManager.setOff();
                return;
            }

            if (value <= control.targetHumidity) {
                await this.stateManager.setOn(() => {
                    rpio.open(control.switch.gpio, rpio.OUTPUT, rpio.LOW);
                });
            }
    
            if (value > control.targetHumidity) {
                await this.stateManager.setOff(() => {
                    rpio.open(control.switch.gpio, rpio.OUTPUT, rpio.HIGH);
                });
            }

            this.logger.log(`humidity: ${value}, target: ${control.targetHumidity}, state: ${await this.stateManager.state()}`);
        })
    }
}

module.exports = HumditySwitch