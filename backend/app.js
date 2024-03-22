const express = require("express");
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");

// load .env file
require("dotenv").config();

// get db connection pool
const pool = require("./config/database");

const app = express();

app.use(
	cors({
		origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
		credentials: true,
	})
);

app.use("/public", express.static("public"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());

// import and use routers
const apiRouter = require("./routers/index");
app.use("/api", apiRouter);

module.exports = app;
