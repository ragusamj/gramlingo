var glob = require("glob");
var http = require("http");
var log4js = require("log4js");
var parseUrl = require("parseurl");
var path = require("path");
var send = require("send");
var serveStatic = require("serve-static");

var port = process.env.PORT || 8080;
var root = "dist";

var logger = log4js.getLogger();
var serve = serveStatic(root);
var gzipFileCache;

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
    var type = send.mime.lookup(fullpath);
    var charset = send.mime.charsets.lookup(type);
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", type + (charset ? "; charset=" + charset : ""));
    res.setHeader("Vary", "Accept-Encoding");
}

function sendGzippedVersion(req, res, fullpath) {
    setResponseHeaders(res, fullpath);
    send(req, fullpath + ".gz").pipe(res);
}

var server = http.createServer(function(req, res) {

    var urlparts = parseUrl(req);
    var fullpath = path.join(process.cwd(), root, urlparts.pathname);
    fullpath += urlparts.pathname.endsWith("/") ? "index.html" : "";

    if(hasGzippedVersion(fullpath) && canServeGzipped(req) && browserAcceptsGzip(req)) {
        sendGzippedVersion(req, res, fullpath);
    }
    else {
        serve(req, res, function() {
            var fallback = path.join(root, "index.html");
            if(canServeGzipped(req) && browserAcceptsGzip(req)) {
                sendGzippedVersion(req, res, fallback);
            }
            else {
                send(req, fallback).pipe(res);
            }
        });
    }

    res.on("finish", function() {
        var level = res.statusCode >= 300 ? (res.statusCode >= 400 ? "ERROR" : "WARN") : "INFO";
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
