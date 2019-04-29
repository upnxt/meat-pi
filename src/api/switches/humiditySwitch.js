const rpio = require("rpio");

class HumditySwitch {
    constructor(bus, db, logger, type, stateManager) {
        this.bus = bus;
        this.db = db;
        this.logger = logger;
        this.type = type;
        this.stateManager = stateManager;

        this.turnedOn = false;
    }

    listen() {
        this.bus.on("humidity:change", (value) => {
            const control = this.db.get(this.type);

            //manually disabled the control via config, return early
            if (!control.switch.enabled) {
                this.stateManager.setOff();
                return;
            }

            if (value <= control.targetHumidity) {
                this.stateManager.setOff(() => {
                    rpio.open(control.switch.gpio, rpio.OUTPUT, rpio.HIGH);
                });
            }

            if (value > control.targetHumidity) {
                this.stateManager.setOn(() => {
                    rpio.open(control.switch.gpio, rpio.OUTPUT, rpio.LOW);
                });
            }

            this.logger.log(`[switch] humidity: ${value}, target: ${control.targetHumidity}, state: ${this.stateManager.state()}`);
        });
    }
}

module.exports = HumditySwitch;
