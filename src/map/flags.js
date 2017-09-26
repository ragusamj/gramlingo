const fs = require("pn/fs");
const path = require("path");
const svg2png = require("svg2png");

const root = "../../node_modules/flag-icon-css/flags/4x3/";

fs.readdir(root)
    .then((files) => {
        for(let file of files) {
            fs.readFile(path.join(root, file))
                .then(sourceBuffer => svg2png(sourceBuffer, { width: 100 }))
                .then(buffer => fs.writeFile(path.join("./flags/", path.basename(file, ".svg").toUpperCase() + ".png"), buffer))
                .catch(e => process.stderr.write(e));
        }
    });