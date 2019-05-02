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

            if (value <= control.targetHumidity) {
                this.turnoff(control.switch.gpio);
            }

            if (value > control.targetHumidity) {
                this.turnon(control.switch.gpio);
            }

            this.logger.log(`[switch] humidity: ${value}, target: ${control.targetHumidity}, state: ${this.stateManager.state()}`);
        });

        this.bus.on("humidity:forceoff", () => {
            const control = this.db.get(this.type);
            this.turnoff(control.switch.gpio);
        });
    }

    turnon(gpio) {
        this.stateManager.setOn(() => {
            rpio.open(gpio, rpio.OUTPUT, rpio.LOW);
        });
    }

    turnoff(gpio) {
        this.stateManager.setOff(() => {
            rpio.open(gpio, rpio.OUTPUT, rpio.HIGH);
        });
    }
}

module.exports = HumditySwitch;
