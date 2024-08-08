import express from "express";
import { v4 as uuidv4 } from "uuid";
import { WebSocket, WebSocketServer } from "ws";

const app = express();
const httpServer = app.listen(8080, () => {
  console.log(new Date() + " Server is listening on port 8080");
});

app.get("/", (req, res) => {
  res.send({ msg: httpServer });
});
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", function connection(ws) {
  const clientName = `Client-${uuidv4()}`;

  // Notifying the just the current client who has joined
  ws.send(JSON.stringify({ type: "notification", message: `Joined Server` }));

  // Notifying all the clients except current client i.e clientName has joined
  wss.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "notification",
          message: `${clientName} joined`,
        })
      );
    }
  });

  ws.on("error", console.error);

  //
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
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messageData));
        }
      });
    }
  });
  ws.on("close", () => {
    console.log(`${clientName} disconnected`);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "notification",
            message: `${clientName} disconnected`,
          })
        );
      }
    });
  });
});
