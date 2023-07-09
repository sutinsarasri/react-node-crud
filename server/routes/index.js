const express = require("express");
const routre = express.Router();
const ticketController = require("../controllers/ticketController");

// routre.get("/login", loginController.login);
routre.get("/", ticketController.getTicket);
routre.post("/create", ticketController.postTicket);
routre.put("/update", ticketController.postUpdateTicket);

module.exports = routre;
