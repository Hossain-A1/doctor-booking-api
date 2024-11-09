const { body } = require("express-validator");

const userRegisterInputValitation = [
  body("name").trim().notEmpty().withMessage("Name is missing."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is missing.")
    .withMessage("Email already used.")
    .isEmail()
    .withMessage("Invalid email."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is missing.")
    .isLength({ min: 6 })
    .withMessage('"Password should be at last 6 characters long"')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password should contain at last one uppercase letter, one lowercase letter, one number, and one symbo"
    ),
];
const userLoginInputValitation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is missing.")
    .withMessage("Email already used.")
    .isEmail()
    .withMessage("Invalid email."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is missing.")
    .isLength({ min: 6 })
    .withMessage('"Password should be at last 6 characters long"')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password should contain at last one uppercase letter, one lowercase letter, one number, and one symbo"
    ),
];
const userUpdateInputValitation = [
  body("name").trim().notEmpty().withMessage("Name is missing."),
  body("phone").trim().notEmpty().withMessage("Phone is missing."),
  body("address").trim().notEmpty().withMessage("Address is missing."),
  body("birthday").trim().notEmpty().withMessage("Birthday is missing."),
  body("gender").trim().notEmpty().withMessage("Gender is missing."),
];

module.exports = {
  userRegisterInputValitation,
  userLoginInputValitation,
  userUpdateInputValitation,
};
