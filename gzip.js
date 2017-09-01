let fs = require("fs");
let glob = require("glob");
let os = require("os");
let path = require("path");
let zlib = require("zlib");

let compressionLevel = zlib.Z_BEST_COMPRESSION || zlib.constants.Z_BEST_COMPRESSION;

glob(process.argv[2], {}, function (error, files) {
    for(let file of files) {
        fs.readFile(file, function(error, data) {
            zlib.gzip(data, { level: compressionLevel }, function(error, buffer) {
                fs.writeFile(file + ".gz", buffer, function() {
                    process.stdout.write("Wrote " + buffer.length + " bytes to " + path.relative(__dirname, file) + os.EOL);
                });
            });
        });
    }
});
