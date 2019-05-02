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

        this.tempHistory = [];
        this.precooling = false;
        this.lastRun = null;
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

        this.bus.on("temperature:forceoff", () => {
            const control = this.db.get(this.type);
            this.shutoff(control.switch.gpio);
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
            this.shutoff(control.switch.gpio, () => {
                this.recovering = false;
            });

            this.logger.log(`[switch] temperature: ${temperature}, maxtemp: ${control.recoveryMaxTemp} -- RECOVERY COMPLETE`);
        }
    }

    //todo: track upward or downward trend
    adaptiveTemperatureRunner(temperature, control) {
        if (this.recovering) {
            return;
        }

        //turn off no matter what if we're below target temp and not pre-cooling
        if (temperature <= control.targetTemp && !this.precooling) {
            if (this.cooling) {
                this.lastRun = new Date();
            }

            this.shutoff(control.switch.gpio, () => {
                this.cooling = false;
                this.clearAdaptiveTimer();
            });
        }

        //start short-run pre-cooling as we come back up to target temp if we passed the target temp by quite a bit. chamber seems
        //to take quite a bit of cooling to hit target temp again when the compressor has been shut off for good amount of time.
        const lastRunSecondsAgo = new Date(new Date() - this.lastRun).getSeconds();

        if (!this.cooling && temperature <= control.targetTemp && lastRunSecondsAgo >= 210) {
            this.turnon(control.switch.gpio, () => {
                this.cooling = true;
                this.precooling = true;

                const timer = control.initialCoolingTimeout * 0.75;

                this.logger.log(`[switch] chamber pre-cooling for: ${timer} seconds, last run: ${lastRunSecondsAgo / 60}, temp: ${temperature}, target: ${control.targetTemp}`);

                this.coolerTimer = setTimeout(() => {
                    this.shutoff(control.switch.gpio, () => {
                        this.cooling = false;
                        this.precooling = false;
                        this.lastRun = new Date();
                    });
                }, 1000 * timer);
            });
        }

        //check if residual cooling is still in effect or we're cooling down from a high temperature
        const tryCool = !this.cooling && (this.lastTemp < temperature || temperature - control.temperature > 0.5);

        if (temperature + 0.1 > control.targetTemp && tryCool) {
            this.cooling = true;
            this.turnon(control.switch.gpio, () => {
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

                const timer = control.initialCoolingTimeout + additionalCoolingTime;

                this.logger.log(`[switch] chamber cooling for: ${timer} seconds, difference: ${difference}`);

                this.coolerTimer = setTimeout(() => {
                    if (temperature > control.targetTemp + 0.8) {
                        this.cooling = false;

                        return;
                    }

                    this.shutoff(control.switch.gpio, () => {
                        this.cooling = false;
                    });
                }, 1000 * timer);
            });
        }

        this.lastTemp = temperature;
    }

    turnon(gpio, callback) {
        this.stateManager.setOn(() => {
            rpio.open(gpio, rpio.OUTPUT, rpio.LOW);

            if (typeof callback == "function") {
                callback();
            }
        });
    }

    shutoff(gpio, callback) {
        this.stateManager.setOff(() => {
            rpio.open(gpio, rpio.OUTPUT, rpio.HIGH);

            if (typeof callback == "function") {
                callback();
            }
        });
    }

    clearAdaptiveTimer() {
        clearTimeout(this.coolerTimer);
    }
}

module.exports = TemperatureSwitch;
