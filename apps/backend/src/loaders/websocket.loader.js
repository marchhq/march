import { createServer } from 'http';
import { initializeWebSocketServer } from '../services/lib/websocket.service.js';

export const initializeWebSocket = (app) => {
    const server = createServer(app);
    initializeWebSocketServer(server);
    return server;
};
