// import { WebSocketServer, WebSocket } from 'ws';

// let wss;

// export const initializeWebSocketServer = (server) => {
//     wss = new WebSocketServer({ server });

//     wss.on('connection', handleConnection);

//     return wss;
// };

// const handleConnection = (ws) => {
//     console.log('New client connected');
//     ws.on('message', (message) => handleMessage(ws, message));
//     ws.on('close', () => handleClose(ws));
//     ws.on('error', handleError);
//     // Send initial connection success message
//     ws.send(JSON.stringify({ type: 'CONNECTION_SUCCESS' }));
// };

// const handleMessage = (ws, message) => {
//     try {
//         const parsedMessage = JSON.parse(message);
//         console.log('Received message:', parsedMessage);
//         // Handle different message types here
//         switch (parsedMessage.type) {
//         case 'PING':
//             ws.send(JSON.stringify({ type: 'PONG' }));
//             break;
//         default:
//             console.log('Unhandled message type:', parsedMessage.type);
//         }
//     } catch (error) {
//         console.error('Error handling message:', error);
//     }
// };

// const handleClose = (ws) => {
//     console.log('Client disconnected');
// };

// const handleError = (error) => {
//     console.error('WebSocket error:', error);
// };

// export const broadcastToAll = (message) => {
//     if (!wss) return;

//     wss.clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify(message));
//         }
//     });
// };

import { WebSocketServer, WebSocket } from 'ws';

let wss;

export const initializeWebSocketServer = (server) => {
    wss = new WebSocketServer({ server });
    console.log('WebSocket server initialized');
    return wss;
};

export const broadcastUpdate = (data, isBinary) => {
    if (!wss) return;

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            if (data.type === 'INBOX_UPDATE') {
                // client.send(JSON.stringify(data));
                client.send(data, { binary: isBinary });
                console.log("Sent data to client: ", data)
            }
        }
    });
};
