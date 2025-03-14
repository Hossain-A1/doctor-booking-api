const express = require("express");

const {
  getAllDoctors,
} = require("../controllers/doctors.controller.js");
const doctorRouter = express.Router();

doctorRouter.get("/all-doc", getAllDoctors);

module.exports = doctorRouter;
