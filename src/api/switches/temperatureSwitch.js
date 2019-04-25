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

    async listen() {
        this.bus.on("temperature:change", async (value) => {
            const control = await this.db.get(this.type);

            //manually disabled the control via config, return early
            if (!control.switch.enabled)
            {
                this.stateManager.setOff();
                return;
            }

            await this.recoveryTemperatureRunner(value, control);
            await this.adaptiveTemperatureRunner(value, control);

            this.logger.log(`temperature: ${value}, target: ${control.targetTemp}`);
        })
    }

    async recoveryTemperatureRunner(temperature, control) {
        if (temperature >= control.recoveryMaxTemp && !this.recovering) {
            this.recovering = true;
            this.clearAdaptiveTimer();
            this.turnon(control.switch.gpio);

            this.logger.log(`RECOVERY STARTED. temp: ${temperature}`);
        }

        if (temperature <= control.targetTemp && this.recovering) {
            this.shutoff(control.switch.gpio);
            this.recovering = false;

            this.logger.log(`RECOVERY COMPLETE. temp: ${temperature}`);
        }
    }

    async adaptiveTemperatureRunner(temperature, control) {
        if (this.recovering) {
            return;
        }

        if (temperature <= control.targetTemp) {
            await this.stateManager.setOff(() => {
                rpio.open(this.gpio, rpio.OUTPUT, rpio.HIGH);
                this.clearAdaptiveTimer();
            });
        }

        //if current temp is higher than what we want, and the last temp reading was lower than the current reading, then start cooling
        if (temperature > control.targetTemp && lastTemp < temperature) {
            if (!this.cooling) {
                this.cooling = true;

                await this.stateManager.setOn(() => {
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

                    this.logger.log(`freezer cooling for: ${control.initialCoolingTimeout + additionalCoolingTime} seconds, difference: ${difference}`);

                    this.coolerTimer = setTimeout(async () => {
                        await this.shutoff(control.switch.gpio);
                    }, 1000 * (control.initialCoolingTimeout + additionalCoolingTime));
                });
            }
        }

        this.lastTemp = temperature;
    }

    async turnon(gpio) {
        await this.stateManager.setOn(() => {
            rpio.open(gpio, rpio.OUTPUT, rpio.LOW);
        });
    }

    async shutoff(gpio) {
        await this.stateManager.setOff(() => {
            rpio.open(gpio, rpio.OUTPUT, rpio.HIGH);
        });
    }

    clearAdaptiveTimer() {
        this.cooling = false;
        clearTimeout(this.coolerTimer);
    }
}

module.exports = TemperatureSwitch