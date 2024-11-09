const doctorModel = require("../models/doctors.model");
const userModel = require("../models/user.model");
const { successResponse } = require("./responseController");
const createError = require("http-errors");
const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await doctorModel.find();
    if (!doctors || doctors.length === 1) {
      throw createError(404, "No doctors found.");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "All doctors data return successfully",
      payload: doctors,
    });
  } catch (error) {
    next(error);
  }
};

const changeAvailablity = async (req, res, next) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    console.log(docData);

    await doctorModel.findByIdAndUpdate(docData, {
      available: !docData.available,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "successfully changed availability",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctors,
  changeAvailablity,
};
