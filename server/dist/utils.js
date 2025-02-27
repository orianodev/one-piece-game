"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimeType = mimeType;
function mimeType(fileExtension) {
    const mimeTypes = {
        css: "text/css",
        svg: "image/svg+xml",
        png: "image/png",
        webp: "image/webp",
        js: "text/javascript",
    };
    return mimeTypes[fileExtension.toLowerCase()];
}
