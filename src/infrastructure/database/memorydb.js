var PouchDB = require("pouchdb-node");
PouchDB.plugin(require("pouchdb-adapter-memory"));

var memorydb = new PouchDB("memdb", { adapter: "memory", auto_compaction: true });
memorydb.changes = false;
memorydb.update = async (obj) => {
    await memorydb.put(obj);
    memorydb.changed = true;
};

module.exports = memorydb;
