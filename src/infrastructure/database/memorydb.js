var PouchDB = require("pouchdb-node");
PouchDB.plugin(require("pouchdb-adapter-memory"));

var memorydb = new PouchDB("memdb", { adapter: "memory", auto_compaction: true });
memorydb.changed = false;
memorydb.update = async (obj) => {
    await memorydb.put(obj);
    memorydb.changed = true;
    console.log('changed')
};

module.exports = memorydb;
