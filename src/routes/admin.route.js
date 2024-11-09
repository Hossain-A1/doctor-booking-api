const express = require("express");
const {
  addDoctor,
  handleAdminLogin,
  getAllDoctor,
  getAllAppointments,
  adminDashboard,
} = require("../controllers/admin.controller");
const upload = require("../middlewares/multer");
const { isAdmin } = require("../middlewares/auth.middleware");
const { changeAvailablity } = require("../controllers/doctors.controller");

const adminRouter = express.Router();

adminRouter.post("/add-doctor", upload.single("image"), isAdmin, addDoctor);
adminRouter.post("/login", handleAdminLogin);
adminRouter.get("/all-appointments", isAdmin, getAllAppointments);
adminRouter.get("/all-doctors", isAdmin, getAllDoctor);
adminRouter.get("/dashboard", isAdmin, adminDashboard);
adminRouter.post("/change-availability", isAdmin, changeAvailablity);

module.exports = adminRouter;
