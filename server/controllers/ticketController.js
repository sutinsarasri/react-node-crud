const Ticket = require("../models/TicketModel");
const moment = require("moment");
const statusTicket = require("../config/config");
// var dotenv = require('dotenv');

const getTicket = async (req, res, next) => {
  const data = await Ticket.find().sort({ updateDate: -1 });
  const newData = data.map((rowData) => {
    return {
      id: rowData._id,
      title: rowData.title,
      description: rowData.description,
      contact: rowData.contact,
      statusTicket: rowData.status,
      updateDate: rowData.updateDate,
      createDate: rowData.createDate,
    };
  });
  res.send({ message: ``, result: newData });
};

module.exports.getTicket = getTicket;

const createTicket = async (ticketObj) => {
  const ticket = new Ticket({
    title: ticketObj.title,
    description: ticketObj.description,
    contact: ticketObj.contact,
    status: statusTicket.config.pending.key,
    createDate: moment(),
    updateDate: moment(),
  });
  const data = await ticket.save();
  return data;
};

const postTicket = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const contact = req.body.contact;
  const ticketObj = {
    title: title,
    description: description,
    contact: contact,
  };
  createTicket(ticketObj)
    .then(() => {
      res.send({ message: `Create "${ticketObj.title}" Success` });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "Failed to create data", Error: err.message });
    });
};

module.exports.postTicket = postTicket;

const updateTicket = async (ticketObj) => {
  try {
    const ticket = await Ticket.findById(ticketObj.id);
    if (!ticket) {
      return { status: false, message: "Find not found" };
    }
    ticket.title = ticketObj.title;
    ticket.description = ticketObj.description;
    ticket.contact = ticketObj.contact;
    ticket.status = ticketObj.status;
    ticket.updateDate = moment().local();
    const data = await ticket.save();
    return { status: true, result: data };
  } catch (error) {
    return { status: false, message: "Find not found" };
  }
};

const postUpdateTicket = async (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const description = req.body.description;
  const contact = req.body.contact;
  const status = req.body.status;

  const ticketObj = {
    id: id,
    title: title,
    description: description,
    contact: contact,
    status: status,
  };
  updateTicket(ticketObj)
    .then((result) => {
      if (result.status) {
        res
          .status(200)
          .send({ message: `Update "${ticketObj.title}" Success` });
      } else {
        res
          .status(400)
          .send({ message: result.message, Error: result.message });
      }
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: `Failed to update data`, Error: err.message });
    });
};

module.exports.postUpdateTicket = postUpdateTicket;
