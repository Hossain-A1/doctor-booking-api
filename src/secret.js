require("dotenv").config();
const PORT = process.env.PORT || 4000;
const mongoAtlasURL =
  process.env.MONGO_DB_ATLAS_URL ||
  "mongodb://localhost:27017/doctors-book-appointment";

const jwtSecretKey = process.env.JWT_SECRET_KEY || "Your_secret_key";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_51N8qymETgc7j2mkAxR41w2gcV8pkVOoIjuhNALVRg4tysWjp3RXs1ruHkfw5H9dZ1WlHTKq1zcN9f37RAFIN5IUw00Wnv7sgg5";

const cloudinaryName = process.env.CLOUDINARY_NAME;
const cloudinaryKey = process.env.CLOUDINARY_KEY;
const cloudinarySecret = process.env.CLOUDINARY_SECRET_KEY;

const adminEmail = process.env.ADMIN_EMAIL || "admin@docappoint.com";
const adminPass = process.env.ADMIN_PASSWORD || "Abcabc123!";
module.exports = {
  PORT,
  mongoAtlasURL,
  jwtSecretKey,
  cloudinaryName,
  cloudinaryKey,
  cloudinarySecret,
  adminEmail,
  adminPass,
  stripeSecretKey
};
