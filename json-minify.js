var fs = require("fs");
var glob = require("glob");
var path = require("path");
var zlib = require("zlib");

var compressionLevel = zlib.Z_BEST_COMPRESSION || zlib.constants.Z_BEST_COMPRESSION;
var outputDirectory = path.join(process.cwd(), process.argv[3]);

glob(process.argv[2], {}, function (error, files) {
    files.forEach(function(file) {
        fs.readFile(file, function(error, json) {
            var minified = JSON.stringify(JSON.parse(json));
            var filename = path.basename(file);
            var out = path.join(outputDirectory, filename);
            fs.writeFile(out, minified, function() {
                zlib.gzip(minified, { level: compressionLevel }, function(error, buffer) {
                    fs.writeFile(out + ".gz", buffer, function() {
                        //
                    });
                });
            });
        });
    });
});
