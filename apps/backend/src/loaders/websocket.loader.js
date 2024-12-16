// here im using sec-websocket
import { WebSocketServer, WebSocket } from "ws";
import { verifyJWTToken } from "../utils/jwt.service.js";
import { BlackList } from "../models/core/black-list.model.js";
import { getUserById } from "../services/core/user.service.js";

const userConnections = new Map();

const initializeWebSocket = (server) => {
    const wss = new WebSocketServer({
        server
    });

    wss.on("connection", async (ws, req) => {
        try {
            const token = req.headers["sec-websocket-protocol"];
            if (!token) {
                ws.close(4000, "Authorization token is required");
                return;
            }

            const checkIfBlacklisted = await BlackList.findOne({ token });
            if (checkIfBlacklisted) {
                ws.close(4001, "This token has expired. Please login");
                return;
            }

            const payload = await verifyJWTToken(token);
            const user = await getUserById(payload.id);
            if (!user) {
                ws.close(4002, "Invalid user");
                return;
            }

            console.log(`WebSocket connection established for user: ${user.id}`);

            // Close existing connection for the user
            if (userConnections.has(user.id)) {
                const existingWs = userConnections.get(user.id);
                if (existingWs.readyState === WebSocket.OPEN) {
                    existingWs.close();
                }
                userConnections.delete(user.id);
            }

            userConnections.set(user.id, ws);
            // userConnections.set(user.id, ws);
            console.log(`New WebSocket connection added for user: ${user.id}`);

            // Heartbeat mechanism
            let isAlive = true;
            ws.on("pong", () => {
                console.log(`Received pong from user: ${user.id}`);
                isAlive = true;
            });

            const pingInterval = setInterval(() => {
                if (!isAlive) {
                    console.log(`Terminating connection for user: ${user.id}`);
                    ws.terminate();
                    clearInterval(pingInterval);
                    userConnections.delete(user.id);
                    return;
                }
                isAlive = false;
                ws.ping();
                console.log(`Sent ping to user: ${user.id}`);
            }, 30000); // Ping every 30 seconds
            ws.on("error", (error) => {
                console.error(`WebSocket error for user ${user.id}:`, error.message);
            });

            ws.on("message", (data, isBinary) => {
                try {
                    const message = JSON.parse(data.toString());
                    if (message.type === "ping") {
                        console.log(`Received ping from user: ${user.id}`);
                        ws.send(JSON.stringify({ type: "pong" })); // Respond with pong
                    }
                } catch (err) {
                    console.error(`Failed to parse message: ${err.message}`);
                }
            });

            ws.on("close", () => {
                console.log(`WebSocket connection closed for user: ${user.id}`);
                clearInterval(pingInterval); // Stop pinging on close
                userConnections.delete(user.id);
            });

            ws.send(JSON.stringify({ type: "welcome", message: "WebSocket connection established." }));
        } catch (error) {
            console.error("WebSocket authentication error:", error.message);
            ws.close(4003, "Unauthorized");
        }
    });
};

// const broadcastToUser = (userId, data, isBinary = false) => {
//     console.log(`Broadcasting to user: ${userId}`);
//     const ws = userConnections.get(userId.toString());
//     if (!ws) {
//         console.error(`WebSocket connection for user ${userId} not found.`);
//         return;
//     }
//     if (ws.readyState !== WebSocket.OPEN) {
//         console.error(`WebSocket for user ${userId} is not open.`);
//         userConnections.delete(userId);
//         return;
//     }

//     const message = isBinary
//         ? Buffer.from(JSON.stringify(data), "utf-8")
//         : JSON.stringify(data);

//     ws.send(message, { binary: isBinary });
//     // console.log(`Message sent to user ${userId}:`, data);
// };

const broadcastToUser = (userId, data, isBinary = false) => {
    // console.log(`Broadcasting to user: ${userId}`);

    const ws = userConnections.get(userId.toString());
    if (!ws) {
        console.error(`WebSocket connection for user ${userId} not found.`);
        return;
    }

    if (ws.readyState !== WebSocket.OPEN) {
        console.error(`WebSocket for user ${userId} is not open.`);
        userConnections.delete(userId); // Remove inactive connection
        return;
    }

    let message;
    try {
        if (isBinary) {
            // If binary data is expected
            if (Buffer.isBuffer(data)) {
                message = data; // Already a Buffer, use as is
            } else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
                message = Buffer.from(data); // Convert ArrayBuffer or typed array to Buffer
            } else if (typeof data === "object") {
                message = Buffer.from(JSON.stringify(data), "utf-8"); // Serialize object to JSON and convert to Buffer
            } else {
                throw new TypeError("Invalid data type for binary broadcast. Must be Buffer, ArrayBuffer, or serializable object.");
            }
        } else {
            // For text data
            message = typeof data === "object" ? JSON.stringify(data) : data;
        }

        ws.send(message, { binary: isBinary });
        // console.log(`Message sent to user ${userId}:`, isBinary ? "[Binary Data]" : data);
    } catch (error) {
        console.error(`Failed to send message to user ${userId}:`, error.message);
    }
};

export { initializeWebSocket, broadcastToUser };
