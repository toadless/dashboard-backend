import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import setUser from "./auth/setUser";
import db from "./sequelize";
import router from "./router";

// Syncing with postgresql
db.sequelize.sync();

// Initiating server - default express configuration
const PORT = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(setUser);
app.use(cors({
    origin: [process.env.FRONT_END!],
    credentials: true,
}))

// routes
app.use(router);

// Build server using https or http depending on configurations declared above
const server = http.createServer(app)
// Run server, and console log on success
server.listen({ port: PORT }, () => {
    console.log(`Server listening on port ${PORT}`)
})