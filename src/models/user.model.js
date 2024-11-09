const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required."],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "User email is required."],
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [6, "Password would be more than 6 characters"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: String,
      default: "default_image_url",
    },
    phone: {
      type: String,
      default: "+00",
    },
    address: {
      type: Object,
      default: { line1: "Not Selected", line2: "Not Selected" },
    },
    birthday: {
      type: String,
      default: "Not Selected",
    },
    gender: {
      type: String,
      default: "Not Selected",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { minimize: false }
);

const userModel = model("User", userSchema);
module.exports = userModel;
