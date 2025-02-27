"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHtmlPage = sendHtmlPage;
exports.sendStaticFile = sendStaticFile;
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
const utils_1 = require("./utils");
async function sendHtmlPage(pageFileName, res) {
    try {
        const filePath = (0, node_path_1.join)(__dirname, "../../client/views", pageFileName);
        const html = await node_fs_1.promises.readFile(filePath);
        return res.writeHead(200, {
            "Content-Length": Buffer.byteLength(html),
            "Content-Type": "text/html; charset=utf-8"
        }).end(html);
    }
    catch (error) {
        console.error(`Error serving HTML page: ${pageFileName} →`, error.message);
        return res.writeHead(404, { "Content-Type": "text/plain" }).end("Page not found.");
    }
}
async function sendStaticFile(pathFromUrl, res) {
    try {
        const filePath = (0, node_path_1.join)(__dirname, "../../client/", pathFromUrl);
        const stats = await node_fs_1.promises.stat(filePath);
        if (!stats.isFile())
            return res.writeHead(403, { "Content-Type": "text/plain" }).end("Forbidden: Not a file.");
        const fileExtension = pathFromUrl.match(/\.([^.]+)$/)?.[1];
        if (!fileExtension)
            return res.writeHead(400, { "Content-Type": "text/plain" }).end("No file extension found in the requested resource.");
        const fileMimetype = (0, utils_1.mimeType)(fileExtension);
        if (!fileMimetype)
            return res.writeHead(415, { "Content-Type": "text/plain" }).end("Unsupported Media Type.");
        const file = await node_fs_1.promises.readFile(filePath);
        return res.writeHead(200, { "Content-Type": fileMimetype }).end(file);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            return res.writeHead(404, { "Content-Type": "text/plain" }).end("File not found.");
        }
        else {
            console.error(`Error serving static file: ${pathFromUrl} →`, error.message);
            return res.writeHead(500, { "Content-Type": "text/plain" }).end("Internal Server Error.");
        }
    }
}
