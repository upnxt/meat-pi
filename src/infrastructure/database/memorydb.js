var PouchDB = require("pouchdb-node");
PouchDB.plugin(require("pouchdb-adapter-memory"));

var db = new PouchDB("memdb", { adapter: "memory", auto_compaction: true });
module.exports = db;
