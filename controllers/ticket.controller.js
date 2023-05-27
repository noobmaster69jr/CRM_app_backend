const User = require("../models/user.model");
const Ticket = require("../models/ticket.model");
const constants = require("../utils/constants");
const objectConverter = require("../utils/objectConverter");

exports.createTicket = async (req, res) => {
  const ticketObject = {
    title: req.body.title,
    ticketPriority: req.body.ticketPriority,
    description: req.body.description,
    status: req.body.status,
    reporter: req.body.userId,
  };

  const engineer = await User.findOne({
    userType: constants.userTypes.engineer,
    userStatus: constants.userStatus.approved,
  });

  ticketObject.assignee = engineer.userId;

  try {
    const ticket = await Ticket.create(ticketObject);

    if (ticket) {
      const user = await User.findOne({
        userId: req.body.userId,
      });
      user.ticketsCreated.push(ticket._id);
      await user.save();

      engineer.ticketsAssigned.push(ticket._id);
      await engineer.save();

      res.status(201).send(objectConverter.ticketResponse(ticket));
    }
  } catch (err) {
    console.log("Some error happened while creating ticket", err.message);
    res.status(500).send({
      message: "Some internal server error",
    });
  }
};


exports.updateTicket = async (req, res) => {};

exports.getAllTicket = async (req, res) => {};

exports.getOneTicket = async (req, res) => {};
