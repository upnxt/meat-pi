const fs = require("fs");

class SwitchStateManager {
    constructor(db, type) {
        this.db = db;
        this.type = type;
    }

    async state() {
        const control = await this.db.get(this.type);

        if (control.switch.enabled == 0) {
            return -1;
        }

        return control.switch.state;
    }

    async setOn(callback) {
        await this.set(1, callback);
    }

    async setOff(callback) {
        await this.set(0, callback);
    }

    async set(state, callback) {
        let control = await this.db.get(this.type);
        control.switch.state = state;

        await this.db.update(control);

        if (typeof callback === "function") {
            callback();
        }
    }
}

module.exports = SwitchStateManager;
