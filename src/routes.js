const express = require("express");
const routes = express.Router();

const RdStationController = require("./controllers/rdStationController");


routes.post("/api/transformData", RdStationController.post);

module.exports = routes;
