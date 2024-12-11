// import { WebSocketServer, WebSocket } from "ws";

// let wss;

// const initializeWebSocket = (server) => {
//     wss = new WebSocketServer({ server });

//     wss.on("connection", (ws) => {
//         ws.on("error", console.error);

//         ws.on("message", (data, isBinary) => {
//             wss.clients.forEach((client) => {
//                 if (client.readyState === WebSocket.OPEN) {
//                     client.send(data, { binary: isBinary });
//                 }
//             });
//         });

//         ws.send("Hello! Message From Server!!");
//     });
// };

// // const broadcastUpdate = (data, isBinary = false) => {
// //     if (!wss) {
// //         console.log("WebSocket server is not initialized");
// //         return;
// //     }

// //     console.log("Broadcasting update: ", data);

// //     wss.clients.forEach((client) => {
// //         if (client.readyState === WebSocket.OPEN) {
// //             client.send(JSON.stringify(data), { binary: isBinary });
// //         }
// //     });
// // };

// const broadcastUpdate = (data, isBinary = false) => {
//     if (!wss) {
//         console.log("WebSocket server is not initialized");
//         return;
//     }

//     let message;
//     if (isBinary) {
//         if (typeof data === "object") {
//             message = Buffer.from(JSON.stringify(data), "utf-8");
//         } else if (Buffer.isBuffer(data) || data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
//             message = data;
//         } else {
//             throw new TypeError("Invalid data type for binary broadcast. Must be object or binary.");
//         }
//     } else {
//         message = typeof data === "object" ? JSON.stringify(data) : data;
//     }

//     // console.log("Broadcasting update: ", isBinary ? "[Binary Data]" : message);

//     wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(message, { binary: isBinary });
//         }
//     });
// };

// export {
//     initializeWebSocket,
//     broadcastUpdate
// }

// this one is uding the user id

// import { WebSocketServer, WebSocket } from "ws";

// // A map to store user-specific WebSocket connections
// const userConnections = new Map();

// let wss;

// const initializeWebSocket = (server) => {
//     wss = new WebSocketServer({ server });

//     wss.on("connection", (ws, req) => {
//         // Parse user ID from query parameters or headers (adjust based on your frontend)
//         const userId = req.url?.split("?userId=")[1];

//         if (!userId) {
//             ws.close(4000, "User ID is required for WebSocket connection");
//             return;
//         }

//         console.log(`WebSocket connection established for user: ${userId}`);

//         // Store the WebSocket connection for the user
//         userConnections.set(userId, ws);

//         ws.on("error", console.error);

//         ws.on("message", (data, isBinary) => {
//             console.log(`Message received from user ${userId}:`, data);
//         });

//         ws.on("close", () => {
//             console.log(`WebSocket connection closed for user: ${userId}`);
//             userConnections.delete(userId);
//         });

//         ws.send("Welcome! WebSocket connection established.");
//     });
// };

// const broadcastToUser = (userId, data, isBinary = false) => {
//     if (!wss) {
//         console.log("WebSocket server is not initialized");
//         return;
//     }

//     const ws = userConnections.get(userId);

//     if (ws && ws.readyState === WebSocket.OPEN) {
//         const message = isBinary
//             ? Buffer.from(JSON.stringify(data), "utf-8")
//             : JSON.stringify(data);

//         ws.send(message, { binary: isBinary });
//         console.log(`Message sent to user ${userId}:`, data);
//     } else {
//         console.log(`WebSocket for user ${userId} is not open`);
//     }
// };

// // Export functions
// export { initializeWebSocket, broadcastToUser };

// here im usinf sec-websocket
import { WebSocketServer, WebSocket } from "ws";
import { verifyJWTToken } from "../utils/jwt.service.js";
import { BlackList } from "../models/core/black-list.model.js";
import { getUserById } from "../services/core/user.service.js";

// A map to store user-specific WebSocket connections
const userConnections = new Map();

const initializeWebSocket = (server) => {
    const wss = new WebSocketServer({
        server
    });

    wss.on("connection", async (ws, req) => {
        try {
            // Get the token from the Sec-WebSocket-Protocol header
            const token = req.headers["sec-websocket-protocol"];
            if (!token) {
                ws.close(4000, "Authorization token is required");
                return;
            }

            // Check if the token is blacklisted
            const checkIfBlacklisted = await BlackList.findOne({ token });
            if (checkIfBlacklisted) {
                ws.close(4001, "This token has expired. Please login");
                return;
            }

            // Verify the token
            const payload = await verifyJWTToken(token);
            const user = await getUserById(payload.id);
            if (!user) {
                ws.close(4002, "Invalid user");
                return;
            }

            console.log(`WebSocket connection established for user: ${user.id}`);

            // Close any existing WebSocket connection for this user
            if (userConnections.has(user.id)) {
                const existingWs = userConnections.get(user.id);
                if (existingWs.readyState === WebSocket.OPEN) {
                    console.log(`Closing existing WebSocket for user: ${user.id}`);
                    existingWs.close();
                }
                userConnections.delete(user.id); // Clean up the old connection
            }

            // Store the new WebSocket connection for the user
            userConnections.set(user.id, ws);

            ws.on("error", (error) => {
                console.error(`WebSocket error for user ${user.id}:`, error.message);
            });

            ws.on("message", (data, isBinary) => {
                console.log(`Message received from user ${user.id}:`, data.toString());
            });

            ws.on("close", () => {
                console.log(`WebSocket connection closed for user: ${user.id}`);
                userConnections.delete(user.id); // Remove the connection on close
            });

            ws.send("Welcome! WebSocket connection established.");
        } catch (error) {
            console.error("WebSocket authentication error:", error.message);
            ws.close(4003, "Unauthorized");
        }
    });
};

const broadcastToUser = (userId, data, isBinary = false) => {
    const ws = userConnections.get(userId);

    if (ws && ws.readyState === WebSocket.OPEN) {
        const message = isBinary
            ? Buffer.from(JSON.stringify(data), "utf-8")
            : JSON.stringify(data);

        ws.send(message, { binary: isBinary });
        console.log(`Message sent to user ${userId}:`, data);
    } else {
        console.log(`WebSocket for user ${userId} is not open`);
        userConnections.delete(userId); // Clean up stale connections
    }
};

export { initializeWebSocket, broadcastToUser };
