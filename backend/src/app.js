const express = require("express");
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
const { initWebSocketServer } = require("./websockets/websocketServer");

// load .env file
require("dotenv").config();

const app = express();

app.use(
	cors({
		origin: [
			"http://127.0.0.1:3000",
			"http://localhost:3000",
			"http://127.0.0.1:5173",
			process.env.FRONTEND_URL,
		],
		credentials: true,
	})
);

app.use("/images", express.static("images"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());

// import and use routers
const apiRouter = require("./routers/index");
app.use("/api", apiRouter);

initWebSocketServer();

module.exports = app;
