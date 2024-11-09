require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const cors = require("cors");
const { errorResponse } = require("./controllers/responseController.js");
const authRouter = require("./routes/auth.route.js");
const doctorRouter = require("./routes/doctor.route.js");
const adminRouter = require("./routes/admin.route.js");
const userRouter = require("./routes/user.route.js");

const app = express();

const reqLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: "Too many requests from this API, please try again after 1 minute",
});

// Middlewares
app.use(express.json());
app.use(cors({ credentials: true }));
app.use(morgan("dev"));
app.use(reqLimit);
app.use(xssClean());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Test successful" });
});

// Auth routes (make sure this comes before the 404 handler)
app.use("/api/auth", authRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

// 404 Error handler (Route not found)
app.use((req, res, next) => {
  next(createError(404, { message: "Route not found!" }));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  return errorResponse(res, {
    statusCode: err.status || 500,
    message: err.message,
  });
});

module.exports = app;
