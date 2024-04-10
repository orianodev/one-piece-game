"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const node_path_1 = require("node:path");
const node_url_1 = require("node:url");
const node_fs_1 = require("node:fs");
const port = 4000;
const http = (0, http_1.createServer)((req, res) => sendFile(req, res));
http.listen(port, () => console.log("Server running on http://localhost:" + port));
/**
 *
 * @file Sends back the file indicated in url pathname to the client with MimeType (HTML or JavaScript).
 * @throws Error if file not found
 */
const sendFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Parse file name
    let fileName = (0, node_url_1.parse)(req.url, true).pathname;
    if (fileName === "" || fileName === "/")
        fileName = "index.html";
    const parsedFileName = fileName === null || fileName === void 0 ? void 0 : fileName.split("/").at(-1);
    // Get file path and MimeType
    let mimeType;
    let filePath;
    switch (fileName.split(".").at(-1)) {
        case "html":
            mimeType = "text/html";
            filePath = (0, node_path_1.join)(__dirname, "../../../views/", parsedFileName);
            break;
        case "js":
            mimeType = "text/javascript";
            filePath = (0, node_path_1.join)(__dirname, "../scripts/", parsedFileName);
            break;
        case "png":
            mimeType = "image/png";
            filePath = (0, node_path_1.join)(__dirname, "../../../views/images/", parsedFileName);
            break;
    }
    // Get file content
    try {
        const file = yield node_fs_1.promises.readFile(filePath);
        return res.writeHead(200, { "Content-Type": mimeType }).end(file);
    }
    catch (err) {
        // File not found
        console.error(`File not found : ${fileName}`);
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end(`File not found : ${fileName}`);
    }
});
