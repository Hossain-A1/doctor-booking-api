//API for admin action
const validator = require("validator");
const cloudinary = require("../config/cloudinary");
const { successResponse } = require("../controllers/responseController");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctors.model");
const { adminEmail, adminPass, jwtSecretKey } = require("../secret");
const { createJSONWebToken } = require("../helpers/jsonwebtoken");
const appointmentModel = require("../models/appointment.model");
const userModel = require("../models/user.model");

const addDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      speciality,
      password,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const image = req.file;

    const requiredFields = [
      name,
      email,
      speciality,
      password,
      degree,
      experience,
      about,
      fees,
      address,
      image,
    ];

    if (requiredFields.some((field) => !field)) {
      return res.json({ success: false, message: "Please fill all fields" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.json({
        success: false,
        message:
          "Password must contains *char+ with uppercase,lowercase,number and symbol",
      });
    }
    //upload image to cloudinary
    const uploadImage = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
      folder: "book-doctor/doctors",
    });

    const imgUrl = uploadImage.secure_url;

    const doctorData = {
      name,
      email,
      image: imgUrl,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    await doctorModel.create(doctorData);

    // Send success response
    return successResponse(res, {
      statusCode: 201,
      message: "Doctor was created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const getAllDoctor = async (req, res, next) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");

    // Send success response
    return successResponse(res, {
      statusCode: 201,
      message: "Doctors was returened successfully.",
      payload: doctors,
    });
  } catch (error) {
    next(error);
  }
};
//admin login

const handleAdminLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.json({ success: false, message: "Missing pass or Email" });
    }

    if (email === adminEmail && password === adminPass) {
      const token = createJSONWebToken({ email }, jwtSecretKey, "7d");

      res.json({
        success: true,
        token,
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    next(error);
  }
};

const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentModel.find({});

    // Send success response
    return successResponse(res, {
      statusCode: 201,
      message: "Appointments was returened successfully.",
      payload: appointments,
    });
  } catch (error) {
    next(error);
  }
};

const adminDashboard = async (req, res, next) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      users: users.length,
      appointments: appointments.length,
      latestAppointment: appointments.reverse().slice(0, 5),
    };
    if (!dashData) {
      throw Error("Dash Data not found");
    }
    // Send success response
    return successResponse(res, {
      statusCode: 201,
      message: "Appointments was returened successfully.",
      payload: dashData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addDoctor,
  getAllDoctor,
  getAllAppointments,
  adminDashboard,
  handleAdminLogin,
};
