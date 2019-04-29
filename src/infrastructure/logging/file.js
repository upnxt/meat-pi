const simpleLogger = require("simple-node-logger");
const path = require("path");

class FileLogger {
    constructor() {
        this.logger = simpleLogger.createRollingFileLogger({
            logDirectory: path.join(__dirname, "../../../logs"),
            fileNamePattern: "<DATE>.log",
            dateFormat: "YYYY-MM-DD"
        });

        this.logger.setLevel("debug");
    }
    log(message) {
        this.logger.debug(message);
    }
}

module.exports = FileLogger;
