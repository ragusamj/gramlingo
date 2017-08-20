let fs = require("fs");
let glob = require("glob");
let mkdirp = require("mkdirp");
let path = require("path");

let outputDirectory = path.join(process.cwd(), process.argv[3]);

glob(process.argv[2], {}, function (error, files) {
    files.forEach(function(file) {
        fs.readFile(file, function(error, json) {
            let minified = JSON.stringify(JSON.parse(json));
            let filename = path.basename(file);
            let out = path.join(outputDirectory, filename);
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
