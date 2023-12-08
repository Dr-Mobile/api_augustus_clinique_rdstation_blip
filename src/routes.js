const express = require("express");
const routes = express.Router();

const RdStationController = require("./app/controllers/RdStationController");


routes.get("/api/transformData", RdStationController.post);

module.exports = routes;
