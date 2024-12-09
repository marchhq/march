import { WebSocketServer, WebSocket } from "ws";

let wss;

const initializeWebSocket = (server) => {
    wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        ws.on("error", console.error);

        ws.on("message", (data, isBinary) => {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data, { binary: isBinary });
                }
            });
        });

        ws.send("Hello! Message From Server!!");
    });
};

const broadcastUpdate = (data, isBinary = false) => {
    if (!wss) {
        console.log("WebSocket server is not initialized");
        return;
    }

    console.log("Broadcasting update: ", data);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data), { binary: isBinary });
        }
    });
};

export {
    initializeWebSocket,
    broadcastUpdate
}
