const ConsoleLogger = require("./console");
const FileLogger = require("./file");

module.exports = process.env.LOGGER == "console" ? new ConsoleLogger : new FileLogger();