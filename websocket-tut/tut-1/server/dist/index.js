"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const ws_1 = require("ws");
const app = (0, express_1.default)();
const httpServer = app.listen(8080, () => {
    console.log(new Date() + " Server is listening on port 8080");
});
app.get("/", (req, res) => {
    res.send({ msg: httpServer });
});
const wss = new ws_1.WebSocketServer({ server: httpServer });
wss.on("connection", function connection(ws) {
    const clientName = `Client-${(0, uuid_1.v4)()}`;
    ws.send(JSON.stringify({ type: "notification", message: `Joined Server` }));
    ws.on("error", console.error);
    ws.on("message", function message(data) {
        const messageString = data.toString();
        const parsedData = JSON.parse(messageString);
        if (parsedData.type === "message") {
            const messageData = {
                name: clientName,
                message: parsedData.message,
                isBinary: false,
            };
            console.log(`Received message from ${clientName}: ${parsedData.message}`);
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                    client.send(JSON.stringify(messageData));
                }
            });
        }
    });
    ws.on("close", () => {
        console.log(`${clientName} disconnected`);
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: "notification",
                    message: `${clientName} disconnected`,
                }));
            }
        });
    });
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "notification", message: `${clientName} joined` }));
        }
    });
});
