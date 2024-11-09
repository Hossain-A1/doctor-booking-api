const express = require("express");
const { handleRegister, handleLogin } = require("../controllers/auth.controller.js");
const { userRegisterInputValitation, userLoginInputValitation } = require("../validations/auth.js");
const runValidation = require("../validations/index.js");
const { isLogOut } = require("../middlewares/auth.middleware.js");
const authRouter = express.Router();

authRouter.post(
  "/register",
  isLogOut,
  userRegisterInputValitation,
  runValidation,
  handleRegister
);
authRouter.post(
  "/login",
  isLogOut,
  userLoginInputValitation,
  runValidation,
  handleLogin
);

module.exports = authRouter;
