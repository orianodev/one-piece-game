import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { sendHtmlPage, sendStaticFile } from './controllers';
import { Server, Socket } from "socket.io";
import { socketIOListener } from './socketio';

const pageRoutes: Record<string, string> = {
    "/": "index.html",
    "/index.html": "index.html",
    "/play": "play.html",
    "/settings": "settings.html",
    "/controls": "controls.html",
};

const http = createServer((req, res): ServerResponse<IncomingMessage> | Promise<ServerResponse<IncomingMessage>> | void => {
    try {
        const { method } = req
        const { pathname } = parse(req.url!, true);

        if (method === "GET") {
            if (pathname && pageRoutes[pathname]) return sendHtmlPage(pageRoutes[pathname], res);
            else return sendStaticFile(pathname || "", res);
        }

        else return res.writeHead(404, { "Content-Type": "text/plain" }).end("No corresponding resource for this request.");
    } catch (error) {
        console.error("Server error in router:", error);
        res.writeHead(500, { "Content-Type": "text/plain" }).end("Internal Server Error");
    }
})

const io = new Server();
io.on('connection', (socket: Socket) => socketIOListener(socket, io));

http.listen(3000, () => {
    console.log('Server running at http://localhost:3000')
    io.attach(http)
});
