import { createServer, ServerResponse, IncomingMessage } from "http"
import { join } from "node:path"
import { parse } from "node:url";
import { promises } from "node:fs";

const port = 4000
const http = createServer((req, res) => sendFile(req, res))
http.listen(port, () => console.log("Server running on http://localhost:" + port))

/**
 * 
 * @file Sends back the file indicated in url pathname to the client with MimeType (HTML or JavaScript).
 * @throws Error if file not found
 */
const sendFile = async (req: IncomingMessage, res: ServerResponse) => {
    // Parse file name
    let fileName = parse(req.url!, true).pathname
    if (fileName === "" || fileName === "/") fileName = "index.html"
    const parsedFileName = fileName?.split("/").at(-1)
    // Get file path and MimeType
    let mimeType
    let filePath
    switch (fileName!.split(".").at(-1)) {
        case "html":
            mimeType = "text/html"
            filePath = join(__dirname, "../../../views/", parsedFileName!);
            break;
        case "js":
            mimeType = "text/javascript"
            filePath = join(__dirname, "../scripts/", parsedFileName!);
            break;
        case "png":
            mimeType = "image/png"
            filePath = join(__dirname, "../../../views/images/", parsedFileName!);
            break;
    }
    // Get file content
    try {
        const file = await promises.readFile(filePath!);
        return res.writeHead(200, { "Content-Type": mimeType }).end(file);
    } catch (err) {
        // File not found
        console.error(`File not found : ${fileName}`);
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end(`File not found : ${fileName}`);
    }
}