const { Schema, model, models } = require("mongoose");
const bcrypt = require("bcryptjs");
const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required."],
    },

    email: {
      type: String,
      unique: true,
      required: [true, "User email is required."],
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },

    image: {
      type: String,
      default: "",
      required: true,
    },
    speciality: {
      type: String,
      required: [true, "Speciality  is required"],
    },
    experience: {
      type: String,
      required: [true, "Experience  is required"],
    },
    about: {
      type: String,
      required: [true, "About  is required"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    fees: {
      type: Number,
      required: [true, "Number  is required"],
    },
    address: {
      type: Object,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    slots_booked: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

const doctorModel = models.doctors || model("doctors", doctorSchema);
module.exports = doctorModel;
