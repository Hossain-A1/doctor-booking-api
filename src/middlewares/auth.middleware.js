const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { jwtSecretKey } = require("../secret.js");
const { errorResponse } = require("../controllers/responseController.js");

const isLoggedIn = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Authorization token missing or invalid",
      });
    }

    // Extract the token
    const token = authorizationHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, jwtSecretKey);
    // Attach the user info to the request object (optional)
    req.user = decoded.user;
    next();
  } catch (error) {
    next(error);
  }
};

const isLogOut = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    // Check if the token is present in the authorization header
    if (token) {
      throw createError(400, "User already logged in. please log out");
    }

    next();
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Authorization token missing or invalid",
      });
    }

    // Extract the token
    const token = authorizationHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, jwtSecretKey);

    // Attach the user info to the request object (optional)
    req.user = decoded;

    // Call the next middleware
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isLoggedIn,
  isLogOut,
  isAdmin,
};
