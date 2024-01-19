const express = require("express");
const routes = express.Router();

const RdStationController = require("./controllers/rdStationController");


routes.post("/api/transformData", RdStationController.post);
routes.post("/api/teste", RdStationController.postTeste);

module.exports = routes;
