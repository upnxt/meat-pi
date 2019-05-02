const fs = require("mz/fs");
const path = require("path");

class LocalStore {
    constructor() {
        this.localstore_path = path.join(__dirname, "../../../data/data.json");
    }

    async getAll() {
        const data = await fs.readFile(this.localstore_path, "utf8");
        if (!data || data.trim() == "") {
            return null;
        }

        const docs = JSON.parse(data);
        return docs;
    }

    async update(docs) {
        const json = JSON.stringify(docs);
        await fs.writeFile(this.localstore_path, json, "utf8");
    }
}

module.exports = new LocalStore();
