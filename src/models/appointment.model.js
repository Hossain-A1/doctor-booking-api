const { Schema, model } = require("mongoose");
const appointmentSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required."],
    },

    docId: {
      type: String,
      required: [true, "Doc ID is required."],
    },
    slotDate: {
      type: String,
      required: [true, "SlotDate is required"],
    },

    slotTime: {
      type: String,
      required: [true, "SlotTime is required"],
    },
    userData: {
      type: Object,
      required: [true, "Doc Data  is required"],
    },
    docData: {
      type: Object,
      required: [true, "Doc Data  is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount  is required"],
    },
    date: {
      type: Number,
      required: [true, "Date  is required"],
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    payment: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { minimize: false }
);

const appointmentModel = model("appointment", appointmentSchema);
module.exports = appointmentModel;
