"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const node_url_1 = require("node:url");
const controllers_1 = require("./controllers");
const socket_io_1 = require("socket.io");
const socketio_1 = require("./socketio");
const pageRoutes = {
    "/": "index.html",
    "/index.html": "index.html",
    "/play": "play.html",
    "/settings": "settings.html",
    "/commands": "commands.html",
};
const http = (0, node_http_1.createServer)((req, res) => {
    try {
        const { method } = req;
        const { pathname } = (0, node_url_1.parse)(req.url, true);
        if (method === "GET") {
            if (pathname && pageRoutes[pathname])
                return (0, controllers_1.sendHtmlPage)(pageRoutes[pathname], res);
            else
                return (0, controllers_1.sendStaticFile)(pathname || "", res);
        }
        else
            return res.writeHead(404, { "Content-Type": "text/plain" }).end("No corresponding resource for this request.");
    }
    catch (error) {
        console.error("Server error in router:", error);
        res.writeHead(500, { "Content-Type": "text/plain" }).end("Internal Server Error");
    }
});
const io = new socket_io_1.Server();
let gameStateCollection = {};
io.on('connection', (socket) => (0, socketio_1.socketIOListener)(socket, io, gameStateCollection));
http.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
    io.attach(http);
});
