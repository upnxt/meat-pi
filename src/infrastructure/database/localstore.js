var PouchDB = require("pouchdb-node");

var localstore = new PouchDB("./data.db", { auto_compaction: true });
module.exports = localstore;
