"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimeType = mimeType;
function mimeType(fileExtension) {
    const mimeTypes = {
        svg: "image/svg+xml",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        css: "text/css",
        js: "text/javascript",
    };
    return mimeTypes[fileExtension.toLowerCase()];
}
