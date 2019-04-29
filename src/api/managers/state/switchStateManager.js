const fs = require("fs");

class SwitchStateManager {
    constructor(db, type) {
        this.db = db;
        this.type = type;
    }

    state() {
        const control = this.db.get(this.type);

        if (control.switch.enabled == 0) {
            return -1;
        }

        return control.switch.state;
    }

    setOn(callback) {
        this.set(1, callback);
    }

    setOff(callback) {
        this.set(0, callback);
    }

    set(state, callback) {
        let control = this.db.get(this.type);
        control.switch.state = state;

        this.db.update(control);

        if (typeof callback === "function") {
            callback();
        }
    }
}

module.exports = SwitchStateManager;
