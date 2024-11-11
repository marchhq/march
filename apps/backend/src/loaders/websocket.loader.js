import { WebSocketServer } from 'ws';

function initWebSocketServer (server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
}

export { initWebSocketServer };
