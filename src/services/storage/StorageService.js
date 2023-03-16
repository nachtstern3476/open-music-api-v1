const fs = require('fs');

class StorageService {
    constructor (folder) {
        this._folder = folder;

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    }

    writeFile (file, meta) {
        const filename = +new Date() + meta.filename;
        const path = `${this._folder}/${filename}`;

        const stream = fs.createWriteStream(path);

        return new Promise((resolve, reject) => {
            stream.on('error', (error) => reject(error));

            file.pipe(stream);
            file.on('end', () => resolve(filename));
        });
    }
}

module.exports = StorageService;
