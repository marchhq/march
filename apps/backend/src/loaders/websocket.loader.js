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

// const broadcastUpdate = (data, isBinary = false) => {
//     if (!wss) {
//         console.log("WebSocket server is not initialized");
//         return;
//     }

//     console.log("Broadcasting update: ", data);

//     wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify(data), { binary: isBinary });
//         }
//     });
// };

const broadcastUpdate = (data, isBinary = false) => {
    if (!wss) {
        console.log("WebSocket server is not initialized");
        return;
    }

    let message;
    if (isBinary) {
        if (typeof data === "object") {
            message = Buffer.from(JSON.stringify(data), "utf-8");
        } else if (Buffer.isBuffer(data) || data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
            message = data;
        } else {
            throw new TypeError("Invalid data type for binary broadcast. Must be object or binary.");
        }
    } else {
        message = typeof data === "object" ? JSON.stringify(data) : data;
    }

    // console.log("Broadcasting update: ", isBinary ? "[Binary Data]" : message);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message, { binary: isBinary });
        }
    });
};

export {
    initializeWebSocket,
    broadcastUpdate
}
