import { app } from "./src/index.js";
import { environment } from "./src/loaders/environment.loader.js";
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

(async function init () {
    const server = http.createServer(app);
    server.listen(environment.PORT, () => {
        console.log(`Server listening on port ${environment.PORT}`);
    });

    const wss = new WebSocketServer({ server });

    wss.on('connection', function connection (ws) {
        ws.on('error', console.error);

        ws.on('message', function message (data, isBinary) {
            wss.clients.forEach(function each (client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        });

        ws.send('Hello! Message From Server!!');
    });
})();
