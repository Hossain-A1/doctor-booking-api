require("dotenv").config();
const userModel = require("../models/user.model");
const { successResponse, errorResponse } = require("./responseController");
const createError = require("http-errors");
const cloudinary = require("../config/cloudinary");
const doctorModel = require("../models/doctors.model");
const appointmentModel = require("../models/appointment.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

if (!stripe) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const handleGetUserProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const userData = await userModel.findById(_id).select("-password");
    if (!userData) {
      throw createError(404, "User not found with this id");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "user profile data return successfully",
      payload: userData,
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateUserProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, phone, address, birthday, gender } = req.body;
    const image = req.file;

    const updateOptions = {
      name,
      phone,
      address: JSON.parse(address),
      birthday,
      gender,
    };

    const user = await userModel.findByIdAndUpdate(_id, updateOptions);

    if (!user) {
      throw createError(404, "User not found with this id");
    }

    // Check if there's an image update
    if (image) {
      // Remove the old image from Cloudinary if it exists
      if (user.image && user.image !== "default_image_url") {
        const publicId = user.image
          .split("/book-doctor/users/")[1]
          .split(".")[0]; // Extract public_id without folder path or extension
        await cloudinary.uploader.destroy(`book-doctor/users/${publicId}`, {
          resource_type: "image",
        });
      }

      // Upload the new image to Cloudinary
      const uploadImage = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
        folder: "/book-doctor/users",
      });
      const imgUrl = uploadImage.secure_url;

      const doctors = await userModel.findByIdAndUpdate(
        _id,
        { image: imgUrl },
        {
          new: true,
        }
      );

      // Send success response
      return successResponse(res, {
        statusCode: 200,
        message: "User profile updated successfully",
        payload: doctors,
      });
    }
    return;
  } catch (error) {
    next(error);
  }
};

const handleBookAppointment = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { docId, slotDate, slotTime } = req.body;
    const { origin } = req.headers;

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData) {
      throw createError(404, "Doc not found with this id");
    }

    if (!docData.available) {
      throw createError(400, "Doctor not available");
    }

    let slots_booked = docData.slots_booked;

    //checking  for slots

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        throw createError(400, "Slot not available");
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }
    Object.keys(require.cache).forEach((key) => {
      delete require.cache[key];
    });

    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    // Set up line item details for Stripe
    const line_items = [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: docData.name,
          },
          unit_amount: appointmentData.amount * 100,
        },
        quantity: 1,
      },
    ];

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/my-appiontments`,
      cancel_url: `${origin}/cancel`,
    });

    await appointmentModel.create(appointmentData);

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    return successResponse(res, {
      statusCode: 200,
      message: "Booked appointment successfully",
      payload: session.url,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetUserAppointment = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const appointments = await appointmentModel.find({ userId });

    if (!appointments) {
      throw createError(404, "User appointments not found with this id");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "user appointments data return successfully",
      payload: appointments,
    });
  } catch (error) {
    next(error);
  }
};

const handlePayment = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { appointmentId } = req.body;
    const { origin } = req.headers;

    const appointment = await appointmentModel.findById(appointmentId);
    //verify appointment user
    if (appointment.userId !== userId) {
      throw createError(400, "Unauthorized action");
    }

    const pay = await appointmentModel.findByIdAndUpdate(appointmentId, {
      payment: true,
    });

    if (pay.payment) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Already paid this appointment.",
      });
    }
    // Set up line item details for Stripe
    const line_items = [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: appointment.docData.name,
          },
          unit_amount: appointment.amount * 100,
        },
        quantity: 1,
      },
    ];

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/my-appiontments`,
      cancel_url: `${origin}/cancel`,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "Booked appointment successfully",
      payload: session.url,
    });
  } catch (error) {
    next(error);
  }
};

const handleCancelAppointment = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { appointmentId } = req.body;
    const appointments = await appointmentModel.findById(appointmentId);

    if (!appointments) {
      throw createError(404, "User appointments not found with this id");
    }
    //verify appointment user
    if (appointments.userId !== userId) {
      throw createError(400, "Unauthorized action");
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //relise doctor slot time
    const { docId, slotDate, slotTime } = appointments;
    const docData = await doctorModel.findById(docId);

    let slots_booked = docData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return successResponse(res, {
      statusCode: 200,
      message: "user appointment was calcelled successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleGetUserProfile,
  handleUpdateUserProfile,
  handleBookAppointment,
  handleGetUserAppointment,
  handleCancelAppointment,
  handlePayment,
};
