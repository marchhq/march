import WebSocket from 'ws';

let wss;
function setWebSocketServer (server) {
    wss = server;
}

function broadcastMessage (message) {
    if (!wss) return;
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

export { setWebSocketServer, broadcastMessage };
