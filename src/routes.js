const express = require("express");
const routes = express.Router();

const SantanderController = require("./controllers/SantanderController");


routes.get("/api/transformData", StopBrowserController.stop);

module.exports = routes;
