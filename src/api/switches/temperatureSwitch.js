const rpio = require("rpio");

class TemperatureSwitch {
    constructor(bus, db, logger, type, stateManager) {
        this.bus = bus;
        this.db = db;
        this.logger = logger;
        this.type = type;
        this.stateManager = stateManager;

        this.recovering = false;
        this.cooling = false;
        this.lastTemp = 0;
        this.coolingTimer = null;
    }

    listen() {
        this.bus.on("temperature:change", (value) => {
            const control = this.db.get(this.type);

            //manually disabled the control via config, return early
            if (!control.switch.enabled) {
                this.stateManager.setOff();
                return;
            }

            this.recoveryTemperatureRunner(value, control);
            this.adaptiveTemperatureRunner(value, control);

            this.logger.log(`[switch] temperature: ${value}, target: ${control.targetTemp}`);
        });
    }

    recoveryTemperatureRunner(temperature, control) {
        if (temperature >= control.recoveryMaxTemp && !this.recovering) {
            this.recovering = true;
            this.clearAdaptiveTimer();
            this.turnon(control.switch.gpio);

            this.logger.log(`[switch] temperature: ${temperature}, maxtemp: ${control.recoveryMaxTemp} -- RECOVERY STARTED`);
        }

        if (temperature <= control.targetTemp && this.recovering) {
            this.shutoff(control.switch.gpio);
            this.recovering = false;

            this.logger.log(`[switch] temperature: ${temperature}, maxtemp: ${control.recoveryMaxTemp} -- RECOVERY COMPLETE`);
        }
    }

    adaptiveTemperatureRunner(temperature, control) {
        if (this.recovering) {
            return;
        }

        if (temperature <= control.targetTemp) {
            this.stateManager.setOff(() => {
                rpio.open(control.switch.gpio, rpio.OUTPUT, rpio.HIGH);
                this.clearAdaptiveTimer();
            });
        }

        //if current temp is higher than what we want, and the last temp reading was lower than the current reading, then start cooling
        if (temperature > control.targetTemp && this.lastTemp < temperature) {
            if (!this.cooling) {
                this.cooling = true;

                this.stateManager.setOn(() => {
                    rpio.open(control.switch.gpio, rpio.OUTPUT, rpio.LOW);

                    let additionalCoolingTime = 0;
                    const difference = (temperature - control.targetTemp).toFixed(2);

                    if (difference >= 0.2) {
                        additionalCoolingTime += control.residualCoolingMultiplier * 5;
                    }

                    if (difference >= 0.3) {
                        additionalCoolingTime += control.residualCoolingMultiplier * 6;
                    }

                    if (difference >= 0.4) {
                        additionalCoolingTime += control.residualCoolingMultiplier * 3.5;
                    }

                    if (difference >= 0.5) {
                        additionalCoolingTime += control.residualCoolingMultiplier * 2;
                    }

                    if (difference >= 0.6) {
                        additionalCoolingTime += ((difference - 0.5) / 0.1) * control.residualCoolingMultiplier;
                    }

                    this.logger.log(`[switch] chamber cooling for: ${control.initialCoolingTimeout + additionalCoolingTime} seconds, difference: ${difference}`);

                    this.coolerTimer = setTimeout(() => {
                        this.shutoff(control.switch.gpio);
                        this.cooling = false;
                    }, 1000 * (control.initialCoolingTimeout + additionalCoolingTime));
                });
            }
        }

        this.lastTemp = temperature;
    }

    turnon(gpio) {
        this.stateManager.setOn(() => {
            rpio.open(gpio, rpio.OUTPUT, rpio.LOW);
        });
    }

    shutoff(gpio) {
        this.stateManager.setOff(() => {
            rpio.open(gpio, rpio.OUTPUT, rpio.HIGH);
        });
    }

    clearAdaptiveTimer() {
        this.cooling = false;
        clearTimeout(this.coolerTimer);
    }
}

module.exports = TemperatureSwitch;
