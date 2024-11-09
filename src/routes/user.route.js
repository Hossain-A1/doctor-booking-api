const express = require("express");
const {
  handleGetUserProfile,
  handleUpdateUserProfile,
  handleBookAppointment,
  handleGetUserAppointment,
  handleCancelAppointment,
  handlePayment,
} = require("../controllers/user.controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");
const runValidation = require("../validations");
const { userUpdateInputValitation } = require("../validations/auth");
const upload = require("../middlewares/multer");

const userRouter = express.Router();

userRouter.get("/get-profile", isLoggedIn, handleGetUserProfile);
userRouter.put(
  "/update-profile",
  upload.single("image"),
  isLoggedIn,
  userUpdateInputValitation,
  runValidation,
  handleUpdateUserProfile
);
userRouter.post("/book-appointment", isLoggedIn, handleBookAppointment);
userRouter.post("/pay-appointment", isLoggedIn, handlePayment);
userRouter.get("/my-appointments", isLoggedIn, handleGetUserAppointment);
userRouter.put("/cancle-appointment", isLoggedIn, handleCancelAppointment);

module.exports = userRouter;
