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

    unlinkFile (oldFilename) {
        const path = `${this._folder}/${oldFilename}`;
        fs.unlink(path, (err) => {
            if (err) console.log(err);
        });
    }
}

module.exports = StorageService;
