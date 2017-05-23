var fs = require("fs");
var glob = require("glob");
var mkdirp = require("mkdirp");
var path = require("path");

var outputDirectory = path.join(process.cwd(), process.argv[3]);

glob(process.argv[2], {}, function (error, files) {
    files.forEach(function(file) {
        fs.readFile(file, function(error, json) {
            var minified = JSON.stringify(JSON.parse(json));
            var filename = path.basename(file);
            var out = path.join(outputDirectory, filename);
            mkdirp(outputDirectory, function (error) {
                if (error) {
                    process.stderr.write(error.message);
                }
                else {
                    fs.writeFile(out, minified, function() {
                        //
                    });
                }
            });
        });
    });
});
