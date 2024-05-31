const WebSocket = require("ws");
const { handleConnection } = require("./websocketHandlers");
const { verifyTokenForWs } = require("./verifyTokenForWs");

require("dotenv").config();

const initWebSocketServer = async () => {
	const wss = new WebSocket.Server({ port: process.env.WS_PORT || 5001 });

	wss.on("connection", async (ws, req) => {
		console.log("WebSocket connection");
		const token = req.headers["sec-websocket-protocol"];

		try {
			verifyTokenForWs(token, ws, () => handleConnection(ws, ws.user, wss));
		} catch (error) {
			console.error("WebSocket connection error:", error);
			ws.close(4002, "Invalid token");
		}
	});
};

module.exports = { initWebSocketServer };
