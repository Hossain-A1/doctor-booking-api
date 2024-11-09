const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model.js");
const { successResponse } = require("./responseController.js");
const { createJSONWebToken } = require("../helpers/jsonwebtoken.js");
const { jwtSecretKey } = require("../secret.js");
//---------------- register user--------------//
const handleRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
   
    // Check if email already exists
    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      throw createError(400, "Email already used.");
    }

    const user = await userModel.create({ name, email, password });

    if (!user) {
      throw createError(400, "User was not created.");
    }

    // Create JWT token for the user
    const token = createJSONWebToken({ user }, jwtSecretKey, "7d");

    // Send success response
    return successResponse(res, {
      statusCode: 200,
      message: "User was created successfully.",
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};

//---------------- login user--------------
const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not exist with this email.",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      throw createError(400, "Invalid email or passrowd.");
    }

    //isBanned

    if (user.isBanned) {
      throw createError(422, "You are banned. please contact authority");
    }

    const notPassword = user.toObject();
    delete notPassword.password;

    const token = createJSONWebToken({ user }, jwtSecretKey, "7d");
    return successResponse(res, {
      statusCode: 200,
      message: "user was login successfully",
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleRegister,
  handleLogin,
};
