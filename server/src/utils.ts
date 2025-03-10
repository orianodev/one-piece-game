/**
* Returns the corresponding MIME type for a given file extension.
* @param {string} fileExtension - File extension (e.g., "css", "svg", "png", "webp", "js").
* @returns {string | undefined} MIME type if found, otherwise undefined.
*/
export function mimeType(fileExtension: string): string | undefined {
    const mimeTypes: Record<string, string> = {
        svg: "image/svg+xml",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        css: "text/css",
        js: "text/javascript",
    };
    return mimeTypes[fileExtension.toLowerCase()];
}