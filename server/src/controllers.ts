import { IncomingMessage, ServerResponse } from "node:http";
import { join } from "node:path";
import { promises as fs } from "node:fs";
import { mimeType } from "./utils";
import { StaticHeaders } from "../../shared/Types";

/**
 * Sends an HTML page to the client.
 * @param {string} pageFileName - The HTML file name.
 * @param {ServerResponse<IncomingMessage>} res - The server response object.
 */
export async function sendHtmlPage(pageFileName: string, res: ServerResponse<IncomingMessage>) {
    try {
        const filePath = join(__dirname, "../../client/views", pageFileName);
        const html = await fs.readFile(filePath);
        return res.writeHead(200, {
            "Content-Length": Buffer.byteLength(html),
            "Content-Type": "text/html; charset=utf-8"
        }).end(html);
    } catch (error: any) {
        console.error(`Error serving HTML page: ${pageFileName} →`, error.message);
        return res.writeHead(404, { "Content-Type": "text/plain" }).end("Page not found.");
    }
}

/**
 * Sends a static file (CSS, JS, images, etc.) to the client.
 * @param {string} pathFromUrl - The file path from the URL.
 * @param {ServerResponse<IncomingMessage>} res - The server response object.
 */
export async function sendStaticFile(pathFromUrl: string, res: ServerResponse<IncomingMessage>) {
    try {
        const filePath = join(__dirname, "../../client/", pathFromUrl);
        const stats = await fs.stat(filePath);
        if (!stats.isFile()) return res.writeHead(403, { "Content-Type": "text/plain" }).end("Forbidden: Not a file.");

        const fileExtension = pathFromUrl.match(/\.([^.]+)$/)?.[1];
        if (!fileExtension) return res.writeHead(400, { "Content-Type": "text/plain" }).end("No file extension found in the requested resource.");

        const fileMimetype = mimeType(fileExtension);
        if (!fileMimetype) return res.writeHead(415, { "Content-Type": "text/plain" }).end("Unsupported Media Type.");

        const file = await fs.readFile(filePath);

        // Set Cache-Control headers for specific image types

        let headers: StaticHeaders = { "Content-Type": fileMimetype };
        if (["png", "gif", "webp", "svg"].includes(fileExtension)) {
            headers["Cache-Control"] = "public, max-age=86400"; // Cache for 1 day (86400 seconds)
        } else if (["css", "js"].includes(fileExtension)) {
            headers["Cache-Control"] = "public, max-age=3600"; // Cache for 1 hour (3600 seconds)
        }

        return res.writeHead(200, headers).end(file);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return res.writeHead(404, { "Content-Type": "text/plain" }).end("File not found.");
        } else {
            console.error(`Error serving static file: ${pathFromUrl} →`, error.message);
            return res.writeHead(500, { "Content-Type": "text/plain" }).end("Internal Server Error.");
        }
    }
}
