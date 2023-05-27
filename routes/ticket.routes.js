const ticketController = require("../controllers/ticket.controller")
const authJwt = require("../middleware/authjwt")

module.exports = function (app){
    app.post("/crm/api/tickets/", [authJwt.verifyToken], ticketController.createTicket)
}