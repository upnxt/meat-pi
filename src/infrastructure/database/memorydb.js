const PouchDB = require("pouchdb-node");
PouchDB.plugin(require("pouchdb-adapter-memory"));

const memorydb = new PouchDB("memdb", { adapter: "memory", auto_compaction: true });
memorydb.changed = false;
memorydb.update = async (obj) => {
    await memorydb.put(obj);
    memorydb.changed = true;
};

module.exports = memorydb;
