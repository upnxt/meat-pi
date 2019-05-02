class MemoryDb {
    constructor() {
        this.data = [];
        this.changed = false;
    }

    get(id) {
        const doc = this.data.filter((m) => "_id" in m && m._id == id);
        if (doc.length <= 0) {
            throw new Error(`unable to retrieve doc id: ${id}`);
        }

        return doc[0];
    }

    update(obj) {
        const doc = this.get(obj._id);
        if (!doc) {
            this.data.push(obj);
        }

        Object.keys(obj).forEach(function(key) {
            doc[key] = obj[key];
        });

        this.changed = true;
        return doc;
    }

    replicateFrom(docs) {
        for (const doc of docs) {
            this.data.push(doc);
        }
    }
}

module.exports = new MemoryDb();
