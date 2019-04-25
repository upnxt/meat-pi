var PouchDB = require("pouchdb-node");

var diskStore = new PouchDB("./data.db", { auto_compaction: true });
module.exports = diskStore;
