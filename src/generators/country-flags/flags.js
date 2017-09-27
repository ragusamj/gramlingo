const fs = require("pn/fs");
const path = require("path");
const svg2png = require("svg2png");

const root = path.join(__dirname, "../../../node_modules/flag-icon-css/flags/4x3");
const target = path.join(__dirname, "../../images/flags");

fs.readdir(root)
    .then((files) => {
        for(let file of files) {
            fs.readFile(path.join(root, file))
                .then(sourceBuffer => svg2png(sourceBuffer, { width: 100 }))
                .then(buffer => fs.writeFile(path.join(target, path.basename(file, ".svg").toUpperCase() + ".png"), buffer))
                .catch(e => process.stderr.write(e));
        }
    });