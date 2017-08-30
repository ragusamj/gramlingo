let glob = require("glob");
let http = require("http");
let log4js = require("log4js");
let parseUrl = require("parseurl");
let path = require("path");
let send = require("send");
let serveStatic = require("serve-static");

let port = process.env.PORT || 8080;
let root = "dist";

let logger = log4js.getLogger();
logger.level = "INFO";
let serve = serveStatic(root);
let gzipFileCache;

function canServeGzipped(req) {
    return req.method === "GET" || req.method === "HEAD";
}

function browserAcceptsGzip(req) {
    return req.headers["accept-encoding"].indexOf("gzip") >= 0;
}

function hasGzippedVersion(fullpath) {
    return gzipFileCache.indexOf(fullpath + ".gz") >= 0;
}

function setResponseHeaders(res, fullpath) {
    let type = send.mime.lookup(fullpath);
    let charset = send.mime.charsets.lookup(type);
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", type + (charset ? "; charset=" + charset : ""));
    res.setHeader("Vary", "Accept-Encoding");
}

function sendGzippedVersion(req, res, fullpath) {
    setResponseHeaders(res, fullpath);
    send(req, fullpath + ".gz").pipe(res);
}

let server = http.createServer(function(req, res) {

    let urlparts = parseUrl(req);
    let fullpath = path.join(process.cwd(), root, urlparts.pathname);
    fullpath += urlparts.pathname.endsWith("/") ? "index.html" : "";

    if(hasGzippedVersion(fullpath) && canServeGzipped(req) && browserAcceptsGzip(req)) {
        sendGzippedVersion(req, res, fullpath);
    }
    else {
        serve(req, res, function() {
            let fallback = path.join(root, "index.html");
            if(canServeGzipped(req) && browserAcceptsGzip(req)) {
                sendGzippedVersion(req, res, fallback);
            }
            else {
                send(req, fallback).pipe(res);
            }
        });
    }

    res.on("finish", function() {
        let level = res.statusCode >= 300 ? (res.statusCode >= 400 ? "ERROR" : "WARN") : "INFO";
        logger.log(level, req.method, res.statusCode, req.url);
    });
});

glob("/**/*.gz", { root: root }, function (error, files) {
    if(error) {
        throw error;
    }
    gzipFileCache = files;
    server.listen(port);
    logger.info("Listening on port %s", port);
});
