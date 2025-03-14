const express = require("express");
const { handleGetAllDoctors } = require("../controllers/doctors.controller");

const doctorRouter = express.Router();

doctorRouter.get("/all", handleGetAllDoctors);

module.exports = doctorRouter;
